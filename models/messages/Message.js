/**
 * @file Message.js - Module for representing a messages in a chat.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import BaseModel from "../BaseModel.js";
import MessageSchema from "../../mongoDb/schemas/messages/MessageSchema.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import Chat from "./Chat.js";
import User from "../users/User.js";
import Course from "../general/Course.js";
import Club from "../clubs/Club.js";
import MessageReaction from "./MessageReaction.js";
import { castToMessageContent } from "./messageContentCaster.js";

/**
 * @description Class representing a Message.
 * @param {String} _id - The _id of the messages.
 * @param {Chat} chat - The _id of the chat that the messages belongs to.
 * @param {User} author - The _id of the author of the messages.
 * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the messages.
 * @param {Array<MessageReaction>} reactions - The reactions to the messages.
 * @param {Message | null} answer - The messages that this messages is an answer to.
 * @param {Array<Message>} editHistory - The editHistory made to the messages.
 * @param {Number} date - The date the messages was created.
 */
export default class Message extends BaseModel {

    static modelName = 'Message';
    static schema = MessageSchema;
    static cacheKey = 'messages';
    static expirationTime = 2; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'chat' },
        { path: 'author' },
        { path: 'answer' }
    ];

    /**
     * @description Create a messages.
     * @param {String} chat - The _id of the chat that the messages belongs to.
     * @param {String} author - The _id of the author of the messages.
     * @param {Array<FileContent | ImageContent | PollContent | TextContent | VideoContent>} content - The content of the messages.
     * @param {Array<MessageReaction>} reactions - The reactions to the messages.
     * @param {String | null} answer - The _id of the messages that this messages is an answer to.
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

        super({
            chat,
            author,
            content,
            reactions,
            answer,
            editHistory,
            date
        });
        this.id = null;
        this._chat = chat;
        this._author = author;
        this._content = content;
        this._reactions = reactions;
        this._answer = answer;
        this._editHistory = editHistory;
        this._date = date;
    }

    get chat() {
        return this._chat;
    }

    set chat(value) {
        this._chat = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }

    get reactions() {
        return this._reactions;
    }

    set reactions(value) {
        this._reactions = value;
    }

    get answer() {
        return this._answer;
    }

    set answer(value) {
        this._answer = value;
    }

    get editHistory() {
        return this._editHistory;
    }

    set editHistory(value) {
        this._editHistory = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

    static getMapPaths() {
        return [
            { path: 'targets', function: User.castToUser },
            { path: 'courses', function: Course.castToCourse },
            { path: 'clubs', function: Club.castToClub },
            { path: 'content', function: castToMessageContent },
        ];
    }

    static getCastPaths() {
        return [
            { path: 'author', function: User.castToUser },
            { path: 'chat', function: Chat.castToChat },
            { path: 'answer', function: Message.castToMessage }
        ];
    }

    /**
     * Casts a plain object to an instance of the Message class.
     * @param {Object} message - The plain object to cast.
     * @returns {Message} The cast instance of the Message class.
     */
    static castToMessage(message) {
        const { _id, chat, author, content, reactions, answer, editHistory, date } = message;
        const castMessage = new Message(
            chat,
            author,
            content,
            reactions,
            answer,
            editHistory,
            date
        );
        castMessage._id = _id.toString();
        return castMessage;
    }

    /**
     * Populates the given message with related data from other collections.
     * @param {Object} message - The message to populate.
     * @returns {Promise<Message>} The populated message.
     * @throws {DatabaseError} If the message could not be populated.
     */
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
            message._id = message._id.toString();

            let castMessage = this.castToMessage(message);
            castMessage.handleProperties();
            return castMessage;
        } catch (error) {
            throw new DatabaseError(`Failed to populate chat with _id #${ message._id }' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateEvent method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<Message>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateMessage(object);
    }

    /**
     * Adds a reaction to the message. If the reaction already exists, it increments the count.
     * If it doesn't exist, it creates a new reaction with the given emoji.
     * @param {string} emoji - The emoji representing the reaction.
     */
    addReaction(emoji) {

        const reactions = this.reactions;

        if (reactions.find(reaction => reaction.emoji === emoji)) {
            reactions.find(reaction => reaction.emoji === emoji).increment();
        }
        else {
            reactions.push(new MessageReaction(emoji));
        }

    }

    /**
     * Retrieves a reaction from the message based on the given emoji.
     * @param {string} emoji - The emoji representing the reaction.
     * @returns {MessageReaction} The reaction associated with the given emoji.
     */
    getReaction(emoji) {
        const reaction = this.reactions.find(reaction => reaction.emoji === emoji);
        return MessageReaction.castToReaction(reaction);
    }

    /**
     * Removes a reaction from the message. If the count of the reaction is more than 1, it decrements the count.
     * If the count is 1, it removes the reaction entirely.
     * @param {string} emoji - The emoji representing the reaction.
     */
    removeReaction(emoji) {
        const reactions = this.reactions;
        const reaction = reactions.find(reaction => reaction.emoji === emoji);

        if (reaction) {
            reaction.decrement();

            if (reaction.count === 0) {
                reactions.splice(reactions.indexOf(reaction), 1);
            }
        }
    }

    /**
     * Converts the Message instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a Message instance.
     * @returns {Object} An object representation of the Message instance without underscores in the property names.
     */
    toJSON() {
        const { _id, chat, author, content, reactions, answer, editHistory, date } = this;
        return {
            _id,
            chat,
            author,
            content,
            reactions,
            answer,
            editHistory,
            date
        };
    }

}