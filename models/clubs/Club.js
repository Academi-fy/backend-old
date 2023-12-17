/**
 * @file Club.js - Module for handling clubs.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import BaseModel from "../BaseModel.js";
import ClubSchema from "../../mongoDb/schemas/clubs/ClubSchema.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Message from "../messages/Message.js";
import User from "../users/User.js";
import Course from "../general/Course.js";

/**
 * @description Class representing a Club
 * @param {String} id - The id of the club.
 * @param {String} name - The name of the club.
 * @param {ClubDetails} details - The details of the club.
 * @param {Array<User>} leaders - The leaders of the club.
 * @param {Array<User>} members - The members of the club.
 * @param {Chat} chat - The chat of the club.
 * @param {Array<Event>} events - The events of the club.
 * @param {String} state - The state of the club. Valid states are:
 * 'SUGGESTED', 'REJECTED', 'APPROVED',
 * 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED',
 * 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * @param {Array<Club>} editHistory - The edit history of the club.
 */
export default class Club extends BaseModel {

    static modelName = 'Club';
    static schema = ClubSchema;
    static cacheKey = 'clubs';
    static expirationTime = 5; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'leaders' },
        { path: 'members' },
        { path: 'chat' },
        { path: 'events' }
    ];

    constructor(
        name,
        details,
        leaders,
        members,
        chat,
        events,
        state,
        editHistory
    ) {
        super({
            name,
            details,
            leaders,
            members,
            chat,
            events,
            state,
            editHistory
        });
        this._id = null;
        this._name = name;
        this._details = details;
        this._leaders = leaders;
        this._members = members;
        this._chat = chat;
        this._events = events;
        this._state = state;
        this._editHistory = editHistory;
    }

    /**
     * Casts a plain object to an instance of the Club class.
     * @param {Object} club - The plain object to cast.
     * @returns {Club} The cast instance of the Club class.
     */
    static castToClub(club) {
        const { id, name, details, leaders, members, chat, events, state, editHistory } = club;
        const castClub = new Club(
            name,
            details,
            leaders,
            members,
            chat,
            events,
            state,
            editHistory
        );
        castClub.id = id.toString();
        return castClub;
    }

    /**
     * Converts the Club instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Club instance.
     * @returns {Object} An object representation of the Club instance without underscores in the property names.
     */
    toJSON(){
        const { id, name, details, leaders, members, chat, events, state, editHistory } = this;
        return {
            id,
            name,
            details,
            leaders,
            members,
            chat,
            events,
            state,
            editHistory
        };
    }

    /**
     * Populates the given Club with related data from other collections.
     * @param {Object} club - The Club to populate.
     * @returns {Promise<Club>} The populated Club.
     * @throws {DatabaseError} If the Club could not be populated.
     */
    static async populateClub(club) {
        try {
            club = await club
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
            club.id = club._id.toString();

            return this.castToClub(club);
        } catch (error) {
            // here club._id is used instead of club.id because club is an instance of the mongoose model
            throw new DatabaseError(`Failed to populate club with id #${club._id}' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateEvent method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Club>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateClub(object);
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get details() {
        return this._details;
    }

    set details(value) {
        this._details = value;
    }

    get leaders() {
        return this._leaders;
    }

    set leaders(value) {
        this._leaders = value;
    }

    get members() {
        return this._members;
    }

    set members(value) {
        this._members = value;
    }

    get chat() {
        return this._chat;
    }

    set chat(value) {
        this._chat = value;
    }

    get events() {
        return this._events;
    }

    set events(value) {
        this._events = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get editHistory() {
        return this._editHistory;
    }

    set editHistory(value) {
        this._editHistory = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

}