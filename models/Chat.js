import cache from "../cache.js";
import ChatSchema from "../MongoDB/schemas/ChatSchema.js";
import mongoose from "mongoose";
import { validateArray, validateNotEmpty, verifyInCache } from "./propertyValidation.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../MongoDB/collectionAccess.js";

const expirationTime = 2 * 60 * 1000;

class Chat {

    constructor(type = 'GROUP',
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

    static async updateChatCache() {

        cache.get("chats").clear();
        const chats = await getAllDocuments(ChatSchema);
        cache.put('chats', chats, expirationTime);
        return chats;

    }

    static async getChats() {

        const cacheResults = cache.get('chats');

        if (cacheResults) {
            return cacheResults;
        } else return await this.updateChatCache();

    }

    static async getChat(chatId) {
        return (await this.getChats()).find(chat => chat.id === chatId);
    }

    static async createChat(chat) {

        chat.id = new mongoose.Types.ObjectId();
        const chats = await this.getChats();

        const insertedChat = await createDocument(ChatSchema, chat);
        chats.push(insertedChat);
        cache.put('chats', chats, expirationTime);

        if (!await this.verifyChatInCache(insertedChat)) throw new Error(`Failed to put chat in cache:\n${ insertedChat }`);

        return insertedChat;
    }

    static async updateChat(chatId, updatedChat) {

        const chats = await this.getChats();
        chats.splice(chats.findIndex(chat => chat.id === chatId), 1, updatedChat);

        await updateDocument(ChatSchema, chatId, updatedChat);
        cache.put('chats', chats, expirationTime);

        if (!await this.verifyChatInCache(updatedChat)) throw new Error(`Failed to put chat in cache:\n${ updatedChat }`);

        return updatedChat;
    }

    static async deleteChat(chatId) {

        const deletedChat = await deleteDocument(ChatSchema, chatId);
        if (!deletedChat) throw new Error(`Failed to delete chat with id ${ chatId }`);


        const chats = await this.getChats();
        chats.splice(chats.findIndex(chat => chat.id === chatId), 1);
        cache.put('chats', chats, expirationTime);

        return true;
    }

    static async verifyChatInCache(chat) {
        return await verifyInCache(await this.getChats(), chat, this.updateChatCache);
    }

}

export default Chat;