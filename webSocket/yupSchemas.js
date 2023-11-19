import yup from "yup";
import YupMessageSchema from "./yupSchemas/message/YupMessageSchema.js";

/**
 * @typedef {Object} WebSocketEvents
 * @property {Object} MESSAGE_SEND - The 'MESSAGE_SEND' event. It requires a 'sender' (string) and 'data' (YupMessageSchema).
 * @property {Object} MESSAGE_EDIT - The 'MESSAGE_EDIT' event. It requires a 'sender' (string) and 'data' (object with 'oldMessageId' and 'newMessage' properties).
 * @property {Object} MESSAGE_DELETE - The 'MESSAGE_DELETE' event. It requires a 'sender' (string) and 'data' (object with 'messageId' property).
 * @property {Object} MESSAGE_REACTION_ADD - The 'MESSAGE_REACTION_ADD' event. It requires a 'sender' (string) and 'data' (object with 'messageId' and 'emoji' properties).
 * @property {Object} MESSAGE_REACTION_REMOVE - The 'MESSAGE_REACTION_REMOVE' event. It requires a 'sender' (string) and 'data' (object with 'messageId' and 'emoji' properties).
 * @property {Object} TYPING - The 'TYPING' event. It requires a 'sender' (string) and 'data' (object with 'isTyping' property).
 * @property {Object} POLL_VOTE - The 'POLL_VOTE' event. It requires a 'sender' (string) and 'data' (object with 'messageId' and 'answerId' properties).
 * @property {Object} ERROR - The 'ERROR' event. It requires a 'sender' (string) and 'error' (object with 'errorCode' and 'errorMessage' properties).
 */
export default {

    /**
     * @description The event that is fired when a new message is sent.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     */
    "MESSAGE_SEND": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape(YupMessageSchema).required()
    }),

    /**
     * @description The event that is fired when a message is edited.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     * @param {String} data.oldMessageId - The unique identifier of the message.
     * @param {String} data.newMessage - The new message.
     */
    "MESSAGE_EDIT": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            oldMessageId: yup.string().required(),
            newMessage: yup.object().shape(YupMessageSchema).required()
        }).required()
    }),

    /**
     * @description The event that is fired when a message is deleted.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     * @param {String} data.messageId - The unique identifier of the message.
     * @param {String} data.emoji - The emoji of the reaction.
     */
    "MESSAGE_DELETE": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required()
        }).required()
    }),

    /**
     * @description The event that is fired when a reaction is added to a message.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     * @param {String} data.messageId - The unique identifier of the message.
     * @param {String} data.emoji - The emoji of the reaction.
     */
    "MESSAGE_REACTION_ADD": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required(),
            emoji: yup.string().required()
        }).required()
    }),

    /**
     * @description The event that is fired when a reaction is removed from a message.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     * @param {String} data.messageId - The unique identifier of the message.
     * @param {String} data.emoji - The emoji of the reaction.
     */
    "MESSAGE_REACTION_REMOVE": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required(),
            emoji: yup.string().required()
        }).required()
    }),

    /**
     * @description The event that is fired when a users starts or stops typing.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     * @param {boolean} data.isTyping - Whether the sender is typing or not.
     */
    "TYPING": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            isTyping: yup.boolean().required()
        }).required()
    }),

    /**
     * @description The event that is fired when a users adds a vote in a poll.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     * @param {String} data.messageId - The unique identifier of the message.
     * @param {String} data.answerId - The unique identifier of the answer.
     */
    "POLL_VOTE_ADD": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required(),
            answerId: yup.string().required()
        }).required()
    }),

    /**
     * @description The event that is fired when a users removes a vote in a poll.
     * @param {String} sender - The sender of the message.
     * @param {Object} data - The data of the message.
     * @param {String} data.messageId - The unique identifier of the message.
     * @param {String} data.answerId - The unique identifier of the answer.
     */
    "POLL_VOTE_REMOVE": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required(),
            answerId: yup.string().required()
        }).required()
    }),

    /**
     * @description The event that is fired when an error occurs.
     * @param {Object} sender - The sender of the message.
     * @param {Object} error - The error of the message.
     * @param {Number} error.errorCode - The error code of the error.
     * @param {String} error.errorMessage - The error message of the error.
     */
    "ERROR": yup.object().shape({
        sender: yup.string().required(),
        error: yup.object().shape({
            errorCode: yup.number().required(),
            errorMessage: yup.string().required()
        })
    }),

}