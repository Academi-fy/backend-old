/**
 * @file PollAnswer.js - Module for representing a poll answer.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
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
        this._id = id;
        this._emoji = emoji;
        this._optionName = optionName;
        this._voters = voters;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get emoji() {
        return this._emoji;
    }

    set emoji(value) {
        this._emoji = value;
    }

    get optionName() {
        return this._optionName;
    }

    set optionName(value) {
        this._optionName = value;
    }

    get voters() {
        return this._voters;
    }

    set voters(value) {
        this._voters = value;
    }

    /**
     * Casts an object into a PollAnswer instance.
     * @param {Object} pollAnswer - The object to be cast into a PollAnswer instance.
     * @returns {PollAnswer} A new PollAnswer instance.
     * @throws {TypeError} If the object cannot be cast into a PollAnswer instance.
     */
    static castToPollAnswer(pollAnswer) {
        if (typeof pollAnswer !== 'object' || pollAnswer === null) {
            throw new TypeError('Invalid object. Cannot cast to PollAnswer.');
        }

        const { id, emoji, optionName, voters } = pollAnswer;
        if (typeof id !== 'number' || typeof emoji !== 'string' || typeof optionName !== 'string' || !Array.isArray(voters)) {
            throw new TypeError('Invalid object properties. Cannot cast to PollAnswer.');
        }

        return new PollAnswer(id, emoji, optionName, voters);
    }

    /**
     * Converts the PollAnswer instance into a JSON-friendly format.
     * This method is automatically called when JSON.stringify() is used on a PollAnswer instance.
     * @returns {Object} An object representation of the PollAnswer instance.
     */
    toJSON() {
        const { id, emoji, optionName, voters } = this;
        return {
            id,
            emoji,
            optionName,
            voters
        };
    }

    vote(user) {
        this.voters.push(user);
    }

    unvote(user) {
        this.voters.splice(this.voters.indexOf(user), 1);
    }

}