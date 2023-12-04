/**
 * @file UserAccountPermissions.js - Object listing all permissions a user account can have.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default {

    club: {
        creation: {
            execute: "club.creation.execute",
            suggest: "club.creation.suggest"
        },
        deletion: {
            execute: "club.deletion.execute",
            suggest: "club.deletion.suggest"
        },
        join: "club.join",
        leave: "club.leave",
        edit: {
            name: {
                change: {
                    execute: "club.edit.name.change.execute",
                    suggest: "club.edit.name.change.suggest"
                }
            },
            details: {
                change: {
                    execute: "club.edit.details.change.execute",
                    suggest: "club.edit.details.change.suggest"
                }
            },
            connections: {
                event: {
                    add: {
                        execute: "club.edit.connections.event.add.execute",
                        suggest: "club.edit.connections.event.add.suggest"
                    },
                    remove: {
                        execute: "club.edit.connections.event.remove.execute",
                        suggest: "club.edit.connections.event.remove.suggest"
                    }
                },
                leader: {
                    set: {
                        execute: "club.edit.connections.leader.set.execute",
                        suggest: "club.edit.connections.leader.set.suggest"
                    }
                },
                member: {

                    add: {
                        user: {
                            execute: "club.edit.connections.member.add.user.execute",
                            suggest: "club.edit.connections.member.add.user.suggest"
                        },
                        teacher: {
                            execute: "club.edit.connections.member.add.teacher.execute",
                            suggest: "club.edit.connections.member.add.teacher.suggest"
                        }
                    },
                    remove: {
                        user: {
                            execute: "club.edit.connections.member.remove.user.execute",
                            suggest: "club.edit.connections.member.remove.user.suggest"
                        },
                        teacher: {
                            execute: "club.edit.connections.member.remove.teacher.execute",
                            suggest: "club.edit.connections.member.remove.teacher.suggest"
                        }
                    }
                }
            }
        },
        administration: {
            suggestion: {
                creation: {
                    approve: "club.administration.creation.approve",
                    reject: "club.administration.creation.reject"
                },
                deletion: {
                    approve: "club.administration.suggestion.deletion.approve",
                    reject: "club.administration.suggestion.deletion.reject"
                },
                edit: {
                    name: {
                        change: {
                            approve: "club.administration.suggestion.edit.name.change.approve",
                            reject: "club.administration.suggestion.edit.name.change.reject"
                        }
                    },
                    details: {
                        change: {
                            approve: "club.administration.suggestion.edit.details.change.approve",
                            reject: "club.administration.suggestion.edit.details.change.reject"
                        }
                    },
                    connections: {
                        event: {
                            add: {
                                approve: "club.administration.suggestion.edit.connections.event.add.approve",
                                reject: "club.administration.suggestion.edit.connections.event.add.reject"
                            },
                            remove: {
                                approve: "club.administration.suggestion.edit.connections.event.remove.approve",
                                reject: "club.administration.suggestion.edit.connections.event.remove.reject"
                            }
                        },
                        leader: {
                            set: {
                                approve: "club.administration.suggestion.edit.connections.leader.set.approve",
                                reject: "club.administration.suggestion.edit.connections.leader.set.reject"
                            }
                        },
                        member: {

                            add: {
                                user: {
                                    approve: "club.administration.suggestion.edit.connections.member.add.user.approve",
                                    reject: "club.administration.suggestion.edit.connections.member.add.user.reject"
                                },
                                teacher: {
                                    approve: "club.administration.suggestion.edit.connections.member.add.teacher.approve",
                                    reject: "club.administration.suggestion.edit.connections.member.add.teacher.reject"
                                }
                            },
                            remove: {
                                user: {
                                    approve: "club.administration.suggestion.edit.connections.member.remove.user.approve",
                                    reject: "club.administration.suggestion.edit.connections.member.remove.user.reject"
                                },
                                teacher: {
                                    approve: "club.administration.suggestion.edit.connections.member.remove.teacher.approve",
                                    reject: "club.administration.suggestion.edit.connections.member.remove.teacher.reject"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    event: {

    }

}



const test = {

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