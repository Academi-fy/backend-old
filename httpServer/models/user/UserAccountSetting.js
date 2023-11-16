/**
 * @description Represents a user account setting.
 * @property {String} name - The name of the setting.
 * @property {String} value - The value of the setting.
 */
export default class UserAccountSetting {

    /**
     * @description Constructs a new UserAccountSetting instance.
     * @param {String} name - The name of the setting.
     * @param {String} value - The value of the setting.
     */
    constructor(
        name = "",
        value = ""
    ) {
        this.name = name;
        this.value = value;
    }

    get _name() {
        return this.name;
    }

    set _name(value) {
        this.name = value;
    }

    get _value() {
        return this.value;
    }

    set _value(value) {
        this.value = value;
    }
}