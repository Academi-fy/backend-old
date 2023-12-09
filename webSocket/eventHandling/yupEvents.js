/**
 * @file yupEvents.js - Class unifying all Schemas
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";
import YupMessageSchema from "../yupSchemas/messages/YupMessageSchema.js";
import YupBlackboardSchema from "../yupSchemas/YupBlackboardSchema.js";
import YupEventPingSchema from "../yupSchemas/events/YupEventPingSchema.js";
import YupEventSchema from "../yupSchemas/events/YupEventSchema.js";

/**
 * @description The standard format for WebSocket requests
 * @param {Object} data - The custom data format for the event
 * @property {String} sender - The sender of the socket messages
 * @property {Object} data - The custom data format for the event
 * @returns {yup.ObjectSchema} A Yup schema object that validates the standard format for WebSocket requests.
 * */
const standardFormat = (data) => {

    return yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape(
            data
        ).required()
    })
}

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
     * Events are built up like this:
     * @param {String} sender - The id of the sender of the messages.
     * @param {Object} data - The data of the updated class.
     * */

    "ERROR": standardFormat({
        errorCode: yup.number().required(),
        errorMessage: yup.string().required()
    }),

    // BLACKBOARDS

    /**
     * @description The event that is fired when a new blackboard is created.
     * */
    "BLACKBOARD_CREATE": standardFormat(YupBlackboardSchema.required()),

    /**
     * @description The event that is fired when a blackboard is updated.
     * */
    "BLACKBOARD_UPDATE": standardFormat(YupBlackboardSchema.required()),

    /**
     * @description The event that is fired when a blackboard is deleted.
     * */
    "BLACKBOARD_DELETE": standardFormat({
        blackboardId: yup.string().required()
    }),

    // CHATS

    /**
     * @description The event that is fired when a target is added to a chat.
     * */
    "CHAT_TARGET_ADD": standardFormat({
        chatId: yup.string().required(),
        targetId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a target is removed from a chat.
     * */
    "CHAT_TARGET_REMOVE": standardFormat({
        chatId: yup.string().required(),
        targetId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a course is added to a chat.
     * */
    "CHAT_COURSE_ADD": standardFormat({
        chatId: yup.string().required(),
        courseId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a course is removed from a chat.
     * */
    "CHAT_COURSE_REMOVE": standardFormat({
        chatId: yup.string().required(),
        courseId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a club is added to a chat.
     * */
    "CHAT_CLUB_ADD": standardFormat({
        chatId: yup.string().required(),
        clubId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a club is removed from a chat.
     * */
    "CHAT_CLUB_REMOVE": standardFormat({
        chatId: yup.string().required(),
        clubId: yup.string().required()
    }),

    // CLASSES

    /**
     * @description The event that is fired when a course is added to a class.
     * */
    "CLASS_COURSE_ADD": standardFormat({
        classId: yup.string().required(),
        courseId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a course is removed from a class.
     * */
    "CLASS_COURSE_REMOVE": standardFormat({
        classId: yup.string().required(),
        courseId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a user is added to a class.
     * */
    "CLASS_USER_ADD": standardFormat({
        classId: yup.string().required(),
        userId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a user is removed from a class.
     * */
    "CLASS_USER_REMOVE": standardFormat({
        classId: yup.string().required(),
        userId: yup.string().required()
    }),

    // CLUBS

    /**
     * @description The event that is fired when a user is added to a club.
     * */
    "CLUB_USER_ADD": standardFormat({
        clubId: yup.string().required(),
        userId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a user is removed from a club.
     * */
    "CLUB_USER_REMOVE": standardFormat({
        clubId: yup.string().required(),
        userId: yup.string().required()
    }),

    /**
     * @description The event that is fired when an event is added to a club.
     * */
    "CLUB_EVENT_ADD": standardFormat({
        clubId: yup.string().required(),
        eventId: yup.string().required()
    }),

    /**
     * @description The event that is fired when an event is removed from a club.
     * */
    "CLUB_EVENT_REMOVE": standardFormat({
        clubId: yup.string().required(),
        eventId: yup.string().required()
    }),

    // COURSES

    /**
     * @description The event that is fired when a user is added to a course.
     * */
    "COURSE_USER_ADD": standardFormat({
        courseId: yup.string().required(),
        userId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a user is removed from a course.
     * */
    "COURSE_USER_REMOVE":standardFormat({
        courseId: yup.string().required(),
        userId: yup.string().required()
    }),

    /**
     * @description The event that is fired when the chat is set for a course.
     * */
    "COURSE_CHAT_SET": standardFormat({
        courseId: yup.string().required(),
        chatId: yup.string().required()
    }),

    // EVENTS

    /**
     * @description The event that is fired when en event is created.
     * */
    "EVENT_CREATE": standardFormat({
        eventId: yup.string().required(),
        event: YupEventSchema.required()
    }),

    /**
     * @description The event that is fired when a ping is created for an event.
     * */
    "EVENT_PING_CREATE": standardFormat({
        eventId: yup.string().required(),
        ping: YupEventPingSchema.required()
    }),

    // MESSAGING

    /**
     * @description The event that is fired when a new message is sent.
     */
    "MESSAGE_SEND": standardFormat(YupMessageSchema.required()),

    /**
     * @description The event that is fired when a message is edited.
     */
    "MESSAGE_EDIT": standardFormat({
        oldMessageId: yup.string().required(),
        newMessage: YupMessageSchema.required()
    }),

    /**
     * @description The event that is fired when a message is deleted.
     */
    "MESSAGE_DELETE": standardFormat({
        messageId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a reaction is added to a messages.
     */
    "MESSAGE_REACTION_ADD": standardFormat({
        messageId: yup.string().required(),
        emoji: yup.string().required()
    }),

    /**
     * @description The event that is fired when a reaction is removed from a messages.
     */
    "MESSAGE_REACTION_REMOVE": standardFormat({
        messageId: yup.string().required(),
        emoji: yup.string().required()
    }),

    /**
     * @description The event that is fired when a user adds a vote in a poll.
     */
    "POLL_VOTE_ADD": standardFormat({
        messageId: yup.string().required(),
        answerId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a user removes a vote in a poll.
     */
    "POLL_VOTE_REMOVE": standardFormat({
        messageId: yup.string().required(),
        answerId: yup.string().required()
    }),

    // USERS

    /**
     * @description The event that is fired when a class is added to a user.
     */
    "USER_CLASS_ADD": standardFormat({
        userId: yup.string().required(),
        classId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a class is removed from a user.
     * */
    "USER_CLASS_REMOVE": standardFormat({
        userId: yup.string().required(),
        classId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a course is added to a user.
     */
    "USER_COURSE_ADD": standardFormat({
        userId: yup.string().required(),
        courseId: yup.string().required()
    }),

    /**
     * @description The event that is fired when a course is removed from a user.
     * */
    "USER_COURSE_REMOVE": standardFormat({
        userId: yup.string().required(),
        courseId: yup.string().required()
    }),

}