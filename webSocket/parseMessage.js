/**
 * @file parseMessage.js - Parses a messages and validates its payload. It is used in webSocket/eventHandler.js.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yupSchemas from "./eventHandling/yupEvents.js";
import SocketMessageParsingError from "./errors/SocketMessageParsingError.js";
import socketEvents from "./eventHandling/socketEvents.js";
import UnknownEventError from "./errors/UnknownEventError.js";

/**
 * @description Parses a messages and validates its payload.
 * @param {String} message - The messages to be parsed.
 * @returns {Object} The parsed messages object with validated payload.
 * @throws {Error} Will throw an error if the messages does not contain 'event' or 'payload'.
 */
export function parseMessage(message) {

    const object = JSON.parse(message);

    if (!("event" in object)) throw new SocketMessageParsingError("Invalid messages: messages event is required");

    if (!Object.keys(socketEvents).includes(object.event)) throw new UnknownEventError(`Invalid message: event '${ object.event }' does not exist`);

    /**
     * @description The actual data of the event.
     * @type {Object}
     * @property {String} sender - The sender of the event.
     * @property {Object} data - The data of the event.
     */
    if (!("payload" in object)) throw new SocketMessageParsingError("Invalid messages: payload is required");
    if (object.payload === null || typeof object.payload !== 'object') {
        throw new SocketMessageParsingError("Invalid messages: payload must be an object");
    }

    if (!("sender" in object.payload)) throw new SocketMessageParsingError("Invalid messages: messages sender is required")
    if (!("data" in object.payload)) throw new SocketMessageParsingError("Invalid messages: messages data is required")

    object.payload = yupSchemas[object.event].validateSync(object.payload);

    return object;
}