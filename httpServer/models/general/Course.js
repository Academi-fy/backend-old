/**
 * @file Course.js - Module for representing a course.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import CourseSchema from "../../../mongoDb/schemas/general/CourseSchema.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

// Define the cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * @description Class representing a Course.
 * @param {String} _id - The id of the course.
 * @param {Array<User>} members - The members of the course.
 * @param {Array<Class>} classes - The classes in the course.
 * @param {User} teacher - The teacher of the course.
 * @param {Chat} chat - The chat of the course.
 * @param {Subject} subject - The subject of the course.
 */
export default class Course {

    /**
     * @description Create a course.
     * @param {Array} members - The members of the course.
     * @param {Array<String>} classes - The classes in the course.
     * @param {String} teacher - The id of the teacher of the course.
     * @param {String} chat - The id of the chat of the course.
     * @param {String} subject - The id of the subject of the course.
     */

    constructor(
        members,
        classes,
        teacher,
        chat,
        subject
    ) {
        this.members = members;
        this.classes = classes;
        this.teacher = teacher;
        this.chat = chat;
        this.subject = subject;
    }

    get _members() {
        return this.members;
    }

    set _members(value) {
        validateArray('Course members', value);
        this.members = value;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(value) {
        validateArray('Course classes', value);
        this.classes = value;
    }

    get _teacher() {
        return this.teacher;
    }

    set _teacher(value) {
        validateObject('Course teacher', value);
        this.teacher = value;
    }

    get _chat() {
        return this.chat;
    }

    set _chat(value) {
        validateNotEmpty('Course chat', value);
        this.chat = value;
    }

    get _subject() {
        return this.subject;
    }

    set _subject(value) {
        validateNotEmpty('Course subject', value);
        this.subject = value;
    }

    /**
     * Update the course cache from the database.
     * @return {Promise<Array<Course>>} The updated courses.
     */
    static async updateCourseCache() {

        cache.del('courses');
        const coursesFromDb = await getAllDocuments(CourseSchema);

        const courses = [];
        for (const course of coursesFromDb) {
            courses.push(
                await this.populateCourse(course)
            );
        }

        cache.put('courses', courses, expirationTime);
        return courses;

    }

    /**
     * @description Get all courses from cache or database.
     * @return {Promise<Array>} The courses.
     */
    static async getAllCourses() {

        const cacheResults = cache.get('courses');

        if (cacheResults) {
            return cacheResults;
        }
        else return await this.updateCourseCache();

    }

    /**
     * @description Get a course by its ID.
     * @param {String} courseId - The id of the course.
     * @return {Promise<Course>} The course.
     * @throws {RetrievalError} When no course matches the id.
     */
    static async getCourseById(courseId) {

        const courses = await this.getAllCourses();

        const course = courses.find(course => course._id === courseId);
        if (!course) throw new RetrievalError(`Course not found:\n${ courseId }`);

        return course;

    }

    /**
     * @description Get courses by rule.
     * @param {String} rule - The rule to find courses by.
     * @return {Promise<Array<Course>>} The matching courses.
     * @throws {RetrievalError} When no course matches the rule.
     * */
    static async getAllCoursesByRule(rule) {

        const courses = await this.getAllCourses();

        const matchingCourses = findByRule(courses, rule);
        if (!matchingCourses) throw new RetrievalError(`Failed to find courses matching rule:\n${ rule }`);

        return matchingCourses;

    }

    /**
     * @description Create a new course and add it to the database and cache.
     * @param {Course} course - The course to create.
     * @return {Promise<Course>} The created course.
     * @throws {DatabaseError} When the course could not be created.
     * @throws {CacheError} When the course could not be created in the cache.
     */
    static async createCourse(course) {

        const courses = await this.getAllCourses();

        const insertedCourse = await createDocument(CourseSchema, course);
        if (!insertedCourse) throw new DatabaseError(`Course could not be created:\n${ course }`);

        courses.push(
            await this.populateCourse(insertedCourse)
        );
        cache.put('courses', courses, expirationTime);

        if (!this.verifyCourseInCache(insertedCourse))

            if (!await verifyInCache(cache.get('courses'), insertedCourse, this.updateCourseCache))
                throw new CacheError(`Course could not be created:\n${ insertedCourse }`);

        return insertedCourse;
    }

    /**
     * @description Update a course in the database and cache.
     * @param {String} courseId - The ID of the course to update.
     * @param {Course} updateCourse - The course to update.
     * @return {Promise<Course>} The updated course.
     * @throws {DatabaseError} When the course could not be updated.
     * @throws {CacheError} When the course could not be updated in the cache.
     */
    static async updateCourse(courseId, updateCourse) {

        const courses = await this.getAllCourses();

        let updatedCourse = await updateDocument(CourseSchema, courseId, updateCourse);
        if (!updatedCourse) throw new DatabaseError(`Course could not be updated:\n${ updateCourse }`);

        updatedCourse = await this.populateCourse(updatedCourse);

        courses.splice(courses.findIndex(course => course._id === courseId), 1, updatedCourse);
        cache.put('courses', courses, expirationTime);

        if (!this.verifyCourseInCache(updatedCourse))

            if (!await verifyInCache(cache.get('courses'), updatedCourse, this.updateCourseCache))
                throw new CacheError(`Course could not be updated:\n${ updatedCourse }`);


        return updatedCourse;
    }

    /**
     * @description Delete a course in the database and cache.
     * @param {String} courseId - The ID of the course to update.
     * @return {Promise<Boolean>} State of the deletion.
     * @throws {DatabaseError} When the course could not be deleted.
     */
    static async deleteCourse(courseId) {

        const deletedCourse = await deleteDocument(CourseSchema, courseId);
        if (!deletedCourse) throw new DatabaseError(`Course could not be deleted:\n${ courseId }`);

        const courses = await this.getAllCourses();
        courses.splice(courses.findIndex(course => course._id === courseId), 1);
        cache.put('courses', courses, expirationTime);

        if (this.verifyCourseInCache(deletedCourse))
            throw new CacheError(`Course could not be deleted from cache:\n${ deletedCourse }`);

        return true;
    }

    /**
     * @description Verify if a course is in the cache.
     * @param {Course} course - The course to verify.
     * @return {Boolean} True if the course is in the cache, false otherwise.
     */
    static async verifyCourseInCache(course) {

        const cacheResult = cache.get('courses').find(course_ => course_._id === course._id)

        return Boolean(cacheResult);
    }

    /**
     * @description Populate a course.
     * @param {Object} course - The course to populate.
     * @return {Promise<Course>} The populated course.
     **/
    static async populateCourse(course) {

        try {
            course = await course
                .populate([
                    {
                        path: 'members',
                        populate: [
                            { path: 'classes' },
                            { path: 'extraCourses' },
                        ]
                    },
                    {
                        path: 'classes',
                        populate: [
                            { path: 'grade' },
                            { path: 'courses' },
                            { path: 'members' },
                        ]
                    },
                    {
                        path: 'teacher',
                        populate: [
                            { path: 'classes' },
                            { path: 'extraCourses' },
                        ]
                    },
                    {
                        path: 'subject',
                        populate: [
                            { path: 'courses' }
                        ]
                    },
                    {
                        path: 'chat',
                        populate: [
                            { path: 'targets' },
                            { path: 'courses' },
                            { path: 'clubs' }
                        ]
                    },
                ]);

            const populatedCourse = new Course(
                course.members,
                course.classes,
                course.teacher,
                course.chat,
                course.subject
            );
            populatedCourse._id = course._id;

            return populatedCourse;
        } catch (error) {
            throw new DatabaseError(`Failed to populate course:\n${ course }\n${ error }`);
        }
    }

}