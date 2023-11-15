/**
 * UserAccountSetting class
 * This class represents the settings of a user account.
 */
class UserAccountSetting {

    /**
     * @description Constructs a new UserAccountSetting instance.
     * @param {string} name - The name of the setting.
     * @param {string} value - The value of the setting.
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