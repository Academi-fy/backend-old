/**
 * @file Message.js - Module for representing a messages in a chat.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import {
    validateArray,
    validateNotEmpty,
    validateNumber,
    validateObject,
    verifyInCache
} from "../propertyValidation.js";
import cache from "../../httpServer/cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../mongoDb/collectionAccess.js";
import MessageSchema from "../../mongoDb/schemas/messages/MessageSchema.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../httpServer/errors/RetrievalError.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import CacheError from "../../httpServer/errors/CacheError.js";
import MessageReaction from "./MessageReaction.js";
import Chat from "./Chat.js";
import User from "../users/User.js";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * @description Class representing a Message.
 * @param {String} _id - The id of the messages.
 * @param {Chat} chat - The id of the chat that the messages belongs to.
 * @param {User} author - The id of the author of the messages.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the messages.
 * @param {Array<MessageReaction>} reactions - The reactions to the messages.
 * @param {Message | null} answer - The messages that this messages is an answer to.
 * @param {Array<Message>} editHistory - The editHistory made to the messages.
 * @param {Number} date - The date the messages was created.
 */
export default class Message {

    /**
     * @description Create a messages.
     * @param {String} chat - The id of the chat that the messages belongs to.
     * @param {String} author - The id of the author of the messages.
     * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the messages.
     * @param {Array<MessageReaction>} reactions - The reactions to the messages.
     * @param {String | null} answer - The id of the messages that this messages is an answer to.
     * @param {Array<Message>} editHistory - The editHistory made to the messages.
     * @param {Number} date - The date the messages was created.
     */
    constructor(
        chat,
        author,
        content,
        reactions,
        answer,
        editHistory,
        date
    ) {
        this.chat = chat;
        this.author = author;
        this.content = content;
        this.reactions = reactions;
        this.answer = answer;
        this.editHistory = editHistory;
        this.date = date;
    }

    get _chat() {
        return this.chat;
    }

    set _chat(value) {
        validateNotEmpty('Message chat', value);
        this.chat = value;
    }

    get _author() {
        return this.author;
    }

    set _author(value) {
        validateNotEmpty('Message author', value);
        this.author = value;
    }

    get _content() {
        return this.content;
    }

    set _content(value) {
        validateObject('Message content', value);
        this.content = value;
    }

    get _reactions() {
        return this.reactions;
    }

    set _reactions(value) {
        validateArray('Message reactions', value);

        for (const reaction of value) {
            if (!reaction instanceof MessageReaction) throw new TypeError(`Message reactions must be of type MessageReaction`);
        }

        this.reactions = value;
    }

    get _answer() {
        return this.answer;
    }

    set _answer(value) {
        validateObject('Message answer', value);
        this.answer = value;
    }

    get _editHistory() {
        return this.editHistory;
    }

    set _editHistory(value) {
        validateArray('Message editHistory', value);
        this.editHistory = value;
    }

    get _date() {
        return this.date;
    }

    set _date(value) {
        validateNumber('Message date', value);
        this.date = value;
    }

    /**
     * @description Get the reaction object from a message.
     * @param {String} emoji - The emoji of the reaction
     * @returns {MessageReaction} - The reaction
     * @returns {null} - If the reaction doesn exist
     */
    getReaction(emoji){
        const reaction = reactions.find(r => r.emoji === emoji);
        return MessageReaction.castToReaction(reaction);
    }

    /**
     * @description Adds a reaction to the message. If it exists already, the count is increased by 1.
     * @param {String} emoji - The emoji of the reaction
     */
    addReaction(emoji){ //TODO brauche ich static?

        reactions = this._reactions;
        
        if(reactions.incluedes(emoji)){
            let reaction = this.getReaction(emoji);
            reaction.increment(); //TODO checken, ob es ohne static funktioniert

            const index = reactions.findIndex(reaction);
            this._reactions[index] = cast; //TODO simplify mit copilot
        }
        else {
            this._reactions = reactions.push(new MessageReaction(emoji))
        }

    }

    /**
     * @description Update the cache of messages.
     * @return {Promise<Array<Message>>} The updated list of messages.
     */
    static async updateMessageCache() {
        const messagesFromDb = await getAllDocuments(MessageSchema);

        if (!messagesFromDb || !Array.isArray(messagesFromDb)) {
            throw new DatabaseError('Failed to fetch messages from database');
        }

        const messages = [];
        for (const message of messagesFromDb) {
            messages.push(await this.populateMessage(message));
        }

        cache.put('messages', messages, expirationTime);

        return messages;
    }

    /**
     * @description Get all messages.
     * @return {Promise<Array<Message>>} The list of messages.
     */
    static async getAllMessages() {

        const cacheResults = cache.get("messages");

        if (cacheResults) {
            return cacheResults;
        }
        else return await this.updateMessageCache();

    }

    /**
     * @description Get a messages by its ID.
     * @param {String} id - The ID of the messages.
     * @return {Promise<Message>} The messages object.
     * @throws {RetrievalError} If the messages is not found.
     */
    static async getMessageById(id) {

        const messages = await this.getAllMessages();

        const message = messages.find(msg => msg._id === id);
        if (!message) throw new RetrievalError(`Failed to find message with id: ${ id }`);

        return message;

    }

    /**
     * @description Get all messages that match a rule.
     * @param {String} rule - The rule to match.
     * @return {Promise<Array<Message>>} The list of messages.
     * @throws {RetrievalError} When no messages match the rule.
     * */
    static async getAllMessagesByRule(rule) {

        const messages = await this.getAllMessages();

        const matchingMessages = findByRule(messages, rule);
        if (!matchingMessages) throw new RetrievalError(`Failed to find messages matching rule:\n${ rule }`);

        return matchingMessages;

    }

    /**
     * @description Create a new messages.
     * @param {Message} message - The messages object.
     * @return {Promise<Message>} The created messages object.
     * @throws {DatabaseError} When the messages is not created.
     * @throws {CacheError} When the messages is not created in the cache.
     */
    static async createMessage(message) {

        const messages = await this.getAllMessages();

        let insertedMessage = await createDocument(MessageSchema, message);
        if (!insertedMessage) throw new DatabaseError(`Failed to create message:\n`, message );

        insertedMessage = await this.populateMessage(insertedMessage);

        messages.push(
            insertedMessage
        );
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(insertedMessage))

            if (!await verifyInCache(cache.get('messages'), insertedMessage, this.updateMessageCache))
                throw new CacheError(`Failed to put message in cache:\n${ insertedMessage }`);

        return insertedMessage;

    }

    /**
     * @description Update a messages.
     * @param {String} messageId - The ID of the messages to update.
     * @param {Message} updateMessage - The updated messages object.
     * @return {Promise<Message>} The updated messages object.
     * @throws {DatabaseError} When the messages is not updated.
     * @throws {CacheError} When the messages is not updated in the cache.
     */
    static async updateMessages(messageId, updateMessage) {

        const messages = await this.getAllMessages();

        let updatedMessage = await updateDocument(MessageSchema, messageId, updateMessage);
        if (!updatedMessage) throw new DatabaseError(`Failed to update message:\n${ updateMessage }`);

        updatedMessage = await this.populateMessage(updatedMessage);

        messages.splice(messages.findIndex(message => message._id === messageId), 1, updatedMessage);
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(updatedMessage))

            if (!await verifyInCache(cache.get('messages'), updatedMessage, this.updateMessageCache))
                throw new CacheError(`Failed to update message in cache:\n${ updatedMessage }`);

        return updatedMessage;
    }

    /**
     * Delete a messages.
     * @param {String} messageId - The ID of the messages to delete.
     * @return {Promise<Boolean>} The status of the deletion.
     * @throws {DatabaseError} When the messages is not deleted.
     * @throws {CacheError} When the messages is not deleted in the cache.
     */
    static async deleteMessage(messageId) {

        const deletedMessage = await deleteDocument(MessageSchema, messageId);
        if (!deletedMessage) throw new DatabaseError(`Failed to delete message with id ${ messageId }`);

        const messages = await this.getAllMessages();
        messages.splice(messages.findIndex(message => message._id === messageId), 1);
        cache.put('messages', messages, expirationTime);

        if (this.verifyMessageInCache(deletedMessage))

            if (!await verifyInCache(cache.get('messages'), deletedMessage, this.updateMessageCache))
                throw new CacheError(`Failed to delete message from cache:\n${ deletedMessage }`);

        return true;
    }

    /**
     * Verify if a messages is in the cache.
     * @param {Message} testMessage - The messages to verify.
     * @return {Boolean} True if the messages is in the cache, false otherwise.
     */
    static verifyMessageInCache(testMessage) {

        const cacheResult = cache.get("messages").find(message => message._id === testMessage._id);
        return Boolean(cacheResult);

    }

    /**
     * @description Populate a messages.
     * @param {Object} message - The messages to populate.
     * @return {Promise<Message>} The populated messages.
     * */
    static async populateMessage(message) {

        try {

            message = await message
                .populate([
                    {
                        path: 'chat',
                        populate: Chat.getPopulationPaths()
                    },
                    {
                        path: 'author',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'answer',
                        populate: Message.getPopulationPaths()
                    }
                ]);

            message.chat = Chat.castToChat(message.chat);
            //TODO casts

            const populatedMessage = new Message(
                message.chat,
                message.author,
                message.content,
                message.reactions,
                message.answer,
                message.editHistory,
                message.date
            );
            populatedMessage._id = message._id.toString();

            return populatedMessage;

        } catch (error) {
            throw new DatabaseError(`Failed to populate message:\n${ message }\n${ error }`);
        }

    }

    static getPopulationPaths() {
        return [
            { path: 'chat' },
            { path: 'author' },
            { path: 'answer' }
        ]
    }

}