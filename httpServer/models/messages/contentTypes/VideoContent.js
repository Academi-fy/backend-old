/**
 * @file VideoContent.js - Module for representing a video content of messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

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

        validateNotEmpty("VideoContent value", value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("VideoContent value", value);
        this.value = value;
    }

}