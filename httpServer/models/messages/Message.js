import { validateArray, validateNotEmpty, validateNumber, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import MessageSchema from "../../../mongoDb/schemas/MessageSchema.js";
import mongoose from "mongoose";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * @description Class representing a Message.
 * @property {String} _id - The id of the message.
 * @property {Chat} chat - The chat that the message belongs to.
 * @property {User} author - The author of the message.
 * @property {Array<Object<FileContent | ImageContent | PollContent | TextContent | VideoContent>>} content - The content of the message.
 * @property {Array<Reaction>} reactions - The reactions to the message.
 * @property {Array<EditedMessage>} edits - The edits made to the message.
 * @property {Number} date - The date the message was created.
 */
class Message {

    /**
     * Create a message.
     * @param {String} chat - The id of the chat that the message belongs to.
     * @param {String} author - The id of the author of the message.
     * @param {Array<Object<FileContent | ImageContent | PollContent | TextContent | VideoContent>>} content - The content of the message.
     * @param {Array<Reaction>} reactions - The reactions to the message.
     * @param {Array<EditedMessage>} edits - The edits made to the message.
     * @param {Number} date - The date the message was created.
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
     * @return {Array<Message>} The updated list of messages.
     */
    static async updateMessageCache() {

        cache.get("messages").clear();
        const messagesFromDb = getAllDocuments(MessageSchema);

        const messages = [];
        for await (const message of messagesFromDb) {
            messages.push(
                message
                    .populate('chat')
                    .populate('author')
            );
        }

        cache.put('messages', messages, expirationTime);
        return messages;

    }

    /**
     * Get all messages.
     * @return {Array<Message>} The list of messages.
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
     * @param {String} id - The ID of the message.
     * @return {Message} The message object.
     */
    static async getMessageById(id) {
        return (this.getMessages()).find(message => message._id === id);
    }

    /**
     * Create a new message.
     * @param {Message} message - The message object.
     * @return {Message} The created message object.
     */
    static async createMessage(message) {

        const messages = this.getMessages();

        const insertedMessage = await createDocument(MessageSchema, message);
        messages.push(
            insertedMessage
                .populate('chat')
                .populate('author')
        );
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(message.chat)) throw new Error(`Failed to put message in cache:\n${ insertedMessage }`);

        return insertedMessage;

    }

    /**
     * Update a message.
     * @param {String} messageId - The ID of the message to update.
     * @param {Message} updateMessage - The updated message object.
     * @return {Message} The updated message object.
     */
    static async updateMessages(messageId, updateMessage) {

        const messages = this.getMessages();

        let updatedMessage = await updateDocument(MessageSchema, messageId, updateMessage);
        updatedMessage = updatedMessage
                            .populate('chat')
                            .populate('author');

        messages.splice(messages.findIndex(message => message._id === messageId), 1, updatedMessage);
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(updatedMessage.chat)) throw new Error(`Failed to update message in cache:\n${ updatedMessage }`);

        return updatedMessage;
    }

    /**
     * Delete a message.
     * @param {String} messageId - The ID of the message to delete.
     * @return {Boolean} The status of the deletion.
     */
    static async deleteMessage(messageId) {

        const deleteMessage = await deleteDocument(MessageSchema, messageId);
        if (!deleteMessage) throw new Error(`Failed to delete message with id ${ messageId }`);

        const messages = this.getMessages();
        messages.splice(messages.findIndex(message => message._id === messageId), 1);
        cache.put('messages', messages, expirationTime);

        if (this.verifyMessageInCache(deleteMessage.chat)) throw new Error(`Failed to delete message from cache:\n${ deleteMessage }`);

        return true;
    }

    /**
     * Verify if a message is in the cache.
     * @param {Message} testMessage - The chat to which the message belongs.
     * @return {Boolean} True if the message is in the cache, false otherwise.
     */
    static async verifyMessageInCache(testMessage) {
        return verifyInCache(this.getMessages(), testMessage, this.updateMessageCache());
    }

}