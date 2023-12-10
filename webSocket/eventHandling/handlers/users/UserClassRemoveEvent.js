/**
 * @file UserClassRemoveEvent.js - Class handling the socket's UserClassRemoveEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import logger from "../../../../tools/logging/logger.js";

/**
 * @description Function handling the UserClassRemoveEvent.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} date - The date when the event was received.
 */
export default function (ws, data, messageId, date) {

    logger.socket.debug(`Message #${messageId} processed in ${Date.now() - date} ms`)
}