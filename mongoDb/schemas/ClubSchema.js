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
 * @param {Array<Requirement>} details.requirements - The requirements of the club.
 * @param {String} details.requirements.emoji - The emoji of the requirement.
 * @param {String} details.requirements.description - The description of the requirement.
 * @param {Array<ObjectId>} details.events - The events of the club.
 * @param {Array<ObjectId>} leaders - The leaders of the club.
 * @param {Array<ObjectId>} members - The members of the club.
 * @param {ObjectId} chat - The chat of the club.
 * @param {Date} createdAt - The date the club was created.
 * @param {Date} updatedAt - The date the club was last updated.
 * @return {Schema} The schema for a club.
 */

const ClubSchema = new Schema(

    {

        name: {
            type: String,
            required: true
        },
        details: {

            description: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            meetingTime: {
                type: String,
                required: true
            },
            meetingDay: {
                type: String,
                required: true
            },
            requirements: [
                {
                    emoji: {
                        type: String,
                        required: true
                    },
                    description: {
                        type: String,
                        required: true
                    }
                }
            ],
            events: [
                {
                    type: ObjectId,
                    ref: 'Event'
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
        }

    },
    {
        timestamps: true
    }

);

/**
 * Exporting the Club model
 * @name Club
 * @type {mongoose.Model}
 */
export default mongoose.model("Club", ClubSchema);