/**
 * @file VideoContent.js - Module for representing a video content of messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";

/**
 * @description Class representing a video content.
 * @param {String} type - The type of the content. For video: 'VIDEO'
 * @param {String} value - The link to the video.
 * */
export default class VideoContent extends MessageContent {

    /**
     * @description Create a video content.
     * @param {String} value - The link to the video.
     * */
    constructor(
        value
    ) {
        const type = "VIDEO";
        super(type, value);

    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

}