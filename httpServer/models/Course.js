import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "./propertyValidation.js";
import cache from "../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../mongoDb/collectionAccess.js";
import CourseSchema from "../../mongoDb/schemas/CourseSchema.js";
import mongoose from "mongoose";

// Define the cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * @description Class representing a Course.
 * @property {Array<User>} members - The members of the course.
 * @property {Array<Class>} classes - The classes in the course.
 * @property {User} teacher - The teacher of the course.
 * @property {Chat} chat - The chat of the course.
 * @property {Subject} subject - The subject of the course.
 */
export default class Course {

    /**
     * @description Create a course.
     * @param {Array} members - The members of the course.
     * @param {Array} classes - The classes in the course.
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
     * @description Get all courses from cache or database.
     * @return {Array} The courses.
     */
    static async getCourses() {

        const cacheResults = cache.get('courses');

        if (cacheResults) {
            return cacheResults;
        }
        else return this.updateCourseCache();

    }

    /**
     * @description Get a course by its ID.
     * @param {String} courseId - The ID of the course.
     * @return {Course} The course.
     */
    static async getCourseById(courseId) {
        return (this.getCourses()).find(course => course._id === courseId);
    }

    /**
     * @description Create a new course and add it to the database and cache.
     * @param {Course} course - The course to create.
     * @return {Course} The created course.
     */
    static async createCourse(course) {

        const courses = this.getCourses();

        const insertedCourse = await createDocument(CourseSchema, course);
        courses.push(
            insertedCourse
                .populate('members')
                .populate('classes')
                .populate('teacher')
                .populate('chat')
                .populate('subject')
        );
        cache.put('courses', courses, expirationTime);

        if (!this.verifyCourseInCache(insertedCourse)) throw new Error(`Course could not be created:\n${ insertedCourse }`);

        return insertedCourse;
    }

    /**
     * @description Update a course in the database and cache.
     * @param {String} courseId - The ID of the course to update.
     * @param {Course} updateCourse - The course to update.
     * @return {Course} The updated course.
     */
    static async updateCourse(courseId, updateCourse) {

        const courses = this.getCourses();

        let updatedCourse = await updateDocument(CourseSchema, courseId, updateCourse);
        updatedCourse = updatedCourse
                            .populate('members')
                            .populate('classes')
                            .populate('teacher')
                            .populate('chat')
                            .populate('subject');

        courses.splice(courses.findIndex(course => course._id === courseId), 1, updatedCourse);
        cache.put('courses', courses, expirationTime);

        if (!this.verifyCourseInCache(updatedCourse)) throw new Error(`Course could not be updated:\n${ updatedCourse }`);

        return updatedCourse;
    }

    /**
     * @description Delete a course in the database and cache.
     * @param {String} courseId - The ID of the course to update.
     * @return {Boolean} State of the deletion.
     */
    static async deleteCourse(courseId) {

        const deletedCourse = await deleteDocument(CourseSchema, courseId);
        if (!deletedCourse) throw new Error(`Course could not be deleted:\n${ courseId }`);

        const courses = this.getCourses();
        courses.splice(courses.findIndex(course => course._id === courseId), 1);
        cache.put('courses', courses, expirationTime);

        if (this.verifyCourseInCache(deletedCourse)) throw new Error(`Course could not be deleted from cache:\n${ deletedCourse }`);

        return true;
    }

    /**
     * @description Verify if a course is in the cache.
     * @param {Course} course - The course to verify.
     * @return {Boolean} True if the course is in the cache, false otherwise.
     */
    static async verifyCourseInCache(course) {
        return verifyInCache(this.getCourses(), course, this.updateCourseCache);
    }

    /**
     * Update the course cache from the database.
     * @return {Array<Course>} The updated courses.
     */
    static async updateCourseCache() {

        cache.get("courses").clear();
        const coursesFromDb = getAllDocuments(CourseSchema);

        const courses = [];
        for(const course of coursesFromDb) {
            courses.push(
                course
                    .populate('members')
                    .populate('classes')
                    .populate('teacher')
                    .populate('chat')
                    .populate('subject')
            );
        }

        cache.put('courses', courses, expirationTime);
        return courses;

    }

}