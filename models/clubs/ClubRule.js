import { validateNotEmpty } from "../propertyValidation.js";

class ClubRule {

    constructor(
        emoji = "",
        description = ""
    ) {
        this.emoji = emoji;
        this.description = description;
    }

    get _emoji() {
        return this.emoji;
    }

    set _emoji(value) {
        validateNotEmpty('Club rule emoji', value);
        this.emoji = value;
    }

    get _description() {
        return this.description;
    }

    set _description(value) {
        validateNotEmpty('Club rule description', value);
        this.description = value;
    }

}

export default ClubRule;