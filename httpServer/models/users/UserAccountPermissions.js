/**
 * @file UserAccountPermissions.js - Object listing all permissions a user account can have.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default {

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
    event: [
        'EVENT_CREATE',
        'EVENT_DELETE',
        'EVENT_VIEW',
        'EVENT_APPROVE',
        'EVENT_REJECT',
        'EVENT_EDIT',
        'EVENT_TICKET_MANAGE'
    ]

}