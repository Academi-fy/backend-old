/**
 * @file UserAccountPermissions.js - Object listing all permissions a user account can have.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default {

    chat: [
        'CHAT_CREATE',
        'CHAT_DELETE',
        'CHAT_VIEW',
        'CHAT_ADD_USER',
        'CHAT_ADD_CLUB',
        'CHAT_ADD_CLASS'
    ],
    class: [
        'CLASS_CREATE',
        'CLASS_DELETE',
        'CLASS_ADD_USER',
        'CLASS_ADD_TEACHER'
    ],
    club: [
        'CLUB_CREATE',
        'CLUB_DELETE',
        'CLUB_APPROVE',
        'CLUB_REJECT',
        'CLUB_JOIN',
        'CLUB_LEAVE',
        'CLUB_NAME_CHANGE',
        'CLUB_DETAILS_CHANGE',
        'CLUB_EVENT_ADMIN',
        'CLUB_MEMBER_PROMOTE_DEMOTE',
        'CLUB_MEMBER_ADD_REMOVE',
        'CLUB_TEACHER_ADD_REMOVE'
    ],
    course: [
        'COURSE_CREATE',
        'COURSE_DELETE',
        'COURSE_EDIT',
        'COURSE_SET_TEACHER',
        'COURSE_ADD_USER',
        'COURSE_ADD_CLASS',
        'COURSE_SET_SUBJECT',
        'COURSE_SET_CHAT'
    ],
    event: [
        'EVENT_CREATE',
        'EVENT_DELETE',
        'EVENT_VIEW',
        'EVENT_APPROVE',
        'EVENT_REJECT',
        'EVENT_EDIT',
        'EVENT_TICKET_MANAGE'
    ],
    user: [
        'USER_MANUAL_CREATE',
        'USER_DELETE',
        'USER_MANUAL_ASSIGN_CLASSES',
        'USER_MANUAL_ASSIGN_COURSES'
    ]

}