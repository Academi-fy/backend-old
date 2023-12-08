/**
 * @file YupMessageSchema.js - Yup schema for validating message objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";
import YupMessageContentSchema from "./YupMessageContentSchema.js";
import YupMessageReactionSchema from "./YupMessageReactionSchema.js";

/**
 * @typedef {Object} YupMessageReactionSchema
 * @param {String} id - The id of the message
 * @param {String} chat - The id of the chat that the message belongs to.
 * @param {String} author - The id of the author of the message.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the message.
 * @param {Array<MessageReaction>} reactions - The reactions to the message.
 * @param {String | null} answer - The id of the message that this message is an answer to.
 * @param {Array<Message>} editHistory - The editHistory made to the message.
 * @param {Number} date - The date the message was created.
 */
export default yup.object().shape({
    id: yup.string().required(),
    chat: yup.string().required(),
    author: yup.string().required(),
    content: yup.array().of(
        YupMessageContentSchema
    ).required(),
    reactions: yup.array().of(
        YupMessageReactionSchema
    ).required(),
    answer: yup.string().nullable(),
    editHistory: yup.array().of(
        yup.object()
    ).required(),
    date: yup.number().required()
})
