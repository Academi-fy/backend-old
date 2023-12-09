/**
 * @file socketEvents.js - Class unifying all socket events and their handlers.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import * as handlers from "./handlers.js";

function createHandler(eventName) {
    return {
        handler: (ws, data, messageId, date) => { handlers[eventName](ws, data, messageId, date) }
    };
}

export default {

    "ERROR": createHandler('ErrorEvent'),

    // BLACKBOARDS

    "BLACKBOARD_CREATE": createHandler('BlackboardCreateEvent'),
    "BLACKBOARD_UPDATE": createHandler('BlackboardUpdateEvent'),
    "BLACKBOARD_DELETE": createHandler('BlackboardDeleteEvent'),

    // CHATS

    "CHAT_TARGET_ADD": createHandler('ChatTargetAddEvent'),
    "CHAT_TARGET_REMOVE": createHandler('ChatTargetRemoveEvent'),
    "CHAT_COURSE_ADD": createHandler('ChatCourseAddEvent'),
    "CHAT_COURSE_REMOVE": createHandler('ChatCourseRemoveEvent'),
    "CHAT_CLUB_ADD": createHandler('ChatClubAddEvent'),
    "CHAT_CLUB_REMOVE": createHandler('ChatClubRemoveEvent'),

    // CLASSES

    "CLASS_COURSE_ADD": createHandler('ClassCourseAddEvent'),
    "CLASS_COURSE_REMOVE": createHandler('ClassCourseRemoveEvent'),
    "CLASS_USER_ADD": createHandler('ClassUserAddEvent'),
    "CLASS_USER_REMOVE": createHandler('ClassUserRemoveEvent'),

    // CLUBS

    "CLUB_USER_ADD": createHandler('ClubUserAddEvent'),
    "CLUB_USER_REMOVE": createHandler('ClubUserRemoveEvent'),
    "CLUB_EVENT_ADD": createHandler('ClubEventAddEvent'),
    "CLUB_EVENT_REMOVE": createHandler('ClubEventRemoveEvent'),

    // COURSES

    "COURSE_USER_ADD": createHandler('CourseUserAddEvent'),
    "COURSE_USER_REMOVE": createHandler('CourseUserRemoveEvent'),
    "COURSE_CHAT_SET": createHandler('CourseChatSetEvent'),

    // EVENTS

    "EVENT_CREATE": createHandler('EventCreateEvent'),
    "EVENT_PING_CREATE": createHandler('EventPingCreateEvent'),

    // MESSAGES

    "MESSAGE_SEND": createHandler('MessageSendEvent'),
    "MESSAGE_EDIT": createHandler('MessageEditEvent'),
    "MESSAGE_DELETE": createHandler('MessageDeleteEvent'),
    "MESSAGE_REACTION_ADD": createHandler('MessageReactionAddEvent'),
    "MESSAGE_REACTION_REMOVE": createHandler('MessageReactionRemoveEvent'),
    "POLL_VOTE_ADD": createHandler('PollVoteAddEvent'),
    "POLL_VOTE_REMOVE": createHandler('PollVoteRemoveEvent'),

    // USERS

    "USER_CLASS_ADD": createHandler('UserClassAddEvent'),
    "USER_CLASS_REMOVE": createHandler('UserClassRemoveEvent'),
    "USER_COURSE_ADD": createHandler('UserCourseAddEvent'),
    "USER_COURSE_REMOVE": createHandler('UserCourseRemoveEvent')

}