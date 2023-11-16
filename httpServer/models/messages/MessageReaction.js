import { validateNotEmpty, validateNumber } from "../propertyValidation.js";

export default class MessageReaction {

    /**
     * Constructs a new MessageReaction instance.
     * @param {String} emoji - The emoji used for the reaction.
     * @param {Number} count - The count of the reaction (default is 0).
     */
    constructor(
        emoji,
        count = 0
    ) {
        this.emoji = emoji;
        this.count = count;
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