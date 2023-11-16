import MessageContent from "../MessageContent.js";

export default class VideoContent extends MessageContent {

    constructor(
        type,
        video
    ) {
        super(type);
        this._type = type;
        this._video = video;
    }

    getContent() {
        return this._video;
    }

    get video() {
        return this._video;
    }

    set video(value) {
        this._video = value;
    }

}