import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument, getDocumentByRule,
    updateDocument
} from "../../../../mongoDb/collectionAccess.js";
import SchoolSchema from "../../../../mongoDb/schemas/general/setup/SchoolSchema.js";

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
     * Create a school.
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
    }

    get _id() {
        return this.id;
    }

    set _id(id) {
        this.id = id;
    }

    get _name() {
        return this.name;
    }

    set _name(name) {
        this.name = name;
    }

    get _grades() {
        return this.grades;
    }

    set _grades(grades) {
        this.grades = grades;
    }

    get _courses() {
        return this.courses;
    }

    set _courses(courses) {
        this.courses = courses;
    }

    get _members() {
        return this.members;
    }

    set _members(members) {
        this.members = members;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(classes) {
        this.classes = classes;
    }

    get _messages() {
        return this.messages;
    }

    set _messages(messages) {
        this.messages = messages;
    }

    get _subjects() {
        return this.subjects;
    }

    set _subjects(subjects) {
        this.subjects = subjects;
    }

    get _clubs() {
        return this.clubs;
    }

    set _clubs(clubs) {
        this.clubs = clubs;
    }

    get _events() {
        return this.events;
    }

    set _events(events) {
        this.events = events;
    }

    get _blackboards() {
        return this.blackboards;
    }

    set _blackboards(blackboards) {
        this.blackboards = blackboards;
    }

    /**
     * @description Get all schools.
     * @return {Promise<Array<School>>} The schools.
     */
    static async getSchools() {
        return await getAllDocuments(SchoolSchema);
    }

    /**
     * @description Get a school by id.
     * @param {String} id - The id of the school.
     * @return {Promise<School>} The school.
     */
    static async getSchoolById(id) {
        return await getDocument(SchoolSchema, id);
    }

    /**
     * @description Get a school by rule.
     * @param {Object} rule - The rule to find the school by.
     * @return {Promise<School>} The school.
     * */
    static async getSchoolByRule(rule) {
        return await getDocumentByRule(SchoolSchema, rule);
    }

    /**
     * @description Create a school.
     * @param {School} school - The school to create.
     * @return {Promise<School>} The created school.
     */
    static async createSchool(school) {

        const insertedSchool = await createDocument(SchoolSchema, school);
        if(!insertedSchool) throw new Error(`Failed to create school:\n${ school }`);

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
        if(!updatedSchool) throw new Error(`Failed to update school:\n${ updatedSchool }`);

        return this.populateSchool(updatedSchool);

    }

    /**
     * @description Delete a school.
     * @param {String} schoolId - The id of the school to delete.
     * @return {Promise<Boolean>} The state of the deletion.
     * */
    static async deleteSchool(schoolId) {

        const deletedSchool = await deleteDocument(SchoolSchema, schoolId);
        if(!deletedSchool) throw new Error(`Failed to delete school:\n${ schoolId }`);

        return true;
    }

    /**
     * @description Populate a school.
     * @param {Object} school - The school to populate.
     * @return {School} The populated school.
     */
    static populateSchool(school) {
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