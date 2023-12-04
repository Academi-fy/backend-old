/**
 * @file SubjectSchema.js - Class representing the subject schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a subject.
 * @param {String} type - The type of the subject.
 * @param {Array<ObjectId>} courses - The courses of the subject.
 * @param {Date} createdAt - The date the subject was created.
 * @param {Date} updatedAt - The date the subject was last updated.
 * @return {Schema} The schema for a subject.
 */
export default new Schema(
    {

        type: {
            type: String,
            unique: true,
            required: true
        },
        shortName: {
            type: String,
            unique: true,
            required: true
        },
        courses: [
            {
                type: ObjectId,
                ref: 'Course'
            }
        ]
    },
    {
        timestamps: true
    }
);