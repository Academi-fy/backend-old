**DIESE SEITE IST NOCH NICHT FORMATIERT** \
Sie ist nur ein Entwurf. 

## Permissions

```javascript

const permissions = {

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
        ... TODO
    }

    ... TODO

}

```