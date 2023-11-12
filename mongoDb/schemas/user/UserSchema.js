import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const UserSchema = new Schema(

    {
        id: {
            type: ObjectId,
            required: true,
            unique: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        classes: [
            {
                type: ObjectId,
                ref: 'Class'
            }
        ],
        extra_courses: [
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

export default mongoose.model("User", UserSchema);