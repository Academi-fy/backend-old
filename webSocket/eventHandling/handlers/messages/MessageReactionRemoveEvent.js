/**
 * @file MessageReactionRemoveEvent.js - Class handling the socket's MessageReactionRemoveEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import Message from "../../../../models/messages/Message.js";
import logger from "../../../../tools/logging/logger.js";
import sendToTargetSocket from "../../../sendToTargetSocket.js";
import SocketMessageSendError from "../../../errors/SocketMessageSendError.js";
import EventHandlerError from "../../../errors/EventHandlerError.js";

/**
 * @description Function handling the MessageReactionRemoveEvent.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} messageDate - The date when the event was received.
 */
export default async function (ws, data, messageId, messageDate) {

    const { server, connection } = ws;

    const msgId = data.payload.data.messageId;
    const emoji = data.payload.data.emoji;

    try {

        const message = await Message.getById(msgId);
        message.removeReaction(emoji);
        const updatedMessage = await message.update(message);

        let chat = updatedMessage.chat;
        let index = chat.messages.findIndex(msg => msg.id === msgId);
        chat.messages[index] = updatedMessage;
        chat.update(chat);

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
                throw new SocketMessageSendError(`'target '${ target.id }' could not be notified.'`);
            }

        });

        logger.socket.debug(`Message #${ messageId } processed in ${ Date.now() - messageDate } ms`)
    }
    catch(error){
        throw new EventHandlerError(error.stack);
    }

}