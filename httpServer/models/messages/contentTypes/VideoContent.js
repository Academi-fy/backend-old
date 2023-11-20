/**
 * @file VideoContent.js - Module for representing a video content of message.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

export default class VideoContent extends MessageContent {

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