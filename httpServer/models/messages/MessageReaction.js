import { validateNotEmpty, validateNumber } from "../propertyValidation.js";

class MessageReaction {

    constructor(
        emoji,
        count = 0
    ) {
        this.emoji = emoji;
        this.count = count;
    }

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
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

}