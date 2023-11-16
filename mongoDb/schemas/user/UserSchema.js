import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const UserSchema = new Schema(
    {

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

/**
 * Exporting the User model
 * @name User
 * @type {mongoose.Model}
 */
export default mongoose.model("User", UserSchema);