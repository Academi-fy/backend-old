/**
 * @file UserSchema.js - Class representing the user schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a users.
 * @param {String} firstName - The first name of the users.
 * @param {String} lastName - The last name of the users.
 * @param {String} avatar - The avatar of the users.
 * @param {String} type - The type of the users. Can be 'STUDENT', 'TEACHER', or 'ADMIN'.
 * @param {Array<ObjectId>} classes - The classes of the user.
 * @param {Array<ObjectId>} extraCourses - The extra courses of the user.
 * @param {Date} createdAt - The date the ticket was created.
 * @param {Date} updatedAt - The date the ticket was last updated.
 * @return {Schema} The schema for a users.
 */
export default new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: [ 'STUDENT', 'TEACHER', 'ADMIN' ]
        },
        classes: [
            {
                type: ObjectId,
                ref: 'Class'
            }
        ],
        extraCourses: [
            {
                type: ObjectId,
                ref: 'Course'
            }
        ],
        blackboards: [
            {
                type: ObjectId,
                ref: 'Blackboard'
            }
        ],
        clubs: [
            {
                type: ObjectId,
                ref: 'Club'
            }
        ],
        chats: [
            {
                type: ObjectId,
                ref: 'Chat'
            }
        ]

    },
    {
        timestamps: true
    }
);