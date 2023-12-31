/**
 * @file Course.js - Module for representing a course.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import BaseModel from "../BaseModel.js";
import CourseSchema from "../../mongoDb/schemas/general/CourseSchema.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Class from "./Class.js";
import Chat from "../messages/Chat.js";
import Subject from "./Subject.js";
import User from "../users/User.js";

/**
 * @description Class representing a Course.
 * @param {String} _id - The _id of the course.
 * @param {Array<User>} members - The members of the course.
 * @param {Array<Class>} classes - The classes in the course.
 * @param {User} teacher - The teacher of the course.
 * @param {Chat} chat - The chat of the course.
 * @param {Subject} subject - The subject of the course.
 */
export default class Course extends BaseModel {

    static modelName = 'Course';
    static schema = CourseSchema;
    static cacheKey = 'courses';
    static expirationTime = 5; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'members' },
        { path: 'classes' },
        { path: 'teacher' },
        { path: 'chat' },
        { path: 'subject' }
    ];

    /**
     * @description Create a course.
     * @param {Array} members - The members of the course.
     * @param {Array<String>} classes - The classes in the course.
     * @param {String} teacher - The _id of the teacher of the course.
     * @param {String} chat - The _id of the chat of the course.
     * @param {String} subject - The _id of the subject of the course.
     */
    constructor(
        members,
        classes,
        teacher,
        chat,
        subject
    ) {
        super({
            members,
            classes,
            teacher,
            chat,
            subject
        });
        this.id = null;
        this._members = members;
        this._classes = classes;
        this._teacher = teacher;
        this._chat = chat;
        this._subject = subject;
    }

    get members() {
        return this._members;
    }

    set members(value) {
        this._members = value;
    }

    get classes() {
        return this._classes;
    }

    set classes(value) {
        this._classes = value;
    }

    get teacher() {
        return this._teacher;
    }

    set teacher(value) {
        this._teacher = value;
    }

    get chat() {
        return this._chat;
    }

    set chat(value) {
        this._chat = value;
    }

    get subject() {
        return this._subject;
    }

    set subject(value) {
        this._subject = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

    static getMapPaths() {
        return [
            { path: 'members', function: User.castToUser },
            { path: 'classes', function: Class.castToClass },
        ];
    }

    static getCastPaths() {
        return [
            { path: 'teacher', function: User.castToUser },
            { path: 'chat', function: Chat.castToChat },
            { path: 'subject', function: Subject.castToSubject }
        ];
    }

    /**
     * Casts a plain object to an instance of the Course class.
     * @param {Object} course - The plain object to cast.
     * @returns {Course} The cast instance of the Course class.
     */
    static castToCourse(course) {
        if (!course) return null;
        const { _id, members, classes, teacher, chat, subject } = course;
        const castCourse = new Course(
            members,
            classes,
            teacher,
            chat,
            subject
        );
        castCourse._id = _id.toString();
        return castCourse;
    }

    /**
     * Populates the given Course with related data from other collections.
     * @param {Object} course - The Course to populate.
     * @returns {Promise<Course>} The populated Course.
     * @throws {DatabaseError} If the Course could not be populated.
     */
    static async populateCourse(course) {
        try {
            course = await course
                .populate([
                    {
                        path: 'members',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'classes',
                        populate: Class.getPopulationPaths()
                    },
                    {
                        path: 'teacher',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'subject',
                        populate: Subject.getPopulationPaths()
                    },
                    {
                        path: 'chat',
                        populate: Chat.getPopulationPaths()
                    },
                ]);

            course._id = course._id.toString();

            let castCourse = this.castToCourse(course);
            castCourse.handleProperties();
            return castCourse;
        } catch (error) {
            throw new DatabaseError(`Failed to populate course with _id '${ course._id }' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateCourse method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Course>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateCourse(object);
    }

    /**
     * Converts the Course instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Course instance.
     * @returns {Object} An object representation of the Course instance without underscores in the property names.
     */
    toJSON() {
        const { _id, members, classes, teacher, chat, subject } = this;
        return {
            _id,
            members,
            classes,
            teacher,
            chat,
            subject
        };
    }


}