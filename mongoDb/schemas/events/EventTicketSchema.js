import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const EventTicketSchema = new Schema(

    {
        id: {
            type: ObjectId,
            required: true,
            unique: true
        },
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

export default mongoose.model("EventTicket", EventTicketSchema);