/**
 * @file Chat.js - Module for representing a chat.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import BaseModel from "../BaseModel.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import ChatSchema from "../../mongoDb/schemas/general/ChatSchema.js";
import Course from "../general/Course.js";
import Club from "../clubs/Club.js";
import User from "../users/User.js";
/**
 * @description Class representing a Chat.
 * @param {String} _id - The _id of the chat.
 * @param {String} type - The type of the chat. Valid types are: 'PRIVATE', 'GROUP', 'COURSE', 'CLUB'.
 * @param {Array<User>} targets - The targets of the chat.
 * @param {Array<Course>} courses - The courses related to the chat.
 * @param {Array<Club>} clubs - The clubs related to the chat.
 * @param {String} name - The name of the chat.
 * @param {String} avatar - The avatar of the chat.
 * @param {Array<Message>} messages - The messages in the chat.
 */
export default class Chat extends BaseModel {

    static modelName = 'Chat';
    static schema = ChatSchema;
    static cacheKey = 'chats';
    static expirationTime = 2; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'targets' },
        { path: 'courses' },
        { path: 'clubs' }
    ];

    static getMapPaths() {
        return [
            { path: 'targets', function: User.castToUser },
            { path: 'courses', function: Course.castToCourse },
            { path: 'clubs', function: Club.castToClub }
        ];
    }

    static getCastPaths(){
        return [];
    }

    /**
     * Create a chat.
     * @param {String} type - The type of the chat. Valid types are: 'PRIVATE', 'GROUP', 'COURSE', 'CLUB'.
     * @param {Array<String>} targets - The ids of the targets of the chat.
     * @param {Array<String>} courses - The ids of the courses related to the chat.
     * @param {Array<String>} clubs - The ids of the clubs related to the chat.
     * @param {String} name - The name of the chat.
     * @param {String} avatar - The avatar of the chat.
     * @param {Array<String>} messages - The ids of the messages in the chat.
     */
    constructor(
        type,
        targets,
        courses,
        clubs,
        name,
        avatar,
        messages
    ) {
        super({
            type,
            targets,
            courses,
            clubs,
            name,
            avatar,
            messages
        });
        this.id = null;
        this._type = type;
        this._targets = targets;
        this._courses = courses;
        this._clubs = clubs;
        this._name = name;
        this._avatar = avatar;
        this._messages = messages;

    }

    /**
     * @description Get all the targets from targets, courses and clubs.
     * @return {Array<User>} The targets of the chats.
     */
    getAllTargets(){
        return [
            ...this.targets,
            ...this.courses.flatMap(course => course.members),
            ...this.clubs.flatMap(club => club.members)
        ];
    }

    /**
     * Casts a plain object to an instance of the Chat class.
     * @param {Object} chat - The plain object to cast.
     * @returns {Chat} The cast instance of the Chat class.
     */
    static castToChat(chat) {
        const { _id, type, targets, courses, clubs, name, avatar, messages } = chat;
        const castChat = new Chat(
            type,
            targets,
            courses,
            clubs,
            name,
            avatar,
            messages
        );
        castChat._id = _id.toString();
        return castChat;
    }

    /**
     * Converts the Chat instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Chat instance.
     * @returns {Object} An object representation of the Chat instance without underscores in the property names.
     */
    toJSON(){
        const { _id, type, targets, courses, clubs, name, avatar, messages } = this;
        return {
            _id,
            type,
            targets,
            courses,
            clubs,
            name,
            avatar,
            messages
        };
    }

    /**
     * Populates the given Chat with related data from other collections.
     * @param {Object} chat - The Chat to populate.
     * @returns {Promise<Chat>} The populated Chat.
     * @throws {DatabaseError} If the Chat could not be populated.
     */
    static async populateChat(chat) {
        try {
            chat = await chat
                .populate([
                    {
                        path: 'targets',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'courses',
                        populate: Course.getPopulationPaths()
                    },
                    {
                        path: 'clubs',
                        populate: Club.getPopulationPaths()
                    }
                ]);

            chat._id = chat._id.toString();

            let castChat = this.castToChat(chat);
            castChat.handleProperties();
            return castChat;
        } catch (error) {
            throw new DatabaseError(`Failed to populate chat with _id #${chat._id}' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateChat method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Chat>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateChat(object);
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get targets() {
        return this._targets;
    }

    set targets(value) {
        this._targets = value;
    }

    get courses() {
        return this._courses;
    }

    set courses(value) {
        this._courses = value;
    }

    get clubs() {
        return this._clubs;
    }

    set clubs(value) {
        this._clubs = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get avatar() {
        return this._avatar;
    }

    set avatar(value) {
        this._avatar = value;
    }

    get messages() {
        return this._messages;
    }

    set messages(value) {
        this._messages = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

}