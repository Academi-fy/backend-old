import MessageContent from "../MessageContent.js";

export default class PollContent extends MessageContent {

    constructor(
        type,
        poll
    ) {
        super(type);
        this._poll = poll;
    }

    getContent() {
        return this._poll;
    }

    get poll() {
        return this._poll;
    }

    set poll(value) {
        this._poll = value;
    }

}