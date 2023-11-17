import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import ClubSchema from "../../../mongoDb/schemas/ClubSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import ClubDetails from "./ClubDetails.js";

// Cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * @description Class representing a Club.
 * @property {String} _id - The id of the club.
 * @property {String} name - The name of the club.
 * @property {ClubDetails} details - The details of the club.
 * @property {Array<User>} leaders - The leaders of the club.
 * @property {Array<User>} members - The members of the club.
 * @property {Chat} chat - The chat of the club.
 */
export default class Club {

    /**
     * @description Create a club.
     * @param {String} name - The name of the club.
     * @param {ClubDetails} details - The details of the club.
     * @param {Array<String>} leaders - The ids of the leaders of the club.
     * @param {Array<String>} members - The ids of the members of the club.
     * @param {String} chat - The id of the chat of the club.
     */
    constructor(
        name,
        details,
        leaders,
        members,
        chat
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
     * @return {Array<Club>} The updated clubs.
     */
    static async updateClubCache() {

        cache.get("clubs").clear();
        const clubsFromDb = getAllDocuments(ClubSchema);

        let clubs = [];
        for (const club in clubsFromDb) {
            clubs.push(
                club
                    .populate('chat')
                    .populate('leaders')
                    .populate('members')
                    .populate('details.events')
            );
        }

        cache.put('clubs', clubs, expirationTime);
        return clubs;

    }

    /**
     * @description Get all clubs.
     * @return {Array<Club>} The clubs.
     */
    static async getClubs() {

        const cacheResults = cache.get('clubs');

        if (cacheResults) {
            return cacheResults;
        }
        else return this.updateClubCache();

    }

    /**
     * @description Get a club by ID.
     * @param {String} clubId - The ID of the club.
     * @return {Club} The club.
     */
    static async getClubById(clubId) {
        return (this.getClubs()).find(club => club._id === clubId);
    }

    /**
     * @description Create a club.
     * @param {Club} club - The club to create.
     * @return {Club} The created club.
     */
    static async createClub(club) {

        const clubs = this.getClubs();

        const insertedClub = await createDocument(ClubSchema, club);
        if (!insertedClub) throw new Error(`Failed to create club:\n${ insertedClub }`);

        clubs.push(insertedClub
            .populate('chat')
            .populate('leaders')
            .populate('members')
            .populate('details.events')
        );
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(insertedClub))

            if(!verifyInCache(cache.get('clubs'), insertedClub, this.updateClubCache))
                throw new Error(`Failed to put club in cache:\n${ insertedClub }`);

        return insertedClub;
    }

    /**
     * @description Update a club.
     * @param {String} clubId - The ID of the club to update.
     * @param {Club} updateClub - The club to update.
     * @return {Club} The updated club.
     */
    static async updateClub(clubId, updateClub) {

        const clubs = this.getClubs();

        let updatedClub = await updateDocument(ClubSchema, clubId, updatedClub);
        if(!updatedClub) throw new Error(`Failed to update club:\n${ updatedClub }`);

        updatedClub = updatedClub
            .populate('chat')
            .populate('leaders')
            .populate('members')

        clubs.splice(clubs.findIndex(club => club._id === clubId), 1, updateClub);
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(updatedClub))

            if(!verifyInCache(cache.get('clubs'), updatedClub, this.updateClubCache))
                throw new Error(`Failed to update club in cache:\n${ updatedClub }`);

        return updatedClub;
    }

    /**
     * @description Delete a club.
     * @param {String} clubId - The ID of the club to delete.
     * @return {Boolean} The state of the deletion.
     */
    static async deleteClub(clubId) {

        const deletedCourse = await deleteDocument(ClubSchema, clubId);
        if (!deletedCourse) throw new Error(`Failed to delete club: ${ clubId }`);

        const clubs = this.getClubs();
        clubs.splice(clubs.findIndex(club => club._id === clubId), 1);
        cache.put('clubs', clubs, expirationTime);

        if (this.verifyClubInCache(deletedCourse))
            throw new Error(`Failed to delete club from cache:\n${ clubId }`);

        return true;
    }

    /**
     * @description Verify a club in cache.
     * @param {Object} testClub - The club to verify.
     * @return {Boolean} The result of the verification.
     */
    static async verifyClubInCache(testClub) {

        const cacheResults = cache.get('clubs').find(club => club._id === testClub._id);

        return Boolean(cacheResults);
    }

}