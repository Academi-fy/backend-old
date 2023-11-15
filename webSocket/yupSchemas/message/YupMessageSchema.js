import yup from "yup";

import YupContentTypeSchema from "./YupContentTypeSchema.js";
import YupMessageReaction from "./YupMessageReaction.js";
import YupEditedMessage from "./YupEditedMessage.js";

/**
 * @typedef {Object} Message
 * @property {string} id - The unique identifier of the message. It is required.
 * @property {string} chat - The unique identifier of the chat where the message was sent. It is required.
 * @property {string} author - The unique identifier of the author of the message. It is required.
 * @property {Array.<YupContentTypeSchema>} content - The content of the message. It is an array of YupContentTypeSchema and is required.
 * @property {Array.<YupMessageReaction>} reactions - The reactions to the message. It is an array of YupMessageReaction and is required.
 * @property {Array.<YupEditedMessage>} edits - The edits made to the message. It is an array of YupEditedMessage and is required.
 */
export default {
    id: yup.string().required(),
    chat: yup.string().required(),
    author: yup.string().required(),
    content: yup.array().of({
        YupContentTypeSchema
    }).required(),
    reactions: yup.array().of({
        YupMessageReaction
    }).required(),
    edits: yup.array().of({
        YupEditedMessage
    }).required()
}