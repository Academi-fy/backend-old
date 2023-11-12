import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "./propertyValidation.js";
import cache from "../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../mongoDb/collectionAccess.js";
import ClassSchema from "../../mongoDb/schemas/ClassSchema.js";
import mongoose from "mongoose";

const expirationTime = 5 * 60 * 1000;

class Class {

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

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNotEmpty('Class id', value);
        this.id = value;
    }

    get _grade() {
        return this.grade;
    }

    set _grade(value) {
        validateObject('Class grade', value);
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

    static async updateClassCache() {

        cache.get("classes").clear();
        const classes = await getAllDocuments(ClassSchema);
        cache.put('classes', classes, expirationTime);
        return classes;

    }

    static async getClasses() {

        const cacheResults = cache.get('classes');

        if (cacheResults) {
            return cacheResults;
        } else return await this.updateClassCache();

    }

    static async getClass(classId) {
        return (await this.getClasses()).find(class_ => class_.id === classId);
    }

    static async createClass(class_) {

        class_.id = new mongoose.Types.ObjectId();
        const classes = await this.getClasses();

        const insertedClass = await createDocument(ClassSchema, class_);
        classes.push(insertedClass);
        cache.put('classes', classes, expirationTime);

        if (!await this.verifyClassInCache(insertedClass)) throw new Error(`Class could not be created:\n${ insertedClass }`);

        return insertedClass;
    }

    static async updateClass(classId, updatedClass) {

        const classes = await this.getClasses();
        classes.splice(classes.findIndex(class_ => class_.id === classId), 1, updatedClass);

        await updateDocument(ClassSchema, classId, updatedClass);
        cache.put('classes', classes, expirationTime);

        if (!await this.verifyClassInCache(updatedClass)) throw new Error('Class could not be updated');

        return updatedClass;
    }

    static async deleteClass(classId) {

        const deletedClass = await deleteDocument(ClassSchema, classId);
        if (!deletedClass) throw new Error(`Failed to delete class with id ${ classId }`);

        const classes = await this.getClasses();
        classes.splice(classes.findIndex(class_ => class_.id === classId), 1);
        cache.put('classes', classes, expirationTime);

        return true;
    }

    static async verifyClassInCache(class_) {
        return await verifyInCache(await this.getClasses(), class_, this.updateClassCache);
    }

}