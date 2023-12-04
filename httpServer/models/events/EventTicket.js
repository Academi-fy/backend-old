/**
 * @file EventTicket.js - Module for representing an event ticket.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import cache from "../../cache.js";
import EventTicketSchema from "../../../mongoDb/schemas/events/EventTicketSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import { validateNotEmpty, validateNumber, validateObject, verifyInCache } from "../propertyValidation.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

const expirationTime = 15 * 60 * 1000;

/**
 * @description The class for an event ticket.
 * @param {String} _id - The id of the event ticket.
 * @param {Event} event - The id of the event of the ticket.
 * @param {User} buyer - The id of the buyer of the ticket.
 * @param {Number} price - The price of the ticket.
 * @param {Number} saleDate - The date the ticket was sold.
 * */
export default class EventTicket {

    /**
     * @description The constructor for an event ticket.
     * @param {String} event - The id of the event of the ticket.
     * @param {String} buyer - The id of the buyer of the ticket.
     * @param {Number} price - The price of the ticket.
     * @param {Number} saleDate - The date the ticket was sold.
     */
    constructor(
        event,
        buyer,
        price,
        saleDate
    ) {
        this.event = event;
        this.buyer = buyer;
        this.price = price;
        this.saleDate = saleDate;
    }

    get _event() {
        return this.event;
    }

    set _event(value) {
        validateObject('Event ticket event', value)
        this.event = value;
    }

    get _buyer() {
        return this.buyer;
    }

    set _buyer(value) {
        validateObject('Event ticket buyer', value)
        this.buyer = value;
    }

    get _price() {
        return this.price;
    }

    set _price(value) {
        validateNumber('Event ticket price', value);
        this.price = value;
    }

    get _saleDate() {
        return this.saleDate;
    }

    set _saleDate(value) {
        validateNumber('Event ticket sale date', value);
        this.saleDate = value;
    }

    /**
     * @description Create an event ticket.
     * @returns {Promise<Array<EventTicket>>} - The updated event tickets.
     */
    static async updateEventTicketCache() {

        cache.del('eventTickets');
        const eventTicketsFromDb = await getAllDocuments(EventTicketSchema);

        let eventTickets = [];
        for (const eventTicket in eventTicketsFromDb) {
            eventTickets.push(
                await this.populateEvent(eventTicket)
            );
        }

        cache.put('eventTickets', eventTickets, expirationTime);
        return eventTickets;
    }

    /**
     * @description Get all the event tickets.
     * @returns {Promise<Array<EventTicket>>} - The event tickets.
     */
    static async getAllEventTickets() {

        const cacheResults = cache.get('eventTickets');

        if (cacheResults) {
            return cacheResults;
        }
        else return await this.updateEventTicketCache();

    }

    /**
     * @description Get an event ticket by its id.
     * @param {String} eventTicketId - The id of the event ticket.
     * @returns {Promise<EventTicket>} - The event ticket.
     * @throws {RetrievalError} - When the event ticket could not be found.
     */
    static async getEventTicketById(eventTicketId) {

        const eventTickets = await this.getAllEventTickets();

        const eventTicket = eventTickets.find(eventTicket => eventTicket._id === eventTicketId);
        if (!eventTicket) throw new RetrievalError(`Failed to get event ticket:\n${ eventTicketId }`);

        return eventTicket;

    }

    /**
     * @description Get all event ticket that match a rule.
     * @param {Object} rule - The rule to find the event tickets by.
     * @returns {Promise<Array<EventTicket>>} - The matching event tickets.
     * @throws {RetrievalError} - When the event tickets could not be found.
     * */
    static async getAllEventTicketsByRule(rule) {

        const eventTickets = await this.getAllEventTickets();

        const matchingTickets = findByRule(eventTickets, rule);
        if (!matchingTickets) throw new RetrievalError(`Failed to get event tickets with rule:\n${ rule }`);

        return matchingTickets;

    }

    /**
     * @description Create an event ticket.
     * @param {EventTicket} eventTicket - The event ticket to create.
     * @returns {Promise<EventTicket>} - The created event ticket.
     * @throws {DatabaseError} - When the event ticket could not be created.
     * @throws {CacheError} - When the event ticket could not be put in the cache.
     */
    static async createEventTicket(eventTicket) {

        const eventTickets = await this.getAllEventTickets();

        const insertedEventTicket = await createDocument(EventTicketSchema, eventTicket);
        if (!insertedEventTicket) throw new DatabaseError(`Failed to create event ticket:\n${ eventTicket }`);

        eventTickets.push(
            await this.populateEvent(insertedEventTicket)
        );
        cache.put('eventTickets', eventTickets, expirationTime);

        if (!this.verifyTicketInCache(insertedEventTicket))

            if (!await verifyInCache(cache.get('eventTickets'), insertedEventTicket, this.updateEventTicketCache))
                throw new CacheError(`Failed to put event ticket in cache:\n${ insertedEventTicket }`);

        return insertedEventTicket;
    }

    /**
     * @description Update an event ticket.
     * @param {EventTicket} eventTicket - The event ticket to update.
     * @returns {Promise<EventTicket>} - The updated event ticket.
     * @throws {DatabaseError} - When the event ticket could not be updated.
     * @throws {CacheError} - When the event ticket could not be put in the cache.
     */
    static async updateEventTicket(eventTicket) {

        const eventTickets = await this.getAllEventTickets();

        let updatedEventTicket = await updateDocument(EventTicketSchema, eventTicket._id, eventTicket);
        if (!updatedEventTicket) throw new DatabaseError(`Failed to update event ticket:\n${ eventTicket }`);

        updatedEventTicket = await this.populateEvent(updatedEventTicket);

        eventTickets.splice(eventTickets.indexOf(eventTicket), 1, updatedEventTicket);
        cache.put('eventTickets', eventTickets, expirationTime);

        if (!this.verifyTicketInCache(updatedEventTicket))

            if (!await verifyInCache(cache.get('eventTickets'), updatedEventTicket, this.updateEventTicketCache))
                throw new CacheError(`Failed to put event ticket in cache:\n${ updatedEventTicket }`);

        return updatedEventTicket;
    }

    /**
     * @description Delete an event ticket.
     * @param {String} eventTicketId - The id of the event ticket to delete.
     * @returns {Promise<Boolean>} - Whether the event ticket was deleted.
     * @throws {DatabaseError} - When the event ticket could not be deleted.
     * @throws {CacheError} - When the event ticket could not be deleted from the cache.
     */
    static async deleteEventTicket(eventTicketId) {

        const deletedEventTicket = await deleteDocument(EventTicketSchema, eventTicketId);
        if (!deletedEventTicket) throw new DatabaseError(`Failed to delete event ticket:\n${ eventTicketId }`);

        const eventTickets = await this.getAllEventTickets();
        eventTickets.splice(eventTickets.indexOf(deletedEventTicket), 1);
        cache.put('eventTickets', eventTickets, expirationTime);

        if (this.verifyTicketInCache(deletedEventTicket))
            throw new CacheError(`Failed to delete event ticket in cache:\n${ deletedEventTicket }`);

        return true;
    }

    /**
     * @description Verify if a ticket is in the cache.
     * @param {EventTicket} testTicket - The ticket to test.
     * @returns {Boolean} - Whether the ticket is in the cache.
     */
    static async verifyTicketInCache(testTicket) {

        const cacheResult = await cache.get('eventTickets').find(ticket => ticket._id === testTicket._id);
        return Boolean(cacheResult);

    }

    /**
     * @description Populates the event ticket.
     * @param {Object} eventTicket - The event ticket to populate.
     * @returns {Promise<EventTicket>} - The populated event ticket.
     */
    static async populateEvent(eventTicket) {

        try {

            eventTicket = await eventTicket
                                    .populate([
                                        {
                                            path: 'event',
                                            populate: [
                                                { path: 'clubs' },
                                                { path: 'tickets' }
                                            ]
                                        },
                                        {
                                            path: 'buyer',
                                            populate: [
                                                { path: 'classes' },
                                                { path: 'extra_courses' }
                                            ]
                                        }
                                    ]);

        } catch (error) {
            throw new DatabaseError(`Failed to populate event ticket:\n${ eventTicket }\n${ error }`);
        }

    }

}