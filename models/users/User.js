/**
 * @file User.js - Module for representing a user.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import UserSchema from "../../../mongoDb/schemas/user/UserSchema.js";
import cache from "../../cache.js";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import mongoose from "mongoose";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";
import Class from "../general/Class.js";
import Course from "../general/Course.js";
import Blackboard from "../general/Blackboard.js";

const expirationTime = 3 * 60 * 1000;

/**
 * @description Class representing a User.
 * @param {String} _id - The id of the users.
 * @param {String} firstName - The first name of the users.
 * @param {String} lastName - The last name of the users.
 * @param {String} avatar - The avatar URL of the users.
 * @param {String} type - The type of the users. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
 * @param {Array<Class>} classes - The classes of the users.
 * @param {Array<Course>} extraCourses - The extra courses of the users.
 * @param {Array<Blackboard>} blackboards - The blackboards of the users.
 */
export default class User {

    /**
     * User constructor
     * @param {String} firstName - The first name of the users.
     * @param {String} lastName - The last name of the users.
     * @param {String} avatar - The avatar URL of the users.
     * @param {String} type - The type of the users. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
     * @param {Array<String>} classes - The ids of the classes of the users.
     * @param {Array<String>} extraCourses - The ids of the extra courses of the users.
     * @param {Array<String>} blackboards - The ids of the blackboards of the users.
     */
    constructor(
        firstName,
        lastName,
        avatar,
        type,
        classes,
        extraCourses,
        blackboards
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar;
        this.type = type;
        this.classes = classes;
        this.extraCourses = extraCourses;
        this.blackboards = blackboards;
    }

    get _firstName() {
        return this.firstName;
    }

    set _firstName(value) {
        validateNotEmpty('users first name', value);
        this.firstName = value;
    }

    get _lastName() {
        return this.lastName;
    }

    set _lastName(value) {
        validateNotEmpty('users last name', value);
        this.lastName = value;
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

    get _extraCourses() {
        return this.extraCourses;
    }

    set _extraCourses(value) {
        validateArray('users extra courses', value);
        this.extraCourses = value;
    }

    get _blackboards() {
        return this.blackboards;
    }

    set _blackboards(value) {
        validateArray('users blackboards', value);
        this.blackboards = value;
    }

    /**
     * @description Update the users cache
     * @returns {Promise<Array<User>>} The updated users
     */
    static async updateUserCache() {

        cache.del('users');
        const usersFromDb = await getAllDocuments(UserSchema);

        const users = [];
        for (let user of usersFromDb) {
            users.push(
                await this.populateUser(user)
            );
        }

        cache.put('users', users, expirationTime);
        return users;

    }

    /**
     * @description Get all users
     * @returns {Promise<Array<User>>} The users
     */
    static async getAllUsers() {

        const cacheResults = cache.get('users');

        if (cacheResults) {
            return cacheResults;
        }
        else return this.updateUserCache();

    }

    /**
     * @description Get a users by their ID
     * @param {String} userId - The ID of the users
     * @returns {Promise<User>} The users
     */
    static async getUserById(userId) {

        const users = await this.getAllUsers();

        let user = users.find(user => user.id === userId);
        if (!user) throw new Error(`User with id ${ userId } not found`);

        return user;

    }

    /**
     * @description Get all users that match a rule.
     * @param {String} rule - The rule to match.
     * @return {Promise<Array<User>>} The list of users.
     * @throws {RetrievalError} When no users match the rule.
     * */
    static async getUserByRule(rule) {

        const users = await this.getAllUsers();

        let user = findByRule(users, rule);
        if (!user) throw new RetrievalError(`Failed to get user matching rule:\n${ rule }`);

        //TODO populate

        return user;

    }

    /**
     * @description Create a new users
     * @param {User} user - The users to create
     * @returns {Promise<User>} The created users
     * @throws {DatabaseError} When the users is not created
     * @throws {CacheError} When the users is not created in the cache
     */
    static async createUser(user) {

        const users = await this.updateUserCache();

        let insertedUser = await createDocument(UserSchema, { ...user, id: new mongoose.Types.ObjectId() });
        if (!insertedUser) throw new DatabaseError(`Failed to create user:\n${ user }`);

        users.push(
            await this.populateUser(insertedUser)
        );
        cache.put(`users`, users, expirationTime);

        if (!this.verifyUserInCache(insertedUser))

            if (!await verifyInCache(cache.get('messages'), insertedUser, this.updateUserCache))
                throw new CacheError(`Failed to put user in cache:\n${ insertedUser }`);

        return insertedUser;
    }

    /**
     * @description Update a users
     * @param {String} userId - The ID of the users to update.
     * @param {User} updateUser - The users to update.
     * @returns {Promise<User>} The updated users.
     * @throws {DatabaseError} When the users is not updated.
     * @throws {CacheError} When the users is not updated in the cache.
     */
    static async updateUser(userId, updateUser) {

        const users = await this.getAllUsers();

        let updatedUser = await updateDocument(UserSchema, userId, { ...updateUser, id: userId });
        if (!updatedUser) throw new DatabaseError(`Failed to update user:\n${ JSON.stringify(updateUser, null, 2) }`);

        updatedUser = await this.populateUser(updatedUser);

        users.splice(users.findIndex(user => user.id === userId), 1, updatedUser);
        cache.put('users', users, expirationTime);

        if (!this.verifyUserInCache(updatedUser))

            if (!await verifyInCache(cache.get('messages'), updatedUser, this.updateUserCache))
                throw new CacheError(`Failed to update user in cache:\n${ updatedUser }`);

        return updatedUser;
    }


    /**
     * @description Delete a users
     * @param {String} userId - The ID of the users to delete
     * @returns {Promise<Boolean>} True if the users was deleted successfully
     * @throws {DatabaseError} When the users is not deleted
     * @throws {CacheError} When the users is not deleted in the cache
     */
    static async deleteUser(userId) {

        const deletedUser = await deleteDocument(UserSchema, userId);
        if (!deletedUser) throw new DatabaseError(`Failed to delete user with id ${ userId }`);

        await this.updateUserCache();

        if (this.verifyUserInCache(deletedUser))
            throw new CacheError(`Failed to delete user from cache:\n${ deletedUser }`);

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
     * @returns {Promise<User>} The populated users
     */
    static async populateUser(user) {

        try {

            user = await user
                .populate([
                    {
                        path: 'classes',
                        populate: Class.getPopulationPaths()
                    },
                    {
                        path: 'extraCourses',
                        populate: Course.getPopulationPaths()
                    },
                    {
                        path: 'blackboards',
                        populate: Blackboard.getPopulationPaths()
                    }
                ]);

            const populatedUser = new User(
                user.firstName,
                user.lastName,
                user.avatar,
                user.type,
                user.classes,
                user.extraCourses,
                user.blackboards
            );
            populatedUser.id = user._id.toString();

            return populatedUser;

        } catch (error) {
            throw new DatabaseError(`Failed to populate user:\n${ user }\n${ error }`);
        }

    }

    static getPopulationPaths() {
        return [
            { path: 'classes' },
            { path: 'extraCourses' },
            { path: 'blackboards' }
        ]
    }

}