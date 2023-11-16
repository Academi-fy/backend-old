import mongoose from 'mongoose';

const { Schema, Types: { ObjectId } } = mongoose;

/**
 * @description The schema for a chat.
 * @param {String} type - The type of the chat.
 * @param {Array<ObjectId>} targets - The targets of the chat.
 * @param {Array<ObjectId>} courses - The courses of the chat.
 * @param {Array<ObjectId>} clubs - The clubs of the chat.
 * @param {String} name - The name of the chat.
 * @param {String} avatar - The avatar of the chat.
 * @param {Date} createdAt - The date the ticket was created.
 * @param {Date} updatedAt - The date the ticket was last updated.
 * @return {Schema} The schema for a chat.
 */
const ChatSchema = new Schema(

    {

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

/**
 * Exporting the Chat model
 * @name Chat
 * @type {mongoose.Model}
 */
export default mongoose.model("Chat", ChatSchema);