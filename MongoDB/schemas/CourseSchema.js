import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const CourseSchema = new Schema({

    id: {
        type: ObjectId,
        required: true,
        unique: true
    },
    members: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    classes: [
        {
            type: ObjectId,
            ref: 'Class'
        }
    ],
    teacher: {
        type: ObjectId,
        ref: 'User'
    },
    chat: {
        type: ObjectId,
        ref: 'Chat'
    },
    subject: {
        type: ObjectId,
        ref: 'Subject'
    }

});

export default mongoose.model("Course", CourseSchema);