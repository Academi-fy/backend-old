/**
 * @file Subject.js - Module for representing a subject.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import BaseModel from "../BaseModel.js";
import SubjectSchema from "../../mongoDb/schemas/general/SubjectSchema.js";
import Course from "./Course.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
/**
 * @description Class representing a Subject.
 * @param {String} _id - The _id of the subject.
 * @param {String} type - The type of the subject.
 * @param {String} shortName - The short name of the subject.
 * @param {Array<Course>} courses - The courses of the subject.
 */
export default class Subject extends BaseModel {

    static modelName = 'Subject';
    static schema = SubjectSchema;
    static cacheKey = 'subjects';
    static expirationTime = 10; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'courses' }
    ];


    static getMapPaths() {
        return [
            { path: 'courses', function: Course.castToCourse }
        ];
    }

    static getCastPaths(){
        return [];
    }

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
        super({
            type,
            shortName,
            courses
        });
        this.id = null;
        this._type = type;
        this._shortName = shortName;
        this._courses = courses;
    }

    /**
     * Casts a plain object to an instance of the Subject class.
     * @param {Object} subject - The plain object to cast.
     * @returns {Subject} The cast instance of the Subject class.
     */
    static castToSubject(subject) {
        const { _id, type, shortName, courses } = subject;
        const castSubject = new Subject(
            type,
            shortName,
            courses
        );
        castSubject._id = _id.toString();
        return castSubject;
    }

    /**
     * Converts the Subject instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Subject instance.
     * @returns {Object} An object representation of the Subject instance without underscores in the property names.
     */
    toJSON(){
        const { _id, type, shortName, courses } = this;
        return {
            _id,
            type,
            shortName,
            courses
        };
    }

    /**
     * Populates the given Subject with related data from other collections.
     * @param {Object} subject - The Subject to populate.
     * @returns {Promise<Subject>} The populated Subject.
     * @throws {DatabaseError} If the Subject could not be populated.
     */
    static async populateSubject(subject) {
        try {
            subject = await subject
                .populate([
                    {
                        path: 'courses',
                        populate: Course.getPopulationPaths()
                    }
                ]);

            subject._id = subject._id.toString();

            let castSubject = this.castToSubject(subject);
            castSubject.handleProperties();
            return castSubject;
        } catch (error) {
            throw new DatabaseError(`Failed to populate subject with _id #${subject._id}' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateSubject method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Subject>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateSubject(object);
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get shortName() {
        return this._shortName;
    }

    set shortName(value) {
        this._shortName = value;
    }

    get courses() {
        return this._courses;
    }

    set courses(value) {
        this._courses = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

}