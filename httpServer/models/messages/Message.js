import {
    validateArray,
    validateNotEmpty,
    validateNumber,
    validateObject,
    verifyInCache
} from "../propertyValidation.js";
import cache from "../../cache.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import MessageSchema from "../../../mongoDb/schemas/messages/MessageSchema.js";
import { findByRule } from "../findByRule.js";

// Time in milliseconds after which the cache will expire
const expirationTime = 2 * 60 * 1000;

/**
 * @description Class representing a Message.
 * @param {String} id - The id of the message.
 * @param {Chat} chat - The chat that the message belongs to.
 * @param {User} author - The author of the message.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the message.
 * @param {Array<MessageReaction>} reactions - The reactions to the message.
 * @param {Array<EditedMessage>} edits - The edits made to the message.
 * @param {Number} date - The date the message was created.
 */
export default class Message {

    /**
     * Create a message.
     * @param {String} id - The id of the message.
     * @param {String} chat - The id of the chat that the message belongs to.
     * @param {String} author - The id of the author of the message.
     * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the message.
     * @param {Array<MessageReaction>} reactions - The reactions to the message.
     * @param {Array<EditedMessage>} edits - The edits made to the message.
     * @param {Number} date - The date the message was created.
     */
    constructor(
        id,
        chat,
        author,
        content,
        reactions,
        edits,
        date
    ) {
        this.id = id;
        this.chat = chat;
        this.author = author;
        this.content = content;
        this.reactions = reactions;
        this.edits = edits;
        this.date = date;

        validateNotEmpty('Message id', id);
        validateObject('Message chat', chat);
        validateObject('Message author', author);
        validateObject('Message content', content);
        validateArray('Message reactions', reactions);
        validateArray('Message edits', edits);
        validateNumber('Message date', date);
    }

    get _chat() {
        return this.chat;
    }

    set _chat(value) {
        validateObject('Message chat', value);
        this.chat = value;
    }

    get _author() {
        return this.author;
    }

    set _author(value) {
        validateObject('Message author', value);
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
     * @return {Promise<Array<Message>>} The updated list of messages.
     */
    static async updateMessageCache() {

        cache.del('messages');
        const messagesFromDb = await getAllDocuments(MessageSchema);

        const messages = [];
        for (const message of messagesFromDb) {
            messages.push(
                this.populateMessage(message)
            );
        }

        cache.put('messages', messages, expirationTime);
        return messages;

    }

    /**
     * Get all messages.
     * @return {Promise<Array<Message>>} The list of messages.
     */
    static async getAllMessages() {

        const cacheResults = cache.get("messages");

        if (!cacheResults) {
            return cacheResults;
        }
        else return await this.updateMessageCache();

    }

    /**
     * Get a message by its ID.
     * @param {String} id - The ID of the message.
     * @return {Promise<Message>} The message object.
     */
    static async getMessageById(id) {

        const messages= await this.getAllMessages();

        const message = messages.find(message => message._id === id);
        if (!message) throw new Error(`Message with id ${ id } not found`);

        return message;

    }

    static async getAllMessagesByRule(rule) {

        const messages = await this.getAllMessages();

        const matchingMessages = findByRule(messages, rule);
        if (!matchingMessages) throw new Error(`Failed to find messages matching rule:\n${ rule }`);

        return matchingMessages;

    }

    /**
     * Create a new message.
     * @param {Message} message - The message object.
     * @return {Promise<Message>} The created message object.
     */
    static async createMessage(message) {

        const messages= await this.getAllMessages();

        const insertedMessage = await createDocument(MessageSchema, message);
        if (!insertedMessage) throw new Error(`Failed to create message:\n${ message }`);

        messages.push(
            this.populateMessage(insertedMessage)
        );
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(message))

            if (!await verifyInCache(cache.get('messages'), insertedMessage, this.updateMessageCache))
                throw new Error(`Failed to put message in cache:\n${ insertedMessage }`);

        return insertedMessage;

    }

    /**
     * Update a message.
     * @param {String} messageId - The ID of the message to update.
     * @param {Message} updateMessage - The updated message object.
     * @return {Promise<Message>} The updated message object.
     */
    static async updateMessages(messageId, updateMessage) {

        const messages = await this.getAllMessages();

        let updatedMessage = await updateDocument(MessageSchema, messageId, updateMessage);
        if (!updatedMessage) throw new Error(`Failed to update message:\n${ updateMessage }`);

        updatedMessage = this.populateMessage(updatedMessage);

        messages.splice(messages.findIndex(message => message._id === messageId), 1, updatedMessage);
        cache.put('messages', messages, expirationTime);

        if (!this.verifyMessageInCache(updatedMessage))

            if (!await verifyInCache(cache.get('messages'), updatedMessage, this.updateMessageCache))
                throw new Error(`Failed to update message in cache:\n${ updatedMessage }`);

        return updatedMessage;
    }

    /**
     * Delete a message.
     * @param {String} messageId - The ID of the message to delete.
     * @return {Promise<Boolean>} The status of the deletion. Reaction
     */
    static async deleteMessage(messageId) {

        const deletedMessage = await deleteDocument(MessageSchema, messageId);
        if (!deletedMessage) throw new Error(`Failed to delete message with id ${ messageId }`);

        const messages= await this.getAllMessages();
        messages.splice(messages.findIndex(message => message._id === messageId), 1);
        cache.put('messages', messages, expirationTime);

        if (this.verifyMessageInCache(deletedMessage))

            if(!await verifyInCache(cache.get('messages'), deletedMessage, this.updateMessageCache))
                throw new Error(`Failed to delete message from cache:\n${ deletedMessage }`);

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
     * @return {Message} The populated message.
     * */
    static populateMessage(message) {
        return message
            .populate('chat')
            .populate('author');
    }

}