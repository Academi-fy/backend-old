import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const MessageSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        chat: {
            type: ObjectId,
            ref: 'Chat'
        },
        author: {
            type: ObjectId,
            ref: 'User'
        },
        content: {
            type: Array,
            required: true,
            default: ""
        },
        reactions: [
            {
                emoji: {
                    type: Object,
                    required: true
                },
                count: {
                    type: Number,
                    required: true,
                    default: 0
                },
            }
        ],
        edits: {
            type: Array,
            required: true,
            default: []
        }
    },
    {
        timestamps: true
    }
);

/**
 * Exporting the Message model
 * @name Message
 * @type {mongoose.Model}
 */
export default mongoose.model("Message", MessageSchema);