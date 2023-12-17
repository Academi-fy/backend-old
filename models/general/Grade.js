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
 * @param {String} _id - The id of the grade.
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
    ){
        super({
            level,
            classes
        });
        this._id = null;
        this._level = level;
        this._classes = classes;
    }

    /**
     * Casts a plain object to an instance of the Grade class.
     * @param {Object} grade - The plain object to cast.
     * @returns {Grade} The cast instance of the Grade class.
     */
    static castToGrade(grade) {
        const { id, level, classes } = grade;
        const castGrade = new Grade(
            level,
            classes
        );
        castGrade.id = id.toString();
        return castGrade;
    }

    /**
     * Converts the Chat instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Chat instance.
     * @returns {Object} An object representation of the Chat instance without underscores in the property names.
     */
    toJSON(){
        const { id, level, classes } = this;
        return {
            id,
            level,
            classes
        }
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

            grade.id = grade._id.toString();

            return this.castToGrade(grade);
        } catch (error) {
            // here grade._id is used instead of grade.id because grade is an instance of the mongoose model
            throw new DatabaseError(`Failed to populate grade with id #${grade._id}' \n${ error.stack }`);
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

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

}