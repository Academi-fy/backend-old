/**
 * @file ClubTag.js - Module for representing a club tag.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
/**
 * @description Class representing a club tag.
 * @param {String} emoji - The emoji of the club tag.
 * @param {String} description - The description of the club tag.
 */
export default class ClubTag {

    constructor(
        emoji,
        description
    ) {
        this._emoji = emoji;
        this._description = description;
    }

    /**
     * Convert the ClubTag instance into a JSON-friendly format.
     * @returns {Object} An object that contains all the properties of the ClubTag instance.
     */
    toJSON() {
        const { emoji, description } = this;
        return {
            emoji,
            description
        };
    }

    /**
     * Cast an object into a ClubTag instance.
     * @param {Object} clubTagObject - The object to be cast into a ClubTag instance.
     * @returns {ClubTag} A new ClubTag instance.
     * @throws {TypeError} If the provided object is not valid or does not contain all the necessary properties.
     */
    static castToClubTag(clubTagObject) {
        if (typeof clubTagObject !== 'object' || clubTagObject === null) {
            throw new TypeError('Invalid object. Cannot cast to ClubTag.');
        }

        const { emoji, description } = clubTagObject;
        return new ClubTag(emoji, description);
    }

    get emoji() {
        return this._emoji;
    }

    set emoji(value) {
        this._emoji = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

}