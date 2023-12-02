/**
 * @file MessageSchema.js - Class representing the message schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a message.
 * @param {ObjectId} chat - The chat of the message.
 * @param {ObjectId} author - The author of the message.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the message.
 * @param {Array<MessageReaction>} reactions - The reactions of the message.
 * @param {Array<EditedMessage>} edits - The edits of the message.
 * @param {Date} createdAt - The date the message was created.
 * @param {Date} updatedAt - The date the message was last updated.
 * @return {Schema} The schema for a message.
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
        }
    },
    {
        timestamps: true
    }
);