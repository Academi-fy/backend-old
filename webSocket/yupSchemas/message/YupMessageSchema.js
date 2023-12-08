/**
 * @file YupMessageSchema.js - Yup schema for validating messages objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";

//TODO add the other schemas

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
    id: yup.string().required()
}