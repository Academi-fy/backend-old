/**
 * @file ClubRequirement.js - Module for representing a club requirement.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
/**
 * @description Class representing a club requirement.
 * @param {String} emoji - The emoji of the club requirement.
 * @param {String} description - The description of the club requirement.
 * */
export default class ClubRequirement {

    /**
     * @description Create a club requirement.
     * @param {String} emoji - The emoji of the club requirement.
     * @param {String} description - The description of the club requirement.
     */
    constructor(
        emoji,
        description
    ) {
        this._emoji = emoji;
        this._description = description;
    }

    /**
     * Convert the ClubRequirement instance into a JSON-friendly format.
     * @returns {Object} An object that contains all the properties of the ClubRequirement instance.
     */
    toJSON() {
        const { emoji, description } = this;
        return {
            emoji,
            description
        };
    }

    /**
     * Cast an object into a ClubRequirement instance.
     * @param {Object} clubRequirementObject - The object to be cast into a ClubRequirement instance.
     * @returns {ClubRequirement} A new ClubRequirement instance.
     * @throws {TypeError} If the provided object is not valid or does not contain all the necessary properties.
     */
    static castToClubRequirement(clubRequirementObject) {
        if (typeof clubRequirementObject !== 'object' || clubRequirementObject === null) {
            throw new TypeError('Invalid object. Cannot cast to ClubRequirement.');
        }

        const { emoji, description } = clubRequirementObject;
        return new ClubRequirement(emoji, description);
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