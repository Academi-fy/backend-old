import { validateNotEmpty } from "../propertyValidation.js";

/**
 * @description Class for an event information.
 * @param {String} title - The title of the event information.
 * @param {Array<{ emoji : String, description : String }>} descriptionElements - The description elements of the event information.
 * */
export default class EventInformation {

    /**
     * @description The constructor for an event information.
     * @param {String} title - The title of the event information.
     * @param {Array<{ emoji : String, description : String }>} descriptionElements - The description elements of the event information.
     */
    constructor(
        title,
        descriptionElements
    ) {
        this.title = title;
        this.descriptionElements = descriptionElements;

        validateNotEmpty('Event information title', title);
        this.validateDescriptionElements(descriptionElements);
    }

    get _title() {
        return this.title;
    }

    set _title(value) {
        validateNotEmpty('Event information title', value);
        this.title = value;
    }

    get _descriptionElements() {
        return this.descriptionElements;
    }

    set _descriptionElements(descriptionElements) {
        this.validateDescriptionElements(descriptionElements);
        this.descriptionElements = descriptionElements;
    }

    validateDescriptionElements(descriptionElements) {
        descriptionElements.forEach(element => {
            if (!element.emoji || !element.description) {
                throw new Error(`Invalid description element.\n`
                    + `Element: ${ JSON.stringify(element, null, 2) }\n`
                    + `Missing: ${ !element.emoji ? "emoji" : "" }${ !element.emoji && !element.description ? ", " : "" }${ !element.description ? "description" : "" }`);
            }
        })
    }

}