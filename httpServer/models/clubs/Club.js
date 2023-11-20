import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import ClubSchema from "../../../mongoDb/schemas/clubs/ClubSchema.js";
import {
    createDocument,
    deleteDocument,
    getAllDocuments,
    getDocument,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import { findByRule } from "../findByRule.js";

// Cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * @description Class representing a Club.
 * @param {String} id - The id of the club.
 * @param {String} name - The name of the club.
 * @param {ClubDetails} details - The details of the club.
 * @param {Array<User>} leaders - The leaders of the club.
 * @param {Array<User>} members - The members of the club.
 * @param {Chat} chat - The chat of the club.
 * @param {Array<Event>} events - The events of the club.
 * @param {String} state - The state of the club. Valid states are: 'SUGGESTED', 'REJECTED', 'ACCEPTED'.
 */
export default class Club {

    /**
     * @description Create a club.
     * @param {String} id - The id of the club.
     * @param {String} name - The name of the club.
     * @param {ClubDetails} details - The details of the club.
     * @param {Array<String>} leaders - The ids of the leaders of the club.
     * @param {Array<String>} members - The ids of the members of the club.
     * @param {String} chat - The id of the chat of the club.
     * @param {Array<String>} events - The ids of the events of the club.
     * @param {String} state - The state of the club. Valid states are: 'SUGGESTED', 'REJECTED', 'ACCEPTED'.
     */
    constructor(
        id,
        name,
        details,
        leaders,
        members,
        chat,
        events,
        state
    ) {
        this.id = id;
        this.name = name;
        this.details = details;
        this.leaders = leaders;
        this.members = members;
        this.chat = chat;
        this.events = events;
        this.state = state;

        validateNotEmpty('Club id', this.id);
        validateNotEmpty('Club name', this.name);
        validateObject('Club details', this.details);
        validateArray('Club leaders', this.leaders);
        validateArray('Club members', this.members);
        validateObject('Club chat', this.chat);
        validateArray('Club events', this.events);
        validateNotEmpty('Club state', this.state);
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        validateNotEmpty('Club id', value);
        this.id = value;
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

    get _events() {
        return this.events;
    }

    set _events(value) {
        validateArray('Club events', value);
        this.events = value;
    }

    get _state() {
        return this.state;
    }

    set _state(value) {
        validateNotEmpty('Club state', value);
        this.state = value;
    }

    /**
     * @description Update the club cache.
     * @return {Promise<Array<Club>>} The updated clubs.
     */
    static async updateClubCache() {

        cache.get("clubs").clear();
        const clubsFromDb = getAllDocuments(ClubSchema);

        let clubs = [];
        for (const club in clubsFromDb) {
            clubs.push(
                this.populateClub(club)
            );
        }

        cache.put('clubs', clubs, expirationTime);
        return clubs;

    }

    /**
     * @description Get all clubs.
     * @return {Promise<Array<Club>>} The clubs.
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
     * @param {String} clubId - The ID of the club.
     * @return {Promise<Club>} The club.
     */
    static async getClubById(clubId) {

        const clubs = await this.getClubs();

        const club = clubs.find(club => club._id === clubId);
        if (!club) throw new Error(`Failed to get club:\n${ clubId }`);

        return club;

    }

    /**
     * @description Get all clubs that match a rule.
     * @param {Object} rule - The rule to find the clubs by.
     * @return {Promise<Array<Club>>} The matching clubs.
     */
    static async getClubsByRule(rule) {

        const clubs = await this.getClubs();

        const matchingClubs = findByRule(clubs, rule);
        if (!matchingClubs) throw new Error(`Failed to get clubs with rule:\n${ rule }`);

        return matchingClubs;
    }

    /**
     * @description Create a club.
     * @param {Club} club - The club to create.
     * @return {Promise<Club>} The created club.
     */
    static async createClub(club) {

        const clubs = await this.getClubs();

        const insertedClub = await createDocument(ClubSchema, club);
        if (!insertedClub) throw new Error(`Failed to create club:\n${ insertedClub }`);

        clubs.push(
            this.populateClub(insertedClub)
        );
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(insertedClub))

            if (!await verifyInCache(cache.get('clubs'), insertedClub, this.updateClubCache))
                throw new Error(`Failed to put club in cache:\n${ insertedClub }`);

        return insertedClub;
    }

    /**
     * @description Update a club.
     * @param {String} clubId - The ID of the club to update.
     * @param {Club} updateClub - The club to update.
     * @return {Promise<Club>} The updated club.
     */
    static async updateClub(clubId, updateClub) {

        const clubs = await this.getClubs();

        let updatedClub = await updateDocument(ClubSchema, clubId, updatedClub);
        if (!updatedClub) throw new Error(`Failed to update club:\n${ updatedClub }`);

        updatedClub = this.populateClub(updatedClub);

        clubs.splice(clubs.findIndex(club => club._id === clubId), 1, updateClub);
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(updatedClub))

            if (!await verifyInCache(cache.get('clubs'), updatedClub, this.updateClubCache))
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

        const clubs = await this.getClubs();
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

    /**
     * @description Populate a club.
     * @param {Object} club - The club to populate.
     * @return {Club} The populated club.
     */
    static populateClub(club) {
        return club
            .populate('chat')
            .populate('leaders')
            .populate('members')
            .populate('details.events')
    }

}