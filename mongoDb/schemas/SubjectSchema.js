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
const SubjectSchema = new Schema(
    {

        type: {
            type: String,
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

/**
 * Exporting the Subject model
 * @name Subject
 * @type {mongoose.Model}
 */
export default mongoose.model("Subject", SubjectSchema);