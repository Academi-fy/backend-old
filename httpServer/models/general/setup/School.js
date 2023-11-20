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
    getDocumentByRule,
    updateDocument
} from "../../../../mongoDb/collectionAccess.js";
import SchoolSchema from "../../../../mongoDb/schemas/general/setup/SchoolSchema.js";
import { validateArray, validateNotEmpty } from "../../propertyValidation.js";
import DatabaseError from "../../../errors/DatabaseError.js";
import RetrievalError from "../../../errors/RetrievalError.js";

/**
 * @description Class representing a school.
 * @param {String} id - The id of the school.
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
     * @param {String} id - The id of the school.
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
        id,
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
        this.id = id;
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

        validateNotEmpty('School id', id);
        validateNotEmpty('School name', name);
        validateArray('School grades', grades);
        validateArray('School courses', courses);
        validateArray('School members', members);
        validateArray('School classes', classes);
        validateArray('School messages', messages);
        validateArray('School subjects', subjects);
        validateArray('School clubs', clubs);
        validateArray('School events', events);
        validateArray('School blackboards', blackboards);
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNotEmpty('School id', value);
        this.id = value;
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

    set _grades(grades) {
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

        const school = await getDocumentByRule(SchoolSchema, rule);
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

        return this.populateSchool(insertedSchool);

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

        return this.populateSchool(updatedSchool);

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
     * @return {School} The populated school.
     */
    static populateSchool(school) {
        //TODO populate
        return school
            .populate('grades')
            .populate('courses')
            .populate('members')
            .populate('classes')
            .populate('messages')
            .populate('subjects')
            .populate('clubs')
            .populate('events')
            .populate('blackboards');
    }

}