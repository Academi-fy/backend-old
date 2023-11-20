/**
 * @file RetrievalError.js - Error class for events concerning searching of the cache and/or database.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class RetrievalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RetrievalError';
    }
}