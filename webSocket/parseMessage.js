/**
 * @file parseMessage.js - Parses a message and validates its payload. It is used in webSocket/eventHandler.js.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yupSchemas from "./yupSchemas.js";
import SocketMessageParsingError from "./errors/SocketMessageParsingError.js";
import socketEvents from "./socketEvents.js";

/**
 * @description Parses a message and validates its payload.
 * @param {String} message - The message to be parsed.
 * @returns {Object} The parsed message object with validated payload.
 * @throws {Error} Will throw an error if the message does not contain 'event' or 'payload'.
 */
export function parseMessage(message) {

    const object = JSON.parse(message);

    if (!("event" in object)) throw new SocketMessageParsingError("Invalid message: message event is required");

    if(!socketEvents.includes(object.event)) throw new SocketMessageParsingError(`Invalid message: event '${object.event}' does not exist`);

    /**
     * @description The actual data of the event.
     * @type {Object}
     * @property {String} sender - The sender of the event.
     * @property {Object} data - The data of the event.
     */
    if (!("payload" in object)) throw new SocketMessageParsingError("Invalid message: payload is required");
    if (object.payload === null || typeof object.payload !== 'object') {
        throw new SocketMessageParsingError("Invalid message: payload must be an object");
    }

    if (!("sender" in object.payload)) throw new SocketMessageParsingError("Invalid message: message sender is required")
    if (!("data" in object.payload)) throw new SocketMessageParsingError("Invalid message: message data is required")

    object.payload = yupSchemas[object.event].validateSync(object.payload);

    return object;
}