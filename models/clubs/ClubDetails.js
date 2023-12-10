/**
 * @file ClubDetails.js - Module for representing the details of a club.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateArray, validateNotEmpty } from "../propertyValidation.js";

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
        this.description = description;
        this.location = location;
        this.meetingTime = meetingTime;
        this.meetingDay = meetingDay;
        this.requirements = requirements;
        this.tags = tags;
    }

    get _description() {
        return this.description;
    }

    set _description(value) {
        validateNotEmpty('Club description', value);
        this.description = value;
    }

    get _location() {
        return this.location;
    }

    set _location(value) {
        validateNotEmpty('Club location', value);
        this.location = value;
    }

    get _meetingTime() {
        return this.meetingTime;
    }

    set _meetingTime(value) {
        validateNotEmpty('Club meeting time', value);
        this.meetingTime = value;
    }

    get _meetingDay() {
        return this.meetingDay;
    }

    set _meetingDay(value) {
        validateNotEmpty('Club meeting day', value);
        this.meetingDay = value;
    }

    get _requirements() {
        return this.requirements;
    }

    set _requirements(value) {
        validateArray('Club requirements', value);
        this.requirements = value;
    }

    get _tags() {
        return this.tags;
    }

    set _tags(value) {
        validateArray('Club tags', value);
        this.tags = value;
    }

}