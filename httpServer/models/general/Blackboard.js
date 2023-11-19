import cache from "../../cache.js";
import BlackboardSchema from "../../../mongoDb/schemas/general/BlackboardSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import { verifyInCache } from "../propertyValidation.js";

const expirationTime = 10 * 60 * 1000;

/**
 * @description Class representing a blackboard.
 * @param {String} _id - The id of the blackboard.
 * @param {String} title - The title of the blackboard.
 * @param {User} author - The author of the blackboard.
 * @param {String} coverImage - The cover image of the blackboard.
 * @param {String} text - The text of the blackboard.
 * */
export default class Blackboard {

    /**
     * @description Create a blackboard.
     * @param {String} title - The title of the blackboard.
     * @param {String} author - The id of the author of the blackboard.
     * @param {String} coverImage - The cover image of the blackboard.
     * @param {String} text - The text of the blackboard.
     */
    constructor(
        title,
        author,
        coverImage,
        text
    ) {
        this.title = title;
        this.author = author;
        this.coverImage = coverImage;
        this.text = text;
    }

    get _title() {
        return this.title;
    }

    set _title(title) {
        this.title = title;
    }

    get _author() {
        return this.author;
    }

    set _author(author) {
        this.author = author;
    }

    get _coverImage() {
        return this.coverImage;
    }

    set _coverImage(coverImage) {
        this.coverImage = coverImage;
    }

    get _text() {
        return this.text;
    }

    set _text(text) {
        this.text = text;
    }

    /**
     * Update the cache of blackboards.
     * @return {Array<Blackboard>} The updated list of blackboards.
     */
    static updateBlackboardCache() {

        cache.get("blackboards").clear();
        const blackboardsFromDb = getAllDocuments(BlackboardSchema);

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
     * @return {Array<Blackboard>} The list of blackboards.
     */
    static getBlackboards() {

        const blackboards = cache.get("blackboards");

        if (blackboards) {
            return blackboards;
        }
        return this.updateBlackboardCache();
    }

    /**
     * Get a blackboard by id.
     * @param {String} id - The id of the blackboard.
     * @return {Blackboard} The blackboard.
     */
    static getBlackboardById(id) {

        const blackboards = this.getBlackboards();

        const blackboard = blackboards.find(blackboard => blackboard._id.toString() === id);
        if (!blackboard) throw new Error(`Failed to find blackboard with id:\n${ id }`);

        return blackboard;

    }

    /**
     * Create a new blackboard.
     * @param {Blackboard} blackboard - The blackboard to create.
     * @return {Blackboard} The created blackboard.
     */
    static async createBlackboard(blackboard) {

        const blackboards = this.getBlackboards();

        const insertedBlackboard = await createDocument(BlackboardSchema, blackboard);
        if (!insertedBlackboard) throw new Error(`Failed to create blackboard:\n${ blackboard }`);

        blackboards.push(
            this.populateBlackboard(insertedBlackboard)
        );
        cache.put('blackboards', blackboards, expirationTime);

        if (!this.verifyBlackboardInCache(insertedBlackboard))

            if (!verifyInCache(cache.get('blackboards'), insertedBlackboard, this.updateBlackboardCache))
                throw new Error(`Failed to put blackboard in cache:\n${ insertedBlackboard }`);

        return insertedBlackboard;
    }

    /**
     * Update a message.
     * @param {String} blackboardId - The ID of the blackboard to update.
     * @param {Blackboard} updateBlackboard - The updated blackboard object.
     * @return {Blackboard} The updated blackboard object.
     */
    static async updateBlackboard(blackboardId, updateBlackboard) {

        const blackboards = this.getBlackboards();

        let updatedBlackboard = await updateDocument(BlackboardSchema, blackboardId, updateBlackboard);
        if (!updatedBlackboard) throw new Error(`Failed to update blackboard:\n${ updateBlackboard }`);

        updatedBlackboard = this.populateBlackboard(updatedBlackboard);

        blackboards.splice(blackboards.findIndex(blackboard => blackboard._id.toString() === blackboardId), 1, updatedBlackboard);
        cache.put('blackboards', blackboards, expirationTime);

        if (!this.verifyBlackboardInCache(updatedBlackboard))

            if (!verifyInCache(cache.get('blackboards'), updatedBlackboard, this.updateBlackboardCache))
                throw new Error(`Failed to put blackboard in cache:\n${ updatedBlackboard }`);

        return updatedBlackboard;
    }

    /**
     * Delete a blackboard.
     * @param {String} blackboardId - The ID of the blackboard to delete.
     * @return {Boolean} True if the blackboard was deleted, false otherwise.
     */
    static async deleteBlackboard(blackboardId) {

        const deleteBlackboard = await deleteDocument(BlackboardSchema, blackboardId);
        if (!deleteBlackboard) throw new Error(`Failed to delete blackboard with id:\n${ blackboardId }`);

        const blackboards = this.getBlackboards();
        blackboards.splice(blackboards.findIndex(blackboard => blackboard._id.toString() === blackboardId), 1);
        cache.put('blackboards', blackboards, expirationTime);

        if (this.verifyBlackboardInCache(deleteBlackboard))
            throw new Error(`Failed to delete blackboard in cache:\n${ deleteBlackboard }`);


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