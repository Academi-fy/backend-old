/**
 * @file UserSchema.js - Class representing the user schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a users.
 * @param {String} first_name - The first name of the users.
 * @param {String} last_name - The last name of the users.
 * @param {String} avatar - The avatar of the users.
 * @param {String} type - The type of the users. Can be 'STUDENT', 'TEACHER', or 'ADMIN'.
 * @param {Array<ObjectId>} classes - The classes of the users.
 * @param {Date} createdAt - The date the ticket was created.
 * @param {Date} updatedAt - The date the ticket was last updated.
 * @return {Schema} The schema for a users.
 */
const UserSchema = new Schema(
    {

        id: {
            type: String,
            unique: true,
            required: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
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
        extra_courses: [
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

/**
 * Exporting the User model
 * @name User
 * @type {mongoose.Model}
 */
export default mongoose.model("User", UserSchema);