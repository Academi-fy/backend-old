import { validateArray, validateNotEmpty, validateNumber } from "../propertyValidation.js";

/**
 * @description Class representing a PollAnswer.
 * @param {Number} id - The id of the poll answer. Schema: 1, 2, 3, ...
 * @param {String} optionName - The name of the poll answer.
 * @param {Array<User>} voters - The  users that voted for this answer.
 * @param {Number} maxVotesPerUser - The maximum number of votes a users can give to this answer.
 */
export default class PollAnswer {

    /**
     * Create a new PollAnswer
     * @param {Number} id - The id of the poll answer. Schema: 1, 2, 3, ...
     * @param {String} optionName - The name of the poll answer.
     * @param {Array<String>} voters - The ids of the users that voted for this answer.
     * @param {Number} maxVotesPerUser - The maximum number of votes a users can give to this answer.
     */
    constructor(
        id,
        optionName,
        voters,
        maxVotesPerUser
    ) {
        this.id = id;
        this.optionName = optionName;
        this.voters = voters;
        this.maxVotesPerUser = maxVotesPerUser;

        validateNotEmpty('Poll answer id', id);
        validateNotEmpty('Poll answer option name', optionName);
        validateArray('Poll answer voters', voters);
        validateNumber('Poll answer max votes per user', maxVotesPerUser);
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNotEmpty('Poll answer id', value);
        this.id = value;
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

    get _maxVotesPerUser() {
        return this.maxVotesPerUser;
    }

    set _maxVotesPerUser(value) {
        validateNotEmpty('Poll answer maxVotesPerUser', value);
        this.maxVotesPerUser = value;
    }

}