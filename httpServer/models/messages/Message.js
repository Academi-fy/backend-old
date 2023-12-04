/**
 * @file Message.js - Module for representing a message in a chat.
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
import cache from "../../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import MessageSchema from "../../../mongoDb/schemas/messages/MessageSchema.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * @description Class representing a Message.
 * @param {String} _id - The id of the message.
 * @param {Chat} chat - The id of the chat that the message belongs to.
 * @param {User} author - The id of the author of the message.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the message.
 * @param {Array<MessageReaction>} reactions - The reactions to the message.
 * @param {Message | null} answer - The message that this message is an answer to.
 * @param {Array<Message>} editHistory - The editHistory made to the message.
 * @param {Number} date - The date the message was created.
 */
export default class Message {


    /**
     * @description Create a message.
     * @param {String} chat - The id of the chat that the message belongs to.
     * @param {String} author - The id of the author of the message.
     * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the message.
     * @param {Array<MessageReaction>} reactions - The reactions to the message.
     * @param {String | null} answer - The id of the message that this message is an answer to.
     * @param {Array<Message>} editHistory - The editHistory made to the message.
     * @param {Number} date - The date the message was created.
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
     * @description Update the cache of messages.
     * @return {Promise<Array<Message>>} The updated list of messages.
     */
    static async updateMessageCache() {

        cache.del('messages');
        const messagesFromDb = await getAllDocuments(MessageSchema);

        const messages = [];
        for (const message of messagesFromDb) {
            messages.push(
                await this.populateMessage(message)
            );
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
     * @description Get a message by its ID.
     * @param {String} id - The ID of the message.
     * @return {Promise<Message>} The message object.
     * @throws {RetrievalError} If the message is not found.
     */
    static async getMessageById(id) {

        const messages = await this.getAllMessages();

        const message = messages.find(message => message._id === id);
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
     * @description Create a new message.
     * @param {Message} message - The message object.
     * @return {Promise<Message>} The created message object.
     * @throws {DatabaseError} When the message is not created.
     * @throws {CacheError} When the message is not created in the cache.
     */
    static async createMessage(message) {

        const messages = await this.getAllMessages();

        const insertedMessage = await createDocument(MessageSchema, message);
        if (!insertedMessage) throw new DatabaseError(`Failed to create message:\n${ message }`);

        messages.push(
            await this.populateMessage(insertedMessage)
        );
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(message))

            if (!await verifyInCache(cache.get('messages'), insertedMessage, this.updateMessageCache))
                throw new CacheError(`Failed to put message in cache:\n${ insertedMessage }`);

        return insertedMessage;

    }

    /**
     * @description Update a message.
     * @param {String} messageId - The ID of the message to update.
     * @param {Message} updateMessage - The updated message object.
     * @return {Promise<Message>} The updated message object.
     * @throws {DatabaseError} When the message is not updated.
     * @throws {CacheError} When the message is not updated in the cache.
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
     * Delete a message.
     * @param {String} messageId - The ID of the message to delete.
     * @return {Promise<Boolean>} The status of the deletion.
     * @throws {DatabaseError} When the message is not deleted.
     * @throws {CacheError} When the message is not deleted in the cache.
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
     * Verify if a message is in the cache.
     * @param {Message} testMessage - The message to verify.
     * @return {Boolean} True if the message is in the cache, false otherwise.
     */
    static verifyMessageInCache(testMessage) {

        const cacheResult = cache.get("messages").find(message => message._id === testMessage._id);
        return Boolean(cacheResult);

    }

    /**
     * @description Populate a message.
     * @param {Object} message - The message to populate.
     * @return {Promise<Message>} The populated message.
     * */
    static async populateMessage(message) {

        try {

            message = await message
                .populate([
                    {
                        path: 'chat',
                        populate: [
                            { path: 'targets' },
                            { path: 'courses' },
                            { path: 'clubs' },
                            { path: 'messages' }
                        ]
                    },
                    {
                        path: 'author',
                        populate: [
                            { path: 'classes' },
                            { path: 'extra_courses' }
                        ]
                    },
                    {
                        path: 'answer',
                        populate: [
                            { path: 'chat' },
                            { path: 'author' },
                            { path: 'answer' }
                        ]
                    }
                ]);

            const populatedMessage = new Message(
                message.chat,
                message.author,
                message.content,
                message.reactions,
                message.answer,
                message.editHistory,
                message.date
            );
            populatedMessage._id = message._id;

            return populatedMessage;

        } catch (error) {
            throw new DatabaseError(`Failed to populate message:\n${ message }\n${ error }`);
        }

    }

}