import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

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