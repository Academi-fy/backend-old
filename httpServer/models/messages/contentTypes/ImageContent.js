import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

export default class ImageContent extends MessageContent {

    constructor(
        value
    ) {
        const type = "IMAGE";
        super(type, value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("ImageContent value", value);
        this.value = value;
    }

}