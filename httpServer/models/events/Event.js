/**
 * @file Event.js - Module for representing an event.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import cache from "../../cache.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import EventSchema from "../../../mongoDb/schemas/events/EventSchema.js";
import { validateArray, validateNotEmpty, validateNumber, verifyInCache } from "../propertyValidation.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

const expirationTime = 5 * 60 * 1000;

/**
 * @description Class representing an Event.
 * @param {String} id - The ID of the event.
 * @param {String} title - The title of the event.
 * @param {String} description - The description of the event.
 * @param {String} location - The location of the event.
 * @param {String} host - The host of the event.
 * @param {Array<Club>} clubs - The clubs of the event.
 * @param {Number} startDate - The start date of the event.
 * @param {Number} endDate - The end date of the event.
 * @param {Array<EventInformation>} information - The information of the event.
 * @param {Array<EventTicket>} tickets - The tickets of the event.
 * */
export default class Event {

    /**
     * @description Create an event.
     * @param {String} id - The ID of the event.
     * @param {String} title - The title of the event.
     * @param {String} description - The description of the event.
     * @param {String} location - The location of the event.
     * @param {String} host - The host of the event.
     * @param {Array<String>} clubs - The clubs of the event.
     * @param {Number} startDate - The start date of the event.
     * @param {Number} endDate - The end date of the event.
     * @param {Array<EventInformation>} information - The information of the event.
     * @param {Array<EventTicket>} tickets - The tickets of the event.
     */
    constructor(
        id,
        title,
        description,
        location,
        host,
        clubs,
        startDate,
        endDate,
        information,
        tickets
    ) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.host = host;
        this.clubs = clubs;
        this.startDate = startDate;
        this.endDate = endDate;
        this.information = information;
        this.tickets = tickets;

        validateNotEmpty('Event id', id);
        validateNotEmpty('Event title', title);
        validateNotEmpty('Event description', description);
        validateNotEmpty('Event location', location);
        validateNotEmpty('Event host', host);
        validateArray('Event clubs', clubs);
        validateNumber('Event start date', startDate);
        validateNumber('Event end date', endDate);
        validateArray('Event information', information);
        validateArray('Event tickets', tickets);
    }

    get _title() {
        return this.title;
    }

    set _title(value) {
        validateNotEmpty('Event title', value)
        this.title = value;
    }

    get _description() {
        return this.description;
    }

    set _description(value) {
        validateNotEmpty('Event description', value)
        this.description = value;
    }

    get _location() {
        return this.location;
    }

    set _location(value) {
        validateNotEmpty('Event location', value)
        this.location = value;
    }

    get _host() {
        return this.host;
    }

    set _host(value) {
        validateNotEmpty('Event host', value)
        this.host = value;
    }

    get _clubs() {
        return this.clubs;
    }

    set _clubs(value) {
        validateArray('Event clubs', value);
        this.clubs = value;
    }

    get _startDate() {
        return this.startDate;
    }

    set _startDate(value) {
        validateNumber('Event start date', value);
        this.startDate = value;
    }

    get _endDate() {
        return this.endDate;
    }

    set _endDate(value) {
        validateNumber('Event end date', value);
        this.endDate = value;
    }

    get _information() {
        return this.information;
    }

    set _information(value) {
        validateArray('Event information', value);
        this.information = value;
    }

    get _tickets() {
        return this.tickets;
    }

    set _tickets(value) {
        validateArray('Event tickets', value);
        this.tickets = value;
    }

    /**
     * @description Get all events from the cache.
     * @returns {Promise<Array<Event>>} All events from the cache.
     */
    static async updateEventCache() {

        cache.del('events');
        const eventsFromDb = await getAllDocuments(EventSchema);

        const events = [];
        for(const event of eventsFromDb){
            events.push(
               event
            )
        }

        cache.put('events', events, expirationTime);
        return events;

    }

    /**
     * @description Get an event by its ID.
     * @param {String} eventId - The ID of the event.
     * @returns {Promise<Event>} The event.
     * @throws {RetrievalError} When the event could not be retrieved.
     */
    static async getEventById(eventId) {

        const events = await this.getAllEvents();

        const event = events.find(event => event._id === eventId);
        if(!event) throw new RetrievalError(`Failed to get event:\n${eventId}`);

        return event;

    }

    /**
     * @description Get all events that match the rule.
     * @param {Object} rule - The rule to find the events by.
     * @returns {Promise<Array<Event>>} The matching event.
     * @throws {RetrievalError} When the events could not be retrieved.
     * */
    static async getAllEventsByRule(rule) {

        const events = await this.getAllEvents();

        const event = findByRule(events, rule);
        if (!event) throw new RetrievalError(`Failed to get events with rule:\n${ rule }`);

        return event;

    }

    /**
     * @description Get all events.
     * @returns {Promise<Array<Event>>} The events.
     */
    static async getAllEvents() {

        const cacheResults = cache.get('events');

        if (cacheResults) {
            return cacheResults;
        }

        return await this.updateEventCache();
    }

    /**
     * @description Create an event.
     * @param {Event} event - The event to create.
     * @returns {Promise<Event>} The created event.
     * @throws {DatabaseError} When the event could not be created.
     * @throws {CacheError} When the event could not be created in the cache.
     */
    static async createEvent(event) {

        const events = await this.getAllEvents();

        const insertedEvent = await createDocument(EventSchema, event);
        if(!insertedEvent) throw new DatabaseError(`Failed to create event:\n${event}`);

        events.push(
            insertedEvent
        );
        cache.put(`events`, events, expirationTime);

        if(!this.verifyEventInCache(insertedEvent))

            if(!await verifyInCache(cache.get('events'), insertedEvent, this.updateEventCache))
                throw new CacheError(`Failed to create event in cache:\n${ insertedEvent }`);

        return insertedEvent;

    }

    /**
     * @description Update an event.
     * @param {String} eventId - The ID of the event to update.
     * @param {Event} updateEvent - The updated event.
     * @returns {Promise<Event>} The updated event.
     * @throws {DatabaseError} When the event could not be updated.
     * @throws {CacheError} When the event could not be updated in the cache.
     */
    static async updateEvent(eventId, updateEvent) {

        const events = await this.getAllEvents();

        const updatedEvent = await updateDocument(EventSchema, eventId, updateEvent);
        if (!updatedEvent) throw new DatabaseError(`Failed to update event:\n${ event }`);

        events.push(
            updatedEvent
        );
        cache.put(`events`, events, expirationTime);

        if(!this.verifyEventInCache(updatedEvent))

            if(!await verifyInCache(cache.get('events'), updatedEvent, this.updateEventCache))
                throw new CacheError(`Failed to update event in cache:\n${ updatedEvent }`);

        return updatedEvent;
    }

    /**
     * @description Delete an event.
     * @param {String} eventId - The ID of the event to delete.
     * @returns {Promise<Boolean>} The deleted event.
     * @throws {DatabaseError} When the event could not be deleted.
     * @throws {CacheError} When the event could not be deleted in the cache.
     */
    static async deleteEvent(eventId) {

        const deletedEvent = await deleteDocument(EventSchema, eventId);
        if(!deletedEvent) throw new DatabaseError(`Failed to delete event:\n${eventId}`);

        const events = await this.getAllEvents();
        events.splice(events.findIndex(event => event._id === eventId), 1);
        cache.put('events', events, expirationTime);

        if(this.verifyEventInCache(deletedEvent))
            throw new CacheError(`Failed to delete event from cache:\n${deletedEvent}`);

        return true;
    }

    /**
     * @description Verify if an event is in the cache.
     * @param {Event} event - The event to verify.
     * @returns {Boolean} True if the event is in the cache, false otherwise.
     */
    static async verifyEventInCache(event) {

        const cacheResults = cache.get('events').find(eventInCache => eventInCache._id === event._id);

        return Boolean(cacheResults);

    }
}