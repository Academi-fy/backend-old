/**
 * @file MessageReaction.js - Module for representing a message reaction in a chat message.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateNotEmpty, validateNumber } from "../propertyValidation.js";

/**
 * @description Represents a message reaction.
 * @param {String} emoji - The emoji used for the reaction.
 * @param {Number} count - The count of the reaction (default is 0)
 */
export default class MessageReaction {

    /**
     * Constructs a new MessageReaction instance.
     * @param {String} emoji - The emoji used for the reaction.
     * @param {Number} count - The count of the reaction (default is 0).
     */
    constructor(
        emoji,
        count
    ) {
        this.emoji = emoji;
        this.count = count;

        validateNotEmpty("Message reaction emoji", emoji);
        validateNumber("Message reaction count", count);
    }

    get _emoji() {
        return this.emoji;
    }

    set _emoji(value) {
        validateNotEmpty("MessageReaction emoji", value);
        this.emoji = value;
    }

    get _count() {
        return this.count;
    }

    set _count(value) {
        validateNumber("MessageReaction count", value);
        this.count = value;
    }

    /**
     * Increments the count of the reaction by 1.
     */
    increment() {
        this.count++;
    }

    /**
     * Decrements the count of the reaction by 1.
     */
    decrement() {
        this.count--;
    }

}