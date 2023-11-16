import UserSchema from "../../../mongoDb/schemas/user/UserSchema.js";
import cache from "../../cache.js";
import mongoose from "mongoose";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";

const expirationTime = 3 * 60 * 1000;

class User {

    /**
     * User constructor
     * @param {String} first_name - The first name of the user
     * @param {String} last_name - The last name of the user
     * @param {String} avatar - The avatar URL of the user
     * @param {String} type - The type of the user
     * @param {Array} classes - The classes of the user
     * @param {Array} extra_courses - The extra courses of the user
     */
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
        validateNotEmpty('user first name', value);
        this.first_name = value;
    }

    get _last_name() {
        return this.last_name;
    }

    set _last_name(value) {
        validateNotEmpty('user last name', value);
        this.last_name = value;
    }

    get _avatar() {
        return this.avatar;
    }

    set _avatar(value) {
        validateNotEmpty('user avatar', value);
        this.avatar = value;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        validateNotEmpty('user type', value);
        this.type = value;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(value) {
        validateArray('user classes', value);
        this.classes = value;
    }

    get _extra_courses() {
        return this.extra_courses;
    }

    set _extra_courses(value) {
        validateArray('user extra courses', value);
        this.extra_courses = value;
    }

    /**
     * Update the user cache
     * @returns {Array} The updated users
     */
    static async updateUserCache() {

        cache.get("users").clear();
        const users = await getAllDocuments(UserSchema);
        cache.put('users', users, expirationTime);
        return users;

    }

    /**
     * Get a user by their ID
     * @param {String} userId - The ID of the user
     * @returns {Object} The user
     */
    static async getUserById(userId) {
        return (this.getUsers()).find(user => user.id === userId);
    }

    /**
     * Get all users
     * @returns {Array} The users
     */
    static async getUsers() {

        const cacheResults = cache.get('users');

        if (cacheResults) {
            return cacheResults;
        }
        else return this.updateUserCache();
    }

    /**
     * Create a new user
     * @param {Object} user - The user to create
     * @returns {Object} The created user
     */
    static async createUser(user) {

        user.id = new mongoose.Types.ObjectId();
        const users = this.getUsers();

        const insertedUser = await createDocument(UserSchema, user);
        users.push(insertedUser);
        cache.put(`users`, users, expirationTime)

        if (!this.verifyUserInCache(insertedUser)) throw new Error(`Failed to put user in cache:\n${ insertedUser }`);

        return insertedUser;
    }

    /**
     * Update a user
     * @param {String} userId - The ID of the user to update
     * @param {Object} updatedUser - The updated user data
     * @returns {Object} The updated user
     */
    static async updateUser(userId, updatedUser) {

        const users = this.getUsers();
        users.splice(users.findIndex(user => user.id === userId), 1, updatedUser);

        await updateDocument(UserSchema, userId, updatedUser);
        cache.put('users', users, expirationTime);

        if (!this.verifyUserInCache(updatedUser)) throw new Error(`Failed to update user in cache:\n${ updatedUser }`);

        return updatedUser;
    }

    /**
     * Delete a user
     * @param {String} userId - The ID of the user to delete
     * @returns {Boolean} True if the user was deleted successfully
     */
    static async deleteUser(userId) {

        const deletedUser = await deleteDocument(UserSchema, userId);
        if (!deletedUser) throw new Error(`Failed to delete user with id ${ userId }`);

        const users = this.getUsers();
        users.splice(users.findIndex(user => user.id === userId), 1);
        cache.put('users', users, expirationTime);

        if (this.verifyUserInCache(deletedUser)) throw new Error(`Failed to delete user from cache:\n${ deletedUser }`);

        return true;
    }

    /**
     * Verify if a user is in the cache
     * @param {Object} user - The user to verify
     * @returns {Boolean} True if the user is in the cache
     */
    static async verifyUserInCache(user) {
        return verifyInCache(this.getUsers(), user, this.updateUserCache);
    }

}

export default User;
