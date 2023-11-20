export default class RetrievalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RetrievalError';
    }
}