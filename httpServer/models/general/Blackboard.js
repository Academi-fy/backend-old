/**
 * @file Blackboard.js - Module for representing a blackboard.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import cache from "../../cache.js";
import BlackboardSchema from "../../../mongoDb/schemas/general/BlackboardSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import { validateNotEmpty, validateNumber, verifyInCache } from "../propertyValidation.js";
import { findByRule } from "../findByRule.js";
import RetrievalError from "../../errors/RetrievalError.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";

const expirationTime = 10 * 60 * 1000;

/**
 * @description Class representing a blackboard.
 * @param {String} id - The id of the blackboard.
 * @param {String} title - The title of the blackboard.
 * @param {User} author - The author of the blackboard.
 * @param {String} coverImage - The cover image of the blackboard.
 * @param {String} text - The text of the blackboard.
 * @param {Number} date - The date of the blackboard.
 * */
export default class Blackboard {

    /**
     * @description Create a blackboard.
     * @param {String} id - The id of the blackboard.
     * @param {String} title - The title of the blackboard.
     * @param {String} author - The id of the author of the blackboard.
     * @param {String} coverImage - The cover image of the blackboard.
     * @param {String} text - The text of the blackboard.
     * @param {Number} date - The date of the blackboard.
     */
    constructor(
        id,
        title,
        author,
        coverImage,
        text,
        date
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.coverImage = coverImage;
        this.text = text;
        this.date = date;

        validateNotEmpty('Blackboard id', id);
        validateNotEmpty('Blackboard title', title);
        validateNotEmpty('Blackboard author', author);
        validateNotEmpty('Blackboard cover image', coverImage);
        validateNotEmpty('Blackboard text', text);
        validateNumber('Blackboard date', date);
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNotEmpty('Blackboard id', value);
        this.id = value;
    }

    get _title() {
        return this.title;
    }

    set _title(value) {
        validateNotEmpty('Blackboard title', value);
        this.title = value;
    }

    get _author() {
        return this.author;
    }

    set _author(value) {
        validateNotEmpty('Blackboard author', value);
        this.author = value;
    }

    get _coverImage() {
        return this.coverImage;
    }

    set _coverImage(value) {
        validateNotEmpty('Blackboard cover image', value);
        this.coverImage = value;
    }

    get _text() {
        return this.text;
    }

    set _text(value) {
        validateNotEmpty('Blackboard text', value);
        this.text = value;
    }

    get _date() {
        return this.date;
    }

    set _date(value) {
        validateNumber('Blackboard date', value);
        this.date = value;
    }

    /**
     * Update the cache of blackboards.
     * @return {Promise<Array<Blackboard>>} The updated list of blackboards.
     */
    static async updateBlackboardCache() {

        cache.del('blackboards');
        const blackboardsFromDb = await getAllDocuments(BlackboardSchema);

        const blackboards = [];
        for (const blackboard of blackboardsFromDb) {
            blackboards.push(
                this.populateBlackboard(blackboard)
            );
        }

        cache.put('blackboards', blackboards, expirationTime);
        return blackboards;
    }

    /**
     * Get all blackboards.
     * @return {Promise<Array<Blackboard>>} The list of blackboards.
     */
    static async getAllBlackboards() {

        const blackboards = cache.get("blackboards");

        if (blackboards) {
            return blackboards;
        }
        return await this.updateBlackboardCache();
    }

    /**
     * Get a blackboard by id.
     * @param {String} id - The id of the blackboard.
     * @return {Promise<Blackboard>} The blackboard.
     * @throws {RetrievalError} When the blackboard could not be found.
     */
    static async getBlackboardById(id) {

        const blackboards = await this.getAllBlackboards();

        const blackboard = blackboards.find(blackboard => blackboard._id.toString() === id);
        if (!blackboard) throw new RetrievalError(`Failed to find blackboard with id:\n${ id }`);

        return blackboard;

    }

    /**
     * @description Get all blackboards that match the rule.
     * @param {Object} rule - The rule to find the blackboards by.
     * @return {Promise<Array<Blackboard>>} The matching blackboard.
     * @throws {RetrievalError} When the blackboards could not be found.
     */
    static async getAllBlackboardsByRule(rule) {

        const blackboards = await this.getAllBlackboards();

        const matchingBlackboards = findByRule(blackboards, rule);
        if (!matchingBlackboards) throw new RetrievalError(`Failed to find blackboards matching rule:\n${ rule }`);

        return matchingBlackboards;

    }

    /**
     * Create a new blackboard.
     * @param {Blackboard} blackboard - The blackboard to create.
     * @return {Promise<Blackboard>} The created blackboard.
     * @throws {DatabaseError} When the blackboard could not be created.
     * @throws {CacheError} When the blackboard could not be put in the cache.
     */
    static async createBlackboard(blackboard) {

        const blackboards = await this.getAllBlackboards();

        const insertedBlackboard = await createDocument(BlackboardSchema, blackboard);
        if (!insertedBlackboard) throw new DatabaseError(`Failed to create blackboard:\n${ blackboard }`);

        blackboards.push(
            this.populateBlackboard(insertedBlackboard)
        );
        cache.put('blackboards', blackboards, expirationTime);

        if (!this.verifyBlackboardInCache(insertedBlackboard))

            if (!await verifyInCache(cache.get('blackboards'), insertedBlackboard, this.updateBlackboardCache))
                throw new CacheError(`Failed to put blackboard in cache:\n${ insertedBlackboard }`);

        return insertedBlackboard;
    }

    /**
     * Update a message.
     * @param {String} blackboardId - The ID of the blackboard to update.
     * @param {Blackboard} updateBlackboard - The updated blackboard object.
     * @return {Promise<Blackboard>} The updated blackboard object.
     * @throws {DatabaseError} When the blackboard could not be updated.
     * @throws {CacheError} When the blackboard could not be put in the cache.
     */
    static async updateBlackboard(blackboardId, updateBlackboard) {

        const blackboards = await this.getAllBlackboards();

        let updatedBlackboard = await updateDocument(BlackboardSchema, blackboardId, updateBlackboard);
        if (!updatedBlackboard) throw new DatabaseError(`Failed to update blackboard:\n${ updateBlackboard }`);

        updatedBlackboard = this.populateBlackboard(updatedBlackboard);

        blackboards.splice(blackboards.findIndex(blackboard => blackboard._id.toString() === blackboardId), 1, updatedBlackboard);
        cache.put('blackboards', blackboards, expirationTime);

        if (!this.verifyBlackboardInCache(updatedBlackboard))

            if (!await verifyInCache(cache.get('blackboards'), updatedBlackboard, this.updateBlackboardCache))
                throw new CacheError(`Failed to put blackboard in cache:\n${ updatedBlackboard }`);

        return updatedBlackboard;
    }

    /**
     * Delete a blackboard.
     * @param {String} blackboardId - The ID of the blackboard to delete.
     * @return {Promise<Boolean>} True if the blackboard was deleted, false otherwise.
     * @throws {DatabaseError} When the blackboard could not be deleted.
     * @throws {CacheError} When the blackboard could not be deleted from the cache.
     */
    static async deleteBlackboard(blackboardId) {

        const deleteBlackboard = await deleteDocument(BlackboardSchema, blackboardId);
        if (!deleteBlackboard) throw new DatabaseError(`Failed to delete blackboard with id:\n${ blackboardId }`);

        const blackboards = await this.getAllBlackboards();
        blackboards.splice(blackboards.findIndex(blackboard => blackboard._id.toString() === blackboardId), 1);
        cache.put('blackboards', blackboards, expirationTime);

        if (this.verifyBlackboardInCache(deleteBlackboard))
            throw new CacheError(`Failed to delete blackboard in cache:\n${ deleteBlackboard }`);


        return true;
    }

    /**
     * Verify if a blackboard is in the cache.
     * @param {Blackboard} testBlackboard - The blackboard to which the message belongs.
     * @return {Boolean} True if the blackboard is in the cache, false otherwise.
     */
    static verifyBlackboardInCache(testBlackboard) {

        const cacheResult = cache.get('blackboards').find(blackboard => blackboard._id === testBlackboard._id);

        return Boolean(cacheResult);

    }

    /**
     * Populate a blackboard.
     * @param {Object} blackboard - The blackboard to populate.
     * @return {Blackboard} The populated blackboard.
     */
    static populateBlackboard(blackboard) {
        return blackboard
            .populate('author');
    }

}