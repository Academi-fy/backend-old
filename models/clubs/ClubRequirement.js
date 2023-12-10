/**
 * @file ClubRequirement.js - Module for representing a club requirement.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateNotEmpty } from "../propertyValidation.js";

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
        this.emoji = emoji;
        this.description = description;
    }

    get _emoji() {
        return this.emoji;
    }

    set _emoji(value) {
        validateNotEmpty('Club requirement emoji', value);
        this.emoji = value;
    }

    get _description() {
        return this.description;
    }

    set _description(value) {
        validateNotEmpty('Club requirement description', value);
        this.description = value;
    }

}