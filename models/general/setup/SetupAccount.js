/**
 * @file SetupAccount.js - Module for representing a setup account.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import BaseModel from "../../BaseModel.js";
import DatabaseError from "../../../httpServer/errors/DatabaseError.js";
import School from "./School.js";
import SetupAccountSchema from "../../../mongoDb/schemas/general/setup/SetupAccountSchema.js";

/**
 * @description The setup account model.
 * @param {String} _id - The _id of the setup account.
 * @param {String} schoolName - The name of the school of the setup account.
 * @param {School} school - The school of the setup account. Assigned once the school is created.
 * */
export default class SetupAccount extends BaseModel {

    static modelName = 'SetupAccount';
    static schema = SetupAccountSchema;
    static cacheKey = 'setupAccounts';
    static expirationTime = 15; // time in minutes after which the cache expires
    static populationPaths = [
        { path: 'school' }
    ];
    static castPaths = [
        { path: 'school', function: School.castToUser }
    ];

    /**
     * @description Create a setup account.
     * @param {String} schoolName - The name of the school of the setup account.
     * @param {School} school - The school of the setup account. Assigned once the school is created.
     */
    constructor(
        schoolName,
        school
    ) {
        super({
            schoolName,
            school
        });
        this.id = null;
        this._schoolName = schoolName;
        this._school = school;
    }

    get schoolName() {
        return this._schoolName;
    }

    set schoolName(value) {
        this._schoolName = value;
    }

    get school() {
        return this._school;
    }

    set school(value) {
        this._school = value;
    }

    get _id() {
        return this.id;
    }

    set _id(value) {
        this.id = value;
    }

    /**
     * Casts a plain object to an instance of the setup account class.
     * @param {Object} setupAccount - The plain object to cast.
     * @returns {SetupAccount} The cast instance of the School class.
     */
    static castToSetupAccount(setupAccount) {
        const { _id, schoolName, school } = setupAccount;
        const castSetupAccount = new SetupAccount(
            schoolName,
            school
        );
        castSetupAccount._id = _id.toString();
        return castSetupAccount;
    }

    /**
     * Populates the given SetupAccount with related data from other collections.
     * @param {Object} setupAccount - The SetupAccount to populate.
     * @returns {Promise<SetupAccount>} The populated SetupAccount.
     * @throws {DatabaseError} If the SetupAccount could not be populated.
     */
    static async populateSetupAccount(setupAccount) {
        try {
            setupAccount = await setupAccount
                .populate([
                    {
                        path: 'school',
                        populate: School.getPopulationPaths()
                    }
                ]);
            setupAccount._id = setupAccount._id.toString();

            let castSetupAccount = this.castToSetupAccount(setupAccount);
            castSetupAccount.handleProperties();
            return castSetupAccount;
        } catch (error) {
            throw new DatabaseError(`Failed to populate setup account with _id #${ setupAccount._id }' \n${ error.stack }`);
        }
    }

    /**
     * Calls the static populateSetupAccount method.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<SetupAccount>} The populated instance.
     * @throws {DatabaseError} If the instance could not be populated.
     */
    static async populate(object) {
        return await this.populateSetupAccount(object);
    }

    /**
     * Converts the SetupAccount instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a SetupAccount instance.
     * @returns {Object} An object representation of the SetupAccount instance without underscores in the property names.
     */
    toJSON() {
        const { _id, schoolName, school } = this;
        return {
            _id,
            schoolName,
            school
        };
    }

}