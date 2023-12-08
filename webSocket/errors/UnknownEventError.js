/**
 * @file CacheError.js - Error class for events concerning event for the message parsing through the websocket.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class UnknownEventError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnknownEventError';
    }
}