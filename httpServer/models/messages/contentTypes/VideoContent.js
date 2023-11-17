import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

export default class VideoContent extends MessageContent {

    constructor(
        value
    ) {
        const type = "VIDEO";
        super(type, value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("VideoContent value", value);
        this.value = value;
    }

}