import UserSchema from "../../../mongoDb/schemas/user/UserSchema.js";
import cache from "../../cache.js";
import mongoose from "mongoose";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";

const expirationTime = 3 * 60 * 1000;

/**
 * @description Class representing a User.
 * @property {String} _id - The id of the user.
 * @property {String} first_name - The first name of the user.
 * @property {String} last_name - The last name of the user.
 * @property {String} avatar - The avatar URL of the user.
 * @property {String} type - The type of the user. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
 * @property {Array<Class>} classes - The classes of the user.
 * @property {Array<Course>} extra_courses - The extra courses of the user.
 */
export default class User {

    /**
     * User constructor
     * @param {String} first_name - The first name of the user.
     * @param {String} last_name - The last name of the user.
     * @param {String} avatar - The avatar URL of the user.
     * @param {String} type - The type of the user. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
     * @param {Array<String>} classes - The ids of the classes of the user.
     * @param {Array<String>} extra_courses - The ids of the extra courses of the user.
     */
    constructor(
        first_name,
        last_name,
        avatar,
        type,
        classes,
        extra_courses
    ) {

        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar = avatar;
        this.type = type;
        this.classes = classes;
        this.extra_courses = extra_courses;

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
        if(!['STUDENT', 'TEACHER', 'ADMIN'].includes(value)) throw new Error(`Invalid user type: ${ value }`);
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
     * @returns {Array<User>} The updated users
     */
    static async updateUserCache() {

        cache.get("users").clear();
        const usersFromDb = getAllDocuments(UserSchema);

        const users = [];
        for (const user of usersFromDb) {
            users.push(
                user
                    .populate('classes')
                    .populate('extra_courses')
            );
        }

        cache.put('users', users, expirationTime);
        return users;

    }

    /**
     * Get a user by their ID
     * @param {String} userId - The ID of the user
     * @returns {User} The user
     */
    static async getUserById(userId) {
        return (this.getUsers()).find(user => user._id === userId);
    }

    /**
     * Get all users
     * @returns {Array<User>} The users
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
     * @param {User} user - The user to create
     * @returns {User} The created user
     */
    static async createUser(user) {

        const users = this.getUsers();

        const insertedUser = await createDocument(UserSchema, user);
        users.push(
            insertedUser
                .populate('classes')
                .populate('extra_courses')
        );
        cache.put(`users`, users, expirationTime)

        if (!this.verifyUserInCache(insertedUser)) throw new Error(`Failed to put user in cache:\n${ insertedUser }`);

        return insertedUser;
    }

    /**
     * Update a user
     * @param {String} userId - The ID of the user to update.
     * @param {User} updateUser - The user to update.
     * @returns {User} The updated user.
     */
    static async updateUser(userId, updateUser) {

        const users = this.getUsers();

        let updatedUser = await updateDocument(UserSchema, userId, updateUser);
        updatedUser = updatedUser
                        .populate('classes')
                        .populate('extra_courses');

        users.splice(users.findIndex(user => user._id === userId), 1, updatedUser);
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
        users.splice(users.findIndex(user => user._id === userId), 1);
        cache.put('users', users, expirationTime);

        if (this.verifyUserInCache(deletedUser)) throw new Error(`Failed to delete user from cache:\n${ deletedUser }`);

        return true;
    }

    /**
     * Verify if a user is in the cache
     * @param {User} user - The user to verify
     * @returns {Boolean} True if the user is in the cache
     */
    static async verifyUserInCache(user) {
        return verifyInCache(this.getUsers(), user, this.updateUserCache);
    }

}