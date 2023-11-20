export default class CacheError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CacheError';
    }
}