import cache from "../cache.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from "../../mongoDb/collectionAccess.js";
import GradeSchema from "../../mongoDb/schemas/GradeSchema.js";
import { verifyInCache } from "./propertyValidation.js";

const expirationTime = 10 * 60 * 1000;

/**
 * Represents a Grade.
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
        this.level = value;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(value) {
        this.classes = value;
    }

    /**
     * @description Update the cache of the grades.
     * @returns {Array<Grade>} The grades.
     * */
    static async updateGradeCache() {

        cache.get('grades').clear();
        const gradesFromDb = getAllDocuments(GradeSchema);

        const grades = [];
        for (const grade of gradesFromDb) {
            grades.push(
                this.populateGrade(grade)
            );
        }
        return grades;

    }

    /**
     * @description Get all grades.
     * @returns {Array<Grade>} The grades.
     */
    static async getGrades() {

        const cacheResult = cache.get('grades');

        if (cacheResult) {
            return cacheResult;
        } else return this.updateGradeCache();

    }

    /**
     * @description Get a grade by its id.
     * @param {String} gradeId - The id of the grade.
     * @returns {Grade} The grade.
     */
    static async getGradeById(gradeId) {
        return getDocument(GradeSchema, gradeId);
    }

    /**
     * @description Create a grade.
     * @param {Grade} grade - The grade to create.
     * @returns {Grade} The created grade.
     */
    static async createGrade(grade) {

        const grades = this.getGrades();

        const insertedGrade = await createDocument(GradeSchema, grade);
        if(!insertedGrade) throw new Error(`Failed to create grade:\n${ grade }`);

        grades.push(
            this.populateGrade(insertedGrade)
        );
        cache.put('grades', grades, expirationTime);

        if(!this.verifyGradeInCache(insertedGrade._id))

            if(!verifyInCache(cache.get('grades'), insertedGrade, this.updateGradeCache))
                throw new Error(`Failed to put grade in cache:\n${ grade }`);
    }

    /**
     * @description Update a grade.
     * @param {String} gradeId - The id of the grade.
     * @param {Grade} updateGrade - The grade to update.
     * @returns {Grade} The updated grade.
     */
    static async updateGrade(gradeId, updateGrade) {

        const grades = this.getGrades();

        let updatedGrade = await updateDocument(GradeSchema, gradeId, updateGrade);
        if(!updatedGrade) throw new Error(`Failed to update grade:\n${ updateGrade }`);

        updateGrade = this.populateGrade(updatedGrade);

        grades.splice(grades.findIndex(grade => grade._id === gradeId), 1, updateGrade);
        cache.put('grades', grades, expirationTime);

        if(!this.verifyGradeInCache(updatedGrade._id))

            if(!verifyInCache(cache.get('grades'), updatedGrade, this.updateGradeCache))
                throw new Error(`Failed to put grade in cache:\n${ updatedGrade }`);

        return updatedGrade;
    }

    /**
     * @description Delete a grade.
     * @param {String} gradeId - The id of the grade.
     * @returns {Grade} The deleted grade.
     */
    static async deleteGrade(gradeId) {

        const deletedGrade = await deleteDocument(GradeSchema, gradeId);
        if(!deletedGrade) throw new Error(`Failed to delete grade:\n${ gradeId }`);

        const grades = this.getGrades();
        grades.splice(grades.findIndex(grade => grade._id === gradeId), 1);
        cache.put('grades', grades, expirationTime);

        if(this.verifyGradeInCache(gradeId))

            if(!verifyInCache(cache.get('grades'), deletedGrade, this.updateGradeCache))
                throw new Error(`Failed to delete grade in cache:\n${ deletedGrade }`);

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
     * @returns {Grade} The populated grade.
     */
    static populateGrade(grade) {
        return grade
            .populate('classes');
    }

}