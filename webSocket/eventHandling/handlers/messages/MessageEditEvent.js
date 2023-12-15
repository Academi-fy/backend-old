/**
 * @file MessageEditEvent.js - Class handling the socket's MessageEditEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import Chat from "../../../../models/messages/Chat.js";
import Message from "../../../../models/messages/Message.js";
import logger from "../../../../tools/logging/logger.js";
import SocketMessageSendError from "../../../errors/SocketMessageSendError.js";

/**
 * @description Function handling the MessageEditEvent.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} messageDate - The date when the event was received.
 */
export default async function (ws, data, messageId, messageDate) {

    const { server, connection } = ws;

    const msgId = data.payload.data.oldMessageId;
    let { chat, author, content, reactions, answer, editHistory, date } = data.payload.data.newMessage;

    const newMessage = new Message(chat, author, content, reactions, answer, editHistory, date);

    try {

        const updateMessage = await Message.getMessageById(msgId);
        updateMessage.updateMessage(newMessage);

        chat = await Chat.getChatById(chat);
        let index = chat.messages.findIndex(msg => msg.id === msgId);
        chat._messages[index] = updatedMessage;
        chat.updateChatCache();

        const targets = chat.getAllTargets();
        targets.forEach(target => {

            if(!sendToTargetSocket(server, target, 
                JSON.stringify({
                    event: "MESSAGE_EDIT_RECEIVED",
                    payload: {
                        sender: `socket`,
                        data: message
                    }
                })
            )){
                throw new SocketMessageSendError(`'target '${ target.id }' could not be notified.'`);
            }

        });

        logger.socket.debug(`Message #${ messageId } processed in ${ Date.now() - messageDate } ms`)
    }
    catch(error){
        throw new EventHandlerError(error.stack);
    }

}