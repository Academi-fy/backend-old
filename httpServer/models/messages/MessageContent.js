/**
 * @file MessageContent.js - Module for representing the content of a messages in a chat.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateNotEmpty, validateObject } from "../propertyValidation.js";

/**
 * @description Represents the content of a messages.
 * @param {String} type - The type of the messages content. Valid values are: "FILE", "IMAGE", "POLL", "TEXT", "VIDEO".
 * @param {Object} value - The value of the messages content.
 */
export default class MessageContent {

    /**
     * @description Constructs a new MessageContent instance.
     * @param {String} type - The type of the messages content. Valid values are: "FILE", "IMAGE", "POLL", "TEXT", "VIDEO".
     * @param {Object} value - The value of the messages content.
     */
    constructor(
        type,
        value
    ) {
        if (new.target === MessageContent) {
            throw new TypeError("Cannot construct MessageContent instances directly");
        }

        this.type = type;
        this.value = value;
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateObject('Message content value', value);
        this.value = value;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        validateNotEmpty('Message content type', value);
        this.type = value;
    }

}