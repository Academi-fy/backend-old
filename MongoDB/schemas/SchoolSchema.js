import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const SchoolSchema = new Schema({

    id: {
        type: ObjectId,
        required: true,
        unique: true
    },
    grades: [
        {
            type: ObjectId,
            ref: 'Grade'
        }
    ],
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
    classes: [
        {
            type: ObjectId,
            ref: 'Class'
        }
    ],
    messages: [
        {
            type: ObjectId,
            ref: 'Message'
        }
    ],
    subjects: [
        {
            type: ObjectId,
            ref: 'Subject'
        }
    ],
    clubs: [
        {
            type: ObjectId,
            ref: 'Club'
        }
    ],
    events: [
        {
            type: ObjectId,
            ref: 'Event'
        }
    ],
    blackboards: [
        {
            type: ObjectId,
            ref: 'Blackboard'
        }
    ],
});

export default mongoose.model("School", SchoolSchema);