/**
 * @file SetupAccountSchema.js - Class representing the setup account schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a setup account.
 * @param {Number} id - The id of the setup account.
 * @param {String} schoolName - The name of the school of the setup account.
 * @param {School} school - The school of the setup account. Assigned once the school is created.
 * @param {Date} createdAt - The date the setup account was created.
 * @param {Date} updatedAt - The date the setup account was last updated.
 * @return {Schema} The schema for a setup account.
 */
export default new Schema(
    {

        schoolName: {
            type: String,
            required: true
        },
        school: [
            {
                type: ObjectId,
                ref: 'School'
            }
        ],
    },
    {
        timestamps: true
    }
);