/**
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