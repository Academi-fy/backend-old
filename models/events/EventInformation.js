/**
 * @file EventInformation.js - Module for representing an event information.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { Error } from "mongoose";
import JSON from "nodemon/lib/utils/index.js";

/**
 * @description Class for an event information.
 * @param {String} title - The title of the event information.
 * @param {Array<{ emoji : String, description : String }>} items - The description elements of the event information.
 * */
export default class EventInformation {

    /**
     * @description The constructor for an event information.
     * @param {String} title - The title of the event information.
     * @param {Array<{ emoji : String, description : String }>} items - The description elements of the event information.
     */
    constructor(
        title,
        items
    ) {


        this.validateItems(items);
        this._title = title;
        this._items = items;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get items() {
        return this._items;
    }

    set items(value) {
        this._items = value;
    }

    /**
     * Casts an object into an EventInformation instance.
     * @param {Object} eventInformation - The object to be cast into an EventInformation instance.
     * @returns {EventInformation} A new EventInformation instance.
     * @throws {TypeError} If the object cannot be cast into an EventInformation instance.
     */
    static castToEventInformation(eventInformation) {
        if (typeof eventInformation !== 'object' || eventInformation === null) {
            throw new TypeError('Invalid object. Cannot cast to EventInformation.');
        }
        const { title, items } = eventInformation;
        return new EventInformation(title, items);
    }

    /**
     * Converts the EventInformation instance into a JSON-friendly format.
     * This method is automatically called when JSON.stringify() is used on an EventInformation instance.
     * @returns {Object} An object representation of the EventInformation instance.
     */
    toJSON() {
        const { title, items } = this;
        return {
            title,
            items
        };
    }

    validateItems(items) {
        items.forEach(element => {
            if (!element.emoji || !element.description) {
                throw new Error(`Invalid event information item.\n`
                    + `Element: ${ JSON.stringify(element, null, 2) }\n`
                    + `Missing: ${ !element.emoji ? "emoji" : "" }${ !element.emoji && !element.description ? ", " : "" }${ !element.description ? "description" : "" }`);
            }
        })
    }

}