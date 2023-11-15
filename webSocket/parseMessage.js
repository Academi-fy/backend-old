import yupSchemas from "./yupSchemas.js";

/**
 * Parses a message and validates its payload.
 * @param {string} message - The message to be parsed.
 * @returns {Object} The parsed message object with validated payload.
 * @throws {Error} Will throw an error if the message does not contain 'event' or 'payload'.
 */
export function parseMessage(message) {

    const object = JSON.parse(message);

    if (!("event" in object)) throw new Error("Invalid message: no event");
    if (!("payload" in object)) throw new Error("Invalid message: no payload");

    object.payload = yupSchemas[object.event].validateSync(object.payload);

    return object;
}