import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const ClubSchema = new Schema({

    id: {
        type: ObjectId,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        description: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        meetingTime: {
            type: String,
            required: true
        },
        meetingDay: {
            type: String,
            required: true
        },
        requirements: [
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
        ],
        events: [
            {
                type: ObjectId,
                ref: 'Event'
            }
        ]
    },
    leaders: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    members: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    chat: {
        type: ObjectId,
        ref: 'Chat'
    },

});

export default mongoose.model("Club", ClubSchema);