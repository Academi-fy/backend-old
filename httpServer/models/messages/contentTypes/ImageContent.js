/**
 * @file ImageContent.js - Module for representing an image content of messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

/**
 * @description Class representing an image content.
 * @param {String} type - The type of the content. For image: 'IMAGE'
 * @param {String} value - The link to the image.
 * */
export default class ImageContent extends MessageContent {

    /**
     * @description Create a file content.
     * @param {String} value - The link to the file.
     * */
    constructor(
        value
    ) {
        const type = "IMAGE";
        super(type, value);

        validateNotEmpty("FileContent value", value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("ImageContent value", value);
        this.value = value;
    }

}