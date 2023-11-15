import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import ClubSchema from "../../../mongoDb/schemas/ClubSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import mongoose from "mongoose";
import ClubDetails from "./ClubDetails.js";
import Chat from "../Chat.js";

// Cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * Class representing a Club.
 */
class Club {

    /**
     * @description Create a club.
     * @param {string} name - The name of the club.
     * @param {ClubDetails} details - The details of the club.
     * @param {Array} leaders - The leaders of the club.
     * @param {Array} members - The members of the club.
     * @param {Chat} chat - The chat of the club.
     */
    constructor(
        name = "Neue AG",
        details = new ClubDetails(),
        leaders = [],
        members = [],
        chat = new Chat()
    ) {
        this.name = name;
        this.details = details;
        this.leaders = leaders;
        this.members = members;
        this.chat = chat;
    }

    get _name() {
        return this.name;
    }

    set _name(value) {
        validateNotEmpty('Club name', value);
        this.name = value;
    }

    get _details() {
        return this.details;
    }

    set _details(value) {
        validateObject('Club details', value)
        validateNotEmpty('Club description', value.description);
        validateNotEmpty('Club location', value.location);
        validateNotEmpty('Club meeting time', value.meetingTime);
        validateNotEmpty('Club meeting day', value.meetingDay);
        validateArray('Club rules', value.rules);
        validateArray('Club events', value.events);

        this.details = value;
    }

    get _leaders() {
        return this.leaders;
    }

    set _leaders(value) {
        validateArray('Club leaders', value);
        this.leaders = value;
    }

    get _members() {
        return this.members;
    }

    set _members(value) {
        validateArray('Club members', value);
        this.members = value;
    }

    get _chat() {
        return this.chat;
    }

    set _chat(value) {
        validateObject('Club chat', value);
        this.chat = value;
    }

    /**
     * @description Update the club cache.
     * @return {Array} The updated clubs.
     */
    static async updateClubCache() {

        cache.get("clubs").clear();
        const clubs = await getAllDocuments(ClubSchema);
        cache.put('clubs', clubs, expirationTime);
        return clubs;

    }

    /**
     * @description Get all clubs.
     * @return {Array} The clubs.
     */
    static async getClubs() {

        const cacheResults = cache.get('clubs');

        if (cacheResults) {
            return cacheResults;
        }
        else return await this.updateClubCache();

    }

    /**
     * @description Get a club by ID.
     * @param {string} clubId - The ID of the club.
     * @return {Object} The club.
     */
    static async getClubById(clubId) {
        return (await this.getClubs()).find(club => club.id === clubId);
    }

    /**
     * @description Create a club.
     * @param {Object} club - The club to create.
     * @return {Object} The created club.
     */
    static async createClub(club) {

        club.id = new mongoose.Types.ObjectId();
        const clubs = await this.getClubs();

        const insertedClub = await createDocument(ClubSchema, club);
        clubs.push(insertedClub);
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(insertedClub)) throw new Error(`Failed to put club in cache:\n${ insertedClub }`);

        return insertedClub;
    }

    /**
     * @description Update a club.
     * @param {string} clubId - The ID of the club to update.
     * @param {Object} updatedClub - The updated club.
     * @return {Object} The updated club.
     */
    static async updateClub(clubId, updatedClub) {

        const clubs = await this.getClubs();
        clubs.splice(clubs.findIndex(club => club.id === clubId), 1, updatedClub);

        await updateDocument(ClubSchema, clubId, updatedClub);
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(updatedClub)) throw new Error(`Failed to update club in cache:\n${ updatedClub }`);

        return updatedClub;
    }

    /**
     * @description Delete a club.
     * @param {string} clubId - The ID of the club to delete.
     * @return {Object} The deleted club.
     */
    static async deleteClub(clubId) {

        const deletedCourse = await deleteDocument(ClubSchema, clubId);
        if (!deletedCourse) throw new Error(`Failed to delete club: ${ clubId }`);

        const clubs = await this.getClubs();
        clubs.splice(clubs.findIndex(club => club.id === clubId), 1);
        cache.put('clubs', clubs, expirationTime);

        if (this.verifyClubInCache(deletedCourse)) throw new Error(`Failed to delete club from cache:\n${ clubId }`);

        return deletedCourse;
    }

    /**
     * @description Verify a club in cache.
     * @param {Object} testClub - The club to verify.
     * @return {boolean} The result of the verification.
     */
    static async verifyClubInCache(testClub) {
        return verifyInCache(await this.getClubs(), testClub, this.updateClubCache);
    }

}

export default Club;