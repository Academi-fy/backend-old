import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const EventSchema = new Schema(

    {
        id: {
            type: ObjectId,
            required: true,
            unique: true
        },
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

export default mongoose.model("EventTicket", EventSchema);