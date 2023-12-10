/**
 * @file CacheError.js - Error class for events concerning the event handling in the web socket.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class EventHandlerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EventHandlerError';
    }
}