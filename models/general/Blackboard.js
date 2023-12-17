/**
 * @file Blackboard.js - Module for representing a blackboard.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import BaseModel from "../BaseModel.js";
import BlackboardSchema from "../../mongoDb/schemas/general/BlackboardSchema.js";
import Message from "../messages/Message.js";
import Club from "../clubs/Club.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Course from "./Course.js";
import User from "../users/User.js";

/**
 * @description Class representing a blackboard.
 * @param {String} _id - The _id of the blackboard.
 * @param {String} title - The title of the blackboard.
 * @param {User} author - The author of the blackboard.
 * @param {String} coverImage - The cover image of the blackboard.
 * @param {String} text - The text of the blackboard.
 * @param {Array<Tag>} tags - The tags of the blackboard.
 * @param {Number} date - The date of the blackboard.
 * @param {String} state - The state of the blackboard. Valid states are: 'SUGGESTED', 'REJECTED', 'APPROVED', 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED', 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * */
export default class Blackboard extends BaseModel {

    static modelName = 'Blackboard';
    static schema = BlackboardSchema;
    static cacheKey = 'blackboards';
    static expirationTime = 10; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'author' }
    ];

    /**
     * @description Create a blackboard.
     * @param {String} title - The title of the blackboard.
     * @param {String} author - The _id of the author of the blackboard.
     * @param {String} coverImage - The cover image of the blackboard.
     * @param {String} text - The text of the blackboard.
     * @param {Array<Tag>} tags - The tags of the blackboard.
     * @param {Number} date - The date of the blackboard.
     * @param {String} state - The state of the blackboard. Valid states are: 'SUGGESTED', 'REJECTED', 'APPROVED', 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED', 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
     */
    constructor(
        title,
        author,
        coverImage,
        text,
        tags,
        date,
        state
    ) {
        super({
            title,
            author,
            coverImage,
            text,
            tags,
            date,
            state
        });
        this.id = null;
        this._title = title;
        this._author = author;
        this._coverImage = coverImage;
        this._text = text;
        this._tags = tags;
        this._date = date;
        this._state = state;
    }

    /**
     * Casts a plain object to an instance of the Blackboard class.
     * @param {Object} blackboard - The plain object to cast.
     * @returns {Blackboard} The cast instance of the Blackboard class.
     */
    static castToBlackboard(blackboard) {
        const { _id, title, author, coverImage, text, tags, date, state } = blackboard;
        const castBlackboard = new Blackboard(
            title,
            author,
            coverImage,
            text,
            tags,
            date,
            state
        );
        castBlackboard._id = _id.toString();
        return castBlackboard;
    }

    /**
     * Converts the Blackboard instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Blackboard instance.
     * @returns {Object} An object representation of the Blackboard instance without underscores in the property names.
     */
    toJSON(){
        const { _id, title, author, coverImage, text, tags, date, state } = this;
        return {
            _id,
            title,
            author,
            coverImage,
            text,
            tags,
            date,
            state
        };

    }

    /**
     * Populates the given Blackboard with related data from other collections.
     * @param {Object} blackboard - The Blackboard to populate.
     * @returns {Promise<Blackboard>} The populated Blackboard.
     * @throws {DatabaseError} If the Blackboard could not be populated.
     */
    static async populateBlackboard(blackboard) {
        try {
            blackboard = await blackboard
                .populate([
                    {
                        path: 'targets',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'courses',
                        populate: Course.getPopulationPaths()
                    },
                    {
                        path: 'clubs',
                        populate: Club.getPopulationPaths()
                    },
                    {
                        path: 'messages',
                        populate: Message.getPopulationPaths()
                    },
                ]);
            blackboard._id = blackboard._id.toString();

            return this.castToBlackboard(blackboard);
        } catch (error) {
            // here blackboard._id is used instead of blackboard._id because blackboard is an instance of the mongoose model
            throw new DatabaseError(`Failed to populate blackboard with _id #${blackboard._id}' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateBlackboard method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Blackboard>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateBlackboard(object);
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get coverImage() {
        return this._coverImage;
    }

    set coverImage(value) {
        this._coverImage = value;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get tags() {
        return this._tags;
    }

    set tags(value) {
        this._tags = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

}