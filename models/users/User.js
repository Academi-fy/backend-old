/**
 * @file User.js - Module for representing a user.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import BaseModel from "../BaseModel.js";
import UserSchema from "../../mongoDb/schemas/user/UserSchema.js";
import UserAccountTypes from "./UserAccountTypes.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Blackboard from "../general/Blackboard.js";
import Course from "../general/Course.js";
import Class from "../general/Class.js";
import Chat from "../messages/Chat.js";
import Club from "../clubs/Club.js";

/**
 * @description Class representing a User.
 * @param {String} _id - The _id of the user.
 * @param {String} firstName - The first name of the user.
 * @param {String} lastName - The last name of the user.
 * @param {String} avatar - The avatar URL of the user.
 * @param {String} type - The type of the user. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
 * @param {Array<Class>} classes - The classes of the user.
 * @param {Array<Course>} extraCourses - The extra courses of the user.
 * @param {Array<Blackboard>} blackboards - The blackboards of the user.
 * @param {Array<Club>} clubs - The clubs of the user.
 * @param {Array<Chat>} chats - The ids of the chats of the user.
 */
export default class User extends BaseModel {

    static modelName = 'User';
    static schema = UserSchema;
    static cacheKey = 'users';
    static expirationTime = 3; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'classes' },
        { path: 'extraCourses' },
        { path: 'blackboards' },
        { path: 'clubs' },
        { path: 'chats' }
    ];

    /**
     * User constructor
     * @param {String} firstName - The first name of the user.
     * @param {String} lastName - The last name of the user.
     * @param {String} avatar - The avatar URL of the user.
     * @param {String} type - The type of the user. Valid types are: 'STUDENT', 'TEACHER', 'ADMIN'.
     * @param {Array<String>} classes - The ids of the classes of the user.
     * @param {Array<String>} extraCourses - The ids of the extra courses of the user.
     * @param {Array<String>} blackboards - The ids of the blackboards of the user.
     * @param {Array<String>} clubs - The ids of the clubs of the user.
     * @param {Array<String>} chats - The ids of the chats of the user.
     */
    constructor(
        firstName,
        lastName,
        avatar,
        type,
        classes,
        extraCourses,
        blackboards,
        clubs,
        chats
    ) {
        super({
            firstName,
            lastName,
            avatar,
            type,
            classes,
            extraCourses,
            blackboards,
            clubs,
            chats
        });
        this.id = null;
        this._firstName = firstName;
        this._lastName = lastName;
        this._avatar = avatar;
        this._type = type;
        this._classes = classes;
        this._extraCourses = extraCourses;
        this._blackboards = blackboards;
        this._clubs = clubs;
        this._chats = chats;

        if (!Object.keys(UserAccountTypes).includes(type)) {
            throw new Error(`User type does not exist: ${ type }`);
        }

    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        if (!Object.keys(UserAccountTypes).includes(value)) {
            throw new Error(`User type does not exist: ${ value }`);
        }
        this._type = value;
    }

    get classes() {
        return this._classes;
    }

    set classes(value) {
        this._classes = value;
    }

    get extraCourses() {
        return this._extraCourses;
    }

    set extraCourses(value) {
        this._extraCourses = value;
    }

    get blackboards() {
        return this._blackboards;
    }

    set blackboards(value) {
        this._blackboards = value;
    }

    get clubs() {
        return this._clubs;
    }

    set clubs(value) {
        this._clubs = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

    get chats() {
        return this._chats;
    }

    set chats(value) {
        this._chats = value;
    }

    static getMapPaths() {
        return [
            { path: 'classes', function: Class.castToClass },
            { path: 'extraCourses', function: Course.castToCourse },
            { path: 'blackboards', function: Blackboard.castToBlackboard },
            { path: 'clubs', function: Club.castToClub },
            { path: 'chats', function: Chat.castToChat }
        ];
    }

    static getCastPaths() {
        return [];
    }

    /**
     * Casts a plain object to an instance of the User class.
     * @param {Object} user - The plain object to cast.
     * @returns {User} The cast instance of the User class.
     */
    static castToUser(user) {
        if (!user) return null;
        const { _id, firstName, lastName, avatar, type, classes, extraCourses, blackboards, clubs, chats } = user;
        const castUser = new User(
            firstName,
            lastName,
            avatar,
            type,
            classes,
            extraCourses,
            blackboards,
            clubs,
            chats
        );
        castUser._id = _id.toString();
        return castUser;
    }

    /**
     * Populates the given User with related data from other collections.
     * @param {Object} user - The User to populate.
     * @returns {Promise<User>} The populated User.
     * @throws {DatabaseError} If the User could not be populated.
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
                    },
                    {
                        path: 'clubs',
                        populate: Club.getPopulationPaths()
                    },
                    {
                        path: 'chats',
                        populate: Chat.getPopulationPaths()
                    }
                ]);

            user._id = user._id.toString();

            let castUser = this.castToUser(user);
            castUser.handleProperties();
            return castUser;
        } catch (error) {
            throw new DatabaseError(`Failed to populate user with _id #${ user._id }' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateUser method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<User>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateUser(object);
    }

    /**
     * Converts the User instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a User instance.
     * @returns {Object} An object representation of the User instance without underscores in the property names.
     */
    toJSON() {
        const { _id, firstName, lastName, avatar, type, classes, extraCourses, blackboards, clubs, chats } = this;
        return {
            _id,
            firstName,
            lastName,
            avatar,
            type,
            classes,
            extraCourses,
            blackboards,
            clubs,
            chats
        };
    }

}