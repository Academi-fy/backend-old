import MessageContent from "../MessageContent.js";
import { validateNotEmpty, validatePoll } from "../../propertyValidation.js";

export default class PollContent extends MessageContent {

    constructor(
        value
    ) {
        const type = "POLL";
        validatePoll("PollContent value", value);

        super(type, value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("PollContent value", value);
        this.value = value;
    }

}