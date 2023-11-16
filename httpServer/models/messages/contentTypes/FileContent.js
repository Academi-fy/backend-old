import MessageContent from "../MessageContent.js";

export default class FileContent extends MessageContent {

    constructor(
        type,
        file
    ) {
        super(type);
        this._file = file;
    }

    getContent() {
        return this._file;
    }

    get file() {
        return this._file;
    }

    set file(value) {
        this._file = value;
    }

}