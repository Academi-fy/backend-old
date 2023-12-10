/**
 * @file Poll.js - Module for representing a poll in a chat messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateArray, validateBoolean, validateNotEmpty } from "../propertyValidation.js";

/**
 * @description Represents a poll.
 * @param {String} question - The question of the poll.
 * @param {Boolean} anonymous - Whether the poll is anonymous.
 * @param {Array<PollAnswer>} answers - The answers of the poll.
 * @param {Number} maxVotesPerUser - The maximum votes a user can make.
 */
export default class Poll {

    /**
     * @description Create a poll.
     * @param {String} question - The question of the poll.
     * @param {Boolean} anonymous - Whether the poll is anonymous.
     * @param {Array<PollAnswer>} answers - The answers of the poll.
     * @param {Number} maxVotesPerUser - The maximum votes a user can make.
     */
    constructor(
        question,
        anonymous,
        answers,
        maxVotesPerUser
    ) {
        this.question = question;
        this.anonymous = anonymous;
        this.answers = answers;
        this.maxVotesPerUser = maxVotesPerUser;
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

    get _maxVotesPerUser() {
        return this.maxVotesPerUser;
    }

    set _maxVotesPerUser(value) {
        validateNotEmpty('Poll maxVotesPerUser', value);
        this.maxVotesPerUser = value;
    }

}
