import cache from "../../cache.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import { verifyInCache } from "../propertyValidation.js";
import SubjectSchema from "../../../mongoDb/schemas/general/SubjectSchema.js";

const expirationTime = 10 * 60 * 1000;

/**
 * @description Class representing a Subject.
 * @param {String} _id - The id of the subject.
 * @param {String} type - The type of the subject.
 * @param {Array<Course>} courses - The courses of the subject.
 */
export default class Subject {

    /**
     * Create a subject.
     * @param {String} type - The type of the subject.
     * @param {Array<String>} courses - The ids of the courses of the subject.
     */
    constructor(
        type,
        courses
    ) {
        this.type = type;
        this.courses = courses;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        this.type = value;
    }

    get _courses() {
        return this.courses;
    }

    set _courses(value) {
        this.courses = value;
    }

    /**
     * Update the cache of subjects.
     * @return {Array<Subject>} The updated list of subjects.
     */
    static updateSubjectCache(){

        cache.get("subjects").clear();
        const subjectsFromDb = getAllDocuments(MessageSchema);

        const subjects = [];
        for (const subjectFromDb of subjectsFromDb) {
            subjects.push(new Subject(
                subjectFromDb.type,
                subjectFromDb.courses
            ));
        }

        cache.put('subjects', subjects, expirationTime);
        return subjects;

    }

    /**
     * Get all subjects.
     * @return {Array<Subject>} The list of subjects.
     */
    static getSubjects() {

        const cacheResults = cache.get("subjects");

        if (!cacheResults) {
            return cacheResults;
        }
        else return this.updateSubjectCache();

    }

    /**
     * Get a subject by its id.
     * @param {String} id - The id of the subject.
     * @return {Subject} The subject.
     */
    static async getSubjectById(id) {

        const subjects = this.getSubjects();

        const subject = subjects.find(subject => subject._id === id);
        if (!subject) throw new Error(`Subject not found:\n${ id }`);

        return subject;

    }

    /**
     * Create a subject.
     * @param {Subject} subject - The subject.
     * @return {Array<Subject>} The updated list of subjects.
     * @throws {Error} If the subject could not be created.
     */
    static async createSubject(subject) {

        const subjects = this.getSubjects();

        const insertedSubject = await createDocument(SubjectSchema, subject);
        if(!insertedSubject) throw new Error(`Failed to create subject:\n${ subject }`);

        subjects.push(
            this.populateSubject(insertedSubject)
        );
        cache.put('subjects', subjects, expirationTime);

        if(!this.verifySubjectInCache(insertedSubject))

            if(!verifyInCache(subjects, subject, this.updateSubjectCache))
                throw new Error(`Failed to create subject:\n${ subject }`);

    }

    /**
     * Update a subject.
     * @param {String} subjectId - The id of the subject.
     * @param {Subject} subject - The subject.
     * @return {Subject} The updated subject.
     */
    static async updateSubject(subjectId, subject) {

        const subjects = this.getSubjects();

        let updatedSubject = await updateDocument(SubjectSchema, subjectId, subject);
        if(!updatedSubject) throw new Error(`Failed to update subject:\n${ subject }`);

        updatedSubject = this.populateSubject(updatedSubject);

        subjects.splice(subjects.findIndex(subject => subject._id === subjectId), 1, updatedSubject);
        cache.put('subjects', subjects, expirationTime);

        if(!this.verifySubjectInCache(updatedSubject))

            if(!verifyInCache(subjects, updatedSubject, this.updateSubjectCache))
                throw new Error(`Failed to update subject:\n${ updatedSubject }`);

        return updatedSubject;
    }

    /**
     * Delete a subject.
     * @param {String} subjectId - The id of the subject.
     * @return {Subject} The deleted subject.
     */
    static async deleteSubject(subjectId) {

        const deletedSubject = await deleteDocument(SubjectSchema, subjectId);
        if (!deletedSubject) throw new Error(`Failed to delete subject:\n${ subjectId }`);

        const subjects = this.getSubjects();
        subjects.splice(subjects.findIndex(subject => subject._id === subjectId), 1);
        cache.put('subjects', subjects, expirationTime);


        if(this.verifySubjectInCache(deletedSubject))

            if(!verifyInCache(subjects, deletedSubject, this.updateSubjectCache))
                throw new Error(`Failed to delete subject:\n${ deletedSubject }`);

        return deletedSubject;
    }

    /**
     * Populate a subject.
     * @param {Subject} testSubject - The subject.
     * @return {Boolean} Whether the subject is in the cache.
     */
    static verifySubjectInCache(testSubject) {

        const cacheResults = cache.get("subjects").find(subject => subject._id === testSubject._id);
        return Boolean(cacheResults)

    }

    /**
     * Populate a subject.
     * @param {Object} subject - The subject.
     * @return {Subject} The populated subject.
     */
    static populateSubject(subject) {
        return subject
            .populate('courses')
    }

}