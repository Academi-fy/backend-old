import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

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