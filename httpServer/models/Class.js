import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "./propertyValidation.js";
import cache from "../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../mongoDb/collectionAccess.js";
import ClassSchema from "../../mongoDb/schemas/ClassSchema.js";
import mongoose from "mongoose";

// Cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * Class representing a school class.
 */
class Class {

    /**
     * Create a class.
     * @param {Object} grade - The grade of the class.
     * @param {Array} courses - The courses of the class.
     * @param {Array} members - The members of the class.
     * @param {string} specified_grade - The specified grade of the class.
     */
    constructor(
        grade = {},
        courses = [],
        members = [],
        specified_grade = ""
    ) {

        this.id = null;
        this.grade = grade;
        this.courses = courses;
        this.members = members;
        this.specified_grade = specified_grade;
    }

    // Getters and setters for class properties with validation

    /**
     * Get the class id.
     * @return {string} The class id.
     */
    get _id() {
        return this.id;
    }

    /**
     * Set the class id.
     * @param {string} value - The class id.
     */
    set _id(value) {
        validateNotEmpty('Class id', value);
        this.id = value;
    }

    /**
     * Get the class grade.
     * @return {Object} The class grade.
     */
    get _grade() {
        return this.grade;
    }

    /**
     * Set the class grade.
     * @param {Object} value - The class grade.
     */
    set _grade(value) {
        validateObject('Class grade', value);
        this.grade = value;
    }

    /**
     * Get the class courses.
     * @return {Array} The class courses.
     */
    get _courses() {
        return this.courses;
    }

    /**
     * Set the class courses.
     * @param {Array} value - The class courses.
     */
    set _courses(value) {
        validateArray('Class courses', value);
        this.courses = value;
    }

    /**
     * Get the class members.
     * @return {Array} The class members.
     */
    get _members() {
        return this.members;
    }

    /**
     * Set the class members.
     * @param {Array} value - The class members.
     */
    set _members(value) {
        validateArray('Class members', value);
        this.members = value;
    }

    /**
     * Get the class specified grade.
     * @return {string} The class specified grade.
     */
    get _specified_grade() {
        return this.specified_grade;
    }

    /**
     * Set the class specified grade.
     * @param {string} value - The class specified grade.
     */
    set _specified_grade(value) {
        validateNotEmpty('Class specified grade', value);
        this.specified_grade = value;
    }

    // Static methods for class operations

    /**
     * Update the class cache.
     * @return {Array} The updated classes.
     */
    static async updateClassCache() {

        cache.get("classes").clear();
        const classes = await getAllDocuments(ClassSchema);
        cache.put('classes', classes, expirationTime);
        return classes;

    }

    /**
     * Get all classes.
     * @return {Array} The classes.
     */
    static async getClasses() {

        const cacheResults = cache.get('classes');

        if (cacheResults) {
            return cacheResults;
        }
        else return this.updateClassCache();

    }

    /**
     * Get a class by id.
     * @param {string} classId - The id of the class.
     * @return {Object} The class.
     */
    static async getClassById(classId) {
        return (this.getClasses()).find(class_ => class_.id === classId);
    }

    /**
     * Create a class.
     * @param {Object} class_ - The class to create.
     * @return {Object} The created class.
     */
    static async createClass(class_) {

        class_.id = new mongoose.Types.ObjectId();
        const classes = this.getClasses();

        const insertedClass = await createDocument(ClassSchema, class_);
        classes.push(insertedClass);
        cache.put('classes', classes, expirationTime);

        if (!this.verifyClassInCache(insertedClass)) throw new Error(`Failed to put class in cache:\n${ insertedClass }`);

        return insertedClass;
    }

    /**
     * Update a class.
     * @param {string} classId - The id of the class to update.
     * @param {Object} updatedClass - The updated class.
     * @return {Object} The updated class.
     */
    static async updateClass(classId, updatedClass) {

        const classes = this.getClasses();
        classes.splice(classes.findIndex(class_ => class_.id === classId), 1, updatedClass);

        await updateDocument(ClassSchema, classId, updatedClass);
        cache.put('classes', classes, expirationTime);

        if (!this.verifyClassInCache(updatedClass)) throw new Error(`Failed to update class in cache:\n${ updatedClass }`);

        return updatedClass;
    }

    /**
     * Delete a class.
     * @param {string} classId - The id of the class to delete.
     * @return {boolean} The status of the deletion.
     */
    static async deleteClass(classId) {

        const deletedClass = await deleteDocument(ClassSchema, classId);
        if (!deletedClass) throw new Error(`Failed to delete class with id ${ classId }`);
        const classes = this.getClasses();
        classes.splice(classes.findIndex(class_ => class_.id === classId), 1);
        cache.put('classes', classes, expirationTime);

        if (this.verifyClassInCache(deletedClass)) throw new Error(`Failed to delete class from cache:\n${ deletedClass }`);

        return true;
    }

    /**
     * Verify a class in cache.
     * @param {Object} class_ - The class to verify.
     * @return {boolean} The status of the verification.
     */
    static async verifyClassInCache(class_) {
        return await verifyInCache(this.getClasses(), class_, this.updateClassCache);
    }

}