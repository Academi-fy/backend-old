/**
 * @file Class.js - Module for representing a school class.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import ClassSchema from "../../../mongoDb/schemas/general/ClassSchema.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

// Cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * @description Class representing a school class.
 * @param {String} _id - The id of the class.
 * @param {Grade} grade - The grade of the class.
 * @param {Array<Course>} courses - The courses of the class.
 * @param {Array<User>} members - The members of the class.
 * @param {String} specified_grade - The specified grade of the class.
 */
export default class Class {

    /**
     * @description Create a class.
     * @param {String} grade - The id of the grade of the class.
     * @param {Array<String>} courses - The ids of the courses of the class.
     * @param {Array<String>} members - The ids of the members of the class.
     * @param {String} specified_grade - The specified grade of the class.
     */
    constructor(
        grade,
        courses,
        members,
        specified_grade
    ) {
        this.grade = grade;
        this.courses = courses;
        this.members = members;
        this.specified_grade = specified_grade;
    }

    get _grade() {
        return this.grade;
    }

    set _grade(value) {
        validateNotEmpty('Class grade', value);
        this.grade = value;
    }

    get _courses() {
        return this.courses;
    }

    set _courses(value) {
        validateArray('Class courses', value);
        this.courses = value;
    }

    get _members() {
        return this.members;
    }

    set _members(value) {
        validateArray('Class members', value);
        this.members = value;
    }

    get _specified_grade() {
        return this.specified_grade;
    }

    set _specified_grade(value) {
        validateNotEmpty('Class specified grade', value);
        this.specified_grade = value;
    }

    /**
     * @description Update the class cache.
     * @return {Promise<Array<Class>>} The updated classes.
     */
    static async updateClassCache() {

        cache.del('classes');
        const classesFromDb = await getAllDocuments(ClassSchema);

        const classes = [];
        for (const class_ of classesFromDb) {
            classes.push(
                await this.populateClass(class_)
            )
        }

        cache.put('classes', classes, expirationTime);
        return classes;

    }

    /**
     * @description Get all classes.
     * @return {Promise<Array<Class>>} The classes.
     */
    static async getAllClasses() {

        const cacheResults = cache.get('classes');

        if (cacheResults) {
            return cacheResults;
        }
        else return await this.updateClassCache();

    }

    /**
     * @description Get a class by id.
     * @param {String} classId - The id of the class.
     * @returns {Promise<Class>} The class.
     * @throws {RetrievalError} When no class matches the id.
     */
    static async getClassById(classId) {

        const classes = await this.getAllClasses();

        const class_ = classes.find(class__ => class__._id === classId);
        if (!class_) throw new RetrievalError(`Failed to find class with id ${ classId }`);

        return class_;

    }

    /**
     * @description Get classes by a rule.
     * @param {Object} rule - The rule to find classes by.
     * @returns {Promise<Array<Class>>} The matching classes.
     * @throws {RetrievalError} When no classes match the rule.
     */
    static async getAllClassesByRule(rule) {

        const classes = await this.getAllClasses();

        const matchingClasses = findByRule(classes, rule);
        if (!matchingClasses) throw new RetrievalError(`Failed to find classes matching rule:\n${ rule }`);

        return matchingClasses;

    }

    /**
     * @description Create a class.
     * @param {Class} class_ - The class to create.
     * @return {Promise<Class>} The created class.
     * @throws {DatabaseError} When the class fails to be created.
     * @throws {CacheError} When the class fails to be put in cache.
     */
    static async createClass(class_) {

        const classes = await this.getAllClasses();

        const insertedClass = await createDocument(ClassSchema, class_);
        if (!insertedClass) throw new DatabaseError(`Failed to create class:\n${ class_ }`);

        classes.push(
            await this.populateClass(insertedClass)
        );
        cache.put('classes', classes, expirationTime);

        if (!this.verifyClassInCache(insertedClass))

            if (!await verifyInCache(cache.get('classes'), insertedClass, this.updateClassCache))
                throw new CacheError(`Failed to put class in cache:\n${ insertedClass }`);

        return insertedClass;
    }

    /**
     * @description Update a class.
     * @param {String} classId - The id of the class to update.
     * @param {Class} updateClass - The updated class.
     * @return {Promise<Class>} The updated class.
     * @throws {DatabaseError} When the class fails to be updated.
     * @throws {CacheError} When the class fails to be updated in cache.
     */
    static async updateClass(classId, updateClass) {

        const classes = await this.getAllClasses();

        let updatedClass = await updateDocument(ClassSchema, classId, updateClass);
        if (!updatedClass) throw new DatabaseError(`Failed to update class:\n${ updateClass }`);

        updatedClass = await this.populateClass(updatedClass);

        classes.splice(classes.findIndex(class_ => class_._id === classId), 1, updatedClass);
        cache.put('classes', classes, expirationTime);

        if (!this.verifyClassInCache(updatedClass))

            if (!await verifyInCache(cache.get('classes'), updatedClass, this.updateClassCache))
                throw new CacheError(`Failed to update class in cache:\n${ updatedClass }`);

        return updatedClass;
    }

    /**
     * @description Delete a class.
     * @param {String} classId - The id of the class to delete.
     * @return {Promise<Boolean>} The status of the deletion.
     * @throws {DatabaseError} When the class fails to be deleted.
     * @throws {CacheError} When the class fails to be deleted from cache.
     */
    static async deleteClass(classId) {

        const deletedClass = await deleteDocument(ClassSchema, classId);
        if (!deletedClass) throw new DatabaseError(`Failed to delete class with id ${ classId }`);

        const classes = await this.getAllClasses();
        classes.splice(classes.findIndex(class_ => class_._id === classId), 1);
        cache.put('classes', classes, expirationTime);

        if (this.verifyClassInCache(deletedClass))
            throw new CacheError(`Failed to delete class from cache:\n${ deletedClass }`);

        return true;
    }

    /**
     * @description Verify a class in cache.
     * @param {Class} class_ - The class to verify.
     * @return {Boolean} The status of the verification.
     */
    static async verifyClassInCache(class_) {
        const cacheResult = cache.get('classes').find(class__ => class__._id === class_._id);

        return Boolean(cacheResult);
    }

    /**
     * @description Populate a class.
     * @param {Object} class_ - The class to populate.
     * @return {Class} The populated class.
     * */
    static async populateClass(class_) {

        try {

            class_ = await class_
                .populate([
                    {
                        path: 'grade',
                        populate: [
                            { path: 'classes' }
                        ]
                    },
                    {
                        path: 'course',
                        populate: [
                            { path: 'members' },
                            { path: 'classes' },
                            { path: 'teacher' },
                            { path: 'chat' },
                            { path: 'subject' },
                        ]
                    },
                    {
                        path: 'members',
                        populate: [
                            { path: 'classes' },
                            { path: 'extra_courses' }
                        ]
                    },
                ]);

            const populatedClass = new Class(
                class_.grade,
                class_.courses,
                class_.members,
                class_.specified_grade
            );
            populatedClass._id = class_._id;

            return populatedClass;

        } catch (error) {
            throw new DatabaseError(`Failed to populate event:\n${ class_ }\n${ error }`);
        }

    }

}