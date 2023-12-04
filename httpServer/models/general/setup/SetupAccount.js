/**
 * @file SetupAccount.js - Module for representing a setup account.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import { validateNotEmpty, validateObject } from "../../propertyValidation.js";
import {
    createDocument, deleteDocument,
    getDocument,
    getDocumentByRule,
    updateDocument
} from "../../../../mongoDb/collectionAccess.js";
import DatabaseError from "../../../errors/DatabaseError.js";
import SetupAccountSchema from "../../../../mongoDb/schemas/general/setup/SetupAccountSchema.js";

/**
 * @description The setup account model.
 * @param {String} _id - The id of the setup account.
 * @param {String} schoolName - The name of the school of the setup account.
 * @param {School} school - The school of the setup account. Assigned once the school is created.
 * */
export default class SetupAccount {

    /**
     * @description Create a setup account.
     * @param {String} schoolName - The name of the school of the setup account.
     * @param {School} school - The school of the setup account. Assigned once the school is created.
     */
    constructor(
        schoolName,
        school
    ) {
        this.schoolName = schoolName;
        this.school = school;
    }

    get _schoolName() {
        return this.schoolName;
    }

    set _schoolName(value) {
        validateNotEmpty('Setup account school name', value);
        this.schoolName = value;
    }

    get _school() {
        return this.school;
    }

    set _school(value) {
        validateObject('Setup account school', value);
        this.school = value;
    }

    /**
     * @description Get a setup account by its id.
     * @param {String} id - The id of the setup account.
     * @return {Promise<Object>} The setup account.
     * */
    static async getSetupAccountById(id) {
        const document = await getDocument(SetupAccountSchema, id);
        if (!document) throw new DatabaseError(`Failed to get setup account with id '${ id }'`);

        return await this.populateSetupAccount(document);
    }

    /**
     * @description Get a setup account by its school.
     * @param {School} school - The setup of the setup account.
     * @return {Promise<SetupAccount>} The setup account.
     */
    static async getSetupAccountBySchool(school) {
        const document = await getDocumentByRule(SetupAccountSchema, {
            school: {
                id: school._id
            }
        });

        if (!document) throw new DatabaseError(`Failed to get setup account with school:\n${ school }`);

        return await this.populateSetupAccount(document);
    }

    /**
     * @description Create a setup account.
     * @param {SetupAccount} setupAccount - The setup account to create.
     * @return {Promise<SetupAccount>} The created setup account.
     * @throws {DatabaseError} When the setup account is not created.
     */
    static async createSetupAccount(setupAccount) {

        const insertedSetupAccount = await createDocument(SetupAccountSchema, setupAccount);
        if (!insertedSetupAccount) throw new DatabaseError(`Failed to create setup account:\n${ setupAccount }`);

        return await this.populateSetupAccount(insertedSetupAccount);
    }

    /**
     * @description Update a setup account.
     * @param {SetupAccount} setupAccount - The setup account to update.
     * @return {Promise<SetupAccount>} The updated setup account.
     * @throws {DatabaseError} When the setup account is not updated.
     */
    static async updateSetupAccount(setupAccount) {

        const updatedSetupAccount = await updateDocument(SetupAccountSchema, setupAccount._id, setupAccount);
        if (!updatedSetupAccount) throw new DatabaseError(`Failed to update setup account:\n${ setupAccount }`);

        return await this.populateSetupAccount(updatedSetupAccount);

    }

    /**
     * @description Delete a setup account.
     * @param {SetupAccount} setupAccount - The setup account to delete.
     * @return {Promise<Boolean>} The deleted setup account.
     * @throws {DatabaseError} When the setup account is not deleted.
     */
    static async deleteSetupAccount(setupAccount) {

        const deletedSetupAccount = await deleteDocument(SetupAccountSchema, setupAccount._id);
        if (!deletedSetupAccount) throw new DatabaseError(`Failed to delete setup account:\n${ setupAccount }`);

        return true;
    }

    /**
     * @description Populate a setup account.
     * @param {Object} setupAccount - The setup account to populate.
     * @return {Promise<SetupAccount>} The populated setup account.
     */
    static async populateSetupAccount(setupAccount) {

        try {

            setupAccount = await setupAccount
                                    .populate([
                                        {
                                            path: 'school',
                                            populate: [
                                                { path: 'grades' },
                                                { path: 'courses' },
                                                { path: 'members' },
                                                { path: 'classes' },
                                                { path: 'messages' },
                                                { path: 'subjects' },
                                                { path: 'clubs' },
                                                { path: 'events' },
                                                { path: 'blackboards' },

                                            ]
                                        }
                                    ]);

            const populatedSetupAccount = new SetupAccount(
                setupAccount.schoolName,
                setupAccount.school
            );
            populatedSetupAccount._id = setupAccount._id;

            return populatedSetupAccount;

        }
        catch (error) {
            throw new DatabaseError(`Failed to populate setup account with id '${ setupAccount._id }:'\n${ error }`);
        }

    }

}