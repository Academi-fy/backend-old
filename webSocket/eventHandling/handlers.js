/**
 * @file socketEvents.js - Class unifying all socket events handlers.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export { default as ErrorEvent } from "./handlers/ErrorEvent.js";
export { default as BlackboardCreateEvent } from "./handlers/blackboards/BlackboardCreateEvent.js";
export { default as BlackboardDeleteEvent } from "./handlers/blackboards/BlackboardDeleteEvent.js";
export { default as BlackboardUpdateEvent } from "./handlers/blackboards/BlackboardUpdateEvent.js";
export { default as ChatTargetAddEvent } from "./handlers/chats/ChatTargetAddEvent.js";
export { default as ChatTargetRemoveEvent } from "./handlers/chats/ChatTargetRemoveEvent.js";
export { default as ChatCourseAddEvent } from "./handlers/chats/ChatCourseAddEvent.js";
export { default as ChatCourseRemoveEvent } from "./handlers/chats/ChatCourseRemoveEvent.js";
export { default as ChatClubAddEvent } from "./handlers/chats/ChatClubAddEvent.js";
export { default as ChatClubRemoveEvent } from "./handlers/chats/ChatClubRemoveEvent.js";
export { default as ChatUserHideEvent } from "./handlers/chats/ChatUserHideEvent.js"
export { default as ChatUserPinEvent } from "./handlers/chats/ChatUserPinEvent.js"
export { default as ChatUserReadEvent } from "./handlers/chats/ChatUserReadEvent.js"
export { default as ChatUserUnhideEvent } from "./handlers/chats/ChatUserUnhideEvent.js"
export { default as ChatUserUnpinEvent } from "./handlers/chats/ChatUserUnpinEvent.js"
export { default as ChatUserUnreadEvent } from "./handlers/chats/ChatUserUnreadEvent.js"
export { default as ClassUserAddEvent } from "./handlers/classes/ClassUserAddEvent.js";
export { default as ClassUserRemoveEvent } from "./handlers/classes/ClassUserRemoveEvent.js";
export { default as ClubUserAddEvent } from "./handlers/clubs/ClubUserAddEvent.js";
export { default as ClubUserRemoveEvent } from "./handlers/clubs/ClubUserRemoveEvent.js";
export { default as ClubEventAddEvent } from "./handlers/clubs/ClubEventAddEvent.js";
export { default as ClubEventRemoveEvent } from "./handlers/clubs/ClubEventRemoveEvent.js";
export { default as ClassCourseAddEvent } from "./handlers/classes/ClassCourseAddEvent.js";
export { default as ClassCourseRemoveEvent } from "./handlers/classes/ClassCourseRemoveEvent.js";
export { default as CourseUserAddEvent } from "./handlers/courses/CourseUserAddEvent.js";
export { default as CourseUserRemoveEvent } from "./handlers/courses/CourseUserRemoveEvent.js";
export { default as CourseChatSetEvent } from "./handlers/courses/CourseChatSetEvent.js";
export { default as EventCreateEvent } from "./handlers/events/EventCreateEvent.js";
export { default as EventPingCreateEvent } from "./handlers/events/EventPingCreateEvent.js";
export { default as MessageSendEvent } from "./handlers/messages/MessageSendEvent.js";
export { default as MessageEditEvent } from "./handlers/messages/MessageEditEvent.js";
export { default as MessageDeleteEvent } from "./handlers/messages/MessageDeleteEvent.js";
export { default as MessageReactionAddEvent } from "./handlers/messages/MessageReactionAddEvent.js";
export { default as MessageReactionRemoveEvent } from "./handlers/messages/MessageReactionRemoveEvent.js";
export { default as PollVoteAddEvent } from "./handlers/messages/PollVoteAddEvent.js";
export { default as PollVoteRemoveEvent } from "./handlers/messages/PollVoteRemoveEvent.js";
export { default as UserClassAddEvent } from "./handlers/users/UserClassAddEvent.js";
export { default as UserClassRemoveEvent } from "./handlers/users/UserClassRemoveEvent.js";
export { default as UserCourseAddEvent } from "./handlers/users/UserCourseAddEvent.js";
export { default as UserCourseRemoveEvent } from "./handlers/users/UserCourseRemoveEvent.js";