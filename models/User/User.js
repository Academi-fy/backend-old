import UserSchema from "../../MongoDB/schemas/UserSchema.js";
import cache from "../../cache.js";
import mongoose from "mongoose";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../MongoDB/collectionAccess.js";

const expirationTime = 3 * 60 * 1000;

class User {

    constructor(
        first_name = 'Vorname',
        last_name = 'Nachname',
        avatar = 'https://media.istockphoto.com/id/1147544807/de/vektor/miniaturbild-vektorgrafik.jpg?s=612x612&w=0&k=20&c=IIK_u_RTeRFyL6kB1EMzBufT4H7MYT3g04sz903fXAk=',
        type = 'STUDENT',
        classes = [],
        extra_courses = []
    ) {

        this.id = null;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar = avatar;
        this.type = type;
        this.classes = classes;
        this.extra_courses = extra_courses;

    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNotEmpty('Chat id', value);
        this.id = value;
    }

    get _first_name() {
        return this.first_name;
    }

    set _first_name(value) {
        validateNotEmpty('User first name', value);
        this.first_name = value;
    }

    get _last_name() {
        return this.last_name;
    }

    set _last_name(value) {
        validateNotEmpty('User last name', value);
        this.last_name = value;
    }

    get _avatar() {
        return this.avatar;
    }

    set _avatar(value) {
        validateNotEmpty('User avatar', value);
        this.avatar = value;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        validateNotEmpty('User type', value);
        this.type = value;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(value) {
        validateArray('User classes', value);
        this.classes = value;
    }

    get _extra_courses() {
        return this.extra_courses;
    }

    set _extra_courses(value) {
        validateArray('User extra courses', value);
        this.extra_courses = value;
    }

    static async updateUserCache() {

        cache.get("users").clear();
        const users = await getAllDocuments(UserSchema);
        cache.put('users', users, expirationTime);
        return users;

    }

    static async getUser(userId) {
        return (await this.getUsers()).find(user => user.id === userId);
    }

    static async getUsers() {

        const cacheResults = cache.get('users');

        if (cacheResults) {
            return cacheResults;
        } else return await this.updateUserCache();
    }

    static async createUser(user) {

        user.id = new mongoose.Types.ObjectId();
        const users = await this.getUsers();

        const insertedUser = await createDocument(UserSchema, user);
        users.push(insertedUser);
        cache.put(`users`, users, expirationTime)

        if (!await this.verifyUserInCache(insertedUser)) throw new Error(`Failed to put user in cache:\n${ insertedUser }`);

        return insertedUser;
    }

    static async updateUser(userId, updatedUser) {

        const users = await this.getUsers();
        users.splice(users.findIndex(user => user.id === userId), 1, updatedUser);

        await updateDocument(UserSchema, userId, updatedUser);
        cache.put('users', users, expirationTime);

        if (!await this.verifyUserInCache(updatedUser)) throw new Error(`Failed to put user in cache:\n${ updatedUser }`);

        return updatedUser;
    }

    static async deleteUser(userId) {

        const deletedUser = await deleteDocument(UserSchema, userId);
        if (!deletedUser) throw new Error(`Failed to delete user with id ${ userId }`);

        const users = await this.getUsers();
        users.splice(users.findIndex(user => user.id === userId), 1);
        cache.put('users', users, expirationTime);

        return true;
    }

    static async verifyUserInCache(user) {
        return await verifyInCache(await this.getUsers(), user, this.updateUserCache);
    }

}

export default User;
