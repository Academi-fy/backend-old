/**
 * @file EventInformation.js - Module for representing an event information.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateNotEmpty } from "../propertyValidation.js";

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
        this.title = title;
        this.items = items;

        this.validateItems(items);
    }

    get _title() {
        return this.title;
    }

    set _title(value) {
        validateNotEmpty('Event information title', value);
        this.title = value;
    }

    get _items() {
        return this.items;
    }

    set _items(items) {
        this.validateItems(items);
        this.items = items;
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