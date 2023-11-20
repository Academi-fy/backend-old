import { validateNotEmpty, validateObject } from "../../propertyValidation.js";

/**
 * @description The setup account model.
 * @param {String} id - The id of the setup account.
 * @param {String} schoolName - The name of the school of the setup account.
 * @param {School} school - The school of the setup account. Assigned once the school is created.
 * */
export default class SetupAccount {

    /**
     * @description Create a setup account.
     * @param {String} id - The id of the setup account.
     * @param {String} schoolName - The name of the school of the setup account.
     * @param {School} school - The school of the setup account. Assigned once the school is created.
     */
    constructor(
        id,
        schoolName,
        school
    ) {
        this.id = id;
        this.schoolName = schoolName;
        this.school = school;

        validateNotEmpty('Setup account id', id);
        validateNotEmpty('Setup account school name', schoolName);
        validateObject('Setup account school', school);
    }

    get _id() {
        return this.id;
    }

    set _id(id) {
        validateNotEmpty('Setup account id', id);
        this.id = id;
    }

    get _schoolName() {
        return this.schoolName;
    }

    set _schoolName(schoolName) {
        validateNotEmpty('Setup account school name', schoolName);
        this.schoolName = schoolName;
    }

    get _school() {
        return this.school;
    }

    set _school(school) {
        validateObject('Setup account school', school);
        this.school = school;
    }

    //TODO: caching

}