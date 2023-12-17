/**
 * @file PollContent.js - Module for representing a poll content of messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";
import { validatePoll } from "../../../../models/propertyValidation.js";

/**
 * @description Class representing a poll content.
 * @param {String} type - The type of the content. For poll: 'POLL'
 * @param {Poll} value - The poll object.
 * */
export default class PollContent extends MessageContent {

    /**
     * @description Create a poll content.
     * @param {Poll} value - The poll object.
     * */
    constructor(
        value
    ) {
        const type = "POLL";
        super(type, value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validatePoll("PollContent value", value);
        this.value = value;
    }

}