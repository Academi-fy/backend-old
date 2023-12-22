/**
 * @file Poll.js - Module for representing a poll in a chat messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import PollAnswer from "./PollAnswer.js";

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
        this._question = question;
        this._anonymous = anonymous;
        this._answers = answers;
        this._maxVotesPerUser = maxVotesPerUser;
    }

    get question() {
        return this._question;
    }

    set question(value) {
        this._question = value;
    }

    get anonymous() {
        return this._anonymous;
    }

    set anonymous(value) {
        this._anonymous = value;
    }

    get answers() {
        return this._answers;
    }

    set answers(value) {
        this._answers = value;
    }

    get maxVotesPerUser() {
        return this._maxVotesPerUser;
    }

    set maxVotesPerUser(value) {
        this._maxVotesPerUser = value;
    }

    /**
     * Casts an object into a Poll instance.
     * @param {Object} poll - The object to be cast into a Poll instance.
     * @returns {Poll} A new Poll instance.
     * @throws {TypeError} If the object cannot be cast into a Poll instance.
     */
    static castToPoll(poll) {
        if (typeof poll !== 'object' || poll === null) {
            throw new TypeError('Invalid object. Cannot cast to Poll.');
        }

        const { question, anonymous, answers, maxVotesPerUser } = poll;
        let newPoll = new Poll(question, anonymous, answers, maxVotesPerUser);
        newPoll.answers = newPoll.answers.map(answer => PollAnswer.castToPollAnswer(answer));
        return newPoll;
    }

    /**
     * Converts the Poll instance into a JSON-friendly format.
     * This method is automatically called when JSON.stringify() is used on a Poll instance.
     * @returns {Object} An object representation of the Poll instance.
     */
    toJSON() {
        const { question, anonymous, answers, maxVotesPerUser } = this;
        return {
            question,
            anonymous,
            answers,
            maxVotesPerUser
        };
    }

}
