import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const GradeSchema = new Schema(

    {
        id: {
            type: ObjectId,
            required: true,
            unique: true
        },
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

export default mongoose.model("Grade", GradeSchema);