/**
 * @file Poll.js - Module for representing a poll in a chat message.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateArray, validateBoolean, validateNotEmpty } from "../propertyValidation.js";

/**
 * @description Represents a poll.
 * @param {String} question - The question of the poll.
 * @param {Boolean} anonymous - Whether the poll is anonymous.
 * @param {Array<PollAnswer>} answers - The answers of the poll.
 */
export default class Poll {

    /**
     * @description Create a poll.
     * @param {String} question - The question of the poll.
     * @param {Boolean} anonymous - Whether the poll is anonymous.
     * @param {Array<PollAnswer>} answers - The answers of the poll.
     */
    constructor(
        question,
        anonymous,
        answers
    ) {
        //TODO: unterstriche weg
        this._question = question;
        this._anonymous = anonymous;
        this._answers = answers;
    }

    get question() {
        return this._question;
    }

    set question(value) {
        validateNotEmpty('Poll question', value)
        this._question = value;
    }

    get anonymous() {
        return this._anonymous;
    }

    set anonymous(value) {
        validateBoolean('Poll anonymous', value)
        this._anonymous = value;
    }

    get answers() {
        return this._answers;
    }

    set answers(value) {
        validateArray('Poll answers', value);
        this._answers = value;
    }

}
