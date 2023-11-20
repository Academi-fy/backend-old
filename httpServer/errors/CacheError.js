/**
 * @file CacheError.js - Error class for events concerning the backend cache.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class CacheError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CacheError';
    }
}