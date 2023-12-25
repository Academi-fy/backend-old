/**
 * @file Tag.js - Module for representing an event.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 *
 * @description Class representing a tag.
 * @param {String} emoji - The emoji of the tag.
 * @param {String} description - The description of the tag.
 * */
export default class Tag {

    /**
     * @description Create a tag.
     * @param {String} emoji - The emoji of the tag.
     * @param {String} description - The description of the tag.
     * */
    constructor(
        emoji,
        description
    ) {
        this.emoji = emoji;
        this.description = description;
    }

    get _emoji() {
        return this.emoji;
    }

    set _emoji(value) {
        this.emoji = value;
    }

    get _description() {
        return this.description;
    }

    set _description(value) {
        this.description = value;
    }

}