/**
 * @file CacheError.js - Error class for events concerning the message parsing through the websocket.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class SocketMessageParsingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SocketMessageParsingError';
    }
}