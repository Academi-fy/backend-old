/**
 * @file Class.js - Module for representing a school class.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import BaseModel from "../BaseModel.js";
import ClassSchema from "../../mongoDb/schemas/general/ClassSchema.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Grade from "./Grade.js";
import Course from "./Course.js";
import User from "../users/User.js";
/**
 * @description Class representing a school class.
 * @param {String} _id - The _id of the class.
 * @param {Grade} grade - The grade of the class.
 * @param {Array<Course>} courses - The courses of the class.
 * @param {Array<User>} members - The members of the class.
 * @param {String} specifiedGrade - The specified grade of the class.
 */
export default class Class extends BaseModel {

    static modelName = 'Class';
    static schema = ClassSchema;
    static cacheKey = 'classes';
    static expirationTime = 5; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'grade' },
        { path: 'courses' },
        { path: 'members' }
    ];

    static getMapPaths() {
        return [
            { path: 'courses', function: Course.castToCourse },
            { path: 'members', function: User.castToUser }
        ];
    }

    static getCastPaths() {
        return [
            { path: 'grade', function: Grade.castToGrade }
        ];
    }

    /**
     * @description Create a class.
     * @param {String} grade - The _id of the grade of the class.
     * @param {Array<String>} courses - The ids of the courses of the class.
     * @param {Array<String>} members - The ids of the members of the class.
     * @param {String} specifiedGrade - The specified grade of the class.
     */
    constructor(
        grade,
        courses,
        members,
        specifiedGrade
    ) {
        super({
            grade,
            courses,
            members,
            specifiedGrade
        });
        this.id = null;
        this._grade = grade;
        this._courses = courses;
        this._members = members;
        this._specifiedGrade = specifiedGrade;
    }

    /**
     * Casts a plain object to an instance of the Class class.
     * @param {Object} class_ - The plain object to cast.
     * @returns {Class} The cast instance of the Class class.
     */
    static castToClass(class_) {
        if(!class_) throw new DatabaseError('Failed to cast to Course: course is undefined');
        const { _id, grade, courses, members, specifiedGrade } = class_;
        const castClass = new Class(
            grade,
            courses,
            members,
            specifiedGrade
        );
        castClass._id = _id.toString();
        return castClass;
    }

    /**
     * Converts the Class instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Class instance.
     * @returns {Object} An object representation of the Class instance without underscores in the property names.
     */
    toJSON(){
        const { _id, grade, courses, members, specifiedGrade } = this;
        return {
            _id,
            grade,
            courses,
            members,
            specifiedGrade
        };
    }

    /**
     * Populates the given Class with related data from other collections.
     * @param {Object} class_ - The Class to populate.
     * @returns {Promise<Class>} The populated Class.
     * @throws {DatabaseError} If the Class could not be populated.
     */
    static async populateClass(class_) {
        try {
            class_ = await class_
                .populate([
                    {
                        path: 'grade',
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
                ]);

            if(!class_) return null;

            class_._id = class_._id.toString();

            let castClass = this.castToClass(class_);
            castClass.handleProperties();
            return castClass;
        } catch (error) {
            throw new DatabaseError(`Failed to populate class with _id #${class_._id}' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateClass method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Class>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateClass(object);
    }

    get grade() {
        return this._grade;
    }

    set grade(value) {
        this._grade = value;
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

    get specifiedGrade() {
        return this._specifiedGrade;
    }

    set specifiedGrade(value) {
        this._specifiedGrade = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

}