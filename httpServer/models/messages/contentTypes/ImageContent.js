/**
 * @file ImageContent.js - Module for representing an image content of message.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

export default class ImageContent extends MessageContent {

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