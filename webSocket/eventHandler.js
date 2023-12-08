/**
 * @file eventHandler.js - Handles different types of events that can occur in a WebSocket connection.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 *
 */

import logger from "../tools/logging/logger.js";
import errors from "../errors.js";

/**
 * @description This function handles different types of events that can occur in a WebSocket connection.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 */
export function handleEvents(ws, data, messageId) {

    const event = data.event;
    const payload = data.payload;
    switch (event) {

        case "MESSAGE_SEND":
            break;

        case "MESSAGE_EDIT":
            break;

        case "MESSAGE_DELETE":
            break;

        case "MESSAGE_REACTION_ADD":
            break;

        case "MESSAGE_REACTION_REMOVE":
            break;

        case "TYPING":
            break;

        case "POLL_VOTE":
            break;

        default:
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