import { validateNotEmpty } from "../propertyValidation.js";

/**
 * @description Class representing a club rule.
 * @param {String} emoji - The emoji representing the club rule.
 * @param {String} description - The description of the club rule.
 */
export default class ClubRule {

    /**
     * @description Create a club rule.
     * @param {String} emoji - The emoji representing the club rule.
     * @param {String} description - The description of the club rule.
     */
    constructor(
        emoji = "",
        description = ""
    ) {
        this.emoji = emoji;
        this.description = description;
    }

    get _emoji() {
        return this.emoji;
    }

    set _emoji(value) {
        validateNotEmpty('Club rule emoji', value);
        this.emoji = value;
    }

    get _description() {
        return this.description;
    }

    set _description(value) {
        validateNotEmpty('Club rule description', value);
        this.description = value;
    }

}