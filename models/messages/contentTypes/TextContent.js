/**
 * @file Textcontent.js - Module for representing a text content of messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";

/**
 * @description Class representing a text content.
 * @param {String} type - The type of the content. For text: 'TEXT'
 * @param {String} value - The text.
 * */
export default class TextContent extends MessageContent {

    /**
     * @description Create a text content.
     * @param {String} value - The text.
     * */
    constructor(
        value
    ) {
        const type = "TEXT";
        super(type, value);
    }

    get value() {
        return this._value;
    }

    set value(value) {
        validateNotEmpty("TextContent value", value);
        this._value = value;
    }

}