/**
 * @file EventTicket.js - Module for representing an event ticket.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import BaseModel from "../BaseModel.js";
import EventTicketSchema from "../../mongoDb/schemas/events/EventTicketSchema.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Event from "./Event.js";
import User from "../users/User.js";
/**
 * @description The class for an event ticket.
 * @param {String} _id - The _id of the event ticket.
 * @param {Event} event - The _id of the event of the ticket.
 * @param {User} buyer - The _id of the buyer of the ticket.
 * @param {Number} price - The price of the ticket.
 * @param {Number} saleDate - The date the ticket was sold.
 * */
export default class EventTicket extends BaseModel {

    static modelName = 'EventTicket';
    static schema = EventTicketSchema;
    static cacheKey = 'eventTickets';
    static expirationTime = 15; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'event' },
        { path: 'buyer' }
    ];

    static getCastPaths() {
        return [
            { path: 'event', function: User.castToUser },
            { path: 'buyer', function: EventTicket.castToEventTicket }
        ];
    }

    /**
     * @description The constructor for an event ticket.
     * @param {String} event - The _id of the event of the ticket.
     * @param {String} buyer - The _id of the buyer of the ticket.
     * @param {Number} price - The price of the ticket.
     * @param {Number} saleDate - The date the ticket was sold.
     */
    constructor(
        event,
        buyer,
        price,
        saleDate
    ) {
        super({
            event,
            buyer,
            price,
            saleDate
        });
        this.id = null;
        this._event = event;
        this._buyer = buyer;
        this._price = price;
        this._saleDate = saleDate;
    }

    /**
     * Casts a plain object to an instance of the EventTicket class.
     * @param {Object} eventTicket - The plain object to cast.
     * @returns {EventTicket} The cast instance of the EventTicket class.
     */
    static castToEventTicket(eventTicket) {
        const { _id, event, buyer, price, saleDate } = eventTicket;
        const castEventTicket = new EventTicket(
            event,
            buyer,
            price,
            saleDate
        );
        eventTicket._id = _id.toString();
        return castEventTicket;
    }

    /**
     * Converts the EventTicket instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on an EventTicket instance.
     * @returns {Object} An object representation of the EventTicket instance without underscores in the property names.
     */
    toJSON(){
        const { _id, event, buyer, price, saleDate } = this;
        return {
            _id,
            event,
            buyer,
            price,
            saleDate
        };
    }

    /**
     * Populates the given EventTicket with related data from other collections.
     * @param {Object} eventTicket - The EventTicket to populate.
     * @returns {Promise<EventTicket>} The populated EventTicket.
     * @throws {DatabaseError} If the EventTicket could not be populated.
     */
    static async populateEventTicket(eventTicket) {
        try {
            eventTicket = await eventTicket
                .populate([
                    {
                        path: 'event',
                        populate: Event.getPopulationPaths()
                    },
                    {
                        path: 'buyer',
                        populate: User.getPopulationPaths()
                    }
                ]);
            eventTicket._id = eventTicket._id.toString();

            let castEventTicket = this.castToEventTicket(eventTicket);
            castEventTicket.handleProperties();

            return castEventTicket;
        } catch (error) {
            throw new DatabaseError(`Failed to populate event ticket with _id #${eventTicket._id}' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateEvent method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<EventTicket>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateEventTicket(object);
    }

    get event() {
        return this._event;
    }

    set event(value) {
        this._event = value;
    }

    get buyer() {
        return this._buyer;
    }

    set buyer(value) {
        this._buyer = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get saleDate() {
        return this._saleDate;
    }

    set saleDate(value) {
        this._saleDate = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

}