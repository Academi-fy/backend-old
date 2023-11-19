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
 * @param {Date} createdAt - The date the event was created.
 * @param {Date} updatedAt - The date the event was last updated.
 * @return {Schema} The schema for an event.
 */
const EventSchema = new Schema(
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
                    type: String,
                    required: true
                },
                items: [
                    {
                        emoji: {
                            type: String,
                            required: true
                        },
                        description: {
                            type: String,
                            required: true
                        }
                    }
                ]
            }
        ],
        tickets: {
            ticketDetails: {
                price: {
                    type: Number,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                amount: {
                    type: Number,
                    required: true
                },
            },
            sold: [
                {
                    type: ObjectId,
                    ref: 'EventTicket'
                }
            ]
        }
    },
    {
        timestamps: true,
    }
);

/**
 * Exporting the Event model
 * @name Event
 * @type {mongoose.Model}
 */
export default mongoose.model("Event", EventSchema);