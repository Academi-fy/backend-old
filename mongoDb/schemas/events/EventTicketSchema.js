import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for an event ticket.
 * @param {ObjectId} event - The event of the ticket.
 * @param {ObjectId} buyer - The buyer of the ticket.
 * @param {Number} price - The price of the ticket.
 * @param {Number} saleDate - The date the ticket was sold.
 * @param {Date} createdAt - The date the ticket was created.
 * @param {Date} updatedAt - The date the ticket was last updated.
 * @return {Schema} The schema for an event ticket.
 */
const EventTicketSchema = new Schema(

    {

        event: {
            type: ObjectId,
            ref: 'Event'
        },
        buyer: {
            type: ObjectId,
            ref: 'User'
        },
        price: {
            type: Number,
            required: true
        },
        saleDate: {
            type: Number,
            required: true
        }

    },
    {
        timestamps: true
    }

);

/**
 * Exporting the EventTicket model
 * @name EventTicket
 * @type {mongoose.Model}
 */
export default mongoose.model("EventTicket", EventTicketSchema);