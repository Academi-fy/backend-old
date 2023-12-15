/**
 * @file Chat.js - Module for representing a chat.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import cache from "../../httpServer/cache.js";
import ChatSchema from "../../mongoDb/schemas/general/ChatSchema.js";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import { createDocument, deleteDocument, getAllDocuments, getDocument, updateDocument } from "../../mongoDb/collectionAccess.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../httpServer/errors/RetrievalError.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import CacheError from "../../httpServer/errors/CacheError.js";
import User from "../users/User.js";
import Course from "../general/Course.js";
import Club from "../clubs/Club.js";
import Message from "./Message.js";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * @description Class representing a Chat.
 * @param {String} _id - The id of the chat.
 * @param {String} type - The type of the chat. Valid types are: 'PRIVATE', 'GROUP', 'COURSE', 'CLUB'.
 * @param {Array<User>} targets - The targets of the chat.
 * @param {Array<Course>} courses - The courses related to the chat.
 * @param {Array<Club>} clubs - The clubs related to the chat.
 * @param {String} name - The name of the chat.
 * @param {String} avatar - The avatar of the chat.
 * @param {Array<Message>} messages - The messages in the chat.
 */
export default class Chat {

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
        this.type = type;
        this.targets = targets;
        this.courses = courses;
        this.clubs = clubs;
        this.name = name;
        this.avatar = avatar;
        this.messages = messages;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        validateNotEmpty('Chat type', value);
        if (![ 'PRIVATE', 'GROUP', 'COURSE', 'CLUB' ].includes(value)) throw new Error(`Invalid chat type: ${ value }`);
        this.type = value;
    }

    get _targets() {
        return this.targets;
    }

    set _targets(value) {
        validateArray('Chat targets', value);
        this.targets = value;
    }

    get _courses() {
        return this.courses;
    }

    set _courses(value) {
        validateArray('Chat courses', value);
        this.courses = value;
    }

    get _clubs() {
        return this.clubs;
    }

    set _clubs(value) {
        validateArray('Chat clubs', value);
        this.clubs = value;
    }

    get _name() {
        return this.name;
    }

    set _name(value) {
        validateNotEmpty('Chat name', value);
        this.name = value;
    }

    get _avatar() {
        return this.avatar;
    }

    set _avatar(value) {
        validateNotEmpty('Chat avatar', value);
        this.avatar = value;
    }

    get _messages() {
        return this.messages;
    }

    set _messages(value) {
        validateArray('Chat messages', value);
        this.messages = value;
    }

    /**
     * @description Get all the targets from targets, courses and clubs.
     * @return {Array<User>} The targets of the chats.
     */
    static getAllTargets(){ //TODO static nötig?
        return [
            ...this._targets,
            ...this._courses.reduce((members, course) => members.concat(course.members), []),
            ...this._clubs.reduce((members, club) => members.concat(club.members), [])
        ];
    }

    /**
     * @description Cast an object to a chat object.
     * @param {Object} object - The chat to be cast
     * @return {Chat} - The cast chat
     */
    static castToChat(object){
        return new Chat(
            object.type,
            object.targets,
            object.courses,
            object.clubs,
            object.name,
            object.avatar,
            object.messages
        )
    }

    /**
     * @description Update the chat cache.
     * @return {Promise<Array<Chat>>} The updated chats.
     */
    static async updateChatCache() {

        cache.del('chats');
        const chatsFromDb = await getAllDocuments(ChatSchema);

        const chats = [];
        for (const chat of chatsFromDb) {
            chats.push(
                await this.populateChat(chat)
            );
        }

        cache.put('chats', chats, expirationTime);
        return chats;

    }

    /**
     * @description Update the chat cache for one specifiy chat.
     * @param {Chat} chat - The updated chat
     * @return {Promise<Array<Chat>>} The updated chat
     */
    async updateChatInCache() {


        // TODO implement update in cache

    }

    /**
     * @description Get all chats.
     * @return {Promise<Array<Chat>>} The chats.
     */
    static async getAllChats() {

        const cacheResults = cache.get('chats');

        if (cacheResults) {
            return cacheResults;
        }
        else return await this.updateChatCache();

    }

    /**
     * @description Get a chat by id.
     * @param {String} chatId - The id of the chat.
     * @return {Promise<Chat>} The chat.
     * @throws {RetrievalError} When the chat could not be found.
     */
    static async getChatById(chatId) {

        const chats = await this.getAllChats();

        const chat = chats.find(chat => chat._id === chatId);
        if (!chat) throw new RetrievalError(`Failed to find chat with id ${ chatId }`);

        return chat;

    }

    /**
     * @description Get all chats that match the rule.
     * @param {Object} rule - The rule to find the chats by.
     * @return {Promise<Array<Chat>>} The chat.
     * @throws {RetrievalError} When the chat could not be found.
     * */
    static async getAllChatsByRule(rule) {

        const chats = await this.getAllChats();

        const chat = findByRule(chats, rule);
        if (!chat) throw new RetrievalError(`Failed to find chats matching rule:\n${ rule }`);

        return chat;

    }

    static getChatCache(){
        return cache.get('chats');
    }

    /**
     * @description Create a chat.
     * @return {Promise<Chat>} The created chat.
     * @throws {DatabaseError} When the chat could not be created.
     * @throws {CacheError} When the chat could not be put in cache.
     */
    async createChat() { // TODO name ändern: create

        const chats = await this.getAllChats();

        let insertedChat = await createDocument(ChatSchema, this); //TODO funktioniert das?
        if (!insertedChat) throw new DatabaseError(`Failed to create chat:\n${ this }`);

        insertedChat = await this.populateChat(insertedChat);

        chats.push(
            insertedChat
        );
        cache.put('chats', chats, expirationTime);

        if (!insertedChat.verifyChatInCache())

            if (!await verifyInCache(this.getChatCache, insertedChat, this.updateChatCache))
                throw new CacheError(`Failed to put chat in cache:\n${ insertedChat }`);

        return insertedChat;
    }

    /**
     * @description Update a chat.
     * @param {Chat} updateChat - The chat to update.
     * @return {Promise<Chat>} The updated chat.
     * @throws {DatabaseError} When the chat could not be updated.
     * @throws {CacheError} When the chat could not be updated in cache.
     */
    async updateChat(updated) { // TODO name ändern: update

        const chats = await this.getAllChats();

        let updatedChat = await updateDocument(ChatSchema, this._id, updated);
        if (!updatedChat) throw new DatabaseError(`Failed to update chat:\n${ updated }`);

        updatedChat = await this.populateChat(updatedChat);

        chats.splice(chats.findIndex(chat => chat._id === this._id), 1, updatedChat);
        cache.put('chats', chats, expirationTime);

        if (!updatedChat.verifyChatInCache())

            if (!await verifyInCache(this.getChatCache, updatedChat, this.updateChatCache))
                throw new CacheError(`Failed to update chat in cache:\n${ updatedChat }`);

        return updatedChat;
    }

    /**
     * @description Delete a chat.
     * @return {Promise<Boolean>} The status of the deletion.
     * @throws {DatabaseError} When the chat could not be deleted.
     * @throws {CacheError} When the chat could not be deleted from cache.
     */
    static async deleteChat() { // TODO name ändern: delete

        const deletedChat = await deleteDocument(ChatSchema, this._id);
        if (!deletedChat) throw new DatabaseError(`Failed to delete chat with id '${ this._id }'`);

        const chats = await this.getAllChats();
        chats.splice(chats.findIndex(chat => chat._id === this._id), 1);
        cache.put('chats', chats, expirationTime);

        if (deletedChat.verifyChatInCache())
            throw new CacheError(`Failed to delete chat from cache:\n${ deletedChat }`);

        return true;
    }

    /**
     * @description Verify a chat in cache.
     * @return {Boolean} The status of the verification.
     */
    async verifyChatInCache() { // TODO static und argument weg

        const cacheResult = cache.get('chats').find(chat_ => chat_._id === this._id);

        return Boolean(cacheResult);

    }

    /**
     * @description Populate a chat.
     * @return {Promise<Chat>} The populated chat.
     * */
    static async populateChat() {

        let chat = this; // TODO funktioniert das?

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
                    },
                    {
                        path: 'messages',
                        populate: Message.getPopulationPaths()
                    },
                ]);

            const populatedChat = new Chat(
                chat.type,
                chat.targets,
                chat.courses,
                chat.clubs,
                chat.name,
                chat.avatar,
                chat.messages
            );
            populatedChat._id = chat._id.toString();

            return populatedChat;

        } catch (error) {
            throw new DatabaseError(`Failed to populate chat:\n${ chat }\n${ error }`);
        }

    }

    static getPopulationPaths() {
        return [
            { path: 'targets' },
            { path: 'courses' },
            { path: 'clubs' }
        ]
    }

}