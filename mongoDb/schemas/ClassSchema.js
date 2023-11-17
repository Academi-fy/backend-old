import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a class.
 * @param {ObjectId} grade - The grade of the class.
 * @param {Array<ObjectId>} courses - The courses of the class.
 * @param {Array<ObjectId>} members - The members of the class.
 * @param {String} specified_grade - The specified grade of the class.
 * @param {Date} createdAt - The date the class was created.
 * @param {Date} updatedAt - The date the class was last updated.
 * @return {Schema} The schema for a class.
 */
const ClassSchema = new Schema(
    {

        grade: {
            type: ObjectId,
            ref: 'Grade'
        },
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
        specified_grade: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
);

/**
 * Exporting the Class model
 * @name Class
 * @type {mongoose.Model}
 */
export default mongoose.model("Class", ClassSchema);