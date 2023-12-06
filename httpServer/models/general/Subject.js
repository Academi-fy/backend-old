/**
 * @file Subject.js - Module for representing a subject.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import cache from "../../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import SubjectSchema from "../../../mongoDb/schemas/general/SubjectSchema.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

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
     * @param {String} shortName - The short name of the subject.
     * @param {Array<String>} courses - The ids of the courses of the subject.
     */
    constructor(
        type,
        shortName,
        courses
    ) {
        this.type = type;
        this.courses = courses;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        validateNotEmpty('Subject type', value);
        this.type = value;
    }

    get _shortName() {
        return this.shortName;
    }

    set _shortName(value) {
        validateNotEmpty('Subject shortName', value);
        this.shortName = value;
    }

    get _courses() {
        return this.courses;
    }

    set _courses(value) {
        validateArray('Subject courses', value);
        this.courses = value;
    }

    /**
     * Update the cache of subjects.
     * @return {Promise<Array<Subject>>} The updated list of subjects.
     */
    static async updateSubjectCache() {

        cache.del('subjects');
        const subjectsFromDb = await getAllDocuments(SubjectSchema);

        //TODO update subjects with populate
        let subjects = subjectsFromDb;

        cache.put('subjects', subjects, expirationTime);
        return subjects;

    }

    /**
     * Get all subjects.
     * @return {Promise<Array<Subject>>} The list of subjects.
     */
    static async getAllSubjects() {

        const cacheResults = cache.get("subjects");

        if (cacheResults) {
            return cacheResults;
        }
        else return await this.updateSubjectCache();

    }

    /**
     * Get a subject by its id.
     * @param {String} id - The id of the subject.
     * @return {Promise<Subject>} The subject.
     * @throws {RetrievalError} When the subject is not found.
     */
    static async getSubjectById(id) {

        const subjects = await this.getAllSubjects();

        const subject = subjects.find(subject => subject._id === id);
        if (!subject) throw new RetrievalError(`Subject not found:\n${ id }`);

        return subject;

    }

    /**
     * @description Get all subjects that match a rule.
     * @param {Object} rule - The rule to find the subject.
     * @return {Promise<Array<Subject>>} The matching subjects.
     * @throws {RetrievalError} When no subjects match the rule.
     * */
    static async getAllSubjectsByRule(rule) {

        const subjects = await this.getAllSubjects();

        const matchingSubjects = findByRule(subjects, rule);
        if (!matchingSubjects) throw new RetrievalError(`Failed to find subjects with rule:\n${ rule }`);

        return matchingSubjects;
    }

    /**
     * Create a subject.
     * @param {Subject} subject - The subject.
     * @return {Promise<Array<Subject>>} The updated list of subjects.
     * @throws {DatabaseError} When the subject is not created.
     * @throws {CacheError} When the subject is not created in the cache.
     */
    static async createSubject(subject) {

        const subjects = await this.getAllSubjects();

        const insertedSubject = await createDocument(SubjectSchema, subject);
        if (!insertedSubject) throw new DatabaseError(`Failed to create subject:\n${ subject }`);

        subjects.push(
            await this.populateSubject(insertedSubject)
        );
        cache.put('subjects', subjects, expirationTime);

        if (!this.verifySubjectInCache(insertedSubject))

            if (!await verifyInCache(subjects, subject, this.updateSubjectCache))
                throw new CacheError(`Failed to create subject:\n${ subject }`);

    }

    /**
     * Update a subject.
     * @param {String} subjectId - The id of the subject.
     * @param {Subject} subject - The subject.
     * @return {Promise<Subject>} The updated subject.
     * @throws {DatabaseError} When the subject is not updated.
     * @throws {CacheError} When the subject is not updated in the cache.
     */
    static async updateSubject(subjectId, subject) {

        const subjects = await this.getAllSubjects();

        let updatedSubject = await updateDocument(SubjectSchema, subjectId, subject);
        if (!updatedSubject) throw new DatabaseError(`Failed to update subject:\n${ subject }`);

        updatedSubject = await this.populateSubject(updatedSubject);

        subjects.splice(subjects.findIndex(subject => subject._id === subjectId), 1, updatedSubject);
        cache.put('subjects', subjects, expirationTime);

        if (!this.verifySubjectInCache(updatedSubject))

            if (!await verifyInCache(subjects, updatedSubject, this.updateSubjectCache))
                throw new CacheError(`Failed to update subject:\n${ updatedSubject }`);

        return updatedSubject;
    }

    /**
     * Delete a subject.
     * @param {String} subjectId - The id of the subject.
     * @return {Promise<Subject>} The deleted subject.
     * @throws {DatabaseError} When the subject is not deleted.
     */
    static async deleteSubject(subjectId) {

        const deletedSubject = await deleteDocument(SubjectSchema, subjectId);
        if (!deletedSubject) throw new DatabaseError(`Failed to delete subject:\n${ subjectId }`);

        const subjects = await this.getAllSubjects();
        subjects.splice(subjects.findIndex(subject => subject._id === subjectId), 1);
        cache.put('subjects', subjects, expirationTime);

        if (this.verifySubjectInCache(deletedSubject))

            if (!await verifyInCache(subjects, deletedSubject, this.updateSubjectCache))
                throw new CacheError(`Failed to delete subject:\n${ deletedSubject }`);

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
     * @return {Promise<Subject>} The populated subject.
     */
    static async populateSubject(subject) {

        try {

            subject = await subject
                .populate([
                    {
                        path: 'courses',
                        populate: [
                            { path: 'members' },
                            { path: 'classes' },
                            { path: 'teacher' },
                            { path: 'subject' },
                            { path: 'chat' },
                        ]
                    }
                ]);

            const populatedSubject = new Subject(
                subject.type,
                subject.shortName,
                subject.courses
            );
            populatedSubject._id = subject._id.toString();

            return populatedSubject;

        } catch (error) {
            throw new DatabaseError(`Failed to populate subject:\n${ subject }\n${ error }`);
        }
    }

}