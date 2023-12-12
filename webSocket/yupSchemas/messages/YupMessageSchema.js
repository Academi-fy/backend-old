/**
 * @file YupMessageSchema.js - Yup schema for validating messages objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";
import YupMessageContentSchema from "./YupMessageContentSchema.js";
import YupMessageReactionSchema from "./YupMessageReactionSchema.js";

/**
 * @typedef {Object} YupMessageReactionSchema
 * @param {String} id - The id of the messages
 * @param {String} chat - The id of the chat that the messages belongs to.
 * @param {String} author - The id of the author of the messages.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the messages.
 * @param {Array<MessageReaction>} reactions - The reactions to the messages.
 * @param {String | null} answer - The id of the messages that this messages is an answer to.
 * @param {Array<Message>} editHistory - The editHistory made to the messages.
 * @param {Number} date - The date the messages was created.
 */
export default {
    chat: yup.string().required(),
    author: yup.string().required(),
    content: yup.array().of(
        YupMessageContentSchema
    ).required(),
    reactions: yup.array().of(
        YupMessageReactionSchema
    ).required(),
    answer: yup.object().nullable(),
    editHistory: yup.array().of(
        yup.object()
    ).required(),
    date: yup.number().required()
}
