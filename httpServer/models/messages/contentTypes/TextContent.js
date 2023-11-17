import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

export default class TextContent extends MessageContent {

    constructor(
        value
    ) {
        const type = "TEXT";
        super(type, value);
        validateNotEmpty("TextContent value", value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("TextContent value", value);
        this.value = value;
    }

}