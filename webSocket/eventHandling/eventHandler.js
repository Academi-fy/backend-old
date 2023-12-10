/**
 * @file eventHandler.js - Handles different types of events that can occur in a WebSocket connection.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 *
 */

import logger from "../../tools/logging/logger.js";
import errors from "../../errors.js";
import socketEvents from "./socketEvents.js";

/**
 * @description This function handles different types of events that can occur in a WebSocket connection.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} date - The date when the message was received.
 */
export function handleEvents(ws, data, messageId, date) {

    const now = Date.now();
    const event = data.event;

    if(socketEvents[event]){
        socketEvents[event].handler(ws, data, messageId, date);
    }
    else {
        logger.socket.debug(`Message #${messageId} contains unknown event ${event}`);
        ws.send(
            JSON.stringify({
                event: "ERROR",
                payload: {
                    errorCode: errors.socket.messages.parsing.failed.unknownEvent,
                    errorMessage: `Invalid event type. \nSee documentation for more information [https://github.com/Academi-fy/backend/wiki/SocketEvents]`
                }
            })
        );
    }

}