import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const MessageSchema = new Schema({

    id: {
        type: String,
        required: true,
        unique: true
    },
    chat: {
        type: ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: ObjectId,
        ref: 'User'
    },
    content: {
        type: Array,
        required: true,
        default: ""
    },
    reactions: {
        type: Object,
        default: []
    },
    edited: {
        isEdited: {
            type: Boolean,
            default: false
        },
        history: {
            type: Array,
            default: []
        }
    }
});

export default mongoose.model("Message", MessageSchema);