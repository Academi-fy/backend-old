import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a school.
 * @param {Array<ObjectId>} grades - The grades of the school.
 * @param {Array<ObjectId>} courses - The courses of the school.
 * @param {Array<ObjectId>} members - The members of the school.
 * @param {Array<ObjectId>} classes - The classes of the school.
 * @param {Array<ObjectId>} messages - The messages of the school.
 * @param {Array<ObjectId>} subjects - The subjects of the school.
 * @param {Array<ObjectId>} clubs - The clubs of the school.
 * @param {Array<ObjectId>} events - The events of the school.
 * @param {Array<ObjectId>} blackboards - The blackboards of the school.
 * @param {Date} createdAt - The date the school was created.
 * @param {Date} updatedAt - The date the school was last updated.
 * @return {Schema} The schema for a school.
 */
const SchoolSchema = new Schema(

    {

        grades: [
            {
                type: ObjectId,
                ref: 'Grade'
            }
        ],
        courses: [
            {
                type: ObjectId,
                ref: 'Course'
            }
        ],
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
        messages: [
            {
                type: ObjectId,
                ref: 'Message'
            }
        ],
        subjects: [
            {
                type: ObjectId,
                ref: 'Subject'
            }
        ],
        clubs: [
            {
                type: ObjectId,
                ref: 'Club'
            }
        ],
        events: [
            {
                type: ObjectId,
                ref: 'Event'
            }
        ],
        blackboards: [
            {
                type: ObjectId,
                ref: 'Blackboard'
            }
        ],
    },
    {
        timestamps: true
    }

);

/**
 * Exporting the School model
 * @name School
 * @type {mongoose.Model}
 */
export default mongoose.model("School", SchoolSchema);