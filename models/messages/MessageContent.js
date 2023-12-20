/**
 * @file MessageContent.js - Module for representing the content of a messages in a chat.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
/**
 * @description Represents the content of a messages.
 * @param {String} type - The type of the messages content. Valid values are: "FILE", "IMAGE", "POLL", "TEXT", "VIDEO".
 * @param {Object} value - The value of the messages content.
 */
export default class MessageContent {

    /**
     * @description Constructs a new MessageContent instance.
     * @param {String} type - The type of the messages content. Valid values are: "FILE", "IMAGE", "POLL", "TEXT", "VIDEO".
     * @param {any} value - The value of the messages content.
     */
    constructor(
        type,
        value
    ) {
        if (new.target === MessageContent) {
            throw new TypeError("Cannot construct MessageContent instances directly");
        }

        this._type = type;
        this._value = value;
    }

    /**
     * Converts the MessageContent instance into a JSON-friendly format.
     * This method is automatically called when JSON.stringify() is used on a MessageContent instance.
     * @returns {Object} An object representation of the MessageContent instance.
     */
    toJSON(){
        const { type, value } = this;
        return {
            type,
            value
        };
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

}