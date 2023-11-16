import MessageContent from "../MessageContent.js";

export default class TextContent extends MessageContent {


    constructor(
        type,
        text
    ) {
        super(type);
        this._text = text;
    }

    getContent() {
        return this._text;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

}