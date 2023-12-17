/**
 * @file Message.js - Function initializing all caches.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import Club from "../models/clubs/Club.js";
import Event from "../models/events/Event.js";
import EventTicket from "../models/events/EventTicket.js";
import Blackboard from "../models/general/Blackboard.js";
import Course from "../models/general/Course.js";
import Class from "../models/general/Class.js";
import Grade from "../models/general/Grade.js";
import Subject from "../models/general/Subject.js";
import Chat from "../models/messages/Chat.js";
import Message from "../models/messages/Message.js";
import User from "../models/users/User.js";

export async function initCache () {
    return (await Promise.all([
        Club.updateCache(),
        Event.updateCache(),
        EventTicket.updateCache(),
        Blackboard.updateCache(),
        Class.updateCache(),
        Course.updateCache(),
        Grade.updateCache(),
        Subject.updateCache(),
        Chat.updateCache(),
        Message.updateCache(),
        User.updateCache()
    ])).reduce((total, current) => total + current.length, 0);
}