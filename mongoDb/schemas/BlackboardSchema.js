import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const BlackboardSchema = new Schema(

    {
        id: {
            type: ObjectId,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        author: {
            type: ObjectId,
            ref: 'User'
        },
        coverImage: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }

);

export default mongoose.model("Blackboard", BlackboardSchema);