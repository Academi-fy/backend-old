/**
 * @file UserAccount.js - Module for representing a user account. User accounts containt the privacy information of users.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import {
    createDocument,
    deleteDocument,
    getDocument,
    getDocumentsByRule,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import UserAccountSchema from "../../../mongoDb/schemas/user/UserAccountSchema.js";
import { validateArray, validateNotEmpty } from "../propertyValidation.js";
import DatabaseError from "../../errors/DatabaseError.js";
import UserAccountPermissions from "./UserAccountPermissions.js";

/**
 * @description The model for a users account.
 * @param {String} _id - The id of the users account.
 * @param {String} user - The id of the user of the users account.
 * @param {String} username - The username of the users.
 * @param {String} password - The password of the users.
 * @param {Array<String>} settings - The settings of the users.
 * @param {Array<String>} permissions - The permissions of the users.
 * */
export default class UserAccount {

    /**
     * @description The constructor for a users account.
     * @param {String} user - The id of the user that the account belongs to.
     * @param {String} username - The username of the users.
     * @param {String} password - The password of the users.
     * @param {Array<String>} settings - The settings of the users.
     * @param {Array<String>} permissions - The permissions of the users.
     */
    constructor(
        user,
        username,
        password,
        settings,
        permissions
    ) {
        this.user = user;
        this.username = username;
        this.password = password;
        this.settings = settings;
        this.permissions = permissions;

        for (let perm of permissions) {

            if (typeof perm !== 'string') throw new Error(`User account permissions must be of type string:\n${ perm }`);

            const allPerms = Object.keys(UserAccountPermissions);
            if (!allPerms.includes(perm)) throw new Error(`User account permission does not exist:\n${ perm }`);

        }

    }

    get _user() {
        return this.user;
    }

    set _user(value) {
        validateNotEmpty('User account user', value);
        this.user = value;
    }

    get _username() {
        return this.username;
    }

    set _username(value) {
        validateNotEmpty('User account username', value);
        this.username = value;
    }

    get _password() {
        return this.password;
    }

    set _password(value) {
        validateNotEmpty('User account password', value);
        this.password = value;
    }

    get _settings() {
        return this.settings;
    }

    set _settings(value) {
        validateArray('User account settings', value)
        this.settings = value;
    }

    get _permissions() {
        return this.permissions;
    }

    set _permissions(permissions) {
        validateArray('User account permissions', permissions);

        for (let perm of permissions) {

            if (typeof perm !== 'string') throw new Error(`User account permissions must be of type string:\n${ perm }`);

            const allPerms = Object.keys(UserAccountPermissions);
            if (!allPerms.includes(perm)) throw new Error(`User account permission does not exist:\n${ perm }`);

        }

        this.permissions = permissions;
    }

    /**
     * @description Get a users account by its id.
     * @param {String} id - The id of the users account.
     * @return {Promise<Object>} The users account.
     * */
    static async getUserAccountById(id) {
        const document = await getDocument(UserAccountSchema, id);
        return await this.populateUserAccount(document);
    }

    /**
     * @description Get a users account by its username.
     * @param {String} username - The username of the users account.
     * @return {Promise<UserAccount>} The users account.
     */
    static async getUserAccountByUsername(username) {
        const document = await getDocumentsByRule(UserAccountSchema, {
            username: username
        });

        return await this.populateUserAccount(document);
    }

    /**
     * @description Get a users account by its users.
     * @param {User} user - The users of the users account.
     * @return {Promise<UserAccount>} The users account.
     */
    static async getUserAccountByUser(user) {
        const document = await getDocumentsByRule(UserAccountSchema, {
            user: {
                id: user._id
            }
        });

        return await this.populateUserAccount(document);
    }

    /**
     * @description Create a users account.
     * @param {UserAccount} userAccount - The users account to create.
     * @return {Promise<UserAccount>} The created users account.
     * @throws {DatabaseError} When the users account is not created.
     */
    static async createUserAccount(userAccount) {

        const insertedUserAccount = await createDocument(UserAccountSchema, userAccount);
        if (!insertedUserAccount) throw new DatabaseError(`Failed to create user account:\n${ userAccount }`);

        return await this.populateUserAccount(insertedUserAccount);
    }

    /**
     * @description Update a users account.
     * @param {UserAccount} userAccount - The users account to update.
     * @return {Promise<UserAccount>} The updated users account.
     * @throws {DatabaseError} When the users account is not updated.
     */
    static async updateUserAccount(userAccount) {

        const updatedUserAccount = await updateDocument(UserAccountSchema, userAccount._id, userAccount);
        if (!updatedUserAccount) throw new DatabaseError(`Failed to update user account:\n${ userAccount }`);

        return await this.populateUserAccount(updatedUserAccount);

    }

    /**
     * @description Delete a users account.
     * @param {UserAccount} userAccount - The users account to delete.
     * @return {Promise<Boolean>} The deleted users account.
     * @throws {DatabaseError} When the users account is not deleted.
     */
    static async deleteUserAccount(userAccount) {

        const deletedUserAccount = await deleteDocument(UserAccountSchema, userAccount._id);
        if (!deletedUserAccount) throw new DatabaseError(`Failed to delete user account:\n${ userAccount }`);

        return true;
    }

    /**
     * @description Populate a users account.
     * @param {Object} userAccount - The users account to populate.
     * @return {Promise<UserAccount>} The populated users account.
     */
    static async populateUserAccount(userAccount) {

        try {

            userAccount = await userAccount
                .populate([
                    {
                        path: 'user',
                        populate: [
                            { path: 'classes' },
                            { path: 'extraCourses' }
                        ]
                    }
                ]);

            const populatedUserAccount = new UserAccount(
                userAccount.user,
                userAccount.username,
                userAccount.password,
                userAccount.settings,
                userAccount.permissions
            );
            populatedUserAccount._id = userAccount._id.toString();

            return populatedUserAccount;

        } catch (error) {
            throw new DatabaseError(`Failed to populate user account with id '${ userAccount._id }:'\n${ error }`);
        }

    }

    hasPermission(permission) {
        return this._permissions.includes(permission);
    }

}