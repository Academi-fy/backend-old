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
        this.question = question;
        this.anonymous = anonymous;
        this.answers = answers;
    }

    get _question() {
        return this.question;
    }

    set _question(value) {
        validateNotEmpty('Poll question', value)
        this.question = value;
    }

    get _anonymous() {
        return this.anonymous;
    }

    set _anonymous(value) {
        validateBoolean('Poll anonymous', value)
        this.anonymous = value;
    }

    get _answers() {
        return this.answers;
    }

    set _answers(value) {
        validateArray('Poll answers', value);
        this.answers = value;
    }

}
