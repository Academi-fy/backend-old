/**
 * @description Represents the content of a message.
 * @property {String} type - The type of the message content. Valid values are: "FILE", "IMAGE", "POLL", "TEXT", "VIDEO".
 */
export default class MessageContent {

    /**
     * @description Constructs a new MessageContent instance.
     * @param {String} type - The type of the message content. Valid values are: "FILE", "IMAGE", "POLL", "TEXT", "VIDEO".
     */
    constructor(
        type
    ) {
        if (new.target === MessageContent) {
            throw new TypeError("Cannot construct MessageContent instances directly");
        }

        this.type = type;
        this.value = this.getValue();
    }

    getValue() {
        throw new TypeError("Cannot call abstract method getValue");
    }

    get _type() {
        return this.type;
    }

    set _type(value) {
        this.type = value;
    }

}