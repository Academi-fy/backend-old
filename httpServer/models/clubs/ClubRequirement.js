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

        validateNotEmpty('Club requirement emoji', this.emoji);
        validateNotEmpty('Club requirement description', this.description);
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