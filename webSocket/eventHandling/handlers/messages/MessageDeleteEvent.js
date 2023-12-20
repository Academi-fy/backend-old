/**
 * @file MessageDeleteEvent.js - Class handling the socket's MessageDeleteEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import Message from "../../../../models/messages/Message.js";
import logger from "../../../../tools/logging/logger.js";
import EventHandlerError from "../../../errors/EventHandlerError.js";
import SocketMessageSendError from "../../../errors/SocketMessageSendError.js";
import sendToTargetSocket from "../../../sendToTargetSocket.js";

/**
 * @description Function handling the MessageDeleteEvent.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} messageDate - The date when the event was received.
 */
export default async function (ws, data, messageId, messageDate) {

    const { server, connection } = ws;

    const msgId = data.payload.data.messageId;

    try {

        let deleted = await Message.getById(msgId);
        deleted = deleted.delete();

        const chat = deleted.chat;
        let index = chat.messages.findIndex(msg => msg.id === msgId);
        chat.messages.splice(index, 1);
        await chat.update(chat);

        chat.getAllTargets().forEach(target => {

            if(!sendToTargetSocket(server, target, 
                JSON.stringify({
                    event: "MESSAGE_DELETE_RECEIVED",
                    payload: {
                        sender: `socket`,
                        data: {
                            messageId: msgId
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