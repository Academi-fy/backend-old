/**
 * @file School.js - Module for representing a school.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import BaseModel from "../../BaseModel.js";
import SchoolSchema from "../../../mongoDb/schemas/general/setup/SchoolSchema.js";
import DatabaseError from "../../../httpServer/errors/DatabaseError.js";
import Event from "../../events/Event.js";
import Message from "../../messages/Message.js";
import Club from "../../clubs/Club.js";
import Grade from "../Grade.js";
import Course from "../Course.js";
import User from "../../users/User.js";
import Class from "../Class.js";
import Subject from "../Subject.js";
import Blackboard from "../Blackboard.js";

/**
 * @description Class representing a school.
 * @param {String} _id - The _id of the school.
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
export default class School extends BaseModel {

    static modelName = 'School';
    static schema = SchoolSchema;
    static cacheKey = 'schools';
    static expirationTime = 15; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'grades' },
        { path: 'courses' },
        { path: 'members' },
        { path: 'classes' },
        { path: 'messages' },
        { path: 'subjects' },
        { path: 'clubs' },
        { path: 'events' },
        { path: 'blackboards' }
    ];

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
    ){
        super({
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
        });
        this.id = null;
        this._name = name;
        this._grades = grades;
        this._courses = courses;
        this._members = members;
        this._classes = classes;
        this._messages = messages;
        this._subjects = subjects;
        this._clubs = clubs;
        this._events = events;
        this._blackboards = blackboards;
    }

    /**
     * Casts a plain object to an instance of the school class.
     * @param {Object} school - The plain object to cast.
     * @returns {School} The cast instance of the School class.
     */
    static castToSchool(school) {
        const { _id, name, grades, courses, members, classes, messages, subjects, clubs, events, blackboards } = school;
        const castSchool = new School(
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
        );
        castSchool._id = _id.toString();
        return castSchool;
    }

    /**
     * Converts the School instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a School instance.
     * @returns {Object} An object representation of the School instance without underscores in the property names.
     */
    toJSON(){
        const { _id, name, grades, courses, members, classes, messages, subjects, clubs, events, blackboards } = this;
        return {
            _id,
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
        };
    }

    /**
     * Populates the given School with related data from other collections.
     * @param {Object} school - The School to populate.
     * @returns {Promise<School>} The populated School.
     * @throws {DatabaseError} If the School could not be populated.
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
            school._id = school._id.toString();

            return this.castToSchool(school);
        } catch (error) {
            // here school._id is used instead of school._id because school is an instance of the mongoose model
            throw new DatabaseError(`Failed to populate school with _id #${school._id}' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateSchool method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<School>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateSchool(object);
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get grades() {
        return this._grades;
    }

    set grades(value) {
        this._grades = value;
    }

    get courses() {
        return this._courses;
    }

    set courses(value) {
        this._courses = value;
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

    get messages() {
        return this._messages;
    }

    set messages(value) {
        this._messages = value;
    }

    get subjects() {
        return this._subjects;
    }

    set subjects(value) {
        this._subjects = value;
    }

    get clubs() {
        return this._clubs;
    }

    set clubs(value) {
        this._clubs = value;
    }

    get events() {
        return this._events;
    }

    set events(value) {
        this._events = value;
    }

    get blackboards() {
        return this._blackboards;
    }

    set blackboards(value) {
        this._blackboards = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

}