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
 * @param {String} id - The id of the setup account.
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
        this._id = null;
        this._schoolName = schoolName;
        this._school = school;
    }

    /**
     * Casts a plain object to an instance of the setup account class.
     * @param {Object} setupAccount - The plain object to cast.
     * @returns {SetupAccount} The cast instance of the School class.
     */
    static castToSetupAccount(setupAccount) {
        const { id, schoolName, school } = setupAccount;
        const castSetupAccount = new SetupAccount(
            schoolName,
            school
        );
        castSetupAccount.id = id.toString();
        return castSetupAccount;
    }

    /**
     * Converts the SetupAccount instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a SetupAccount instance.
     * @returns {Object} An object representation of the SetupAccount instance without underscores in the property names.
     */
    toJSON(){
        const { id, schoolName, school } = this;
        return {
            id,
            schoolName,
            school
        };
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
            setupAccount.id = setupAccount._id.toString();

            return this.castToSetupAccount(setupAccount);
        } catch (error) {
            // here setupAccount._id is used instead of setupAccount.id because setupAccount is an instance of the mongoose model
            throw new DatabaseError(`Failed to populate setup account with id #${setupAccount._id}' \n${ error.stack }`);
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

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

}