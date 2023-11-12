import { validateDate, validateNotEmpty } from "../propertyValidation.js";

class EditedMessage {

    constructor(
        updatedDate = Date.now(),
        oldContent = "",
        newContent = ""
    ) {
        this.updatedDate = updatedDate;
        this.oldContent = oldContent;
        this.newContent = newContent;
    }

    get _updatedDate() {
        return this.updatedDate;
    }

    set _updatedDate(value) {
        validateDate("EditedMessage updated date", value);
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