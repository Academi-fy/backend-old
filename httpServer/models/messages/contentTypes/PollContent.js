import MessageContent from "../MessageContent.js";
import { validateNotEmpty, validatePoll } from "../../propertyValidation.js";

export default class PollContent extends MessageContent {

    constructor(
        value
    ) {
        const type = "POLL";
        super(type, value);

        validatePoll("PollContent value", value);
        validateNotEmpty("PollContent value", value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("PollContent value", value);
        this.value = value;
    }

}