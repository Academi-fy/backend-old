import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

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