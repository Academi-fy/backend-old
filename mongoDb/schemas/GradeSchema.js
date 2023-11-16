import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a grade.
 * @param {Number} level - The level of the grade.
 * @param {Array<ObjectId>} classes - The classes of the grade.
 */
const GradeSchema = new Schema(

    {

        level: {
            type: Number,
            required: true
        },
        classes: [
            {
                type: ObjectId,
                ref: 'Class'
            }
        ]
    },
    {
        timestamps: true
    }

);

/**
 * Exporting the Grade model
 * @name Grade
 * @type {mongoose.Model}
 */
export default mongoose.model("Grade", GradeSchema);