import mongoose from 'mongoose';
import ClubSchema from './schemas/clubs/ClubSchema.js';
import UserSchema from './schemas/user/UserSchema.js';
import ChatSchema from './schemas/general/ChatSchema.js';
import EventSchema from './schemas/events/EventSchema.js';
import EventTicketSchema from "./schemas/events/EventTicketSchema.js";
import SchoolSchema from "./schemas/general/setup/SchoolSchema.js";
import SetupAccountSchema from "./schemas/general/setup/SetupAccountSchema.js";
import BlackboardSchema from "./schemas/general/BlackboardSchema.js";
import ClassSchema from "./schemas/general/ClassSchema.js";
import CourseSchema from "./schemas/general/CourseSchema.js";
import GradeSchema from "./schemas/general/GradeSchema.js";
import SubjectSchema from "./schemas/general/SubjectSchema.js";
import MessageSchema from "./schemas/messages/MessageSchema.js";
import UserAccountSchema from "./schemas/user/UserAccountSchema.js";

export function initializeSchemas() {

    for (const model of getAllModels()) {
        mongoose.model(model.name, model.schema);
    }

}

export function getModel(model) {

    model = getAllModels().find(m => m.schema === model);
    if (!model) {
        throw new Error('Model not found.');
    }
    return {
        name: model.name,
        model: mongoose.model(model.name, model.schema)
    };
}

export function getAllModels() {

    return [
        {
            name: 'Club',
            schema: ClubSchema
        },
        {
            name: 'Event',
            schema: EventSchema
        },
        {
            name: 'EventTicket',
            schema: EventTicketSchema
        },
        {
            name: 'School',
            schema: SchoolSchema
        },
        {
            name: 'SetupAccount',
            schema: SetupAccountSchema
        },
        {
            name: 'Blackboard',
            schema: BlackboardSchema
        },
        {
            name: 'Chat',
            schema: ChatSchema
        },
        {
            name: 'Class',
            schema: ClassSchema
        },
        {
            name: 'Course',
            schema: CourseSchema
        },
        {
            name: 'Grade',
            schema: GradeSchema
        },
        {
            name: 'Subject',
            schema: SubjectSchema
        },
        {
            name: 'Message',
            schema: MessageSchema
        },
        {
            name: 'UserAccount',
            schema: UserAccountSchema
        },
        {
            name: 'User',
            schema: UserSchema
        }
    ];

}