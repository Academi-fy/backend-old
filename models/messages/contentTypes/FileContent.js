/**
 * @file FileContent.js - Module for representing a file content of a messages.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import MessageContent from "../MessageContent.js";
import { validateNotEmpty } from "../../../../models/propertyValidation.js";

/**
 * @description Class representing a file content.
 * @param {String} type - The type of the content. For file: 'FILE'
 * @param {String} value - The link to the file.
 * */
export default class FileContent extends MessageContent {

    /**
     * @description Create a file content.
     * @param {String} value - The link to the file.
     * */
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