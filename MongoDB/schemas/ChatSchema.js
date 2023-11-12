import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

const ChatSchema = new Schema(

    {
        id: {
            type: ObjectId,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true
        },
        targets: [
            {
                type: ObjectId,
                ref: 'User'
            }
        ],
        courses: [
            {
                type: ObjectId,
                ref: 'Course'
            }
        ],
        clubs: [
            {
                type: ObjectId,
                ref: 'Club'
            }
        ],
        name: {
            type: String,
            required: true,
            default: 'Neuer Chat'
        },
        avatar: {
            type: String,
            required: true,
            default: 'https://media.istockphoto.com/id/1147544807/de/vektor/miniaturbild-vektorgrafik.jpg?s=612x612&w=0&k=20&c=IIK_u_RTeRFyL6kB1EMzBufT4H7MYT3g04sz903fXAk='
        }

    },
    {
        timestamps: true
    }

);

export default mongoose.model("Chat", ChatSchema);