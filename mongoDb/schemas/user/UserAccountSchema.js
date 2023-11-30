/**
 * @file UserAccountSchema.js - Class representing the user account schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * @description The schema for a users account.
 * @param {String} username - The username of the users.
 * @param {String} password - The password of the users.
 * @param {Array<String>} settings - The settings of the users.
 * @param {String} settings.name - The name of the setting.
 * @param {String} settings.value - The value of the setting.
 * @param {Date} createdAt - The date the ticket was created.
 * @param {Date} updatedAt - The date the ticket was last updated.
 * @return {Schema} The schema for a users account.
 */
export default new Schema(
    {

        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        settings: [
            {
                name: {
                    type: String,
                    required: true
                },
                value: {
                    type: String,
                    required: true
                }
            }
        ]

    }
);
