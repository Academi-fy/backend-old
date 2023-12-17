/**
 * @file PollAnswer.js - Module for representing a poll answer.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateNotEmpty, validateNumber } from "../../../models/propertyValidation.js";

/**
 * @description Class representing a PollAnswer.
 * @param {Number} id - The id of the poll answer. Schema: 1, 2, 3, ...
 * @param {String} emoji - The emoji representing the answer.
 * @param {String} optionName - The name of the poll answer.
 * @param {Array<User>} voters - The  users that voted for this answer.
 */
export default class PollAnswer {

    /**
     * Create a new PollAnswer
     * @param {Number} id - The id of the poll answer. Schema: 1, 2, 3, ...
     * @param {String} emoji - The emoji representing the answer.
     * @param {String} optionName - The name of the poll answer.
     * @param {Array<String>} voters - The ids of the users that voted for this answer.
     */
    constructor(
        id,
        emoji,
        optionName,
        voters,
    ) {
        this.id = id;
        this.emoji = emoji;
        this.optionName = optionName;
        this.voters = voters;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNumber('Poll answer id', value);
        this.id = value;
    }

    get _emoji() {
        return this.emoji;
    }

    set _emoji(value) {
        validateNotEmpty('Poll answer emoji', value);
        this.emoji = value;
    }

    get _optionName() {
        return this.optionName;
    }

    set _optionName(value) {
        validateNotEmpty('Poll answer optionName', value);
        this.optionName = value;
    }

    get _voters() {
        return this.voters;
    }

    set _voters(value) {
        validateNotEmpty('Poll answer voters', value);
        this.voters = value;
    }

    vote(user) {
        this._voters.push(user);
    }

    unvote(user) {
        this._voters.splice(this._voters.indexOf(user), 1);
    }

}