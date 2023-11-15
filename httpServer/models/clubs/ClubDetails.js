import { validateArray, validateNotEmpty } from "../propertyValidation.js";

class ClubDetails {

    /**
     * Create a club details.
     * @param {string} coverImage - The cover image of the club.
     * @param {string} description - The description of the club.
     * @param {string} location - The location of the club.
     * @param {string} meetingTime - The meeting time of the club.
     * @param {string} meetingDay - The meeting day of the club.
     * @param {Array} requirements - The requirements of the club.
     * @param {Array} events - The events of the club.
     */
    constructor(
        coverImage = "", //TODO getters and setters
        description = "",
        location = "",
        meetingTime = "",
        meetingDay = "",
        requirements = [], // wie information bei event
        events = []
    ) {
        this.description = description;
        this.location = location;
        this.meetingTime = meetingTime;
        this.meetingDay = meetingDay;
        this.requirements = requirements;
        this.events = events;
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

    get _events() {
        return this.events;
    }

    set _events(value) {
        validateArray('Club events', value);
        this.events = value;
    }

}

export default ClubDetails;