import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const ClassSchema = new Schema(
    {
        id: {
            type: ObjectId,
            required: true,
            unique: true
        },
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