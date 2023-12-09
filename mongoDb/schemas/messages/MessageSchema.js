/**
 * @file MessageSchema.js - Class representing the messages schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a messages.
 * @param {ObjectId} chat - The chat of the messages.
 * @param {ObjectId} author - The author of the messages.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the messages.
 * @param {Array<MessageReaction>} reactions - The reactions of the messages.
 * @param {Array<Message>} edits - The edits of the messages.
 * @param {Date} createdAt - The date the messages was created.
 * @param {Date} updatedAt - The date the messages was last updated.
 * @return {Schema} The schema for a messages.
 */
export default new Schema(
    {

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
        answer: {
            type: ObjectId,
            ref: 'Message'
        },
        editHistory: {
            type: Array,
            required: true,
            default: []
        },
        date: {
            type: Number,
            required: true,
            default: Date.now()
        }
    },
    {
        timestamps: true
    }
);