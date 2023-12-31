/**
 * @file ClubSchema.js - Class representing the club schema for MongoDB.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a club.
 * @param {String} name - The name of the club.
 * @param {Object} details - The details of the club.
 * @param {String} details.description - The description of the club.
 * @param {String} details.location - The location of the club.
 * @param {String} details.meetingTime - The meeting time of the club.
 * @param {String} details.meetingDay - The meeting day of the club.
 * @param {Array<ClubRequirement>} details.requirements - The requirements of the club.
 * @param {String} details.requirements.emoji - The emoji of the requirement.
 * @param {String} details.requirements.description - The description of the requirement.
 * @param {Array<ObjectId>} details.events - The events of the club.
 * @param {Array<ObjectId>} leaders - The leaders of the club.
 * @param {Array<ObjectId>} members - The members of the club.
 * @param {ObjectId} chat - The chat of the club.
 * @param {String} state - The state of the club. Valid states are:
 * 'SUGGESTED', 'REJECTED', 'APPROVED',
 * 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED',
 * 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * @param {Date} createdAt - The date the club was created.
 * @param {Date} updatedAt - The date the club was last updated.
 * @return {Schema} The schema for a club.
 */

export default new Schema(
    {
        name: {
            type: String,
            required: true,
            default: 'Neue AG'
        },
        details: {

            description: {
                type: String,
                required: true,
                default: 'AG Beschreibung'
            },
            location: {
                type: String,
                required: true,
                default: 'AG Ort'
            },
            meetingTime: {
                type: String,
                required: true,
                default: '13:00'
            },
            meetingDay: {
                type: String,
                required: true,
                default: 'Montag'
            },
            requirements: [
                {
                    emoji: {
                        type: String
                    },
                    description: {
                        type: String
                    }
                }
            ],
            tags: [
                {
                    emoji: {
                        type: String
                    },
                    description: {
                        type: String
                    }
                }
            ]

        },
        leaders: [
            {
                type: ObjectId,
                ref: 'User'
            }
        ],
        members: [
            {
                type: ObjectId,
                ref: 'User'
            }
        ],
        chat: {
            type: ObjectId,
            ref: 'Chat'
        },
        events: [
            {
                type: ObjectId,
                ref: 'Event'
            }
        ],
        state: {
            type: String,
            required: true,
            default: 'SUGGESTED'
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