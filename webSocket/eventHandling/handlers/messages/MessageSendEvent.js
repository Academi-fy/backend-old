/**
 * @file MessageSendEvent.js - Class handling the socket's MessageSendEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import logger from "../../../../tools/logging/logger.js";
import Message from "../../../../models/messages/Message.js";
import EventHandlerError from "../../../errors/EventHandlerError.js";
import Chat from "../../../../models/messages/Chat.js";
import cache from "../../../../httpServer/cache.js";
import sendToTargetSocket from "../../../sendToTargetSocket.js";

/**
 * @description Function handling the MessageSendEvent.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} messageDate - The date when the event was received.
 */
export default async function (ws, data, messageId, messageDate) {

    const { server, connection } = ws;
    let { chat, author, content, reactions, answer, editHistory, date } = data.payload.data;

    const newMessage = new Message(chat, author, content, reactions, answer, editHistory, date);

    try {

        const message = await Message.createMessage(newMessage);

        chat = await Chat.getChatById(chat);
        chat.messages.push(message._id);
        await Chat.updateChat(chat._id, chat);

        const targets = chat.getAllTargets();
        targets.forEach(target => {

            if(!sendToTargetSocket(server, target, 
                JSON.stringify({
                    event: "MESSAGE_SEND_RECEIVED",
                    payload: {
                        sender: `socket`,
                        data: message
                    }
                })
            )){
                logger.socket.error(`Message #${ messageId }: target '${ target.id }' could not be notified.`)
            }

        });

        logger.socket.debug(`Message #${ messageId } processed in ${ Date.now() - messageDate } ms`)
    } catch (error) {
        throw new EventHandlerError(error.stack);
    }

}