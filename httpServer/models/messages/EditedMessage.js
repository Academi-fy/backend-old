import { validateNotEmpty, validateNumber } from "../propertyValidation.js";

/**
 * @description Represents a message that has been edited.
 * @param {Number} updatedDate - The date when the message was updated. Defaults to current date and time.
 * @param {FileContent | ImageContent | PollContent | TextContent | VideoContent} oldContent - The old content of the message.
 * @param {FileContent | ImageContent | PollContent | TextContent | VideoContent} newContent - The new content of the message.
 */
export default class EditedMessage {

    /**
     * Constructs a new EditedMessage instance.
     * @param {Number} updatedDate - The date when the message was updated. Defaults to current date and time.
     * @param {FileContent | ImageContent | PollContent | TextContent | VideoContent} oldContent - The old content of the message.
     * @param {FileContent | ImageContent | PollContent | TextContent | VideoContent} newContent - The new content of the message.
     */
    constructor(
        updatedDate,
        oldContent,
        newContent
    ) {
        this.updatedDate = updatedDate;
        this.oldContent = oldContent;
        this.newContent = newContent;
    }

    get _updatedDate() {
        return this.updatedDate;
    }

    set _updatedDate(value) {
        validateNumber('EditedMessage updated date', value);
        this.updatedDate = value;
    }

    get _oldContent() {
        return this.oldContent;
    }

    set _oldContent(value) {
        validateNotEmpty("EditedMessage old content", value);
        this.oldContent = value;
    }

    get _newContent() {
        return this.newContent;
    }

    set _newContent(value) {
        validateNotEmpty("EditedMessage new content", value);
        this.newContent = value;
    }

}