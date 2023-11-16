import MessageContent from "../MessageContent.js";

export default class ImageContent extends MessageContent {

    constructor(
        type,
        image
    ) {
        super(type);
        this._image = image;
    }

    getContent() {
        return this._image;
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

}