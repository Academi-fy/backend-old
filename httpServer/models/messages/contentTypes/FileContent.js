/**
 * @file FileContent.js - Module for representing a file content of a message.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../propertyValidation.js";

export default class FileContent extends MessageContent {

    constructor(
        value
    ) {
        const type = "FILE";
        super(type, value);

        validateNotEmpty("FileContent value", value);
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        validateNotEmpty("FileContent value", value);
        this.value = value;
    }

}