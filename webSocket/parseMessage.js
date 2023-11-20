/**
 * @file parseMessage.js - Parses a message and validates its payload. It is used in webSocket/eventHandler.js.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yupSchemas from "./yupSchemas.js";

/**
 * @description Parses a message and validates its payload.
 * @param {String} message - The message to be parsed.
 * @returns {Object} The parsed message object with validated payload.
 * @throws {Error} Will throw an error if the message does not contain 'event' or 'payload'.
 */
export function parseMessage(message) {

    const object = JSON.parse(message);

    if (!("event" in object)) throw new Error("Invalid message: no event");

    /**
     * @description The actual data of the event.
     * @type {Object}
     * @property {String} sender - The sender of the event.
     * @property {Object} data - The data of the event.
     */
    if (!("payload" in object)) throw new Error("Invalid message: no payload");

    object.payload = yupSchemas[object.event].validateSync(object.payload);

    return object;
}