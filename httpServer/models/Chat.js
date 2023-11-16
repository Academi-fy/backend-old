import cache from "../cache.js";
import ChatSchema from "../../mongoDb/schemas/ChatSchema.js";
import mongoose from "mongoose";
import { validateArray, validateNotEmpty, verifyInCache } from "./propertyValidation.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../mongoDb/collectionAccess.js";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * Class representing a Chat.
 */
class Chat {

    /**
     * Create a chat.
     * @param {String} type - The type of the chat.
     * @param {Array} targets - The targets of the chat.
     * @param {Array} courses - The courses related to the chat.
     * @param {Array} clubs - The clubs related to the chat.
     * @param {String} name - The name of the chat.
     * @param {String} avatar - The avatar of the chat.
     * @param {Array} messages - The messages in the chat.
     */
    constructor(
        type = 'GROUP',
        targets = [],
        courses = [],
        clubs = [],
        name = "Gruppen Chat",
        avatar = "https://media.istockphoto.com/id/1147544807/de/vektor/miniaturbild-vektorgrafik.jpg?s=612x612&w=0&k=20&c=IIK_u_RTeRFyL6kB1EMzBufT4H7MYT3g04sz903fXAk=",
        messages = []
    ) {
        this.id = null;
        this.type = type;
        this.targets = targets;
        this.courses = courses;
        this.clubs = clubs;
        this.name = name;
        this.avatar = avatar;
        this.messages = messages;

    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNotEmpty('Chat id', value);
        this.id = value;
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        validateNotEmpty('Chat type', value);
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
     * @return {Array} The updated chats.
     */
    static async updateChatCache() {

        cache.get("chats").clear();
        const chats = await getAllDocuments(ChatSchema);
        cache.put('chats', chats, expirationTime);
        return chats;

    }

    /**
     * @description Get all chats.
     * @return {Array} The chats.
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
     * @return {Object} The chat.
     */
    static async getChatById(chatId) {
        return (this.getChats()).find(chat => chat.id === chatId);
    }

    /**
     * @description Create a chat.
     * @param {Object} chat - The chat to create.
     * @return {Object} The created chat.
     */
    static async createChat(chat) {

        chat.id = new mongoose.Types.ObjectId();
        const chats = this.getChats();

        const insertedChat = await createDocument(ChatSchema, chat);
        chats.push(insertedChat);
        cache.put('chats', chats, expirationTime);

        if (!this.verifyChatInCache(insertedChat)) throw new Error(`Failed to put chat in cache:\n${ insertedChat }`);

        return insertedChat;
    }

    /**
     * @description Update a chat.
     * @param {String} chatId - The id of the chat to update.
     * @param {Object} updatedChat - The updated chat.
     * @return {Object} The updated chat.
     */
    static async updateChat(chatId, updatedChat) {

        const chats = this.getChats();
        chats.splice(chats.findIndex(chat => chat.id === chatId), 1, updatedChat);

        await updateDocument(ChatSchema, chatId, updatedChat);
        cache.put('chats', chats, expirationTime);

        if (!this.verifyChatInCache(updatedChat)) throw new Error(`Failed to update chat in cache:\n${ updatedChat }`);

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
        chats.splice(chats.findIndex(chat => chat.id === chatId), 1);
        cache.put('chats', chats, expirationTime);

        if (this.verifyChatInCache(deletedChat)) throw new Error(`Failed to delete chat from cache:\n${ deletedChat }`);

        return true;
    }

    /**
     * @description Verify a chat in cache.
     * @param {Object} chat - The chat to verify.
     * @return {Boolean} The status of the verification.
     */
    static async verifyChatInCache(chat) {
        return verifyInCache(this.getChats(), chat, this.updateChatCache);
    }

}

export default Chat;