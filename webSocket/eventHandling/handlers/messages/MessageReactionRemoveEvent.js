/**
 * @file MessageReactionRemoveEvent.js - Class handling the socket's MessageReactionRemoveEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import Chat from "../../../../models/messages/Chat.js";
import Message from "../../../../models/messages/Message.js";
import logger from "../../../../tools/logging/logger.js";

/**
 * @description Function handling the MessageReactionRemoveEvent.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} date - The date when the event was received.
 */
export default async function (ws, data, messageId, date) {

    const { server, connection } = ws;

    const msgId = data.payload.data.messageId;
    const emoji = data.payload.data.emoji;

    try {

        const message = await Message.getMessageById(msgId);
        message.removeReaction(emoji); //TODO checken, ob es verändert wird
        const updatedMessage = await Message.updatedMessage(msgId, message); // TODO brauche ich das?

        const chat = message._chat; //TODO check if type = Chat
        let index = chat._messages.findIndex(updatedMessage);
        chat.messages[index] = updatedMessage;
        chat.updateChatInCache();

        chat.getAllTargets().forEach(target => {
            
            if(!sendToTargetSocket(
                server,
                target,
                JSON.stringify({
                    event: "MESSAGE_REACTION_REMOVE_RECEIVED",
                    payload: {
                        sender: 'socket',
                        data: {
                            reaction: updatedMessage.getReaction(emoji),
                            message: updatedMessage
                        }
                    }
                })
            )){
                logger.socket.error(`Message #${ messageId }: target '${ target.id }' could not be notified.`)
            }

        });

        logger.socket.debug(`Message #${ messageId } processed in ${ Date.now() - date } ms`)
    }
    catch(error){
        throw new EventHandlerError(error.stack);
    }

}