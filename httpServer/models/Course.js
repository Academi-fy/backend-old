import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "./propertyValidation.js";
import cache from "../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../mongoDb/collectionAccess.js";
import CourseSchema from "../../mongoDb/schemas/CourseSchema.js";
import mongoose from "mongoose";

const expirationTime = 5 * 60 * 1000;

class Course {

    constructor(
        members = [],
        classes = [],
        teacher = {},
        chat = {},
        subject = {}
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

    static async getCourses() {

        const cacheResults = cache.get('courses');

        if (cacheResults) {
            return cacheResults;
        } else return await this.updateCourseCache();

    }

    static async getCourse(courseId) {
        return (await this.getCourses()).find(course => course.id === courseId);
    }

    static async createCourse(course) {

        course.id = new mongoose.Types.ObjectId();
        const courses = await this.getCourses();

        const insertedCourse = await createDocument(CourseSchema, course);
        courses.push(insertedCourse);
        cache.put('courses', courses, expirationTime);

        if (!await this.verifyCourseInCache(insertedCourse)) throw new Error(`Course could not be created:\n${ insertedCourse }`);

        return insertedCourse;
    }

    static async updateCourse(courseId, updatedCourse) {

        const courses = await this.getCourses();
        courses.splice(courses.findIndex(course => course.id === courseId), 1, updatedCourse);

        await updateDocument(CourseSchema, courseId, updatedCourse);
        cache.put('courses', courses, expirationTime);

        if (!await this.verifyCourseInCache(updatedCourse)) throw new Error(`Course could not be updated:\n${ updatedCourse }`);

        return updatedCourse;
    }

    static async deleteCourse(courseId) {

        const deletedCourse = await deleteDocument(CourseSchema, courseId);
        if (!deletedCourse) throw new Error(`Course could not be deleted:\n${ courseId }`);

        const courses = await this.getCourses();
        courses.splice(courses.findIndex(course => course.id === courseId), 1);
        cache.put('courses', courses, expirationTime);

        if (await this.verifyCourseInCache(deletedCourse)) throw new Error(`Course could not be deleted from cache:\n${ deletedCourse }`);

        return deletedCourse;
    }

    static async verifyCourseInCache(course) {
        return await verifyInCache(await this.getCourses(), course, this.updateCourseCache);
    }

    static async updateCourseCache() {

        cache.get("courses").clear();
        const courses = await getAllDocuments(CourseSchema);
        cache.put('courses', courses, expirationTime);
        return courses;

    }

}

export default Course;