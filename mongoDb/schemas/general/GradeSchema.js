/**
 * @file GradeSchema.js - Class representing the grade schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a grade.
 * @param {Number} level - The level of the grade.
 * @param {Array<ObjectId>} classes - The classes of the grade.
 */
export default new Schema(
    {

        level: {
            type: Number,
            unique: true,
            required: true
        },
        classes: [
            {
                type: ObjectId,
                ref: 'Class'
            }
        ]
    },
    {
        timestamps: true
    }
);