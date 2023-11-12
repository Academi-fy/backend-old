class UserAccountSetting {

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