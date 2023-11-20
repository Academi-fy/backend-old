/**
 * @file Chat.js - Module for representing a chat.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import cache from "../../cache.js";
import ChatSchema from "../../../mongoDb/schemas/general/ChatSchema.js";
import { validateArray, validateNotEmpty, verifyInCache } from "../propertyValidation.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * @description Class representing a Chat.
 * @param {String} id - The id of the chat.
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
     * @param {String} id - The id of the chat.
     * @param {String} type - The type of the chat. Valid types are: 'PRIVATE', 'GROUP', 'COURSE', 'CLUB'.
     * @param {Array<String>} targets - The ids of the targets of the chat.
     * @param {Array<String>} courses - The ids of the courses related to the chat.
     * @param {Array<String>} clubs - The ids of the clubs related to the chat.
     * @param {String} name - The name of the chat.
     * @param {String} avatar - The avatar of the chat.
     * @param {Array} messages - The messages in the chat.
     */
    constructor(
        id,
        type,
        targets,
        courses,
        clubs,
        name,
        avatar,
        messages
    ) {
        this.id = id;
        this.type = type;
        this.targets = targets;
        this.courses = courses;
        this.clubs = clubs;
        this.name = name;
        this.avatar = avatar;
        this.messages = messages;

        validateNotEmpty('Chat id', id);
        validateNotEmpty('Chat type', type);
        validateArray('Chat targets', targets);
        validateArray('Chat courses', courses);
        validateArray('Chat clubs', clubs);
        validateNotEmpty('Chat name', name);
        validateNotEmpty('Chat avatar', avatar);
        validateArray('Chat messages', messages);
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
     * @description Update the chat cache.
     * @return {Promise<Array<Chat>>} The updated chats.
     */
    static async updateChatCache() {

        cache.del('chats');
        const chatsFromDb = await getAllDocuments(ChatSchema);

        const chats = [];
        for (const chat of chatsFromDb) {
            chats.push(
                this.populateChat(chat)
            );
        }

        cache.put('chats', chats, expirationTime);
        return chats;

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

    /**
     * @description Create a chat.
     * @param {Chat} chat - The chat to create.
     * @return {Promise<Chat>} The created chat.
     * @throws {DatabaseError} When the chat could not be created.
     * @throws {CacheError} When the chat could not be put in cache.
     */
    static async createChat(chat) {

        const chats = await this.getAllChats();

        const insertedChat = await createDocument(ChatSchema, chat);
        if (!insertedChat) throw new DatabaseError(`Failed to create chat:\n${ chat }`);

        chats.push(
            this.populateChat(insertedChat)
        );
        cache.put('chats', chats, expirationTime);

        if (!this.verifyChatInCache(insertedChat))

            if (!await verifyInCache(cache.get('chats'), insertedChat, this.updateChatCache))
                throw new CacheError(`Failed to put chat in cache:\n${ insertedChat }`);

        return insertedChat;
    }

    /**
     * @description Update a chat.
     * @param {String} chatId - The id of the chat to update.
     * @param {Chat} updateChat - The chat to update.
     * @return {Promise<Chat>} The updated chat.
     * @throws {DatabaseError} When the chat could not be updated.
     * @throws {CacheError} When the chat could not be updated in cache.
     */
    static async updateChat(chatId, updateChat) {

        const chats = await this.getAllChats();

        let updatedChat = await updateDocument(ChatSchema, chatId, updateChat);
        if (!updatedChat) throw new DatabaseError(`Failed to update chat:\n${ updateChat }`);

        updatedChat = this.populateChat(updatedChat);

        chats.splice(chats.findIndex(chat => chat._id === chatId), 1, updatedChat);
        cache.put('chats', chats, expirationTime);

        if (!this.verifyChatInCache(updatedChat))

            if (!await verifyInCache(cache.get('chats'), updatedChat, this.updateChatCache))
                throw new CacheError(`Failed to update chat in cache:\n${ updatedChat }`);

        return updatedChat;
    }

    /**
     * @description Delete a chat.
     * @param {String} chatId - The id of the chat to delete.
     * @return {Promise<Boolean>} The status of the deletion.
     * @throws {DatabaseError} When the chat could not be deleted.
     * @throws {CacheError} When the chat could not be deleted from cache.
     */
    static async deleteChat(chatId) {

        const deletedChat = await deleteDocument(ChatSchema, chatId);
        if (!deletedChat) throw new DatabaseError(`Failed to delete chat with id ${ chatId }`);

        const chats = await this.getAllChats();
        chats.splice(chats.findIndex(chat => chat._id === chatId), 1);
        cache.put('chats', chats, expirationTime);

        if (this.verifyChatInCache(deletedChat))
            throw new CacheError(`Failed to delete chat from cache:\n${ deletedChat }`);

        return true;
    }

    /**
     * @description Verify a chat in cache.
     * @param {Chat} chat - The chat to verify.
     * @return {Boolean} The status of the verification.
     */
    static async verifyChatInCache(chat) {

        const cacheResult = cache.get('chats').find(chat_ => chat_._id === chat._id);

        return Boolean(cacheResult);

    }

    /**
     * @description Populate a chat.
     * @param {Object} chat - The chat to populate.
     * @return {Chat} The populated chat.
     * */
    static populateChat(chat) {
        return chat
            .populate('messages')
            .populate('targets')
            .populate('courses')
            .populate('clubs');
    }

}