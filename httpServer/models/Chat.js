import cache from "../cache.js";
import ChatSchema from "../../mongoDb/schemas/ChatSchema.js";
import { validateArray, validateNotEmpty, verifyInCache } from "./propertyValidation.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from "../../mongoDb/collectionAccess.js";

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
     * @param {Array} messages - The messages in the chat.
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
     * @description Update the chat cache.
     * @return {Array<Chat>} The updated chats.
     */
    static async updateChatCache() {

        cache.get("chats").clear();
        const chatsFromDb = getAllDocuments(ChatSchema);

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
     * @return {Array<Chat>} The chats.
     */
    static async getChats() {

        const cacheResults = cache.get('chats');

        if (cacheResults) {
            return cacheResults;
        }
        else return this.updateChatCache();

    }

    /**
     * @description Get a chat by id.
     * @param {String} chatId - The id of the chat.
     * @return {Chat} The chat.
     */
    static async getChatById(chatId) {
        return getDocument(ChatSchema, chatId);
    }

    /**
     * @description Create a chat.
     * @param {Chat} chat - The chat to create.
     * @return {Chat} The created chat.
     */
    static async createChat(chat) {

        const chats = this.getChats();

        const insertedChat = await createDocument(ChatSchema, chat);
        if (!insertedChat) throw new Error(`Failed to create chat:\n${ chat }`);

        chats.push(
            this.populateChat(insertedChat)
        );
        cache.put('chats', chats, expirationTime);

        if (!this.verifyChatInCache(insertedChat))

            if (!verifyInCache(cache.get('chats'), insertedChat, this.updateChatCache))
                throw new Error(`Failed to put chat in cache:\n${ insertedChat }`);

        return insertedChat;
    }

    /**
     * @description Update a chat.
     * @param {String} chatId - The id of the chat to update.
     * @param {Chat} updateChat - The chat to update.
     * @return {Chat} The updated chat.
     */
    static async updateChat(chatId, updateChat) {

        const chats = this.getChats();

        let updatedChat = await updateDocument(ChatSchema, chatId, updateChat);
        if (!updatedChat) throw new Error(`Failed to update chat:\n${ updateChat }`);

        updatedChat = this.populateChat(updatedChat);

        chats.splice(chats.findIndex(chat => chat._id === chatId), 1, updatedChat);
        cache.put('chats', chats, expirationTime);

        if (!this.verifyChatInCache(updatedChat))

            if (!verifyInCache(cache.get('chats'), updatedChat, this.updateChatCache))
                throw new Error(`Failed to update chat in cache:\n${ updatedChat }`);

        return updatedChat;
    }

    /**
     * @description Delete a chat.
     * @param {String} chatId - The id of the chat to delete.
     * @return {Boolean} The status of the deletion.
     */
    static async deleteChat(chatId) {

        const deletedChat = await deleteDocument(ChatSchema, chatId);
        if (!deletedChat) throw new Error(`Failed to delete chat with id ${ chatId }`);

        const chats = this.getChats();
        chats.splice(chats.findIndex(chat => chat._id === chatId), 1);
        cache.put('chats', chats, expirationTime);

        if (this.verifyChatInCache(deletedChat))
            throw new Error(`Failed to delete chat from cache:\n${ deletedChat }`);

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