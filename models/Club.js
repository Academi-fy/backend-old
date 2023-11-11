import { validateArray, validateNotEmpty, validateObject, verifyInCache } from "./propertyValidation.js";
import cache from "../cache.js";
import ClubSchema from "../MongoDB/schemas/ClubSchema.js";
import { createDocument, deleteDocument, getAllDocuments, updateDocument } from "../MongoDB/collectionAccess.js";
import mongoose from "mongoose";

const expirationTime = 5 * 60 * 1000;

class Club {

    constructor(
        name = "Neue AG",
        details = {
            description: "",
            location: "",
            meetingTime: "",
            meetingDay: "",
            rules: [],
            events: []
        },
        leaders = [],
        members = [],
        chat = {}
    ) {
        this.name = name;
        this.details = details;
        this.leaders = leaders;
        this.members = members;
        this.chat = chat;
    }

    static async updateClubCache(){

        cache.get("clubs").clear();
        const clubs = await getAllDocuments(ClubSchema);
        cache.put('clubs', clubs, expirationTime);
        return clubs;

    }

    static async getClubs(){

        const cacheResults = cache.get('clubs');

        if(cacheResults){
            return cacheResults;
        } else return await this.updateClubCache();

    }

    static async getClub(clubId){
        return (await this.getClubs()).find(club => club.id === clubId);
    }

    static async createClub(club){

        club.id = new mongoose.Types.ObjectId();
        const clubs = await this.getClubs();

        const insertedClub = await createDocument(ClubSchema, club);
        clubs.push(insertedClub);
        cache.put('clubs', clubs, expirationTime);

        if(!await this.verifyClubInCache(insertedClub)) throw new Error(`Club could not be created:\n${insertedClub}`);

        return insertedClub;
    }

    static async updateClub(clubId, updatedClub){

        const clubs = await this.getClubs();
        clubs.splice(clubs.findIndex(club => club.id === clubId), 1, updatedClub);

        await updateDocument(ClubSchema, clubId, updatedClub);
        cache.put('clubs', clubs, expirationTime);

        if(!await this.verifyClubInCache(updatedClub)) throw new Error(`Club could not be updated:\n${updatedClub}`);

        return updatedClub;
    }

    static async deleteClub(clubId){

        const deletedCourse = await deleteDocument(ClubSchema, clubId);
        if(!deletedCourse) throw new Error(`Club could not be deleted: ${clubId}`);

        const clubs = await this.getClubs();
        clubs.splice(clubs.findIndex(club => club.id === clubId), 1);
        cache.put('clubs', clubs, expirationTime);

        if(await this.verifyClubInCache(deletedCourse)) throw new Error(`Club could not be deleted:\n${clubId}`);

        return deletedCourse;
    }

    static async verifyClubInCache(testClub){
        return await verifyInCache(await this.getClubs(), testClub, this.updateClubCache);
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

}