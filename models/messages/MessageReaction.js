/**
 * @file MessageReaction.js - Module for representing a messages reaction in a chat messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
/**
 * @description Represents a message reaction.
 * @param {String} emoji - The emoji used for the reaction.
 * @param {Number} count - The count of the reaction (default is 0)
 */
export default class MessageReaction {

    /**
     * Constructs a new MessageReaction instance.
     * @param {String} emoji - The emoji used for the reaction.
     */
    constructor(
        emoji
    ) {
        this.emoji = emoji;
        this.count = 1;
    }

    get _emoji() {
        return this.emoji;
    }

    set _emoji(value) {
        this.emoji = value;
    }

    get _count() {
        return this.count;
    }

    set _count(value) {
        this.count = value;
    }

    /**
     * Cast an object to a message reaction.
     * @param {Object} reaction - The reaction object to cast. Contains emoji and count.
     */
    static castToReaction(reaction) {
        const returnVal = new MessageReaction(reaction.emoji);
        returnVal._count = reaction.count;
        return returnVal;
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