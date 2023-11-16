import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

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