/**
 * @file CacheError.js - Error class for events concerning sending messsages to socket targets.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class SocketMessageSendError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EventHandlerError';
    }
}