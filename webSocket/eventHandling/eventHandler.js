/**
 * @file eventHandler.js - Handles different types of events that can occur in a WebSocket connection.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 *
 */

import socketEvents from "./socketEvents.js";
import EventHandlerError from "../errors/EventHandlerError.js";

/**
 * @description This function handles different types of events that can occur in a WebSocket connection.
 * @param {Object} wss - The WebSocket server object.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} date - The date when the message was received.
 */
export function handleEvents(wss, ws, data, messageId, date) {

    const event = data.event;

    if (socketEvents[event]) {

        try {
            socketEvents[event].handler({
                server: wss,
                connection: ws
            }, data, messageId, date);
        } catch (error) {
            throw new EventHandlerError(`Event '${ event }' could not be handled: \n${ error.stack }`)
        }

    }
    else throw new EventHandlerError(`Event '${ event }' could not be handled`)

}