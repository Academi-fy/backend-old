/**
 * @file Grade.js - Module for representing a grade.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import BaseModel from "../BaseModel.js";
import GradeSchema from "../../mongoDb/schemas/general/GradeSchema.js";
import Class from "./Class.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";

/**
 * Represents a Grade.
 * @param {String} _id - The _id of the grade.
 * @param {Number} level - The level of the grade.
 * @param {Array<Class>} classes - The classes of the grade.
 * */
export default class Grade extends BaseModel {

    static modelName = 'Grade';
    static schema = GradeSchema;
    static cacheKey = 'grades';
    static expirationTime = 10; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'classes' }
    ];

    /**
     * @constructor Create a Grade.
     * @param {Number} level - The level of the grade.
     * @param {Array<String>} classes - The ids of the classes of the grade.
     */
    constructor(
        level,
        classes
    ) {
        super({
            level,
            classes
        });
        this.id = null;
        this._level = level;
        this._classes = classes;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }

    get classes() {
        return this._classes;
    }

    set classes(value) {
        this._classes = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

    static getMapPaths() {
        return [
            { path: 'classes', function: Class.castToClass }
        ];
    }

    static getCastPaths() {
        return [];
    }

    /**
     * Casts a plain object to an instance of the Grade class.
     * @param {Object} grade - The plain object to cast.
     * @returns {Grade} The cast instance of the Grade class.
     */
    static castToGrade(grade) {
        const { _id, level, classes } = grade;
        const castGrade = new Grade(
            level,
            classes
        );
        castGrade._id = _id.toString();
        return castGrade;
    }

    /**
     * Populates the given Grade with related data from other collections.
     * @param {Object} grade - The Grade to populate.
     * @returns {Promise<Grade>} The populated Grade.
     * @throws {DatabaseError} If the Grade could not be populated.
     */
    static async populateGrade(grade) {
        try {
            grade = await grade
                .populate([
                    {
                        path: 'classes',
                        populate: Class.getPopulationPaths()
                    }
                ]);

            if (!grade) return null;

            grade._id = grade._id.toString();

            let castGrade = this.castToGrade(grade);
            castGrade.handleProperties();
            return castGrade;
        } catch (error) {
            throw new DatabaseError(`Failed to populate grade with _id #${ grade._id }' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateGrade method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Grade>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateGrade(object);
    }

    /**
     * Converts the Chat instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Chat instance.
     * @returns {Object} An object representation of the Chat instance without underscores in the property names.
     */
    toJSON() {
        const { _id, level, classes } = this;
        return {
            _id,
            level,
            classes
        }
    }

}