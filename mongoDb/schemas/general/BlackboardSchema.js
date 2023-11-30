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
        }

    },
    {
        timestamps: true
    }
);