/**
 * @file School.js - Module for representing a school.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    getDocumentsByRule,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import SchoolSchema from "../../../mongoDb/schemas/general/setup/SchoolSchema.js";
import { validateArray, validateNotEmpty } from "../../propertyValidation.js";
import DatabaseError from "../../../httpServer/errors/DatabaseError.js";
import RetrievalError from "../../../httpServer/errors/RetrievalError.js";
import Grade from "../Grade.js";
import Course from "../Course.js";
import User from "../../users/User.js";
import Class from "../Class.js";
import Message from "../../messages/Message.js";
import Subject from "../Subject.js";
import Club from "../../clubs/Club.js";
import Event from "../../events/Event.js";
import Blackboard from "../Blackboard.js";

/**
 * @description Class representing a school.
 * @param {String} _id - The id of the school.
 * @param {String} name - The name of the school.
 * @param {Array<Grade>} grades - The grades in the school.
 * @param {Array<Course>} courses - The courses in the school.
 * @param {Array<User>} members - The members in the school.
 * @param {Array<Class>} classes - The classes in the school.
 * @param {Array<Message>} messages - The messages in the school.
 * @param {Array<Subject>} subjects - The subjects in the school.
 * @param {Array<Club>} clubs - The clubs in the school.
 * @param {Array<Event>} events - The events in the school.
 * @param {Array<Blackboard>} blackboards - The blackboards in the school.
 * */
export default class School {

    /**
     * @description Create a school.
     * @param {String} name - The name of the school.
     * @param {Array<String>} grades - The ids of the grades in the school.
     * @param {Array<String>} courses - The ids of the courses in the school.
     * @param {Array<String>} members - The ids of the members in the school.
     * @param {Array<String>} classes - The ids of the classes in the school.
     * @param {Array<String>} messages - The ids of the messages in the school.
     * @param {Array<String>} subjects - The ids of the subjects in the school.
     * @param {Array<String>} clubs - The ids of the clubs in the school.
     * @param {Array<String>} events - The ids of the events in the school.
     * @param {Array<String>} blackboards - The ids of the blackboards in the school.
     * */
    constructor(
        name,
        grades,
        courses,
        members,
        classes,
        messages,
        subjects,
        clubs,
        events,
        blackboards
    ) {
        this.name = name;
        this.grades = grades;
        this.courses = courses;
        this.members = members;
        this.classes = classes;
        this.messages = messages;
        this.subjects = subjects;
        this.clubs = clubs;
        this.events = events;
        this.blackboards = blackboards;
    }

    get _name() {
        return this.name;
    }

    set _name(value) {
        validateNotEmpty('School name', value);
        this.name = value;
    }

    get _grades() {
        return this.grades;
    }

    set _grades(value) {
        validateArray('School grades', value)
        this.grades = value;
    }

    get _courses() {
        return this.courses;
    }

    set _courses(value) {
        validateArray('School courses', value)
        this.courses = value;
    }

    get _members() {
        return this.members;
    }

    set _members(value) {
        validateArray('School members', value)
        this.members = value;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(value) {
        validateArray('School classes', value)
        this.classes = value;
    }

    get _messages() {
        return this.messages;
    }

    set _messages(value) {
        validateArray('School messages', value)
        this.messages = value;
    }

    get _subjects() {
        return this.subjects;
    }

    set _subjects(value) {
        validateArray('School subjects', value)
        this.subjects = value;
    }

    get _clubs() {
        return this.clubs;
    }

    set _clubs(value) {
        validateArray('School clubs', value)
        this.clubs = value;
    }

    get _events() {
        return this.events;
    }

    set _events(value) {
        validateArray('School events', value)
        this.events = value;
    }

    get _blackboards() {
        return this.blackboards;
    }

    set _blackboards(value) {
        validateArray('School blackboards', value)
        this.blackboards = value;
    }

    /**
     * @description Get all schools.
     * @return {Promise<Array<School>>} The schools.
     */
    static async getAllSchools() {

        const schools = await getAllDocuments(SchoolSchema);
        if (!schools) throw new RetrievalError(`Failed to get all schools`);

        //TODO populate

        return schools;
    }

    /**
     * @description Get a school by id.
     * @param {String} id - The id of the school.
     * @return {Promise<School>} The school.
     */
    static async getSchoolById(id) {

        const school = await getDocument(SchoolSchema, id);
        if (!school) throw new RetrievalError(`Failed to get school with id:\n${ id }`);

        //TODO populate

        return school;
    }

    /**
     * @description Get a school by rule.
     * @param {Object} rule - The rule to find the school by.
     * @return {Promise<School>} The school.
     * */
    static async getSchoolByRule(rule) {

        const school = await getDocumentsByRule(SchoolSchema, rule);
        if (!school) throw new RetrievalError(`Failed to get school matching rule:\n${ rule }`);

        //TODO populate

        return school;
    }

    /**
     * @description Create a school.
     * @param {School} school - The school to create.
     * @return {Promise<School>} The created school.
     */
    static async createSchool(school) {

        const insertedSchool = await createDocument(SchoolSchema, school);
        if (!insertedSchool) throw new DatabaseError(`Failed to create school:\n${ school }`);

        return await this.populateSchool(insertedSchool);

    }

    /**
     * @description Update a school.
     * @param {String} schoolId - The id of the school to update.
     * @param {School} updateSchool - The updated school.
     * @return {Promise<School>} The updated school.
     * */
    static async updateSchool(schoolId, updateSchool) {

        const updatedSchool = await updateDocument(SchoolSchema, schoolId, updateSchool);
        if (!updatedSchool) throw new DatabaseError(`Failed to update school:\n${ updatedSchool }`);

        return await this.populateSchool(updatedSchool);

    }

    /**
     * @description Delete a school.
     * @param {String} schoolId - The id of the school to delete.
     * @return {Promise<Boolean>} The state of the deletion.
     * */
    static async deleteSchool(schoolId) {

        const deletedSchool = await deleteDocument(SchoolSchema, schoolId);
        if (!deletedSchool) throw new DatabaseError(`Failed to delete school:\n${ schoolId }`);

        return true;
    }

    /**
     * @description Populate a school.
     * @param {Object} school - The school to populate.
     * @return {Promise<School>} The populated school.
     */
    static async populateSchool(school) {

        try {

            school = await school
                .populate([
                    {
                        path: 'grades',
                        populate: Grade.getPopulationPaths()
                    },
                    {
                        path: 'courses',
                        populate: Course.getPopulationPaths()
                    },
                    {
                        path: 'members',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'classes',
                        populate: Class.getPopulationPaths()
                    },
                    {
                        path: 'messages',
                        populate: Message.getPopulationPaths()
                    },
                    {
                        path: 'subjects',
                        populate: Subject.getPopulationPaths()
                    },
                    {
                        path: 'clubs',
                        populate: Club.getPopulationPaths()
                    },
                    {
                        path: 'events',
                        populate: Event.getPopulationPaths()
                    },
                    {
                        path: 'blackboards',
                        populate: Blackboard.getPopulationPaths()
                    },
                ]);

            const populatedSchool = new School(
                school.name,
                school.grades,
                school.courses,
                school.members,
                school.classes,
                school.messages,
                school.subjects,
                school.clubs,
                school.events,
                school.blackboards
            );
            populatedSchool._id = school._id.toString();

            return populatedSchool;

        } catch (error) {
            throw new DatabaseError(`Failed to populate school:\n${ school }\n${ error }`);
        }

    }

    static getPopulationPaths() {
        return [
            { path: 'grades' },
            { path: 'courses' },
            { path: 'members' },
            { path: 'classes' },
            { path: 'messages' },
            { path: 'subjects' },
            { path: 'clubs' },
            { path: 'events' },
            { path: 'blackboards' },
        ]
    }

}