/**
 * @file ClubTag.js - Module for representing a club tag.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateNotEmpty } from "../propertyValidation.js";

export default class ClubTag {

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
        validateNotEmpty('Club tag emoji', value);
        this.emoji = value;
    }

    get _description() {
        return this.description;
    }

    set _description(value) {
        validateNotEmpty('Club tag description', value);
        this.description = value;
    }

}