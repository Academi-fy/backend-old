import cache from "../../cache.js";
import EventTicketSchema from "../../../mongoDb/schemas/events/EventTicketSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import { validateNotEmpty, validateNumber, validateObject, verifyInCache } from "../propertyValidation.js";
import { findByRule } from "../findByRule.js";

const expirationTime = 15 * 60 * 1000;

/**
 * @description The class for an event ticket.
 * @param {String} id - The id of the event ticket.
 * @param {Event} event - The id of the event of the ticket.
 * @param {User} buyer - The id of the buyer of the ticket.
 * @param {Number} price - The price of the ticket.
 * @param {Number} saleDate - The date the ticket was sold.
 * */
export default class EventTicket {

    /**
     * @description The constructor for an event ticket.
     * @param {String} id - The id of the event ticket.
     * @param {String} event - The id of the event of the ticket.
     * @param {String} buyer - The id of the buyer of the ticket.
     * @param {Number} price - The price of the ticket.
     * @param {Number} saleDate - The date the ticket was sold.
     */
    constructor(
        id,
        event,
        buyer,
        price,
        saleDate
    ) {
        this.id = id;
        this.event = event;
        this.buyer = buyer;
        this.price = price;
        this.saleDate = saleDate;

        validateNotEmpty('Event ticket id', id);
        validateObject('Event ticket event', event);
        validateObject('Event ticket buyer', buyer);
        validateNumber('Event ticket price', price);
        validateNumber('Event ticket sale date', saleDate);
    }

    get _id() {
        return this.id;
    }

    set _id(id) {
        validateNotEmpty('id', id)
        this.id = id;
    }

    get _event() {
        return this.event;
    }

    set _event(event) {
        validateObject('Event ticket event', event)
        this.event = event;
    }

    get _buyer() {
        return this.buyer;
    }

    set _buyer(buyer) {
        validateObject('Event ticket buyer', buyer)
        this.buyer = buyer;
    }

    get _price() {
        return this.price;
    }

    set _price(price) {
        validateNumber('Event ticket price', price);
        this.price = price;
    }

    get _saleDate() {
        return this.saleDate;
    }

    set _saleDate(saleDate) {
        validateNumber('Event ticket sale date', saleDate);
        this.saleDate = saleDate;
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
                this.populateEvent(eventTicket)
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
     */
    static async getEventTicketById(eventTicketId) {

        const eventTickets = await this.getAllEventTickets();

        const eventTicket = eventTickets.find(eventTicket => eventTicket._id === eventTicketId);
        if (!eventTicket) throw new Error(`Failed to get event ticket:\n${ eventTicketId }`);

        return eventTicket;

    }

    /**
     * @description Get all event ticket that match a rule.
     * @param {Object} rule - The rule to find the event tickets by.
     * @returns {Promise<Array<EventTicket>>} - The matching event tickets.
     * */
    static async getAllEventTicketsByRule(rule) {

        const eventTickets = await this.getAllEventTickets();

        const matchingTickets = findByRule(eventTickets, rule);
        if (!matchingTickets) throw new Error(`Failed to get event tickets with rule:\n${ rule }`);

        return matchingTickets;

    }

    /**
     * @description Create an event ticket.
     * @param {EventTicket} eventTicket - The event ticket to create.
     * @returns {Promise<EventTicket>} - The created event ticket.
     */
    static async createEventTicket(eventTicket) {

        const eventTickets = await this.getAllEventTickets();

        const insertedEventTicket = await createDocument(EventTicketSchema, eventTicket);
        if(!insertedEventTicket) throw new Error(`Failed to create event ticket:\n${ eventTicket }`);

        eventTickets.push(
            this.populateEvent(insertedEventTicket)
        );
        cache.put('eventTickets', eventTickets, expirationTime);

        if(!this.verifyTicketInCache(insertedEventTicket))

            if(!await verifyInCache(cache.get('eventTickets'), insertedEventTicket, this.updateEventTicketCache))
                throw new Error(`Failed to put event ticket in cache:\n${ insertedEventTicket }`);

        return insertedEventTicket;
    }

    /**
     * @description Update an event ticket.
     * @param {EventTicket} eventTicket - The event ticket to update.
     * @returns {Promise<EventTicket>} - The updated event ticket.
     */
    static async updateEventTicket(eventTicket) {

        const eventTickets = await this.getAllEventTickets();

        let updatedEventTicket = await updateDocument(EventTicketSchema, eventTicket._id, eventTicket);
        if(!updatedEventTicket) throw new Error(`Failed to update event ticket:\n${ eventTicket }`);

        updatedEventTicket = this.populateEvent(updatedEventTicket);

        eventTickets.splice(eventTickets.indexOf(eventTicket), 1, updatedEventTicket);
        cache.put('eventTickets', eventTickets, expirationTime);

        if(!this.verifyTicketInCache(updatedEventTicket))

            if(!await verifyInCache(cache.get('eventTickets'), updatedEventTicket, this.updateEventTicketCache))
                throw new Error(`Failed to put event ticket in cache:\n${ updatedEventTicket }`);

        return updatedEventTicket;
    }

    /**
     * @description Delete an event ticket.
     * @param {String} eventTicketId - The id of the event ticket to delete.
     * @returns {Promise<Boolean>} - Whether the event ticket was deleted.
     */
    static async deleteEventTicket(eventTicketId) {

        const deletedEventTicket = await deleteDocument(EventTicketSchema, eventTicketId);
        if(!deletedEventTicket) throw new Error(`Failed to delete event ticket:\n${ eventTicketId }`);

        const eventTickets = await this.getAllEventTickets();
        eventTickets.splice(eventTickets.indexOf(deletedEventTicket), 1);
        cache.put('eventTickets', eventTickets, expirationTime);

        if(this.verifyTicketInCache(deletedEventTicket))
                throw new Error(`Failed to delete event ticket in cache:\n${ deletedEventTicket }`);

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
     * @returns {EventTicket} - The populated event ticket.
     */
    static populateEvent(eventTicket) {
        return eventTicket
            .populate('event')
            .populate('buyer');
    }

}