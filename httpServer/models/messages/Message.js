import { validateArray, validateNotEmpty, validateNumber, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import MessageSchema from "../../../mongoDb/schemas/MessageSchema.js";
import mongoose from "mongoose";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * Class representing a Message.
 */
class Message {

    /**
     * Create a message.
     * @param {string} chat - The chat that the message belongs to.
     * @param {string} author - The author of the message.
     * @param {Array} content - The content of the message.
     * @param {Array} reactions - The reactions to the message.
     * @param {Array} edits - The edits made to the message.
     * @param {number} date - The date the message was created.
     */
    constructor(
        chat = "",
        author = "",
        content = [],
        reactions = [],
        edits = [],
        date = Date.now()
    ) {
        this.chat = chat;
        this.author = author;
        this.content = content;
        this.reactions = reactions;
        this.edits = edits;
        this.date = date;
    }

    // Getters and setters for the properties of the Message class

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
        validateArray('Message content', value);
        this.content = value;
    }

    get _reactions() {
        return this.reactions;
    }

    set _reactions(value) {
        validateArray('Message reactions', value);
        this.reactions = value;
    }

    get _edits() {
        return this.edits;
    }

    set _edits(value) {
        validateArray('Message edits', value);
        this.edits = value;
    }

    get _date() {
        return this.date;
    }

    set _date(value) {
        validateNumber('Message date', value);
        this.date = value;
    }

    /**
     * Update the cache of messages.
     * @return {Array} The updated list of messages.
     */
    static async updateMessageCache() {

        cache.get("messages").clear();
        const messages = await getAllDocuments(MessageSchema);
        cache.put('messages', messages, expirationTime);
        return messages;

    }

    /**
     * Get all messages.
     * @return {Array} The list of messages.
     */
    static async getMessages() {

        const cacheResults = cache.get("messages");

        if (!cacheResults) {
            return cacheResults;
        }
        else return this.updateMessageCache();

    }

    /**
     * Get a message by its ID.
     * @param {string} id - The ID of the message.
     * @return {Object} The message object.
     */
    static async getMessageById(id) {
        return (this.getMessages()).find(message => message.id === id);
    }

    /**
     * Create a new message.
     * @param {Object} message - The message object.
     * @return {Object} The created message object.
     */
    static async createMessage(message) {

        message.id = new mongoose.Types.ObjectId();
        const messages = this.getMessages();

        const insertedMessage = await createDocument(MessageSchema, message);
        messages.push(insertedMessage);
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(message.chat)) throw new Error(`Failed to put message in cache:\n${ insertedMessage }`);

        return insertedMessage;

    }

    /**
     * Update a message.
     * @param {string} messageId - The ID of the message to update.
     * @param {Object} updatedMessage - The updated message object.
     * @return {Object} The updated message object.
     */
    static async updateMessages(messageId, updatedMessage) {

        const messages = this.getMessages();
        messages.splice(messages.findIndex(message => message.id === messageId), 1, updatedMessage);

        await updateDocument(MessageSchema, messageId, updatedMessage);
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(updatedMessage.chat)) throw new Error(`Failed to update message in cache:\n${ updatedMessage }`);

        return updatedMessage;
    }

    /**
     * Delete a message.
     * @param {string} messageId - The ID of the message to delete.
     * @return {boolean} The status of the deletion.
     */
    static async deleteMessage(messageId) {

        const deleteMessage = await deleteDocument(MessageSchema, messageId);
        if (!deleteMessage) throw new Error(`Failed to delete message with id ${ messageId }`);

        const messages = this.getMessages();
        messages.splice(messages.findIndex(message => message.id === messageId), 1);
        cache.put('messages', messages, expirationTime);

        if (this.verifyMessageInCache(deleteMessage.chat)) throw new Error(`Failed to delete message from cache:\n${ deleteMessage }`);

        return true;
    }

    /**
     * Verify if a message is in the cache.
     * @param {string} testChat - The chat to which the message belongs.
     * @return {boolean} True if the message is in the cache, false otherwise.
     */
    static async verifyMessageInCache(testChat) {
        return await verifyInCache(this.getMessages(), testChat, this.updateMessageCache());
    }

}