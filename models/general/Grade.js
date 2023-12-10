/**
 * @file Grade.js - Module for representing a grade.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import cache from "../../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import GradeSchema from "../../../mongoDb/schemas/general/GradeSchema.js";
import { validateArray, validateNumber, verifyInCache } from "../propertyValidation.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";
import Class from "./Class.js";

const expirationTime = 10 * 60 * 1000;

/**
 * Represents a Grade.
 * @param {String} _id - The id of the grade.
 * @param {Number} level - The level of the grade.
 * @param {Array<Class>} classes - The classes of the grade.
 * */
export default class Grade {

    /**
     * @constructor Create a Grade.
     * @param {Number} level - The level of the grade.
     * @param {Array<String>} classes - The ids of the classes of the grade.
     */
    constructor(
        level,
        classes
    ) {
        this.level = level;
        this.classes = classes;
    }

    get _level() {
        return this.level;
    }

    set _level(value) {
        validateNumber('Grade level', value);
        this.level = value;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(value) {
        validateArray('Grade classes', value);
        this.classes = value;
    }

    /**
     * @description Update the cache of the grades.
     * @returns {Promise<Array<Grade>>} The grades.
     * */
    static async updateGradeCache() {

        cache.del('grades');
        const gradesFromDb = await getAllDocuments(GradeSchema);

        const grades = [];
        for (const grade of gradesFromDb) {
            grades.push(
                await this.populateGrade(grade)
            );
        }
        return grades;

    }

    /**
     * @description Get all grades.
     * @returns {Promise<Array<Grade>>} The grades.
     */
    static async getAllGrades() {

        const cacheResult = cache.get('grades');

        if (cacheResult) {
            return cacheResult;
        }
        else return this.updateGradeCache();

    }

    /**
     * @description Get a grade by its id.
     * @param {String} gradeId - The id of the grade.
     * @returns {Promise<Grade>} The grade.
     * @throws {RetrievalError} When the grade could not be retrieved.
     */
    static async getGradeById(gradeId) {

        const grades = await this.getAllGrades();

        const grade = grades.find(grade => grade._id === gradeId);
        if (!grade) throw new RetrievalError(`Failed to get grade by id:\n${ gradeId }`);

        return grade;

    }

    /**
     * @description Get all grades by a rule.
     * @param {String} rule - The rule to find the grades by.
     * @returns {Promise<Array<Grade>>} The matching grades.
     * @throws {RetrievalError} When the grades could not be retrieved.
     * */
    static async getAllGradesByRule(rule) {

        const grades = await this.getAllGrades();

        const matchingGrades = findByRule(grades, rule);
        if (!matchingGrades) throw new RetrievalError(`Failed to get grade by rule:\n${ rule }`);

        return matchingGrades;

    }

    /**
     * @description Create a grade.
     * @param {Grade} grade - The grade to create.
     * @returns {Promise<Grade>} The created grade.
     * @throws {DatabaseError} When the grade could not be created.
     * @throws {CacheError} When the grade could not be put in the cache.
     */
    static async createGrade(grade) {

        const grades = await this.getAllGrades();

        const insertedGrade = await createDocument(GradeSchema, grade);
        if (!insertedGrade) throw new DatabaseError(`Failed to create grade:\n${ grade }`);

        grades.push(
            await this.populateGrade(insertedGrade)
        );
        cache.put('grades', grades, expirationTime);

        if (!this.verifyGradeInCache(insertedGrade._id))

            if (!await verifyInCache(cache.get('grades'), insertedGrade, this.updateGradeCache))
                throw new CacheError(`Failed to put grade in cache:\n${ grade }`);
    }

    /**
     * @description Update a grade.
     * @param {String} gradeId - The id of the grade.
     * @param {Grade} updateGrade - The grade to update.
     * @returns {Promise<Grade>} The updated grade.
     * @throws {DatabaseError} When the grade could not be updated.
     * @throws {CacheError} When the grade could not be put in the cache.
     */
    static async updateGrade(gradeId, updateGrade) {

        const grades = await this.getAllGrades();

        let updatedGrade = await updateDocument(GradeSchema, gradeId, updateGrade);
        if (!updatedGrade) throw new DatabaseError(`Failed to update grade:\n${ updateGrade }`);

        updateGrade = await this.populateGrade(updatedGrade);

        grades.splice(grades.findIndex(grade => grade._id === gradeId), 1, updateGrade);
        cache.put('grades', grades, expirationTime);

        if (!this.verifyGradeInCache(updatedGrade._id))

            if (!await verifyInCache(cache.get('grades'), updatedGrade, this.updateGradeCache))
                throw new CacheError(`Failed to put grade in cache:\n${ updatedGrade }`);

        return updatedGrade;
    }

    /**
     * @description Delete a grade.
     * @param {String} gradeId - The id of the grade.
     * @returns {Promise<Grade>} The deleted grade.
     * @throws {DatabaseError} When the grade could not be deleted.
     * @throws {CacheError} When the grade could not be deleted from the cache.
     */
    static async deleteGrade(gradeId) {

        const deletedGrade = await deleteDocument(GradeSchema, gradeId);
        if (!deletedGrade) throw new DatabaseError(`Failed to delete grade:\n${ gradeId }`);

        const grades = await this.getAllGrades();
        grades.splice(grades.findIndex(grade => grade._id === gradeId), 1);
        cache.put('grades', grades, expirationTime);

        if (this.verifyGradeInCache(gradeId))

            if (!await verifyInCache(cache.get('grades'), deletedGrade, this.updateGradeCache))
                throw new CacheError(`Failed to delete grade in cache:\n${ deletedGrade }`);

        return deletedGrade;
    }

    /**
     * @description Verify if a grade is in the cache.
     * @param {String} gradeId - The id of the grade.
     * @returns {Boolean} If the grade is in the cache.
     */
    static verifyGradeInCache(gradeId) {

        const cacheResult = cache.get('grades').find(grade => grade._id === gradeId);

        return Boolean(cacheResult);

    }

    /**
     * @description Populate a grade.
     * @param {Object} grade - The grade to populate.
     * @returns {Promise<Grade>} The populated grade.
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

            const populatedGrade = new Grade(
                grade.level,
                grade.classes
            );
            populatedGrade._id = grade._id.toString();

            return populatedGrade;

        } catch (error) {
            throw new DatabaseError(`Failed to populate event:\n${ grade }\n${ error }`);
        }

    }

    static getPopulationPaths(){
        return [
            { path: 'classes' }
        ]
    }

}