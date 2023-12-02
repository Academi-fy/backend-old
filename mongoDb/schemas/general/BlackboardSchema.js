/**
 * @file BlackboardSchema.js - Class representing the blackboard schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a blackboard.
 * @param {String} title - The title of the blackboard.
 * @param {ObjectId} author - The author of the blackboard.
 * @param {String} coverImage - The cover image of the blackboard.
 * @param {String} text - The text of the blackboard.
 * @param {Array<String>} tags - The tags of the blackboard.
 * @param {Number} expirationDate - The date when the blackboard expires.
 * @param {String} state - The state of the blackboard. Valid states are: 'SUGGESTED', 'REJECTED', 'APPROVED', 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED', 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * @param {Date} createdAt - The date the ticket was created.
 * @param {Date} updatedAt - The date the ticket was last updated.
 * @return {Schema} The schema for a blackboard.
 */
export default new Schema(
    {

        title: {
            type: String,
            required: true
        },
        author: {
            type: ObjectId,
            ref: 'User'
        },
        coverImage: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        tags: [
            {
                type: String,
                required: false
            }
        ],
        expirationDate: {
            type: Number,
            required: false
        },
        state: {
            type: String,
            required: true,
            default: "SUGGESTED"
        },
        editHistory: [
            {
                type: Object,
                required: false
            }
        ]

    },
    {
        timestamps: true
    }
);