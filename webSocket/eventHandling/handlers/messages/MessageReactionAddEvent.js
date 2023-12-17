/**
 * @file MessageReactionAddEvent.js - Class handling the socket's MessageReactionAddEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import Chat from "../../../../models/messages/Chat.js";
import Message from "../../../../models/messages/Message.js";
import logger from "../../../../tools/logging/logger.js";
import EventHandlerError from "../../../errors/EventHandlerError.js";
import sendToTargetSocket from "../../../sendToTargetSocket.js";

/**
 * @description Function handling the MessageReactionAddEvent.
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
        message.addReaction(emoji); //TODO checken, ob es verändert wird
        const updatedMessage = await Message.updateMessage(msgId, message);

        const chat = message._chat;

        chat.getAllTargets().forEach(target => {
            
            if(!sendToTargetSocket(
                server,
                target,
                JSON.stringify({
                    event: "MESSAGE_REACTION_ADD_RECEIVED",
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