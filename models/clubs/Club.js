/**
 * @file Club.js - Module for handling clubs.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "../propertyValidation.js";
import cache from "../../cache.js";
import ClubSchema from "../../../mongoDb/schemas/clubs/ClubSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../../../mongoDb/collectionAccess.js";
import { findByRule } from "../findByRule.js";
import DatabaseError from "../../errors/DatabaseError.js";
import CacheError from "../../errors/CacheError.js";
import Event from "../events/Event.js";
import Chat from "../messages/Chat.js";
import User from "../users/User.js";

// Cache expiration time in milliseconds
const expirationTime = 5 * 60 * 1000;

/**
 * @description Class representing a Club
 * @param {String} _id - The id of the club.
 * @param {String} name - The name of the club.
 * @param {ClubDetails} details - The details of the club.
 * @param {Array<User>} leaders - The leaders of the club.
 * @param {Array<User>} members - The members of the club.
 * @param {Chat} chat - The chat of the club.
 * @param {Array<Event>} events - The events of the club.
 * @param {String} state - The state of the club. Valid states are:
 * 'SUGGESTED', 'REJECTED', 'APPROVED',
 * 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED',
 * 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * @param {Array<Club>} editHistory - The edit history of the club.
 */
export default class Club {

    /**
     * @description Create a club.
     * @param {String} name - The name of the club.
     * @param {ClubDetails} details - The details of the club.
     * @param {Array<String>} leaders - The ids of the leaders of the club.
     * @param {Array<String>} members - The ids of the members of the club.
     * @param {String} chat - The id of the chat of the club.
     * @param {Array<String>} events - The ids of the events of the club.
     * @param {String} state - The state of the club. Valid states are:
     * 'SUGGESTED', 'REJECTED', 'APPROVED',
     * 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED',
     * 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
     * @param {Array<Club>} editHistory - The edit history of the club.
     */
    constructor(
        name,
        details,
        leaders,
        members,
        chat,
        events,
        state,
        editHistory
    ) {
        this.name = name;
        this.details = details;
        this.leaders = leaders;
        this.members = members;
        this.chat = chat;
        this.events = events;
        this.state = state;
        this.editHistory = editHistory;
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
        if (![ 'SUGGESTED', 'REJECTED', 'APPROVED' ].includes(value)) throw new Error(`Invalid club state: ${ value }`);
        this.state = value;
    }

    get _editHistory() {
        return this.editHistory;
    }

    set _editHistory(value) {
        validateArray('Club edit history', value);
        this.editHistory = value;
    }

    /**
     * @description Update the club cache.
     * @return {Promise<Array<Club>>} The updated clubs.
     */
    static async updateClubCache() {

        cache.del('clubs');
        const clubsFromDb = await getAllDocuments(ClubSchema);

        const clubs = [];
        for (let club of clubsFromDb) {

            club = await this.populateClub(club);
            clubs.push(
                club
            );
        }

        cache.put('clubs', clubs, expirationTime);
        return clubs;

    }

    /**
     * @description Get all clubs.
     * @return {Promise<Array<Club>>} The clubs.
     */
    static async getAllClubs() {

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
     * @throws {Error} When the club is not found.
     */
    static async getClubById(clubId) {

        const clubs = await this.getAllClubs();

        const club = clubs.find(club => club._id === clubId);
        if (!club) throw new Error(`Failed to get club:\n${ clubId }`);

        return club;

    }

    /**
     * @description Get all clubs that match a rule.
     * @param {Object} rule - The rule to find the clubs by.
     * @return {Promise<Array<Club>>} The matching clubs.
     * @throws {Error} When no clubs match the rule.
     */
    static async getAllClubsByRule(rule) {

        const clubs = await this.getAllClubs();

        const matchingClubs = findByRule(clubs, rule);
        if (!matchingClubs) throw new Error(`Failed to get clubs with rule:\n${ rule }`);

        return matchingClubs;
    }

    /**
     * @description Create a club.
     * @param {Club} club - The club to create.
     * @return {Promise<Club>} The created club.
     * @throws {DatabaseError} When the club fails to be created in the database.
     * @throws {CacheError} When the club fails to be put in the cache.
     */
    static async createClub(club) {

        const clubs = await this.getAllClubs();

        club.chat = club.chat.id;

        let insertedClub = (await createDocument(ClubSchema, club)).populate([ 'leaders', 'members', 'chat', 'events' ]);
        if (!insertedClub) throw new DatabaseError(`Failed to create club:\n${ insertedClub }`);

        insertedClub = await this.populateClub(insertedClub);

        clubs.push(
            insertedClub
        );
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(insertedClub))

            if (!await verifyInCache(cache.get('clubs'), insertedClub, this.updateClubCache))
                throw new CacheError(`Failed to put club in cache:\n${ insertedClub }`);

        return insertedClub;
    }

    /**
     * @description Update a club.
     * @param {String} clubId - The ID of the club to update.
     * @param {Club} updateClub - The club to update.
     * @return {Promise<Club>} The updated club.
     * @throws {DatabaseError} When the club fails to be updated in the database.
     * @throws {CacheError} When the club fails to be updated in the cache.
     */
    static async updateClub(clubId, updateClub) {

        const clubs = await this.getAllClubs();

        let updatedClub = await updateDocument(ClubSchema, clubId, updateClub);
        if (!updatedClub) throw new DatabaseError(`Failed to update club:\n${ updatedClub }`);

        updatedClub = await this.populateClub(updatedClub);

        clubs.splice(clubs.findIndex(club => club._id === clubId), 1, updateClub);
        cache.put('clubs', clubs, expirationTime);

        if (!this.verifyClubInCache(updatedClub))

            if (!await verifyInCache(cache.get('clubs'), updatedClub, this.updateClubCache))
                throw new CacheError(`Failed to update club in cache:\n${ updatedClub }`);

        return updatedClub;
    }

    /**
     * @description Delete a club.
     * @param {String} clubId - The ID of the club to delete.
     * @return {Promise<Boolean>} The state of the deletion.
     * @throws {DatabaseError} When the club fails to be deleted from the database.
     * @throws {CacheError} When the club fails to be deleted from the cache.
     */
    static async deleteClub(clubId) {

        const deletedCourse = await deleteDocument(ClubSchema, clubId);
        if (!deletedCourse) throw new DatabaseError(`Failed to delete club: ${ clubId }`);

        const clubs = await this.getAllClubs();
        clubs.splice(clubs.findIndex(club => club._id === clubId), 1);
        cache.put('clubs', clubs, expirationTime);

        if (this.verifyClubInCache(deletedCourse))
            throw new CacheError(`Failed to delete club from cache:\n${ clubId }`);

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
     * @return {Promise<Club>} The populated club.
     */
    static async populateClub(club) {

        try {

            club = await club
                .populate([
                    {
                        path: 'leaders',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'members',
                        populate: User.getPopulationPaths()
                    },
                    {
                        path: 'chat',
                        populate: Chat.getPopulationPaths()
                    },
                    {
                        path: 'events',
                        populate: Event.getPopulationPaths()
                    },
                ]);

            const populatedClub = new Club(
                club.name,
                club.details,
                club.leaders,
                club.members,
                club.chat,
                club.events,
                club.state,
                club.editHistory
            );
            populatedClub._id = club._id.toString();

            return populatedClub;

        } catch (error) {
            throw new DatabaseError(`Failed to populate club:\n${ club }\n${ error }`);
        }
    }

    static getPopulationPaths(){
        return [
            { path: 'leaders' },
            { path: 'members' },
            { path: 'chat' },
            { path: 'events' },
        ]
    }

}