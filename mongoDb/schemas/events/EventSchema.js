/**
 * @file EventSchema.js - Class representing the event schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for an event.
 * @param {String} title - The title of the event.
 * @param {String} description - The description of the event.
 * @param {String} location - The location of the event.
 * @param {String} host - The host of the event.
 * @param {Number} startDate - The start date of the event.
 * @param {Number} endDate - The end date of the event.
 * @param {Array<EventInformation>} information - The information of the event.
 * @param {String} information.title - The title of the information.
 * @param {Array<Object>} information.items - The items of the information.
 * @param {String} information.items.emoji - The emoji of the item.
 * @param {String} information.items.description - The description of the item.
 * @param {Object} tickets - The tickets of the event.
 * @param {Object} tickets.ticketDetails - The details of the ticket.
 * @param {Number} tickets.ticketDetails.price - The price of the ticket.
 * @param {String} tickets.ticketDetails.description - The description of the ticket.
 * @param {Number} tickets.ticketDetails.amount - The amount of the ticket.
 * @param {Array<ObjectId>} tickets.sold - The tickets that have been sold.
 * @param {String} state - The state of the event. Valid states are: 'SUGGESTED', 'REJECTED', 'APPROVED', 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED', 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * @param {Date} createdAt - The date the event was created.
 * @param {Date} updatedAt - The date the event was last updated.
 * @return {Schema} The schema for an event.
 */
export default new Schema(
    {

        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        host: {
            type: String,
            required: true
        },
        clubs: [
            {
                type: ObjectId,
                ref: 'Club'
            }
        ],
        startDate: {
            type: Number,
            required: true
        },
        endDate: {
            type: Number,
            required: true
        },
        information: [
            {
                title: {
                    type: String
                },
                items: [
                    {
                        emoji: {
                            type: String
                        },
                        description: {
                            type: String
                        }
                    }
                ],
                type: Array,
                required: false
            },

        ],
        tickets: {
            ticketDetails: {
                price: {
                    type: Number
                },
                description: {
                    type: String
                },
                amount: {
                    type: Number
                }
            },
            sold: [
                {
                    type: ObjectId,
                    ref: 'EventTicket'
                }
            ]
        },
        state: {
            type: String,
            required: true,
            default: "SUGGESTED"
        },
        editHistory: [
            {
                type: Object,
                required: false
            }
        ]
    },
    {
        timestamps: true,
    }
);