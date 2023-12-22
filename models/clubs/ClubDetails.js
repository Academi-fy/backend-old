/**
 * @file ClubDetails.js - Module for representing the details of a club.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
/**
 * @description Class representing the details of a club.
 * @param {String} coverImage - The cover image of the club.
 * @param {String} description - The description of the club.
 * @param {String} location - The location of the club.
 * @param {String} meetingTime - The meeting time of the club.
 * @param {String} meetingDay - The meeting day of the club.
 * @param {Array<ClubRequirement>} requirements - The requirements of the club.
 * @param {Array<Tag>} tags - The tags of the club.
 * @param {Array<Event>} events - The events of the club.
 */
export default class ClubDetails {

    /**
     * @description Create a club details.
     * @param {String} coverImage - The cover image of the club.
     * @param {String} description - The description of the club.
     * @param {String} location - The location of the club.
     * @param {String} meetingTime - The meeting time of the club.
     * @param {String} meetingDay - The meeting day of the club.
     * @param {Array<ClubRequirement>} requirements - The requirements of the club.
     * @param {Array<Tag>} tags - The tags of the club.
     */
    constructor(
        coverImage,
        description,
        location,
        meetingTime,
        meetingDay,
        requirements,
        tags,
    ) {
        this._description = description;
        this._location = location;
        this._meetingTime = meetingTime;
        this._meetingDay = meetingDay;
        this._requirements = requirements;
        this._tags = tags;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = value;
    }

    get meetingTime() {
        return this._meetingTime;
    }

    set meetingTime(value) {
        this._meetingTime = value;
    }

    get meetingDay() {
        return this._meetingDay;
    }

    set meetingDay(value) {
        this._meetingDay = value;
    }

    get requirements() {
        return this._requirements;
    }

    set requirements(value) {
        this._requirements = value;
    }

    get tags() {
        return this._tags;
    }

    set tags(value) {
        this._tags = value;
    }

    /**
     * Cast an object into a ClubDetails instance.
     * @param {Object} clubDetailsObject - The object to be cast into a ClubDetails instance.
     * @returns {ClubDetails} A new ClubDetails instance.
     * @throws {TypeError} If the provided object is not valid or does not contain all the necessary properties.
     */
    static castToClubDetails(clubDetailsObject) {
        if (typeof clubDetailsObject !== 'object' || clubDetailsObject === null) {
            throw new TypeError('Invalid object. Cannot cast to ClubDetails.');
        }

        const { coverImage, description, location, meetingTime, meetingDay, requirements, tags } = clubDetailsObject;
        return new ClubDetails(coverImage, description, location, meetingTime, meetingDay, requirements, tags);
    }

    /**
     * Convert the ClubDetails instance into a JSON-friendly format.
     * @returns {Object} An object that contains all the properties of the ClubDetails instance.
     */
    toJSON() {
        const { description, location, meetingTime, meetingDay, requirements, tags } = this;
        return {
            description,
            location,
            meetingTime,
            meetingDay,
            requirements,
            tags
        };
    }

}