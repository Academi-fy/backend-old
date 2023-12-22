/**
 * @file Event.js - Module for representing an event.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import BaseModel from "../BaseModel.js";
import EventSchema from "../../mongoDb/schemas/events/EventSchema.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Club from "../clubs/Club.js";
import EventTicket from "./EventTicket.js";
import User from "../users/User.js";
import EventInformation from "./EventInformation.js";

/**
 * @description Class representing an Event.
 * @param {String} _id - The _id of the event.
 * @param {String} title - The title of the event.
 * @param {String} description - The description of the event.
 * @param {String} location - The location of the event.
 * @param {String} host - The host of the event.
 * @param {Array<Event>} clubs - The clubs of the event.
 * @param {Number} startDate - The start date of the event.
 * @param {Number} endDate - The end date of the event.
 * @param {Array<EventInformation>} information - The information of the event.
 * @param {Array<EventTicket>} tickets - The tickets of the event.
 * @param {String} state - The state of the event. Valid states are:
 * 'SUGGESTED', 'REJECTED', 'APPROVED',
 * 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED',
 * 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * @param {Array<Event>} editHistory - The edit history of the event.
 * @param {Array<User>} subscribers - The subscribers of the event.
 * */

export default class Event extends BaseModel {

    static modelName = 'Event';
    static schema = EventSchema;
    static cacheKey = 'events';
    static expirationTime = 5; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'clubs' },
        { path: 'tickets' },
        { path: 'subscribers' }
    ];

    /**
     * @description Create an event.
     * @param {String} title - The title of the event.
     * @param {String} description - The description of the event.
     * @param {String} location - The location of the event.
     * @param {String} host - The host of the event.
     * @param {Array<String>} clubs - The ids of the clubs of the event.
     * @param {Number} startDate - The start date of the event.
     * @param {Number} endDate - The end date of the event.
     * @param {Array<EventInformation>} information - The information of the event.
     * @param {Array<String>} tickets - The ids of the tickets of the event.
     * @param {String} state - The state of the event. Valid states are:
     * 'SUGGESTED', 'REJECTED', 'APPROVED',
     * 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED',
     * 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
     * @param {Array<Event>} editHistory - The edit history of the event.
     * @param {Array<String>} subscribers - The ids of the subscribers of the event.
     */
    constructor(
        title,
        description,
        location,
        host,
        clubs,
        startDate,
        endDate,
        information,
        tickets,
        state,
        editHistory,
        subscribers
    ) {
        super({
            title,
            description,
            location,
            host,
            clubs,
            startDate,
            endDate,
            information,
            tickets,
            state,
            editHistory,
            subscribers
        });
        this.id = null;
        this._title = title;
        this._description = description;
        this._location = location;
        this._host = host;
        this._clubs = clubs;
        this._startDate = startDate;
        this._endDate = endDate;
        this._information = information;
        this._tickets = tickets;
        this._state = state;
        this._editHistory = editHistory;
        this._subscribers = subscribers;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = value;
    }

    get host() {
        return this._host;
    }

    set host(value) {
        this._host = value;
    }

    get clubs() {
        return this._clubs;
    }

    set clubs(value) {
        this._clubs = value;
    }

    get startDate() {
        return this._startDate;
    }

    set startDate(value) {
        this._startDate = value;
    }

    get endDate() {
        return this._endDate;
    }

    set endDate(value) {
        this._endDate = value;
    }

    get information() {
        return this._information;
    }

    set information(value) {
        this._information = value;
    }

    get tickets() {
        return this._tickets;
    }

    set tickets(value) {
        this._tickets = value;
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

    get subscribers() {
        return this._subscribers;
    }

    set subscribers(value) {
        this._subscribers = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

    static getMapPaths() {
        return [
            { path: 'clubs', function: Club.castToUser },
            { path: 'tickets', function: EventTicket.castToEventTicket },
            { path: 'subscribers', function: User.castToUser },
            { path: 'information', function: EventInformation.castToEventInformation }
        ];
    }

    /**
     * Casts a plain object to an instance of the Event class.
     * @param {Object} event - The plain object to cast.
     * @returns {Event} The cast instance of the Event class.
     */
    static castToEvent(event) {
        const {
            _id,
            title,
            description,
            location,
            host,
            clubs,
            startDate,
            endDate,
            information,
            tickets,
            state,
            editHistory,
            subscribers
        } = event;
        const castEvent = new Event(
            title,
            description,
            location,
            host,
            clubs,
            startDate,
            endDate,
            information,
            tickets,
            state,
            editHistory,
            subscribers
        );
        event._id = _id.toString();
        return castEvent;
    }

    /**
     * Populates the given Event with related data from other collections.
     * @param {Object} event - The Event to populate.
     * @returns {Promise<Event>} The populated Event.
     * @throws {DatabaseError} If the Event could not be populated.
     */
    static async populateEvent(event) {
        try {
            event = await event
                .populate([
                    {
                        path: 'clubs',
                        populate: Club.getPopulationPaths()
                    },
                    {
                        path: 'tickets',
                        populate: EventTicket.getPopulationPaths()
                    },
                    {
                        path: 'subscribers',
                        populate: User.getPopulationPaths()
                    },
                ]);
            event._id = event._id.toString();

            let castEvent = this.castToEvent(event);
            castEvent.handleProperties();
            return castEvent;
        } catch (error) {
            throw new DatabaseError(`Failed to populate event with _id #${ event._id }' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateEvent method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Event>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateEvent(object);
    }

    /**
     * Converts the Event instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on an Event instance.
     * @returns {Object} An object representation of the Event instance without underscores in the property names.
     */
    toJSON() {
        const {
            _id,
            title,
            description,
            location,
            host,
            clubs,
            startDate,
            endDate,
            information,
            tickets,
            state,
            editHistory,
            subscribers
        } = this;
        return {
            _id,
            title,
            description,
            location,
            host,
            clubs,
            startDate,
            endDate,
            information,
            tickets,
            state,
            editHistory,
            subscribers
        };
    }

}