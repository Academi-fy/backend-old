import UserSchema from "../../../mongoDb/schemas/user/UserSchema.js";
import cache from "../../cache.js";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import mongoose from "mongoose";

const expirationTime = 3 * 60 * 1000;

/**
 * @description Class representing a User.
 * @param {String} id - The id of the users.
 * @param {String} first_name - The first name of the users.
 * @param {String} last_name - The last name of the users.
 * @param {String} avatar - The avatar URL of the users.
 * @param {String} type - The type of the users. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
 * @param {Array<Class>} classes - The classes of the users.
 * @param {Array<Course>} extra_courses - The extra courses of the users.
 */
export default class User {

    /**
     * User constructor
     * @param {String} id - The id of the users.
     * @param {String} first_name - The first name of the users.
     * @param {String} last_name - The last name of the users.
     * @param {String} avatar - The avatar URL of the users.
     * @param {String} type - The type of the users. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
     * @param {Array<String>} classes - The ids of the classes of the users.
     * @param {Array<String>} extra_courses - The ids of the extra courses of the users.
     */
    constructor(
        id,
        first_name,
        last_name,
        avatar,
        type,
        classes,
        extra_courses
    ) {

        this.id = id;
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
        validateNotEmpty('users id', value);
        this.id = value;
    }

    get _first_name() {
        return this.first_name;
    }

    set _first_name(value) {
        validateNotEmpty('users first name', value);
        this.first_name = value;
    }

    get _last_name() {
        return this.last_name;
    }

    set _last_name(value) {
        validateNotEmpty('users last name', value);
        this.last_name = value;
    }

    get _avatar() {
        return this.avatar;
    }

    set _avatar(value) {
        validateNotEmpty('users avatar', value);
        this.avatar = value;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        validateNotEmpty('users type', value);
        if (![ 'STUDENT', 'TEACHER', 'ADMIN' ].includes(value)) throw new Error(`Invalid user type: ${ value }`);
        this.type = value;
    }

    get _classes() {
        return this.classes;
    }

    set _classes(value) {
        validateArray('users classes', value);
        this.classes = value;
    }

    get _extra_courses() {
        return this.extra_courses;
    }

    set _extra_courses(value) {
        validateArray('users extra courses', value);
        this.extra_courses = value;
    }

    /**
     * Update the users cache
     * @returns {Promise<Array<User>>} The updated users
     */
    static async updateUserCache() {

        cache.del('users');
        const usersFromDb = await getAllDocuments(UserSchema);

        const users = [];
        for (let user of usersFromDb) {

            user = this.populateUser(user)

            users.push(
                new User(
                    user.id,
                    user.first_name,
                    user.last_name,
                    user.avatar,
                    user.type,
                    user.classes,
                    user.extra_courses
                )
            );
        }

        cache.put('users', users, expirationTime);
        return users;

    }

    /**
     * Get a users by their ID
     * @param {String} userId - The ID of the users
     * @returns {Promise<User>} The users
     */
    static async getUserById(userId) {

        const users = await this.getUsers();

        let user = users.find(user => user.id === userId);
        if (!user) throw new Error(`User with id ${ userId } not found`);

        user = this.populateUser(user);
        user = new User(
            user.id,
            user.first_name,
            user.last_name,
            user.avatar,
            user.type,
            user.classes,
            user.extra_courses
        );

        return user;

    }

    static async getUserByRule(rule) {

        const users = await this.getUsers();

        let user = users.find(user => user[Object.keys(rule)[0]] === Object.values(rule)[0]);
        if (!user) throw new Error(`Failed to get user by rule:\n${ rule }`);

        user = this.populateUser(user);
        user = new User(
            user.id,
            user.first_name,
            user.last_name,
            user.avatar,
            user.type,
            user.classes,
            user.extra_courses
        );

        return user;

    }

    /**
     * Get all users
     * @returns {Promise<Array<User>>} The users
     */
    static async getUsers() {

        const cacheResults = cache.get('users');

        if (cacheResults) {
            return cacheResults;
        }
        else return this.updateUserCache();

    }

    /**
     * Create a new users
     * @param {User} user - The users to create
     * @returns {Promise<User>} The created users
     */
    static async createUser(user) {

        const users = await this.getUsers();

        let insertedUser = await createDocument(UserSchema, { ...user, id: new mongoose.Types.ObjectId() });
        if (!insertedUser) throw new Error(`Failed to create user:\n${ user }`);

        insertedUser = this.populateUser(insertedUser);
        insertedUser = new User(
            insertedUser.id,
            insertedUser.first_name,
            insertedUser.last_name,
            insertedUser.avatar,
            insertedUser.type,
            insertedUser.classes,
            insertedUser.extra_courses
        )

        users.push(
            insertedUser
        );
        cache.put(`users`, users, expirationTime);

        if (!this.verifyUserInCache(insertedUser))

            if (!await verifyInCache(cache.get('messages'), insertedUser, this.updateUserCache))
                throw new Error(`Failed to put user in cache:\n${ insertedUser }`);

        return insertedUser;
    }

    /**
     * Update a users
     * @param {String} userId - The ID of the users to update.
     * @param {User} updateUser - The users to update.
     * @returns {Promise<User>} The updated users.
     */
    static async updateUser(userId, updateUser) {

        const users = await this.getUsers();

        let updatedUser = await updateDocument(UserSchema, userId, { ...updateUser, id: userId });
        if (!updatedUser) throw new Error(`Failed to update user:\n${ JSON.stringify(updateUser, null, 2) }`);

        updatedUser = this.populateUser(updatedUser);
        updatedUser = new User(
            updatedUser.id,
            updatedUser.first_name,
            updatedUser.last_name,
            updatedUser.avatar,
            updatedUser.type,
            updatedUser.classes,
            updatedUser.extra_courses
        )

        users.splice(users.findIndex(user => user.id === userId), 1, updatedUser);
        cache.put('users', users, expirationTime);

        if (!this.verifyUserInCache(updatedUser))

            if (!await verifyInCache(cache.get('messages'), updatedUser, this.updateUserCache))
                throw new Error(`Failed to update user in cache:\n${ updatedUser }`);

        return updatedUser;
    }


    /**
     * Delete a users
     * @param {String} userId - The ID of the users to delete
     * @returns {Promise<Boolean>} True if the users was deleted successfully
     */
    static async deleteUser(userId) {

        const deletedUser = await deleteDocument(UserSchema, userId);
        if (!deletedUser) throw new Error(`Failed to delete user with id ${ userId }`);

        const users = await this.getUsers();
        users.splice(users.findIndex(user => user.id === userId), 1);
        cache.put('users', users, expirationTime);

        if (this.verifyUserInCache(deletedUser))
            throw new Error(`Failed to delete user from cache:\n${ deletedUser }`);

        return true;
    }

    /**
     * Verify if a users is in the cache
     * @param {User} user - The users to verify
     * @returns {Boolean} True if the users is in the cache
     */
    static async verifyUserInCache(user) {

        const cacheResult = cache.get('users').find(user_ => user_.id === user.id);

        return Boolean(cacheResult);

    }

    /**
     * Populate a users
     * @param {Object} user - The users to populate
     * @returns {User} The populated users
     */
    static populateUser(user) {
        return user
            // .populate('classes')
            // .populate('extra_courses');
    }

}