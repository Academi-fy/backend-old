/**
 * @file CourseSchema.js - Class representing the course schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a course.
 * @param {Array<ObjectId>} members - The members of the course.
 * @param {Array<ObjectId>} classes - The classes of the course.
 * @param {ObjectId} teacher - The teacher of the course.
 * @param {ObjectId} chat - The chat of the course.
 * @param {ObjectId} subject - The subject of the course.
 */
const CourseSchema = new Schema(
    {

        members: [
            {
                type: ObjectId,
                ref: 'User'
            }
        ],
        classes: [
            {
                type: ObjectId,
                ref: 'Class'
            }
        ],
        teacher: {
            type: ObjectId,
            ref: 'User'
        },
        chat: {
            type: ObjectId,
            ref: 'Chat'
        },
        subject: {
            type: ObjectId,
            ref: 'Subject'
        }

    },
    {
        timestamps: true
    }
);

/**
 * Exporting the Course model
 * @name Course
 * @type {mongoose.Model}
 */
export default mongoose.model("Course", CourseSchema);