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
} from "../../mongoDb/mongoAccess.js";
import UserAccountSchema from "../../mongoDb/schemas/user/UserAccountSchema.js";
import DatabaseError from "../../httpServer/errors/DatabaseError.js";
import UserAccountPermissions from "./UserAccountPermissions.js";
import User from "./User.js";

/**
 * @description The model for a users account.
 * @param {String} _id - The _id of the users account.
 * @param {String} user - The _id of the user of the users account.
 * @param {String} username - The username of the users.
 * @param {String} password - The password of the users.
 * @param {Array<String>} settings - The settings of the users.
 * @param {Array<String>} permissions - The permissions of the users.
 * */
export default class UserAccount {

    /**
     * @description The constructor for a users account.
     * @param {String} user - The _id of the user that the account belongs to.
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
        this.user = value;
    }

    get _username() {
        return this.username;
    }

    set _username(value) {
        this.username = value;
    }

    get _password() {
        return this.password;
    }

    set _password(value) {
        this.password = value;
    }

    get _settings() {
        return this.settings;
    }

    set _settings(value) {
        this.settings = value;
    }

    get _permissions() {
        return this.permissions;
    }

    set _permissions(permissions) {

        for (let perm of permissions) {

            if (typeof perm !== 'string') throw new Error(`User account permissions must be of type string:\n${ perm }`);

            const allPerms = Object.keys(UserAccountPermissions);
            if (!allPerms.includes(perm)) throw new Error(`User account permission does not exist:\n${ perm }`);

        }

        this.permissions = permissions;
    }

    /**
     * Casts a plain object to an instance of the User class.
     * @param {Object} userAccount - The plain object to cast.
     * @returns {UserAccount} The cast instance of the User class.
     */
    static castToUserAccount(userAccount) {
        const { _id, user, username, password, settings, permissions } = userAccount;
        const castUserAccount = new UserAccount(
            user,
            username,
            password,
            settings,
            permissions
        );
        castUserAccount._id = _id.toString();
        return castUserAccount;
    }

    /**
     * @description Get a users account by its _id.
     * @param {String} _id - The _id of the users account.
     * @return {Promise<Object>} The users account.
     * */
    static async getUserAccountById(_id) {
        const document = await getDocument(UserAccountSchema, _id);
        return await UserAccount.populateUserAccount(document);
    }

    /**
     * @description Get a users account by its username.
     * @param {Object} rule - The username of the users account.
     * @return {Promise<UserAccount>} The users account.
     */
    static async getAllUserAccountsByRule(rule) {
        const documents = await getDocumentsByRule(UserAccountSchema, rule);

        let userAccounts = [];
        for(let doc of documents) {
            userAccounts.push(
                await UserAccount.populateUserAccount(doc)
            );
        }
        return userAccounts;
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
     * @param {String} _id - The _id of the users account to update.
     * @param {UserAccount} userAccount - The users account to update.
     * @return {Promise<UserAccount>} The updated users account.
     * @throws {DatabaseError} When the users account is not updated.
     */
    static async updateUserAccount(_id, userAccount) {

        const updatedUserAccount = await updateDocument(UserAccountSchema, _id, userAccount);
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
                        populate: User.getPopulationPaths()
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
            userAccount.user = userAccount.user ? User.castToUser(userAccount.user) : null;

            return populatedUserAccount;

        } catch (error) {
            throw new DatabaseError(`Failed to populate user account with _id '${ userAccount._id }:'\n${ error }`);
        }

    }

    /**
     * Converts the User instance into a JSON-friendly format by removing the underscores from the property names.
     * This method is automatically called when JSON.stringify() is used on a User instance.
     * @returns {Object} An object representation of the User instance without underscores in the property names.
     */
    toJSON() {
        const { _id, user, username, password, settings, permissions } = this;
        return {
            _id,
            user,
            username,
            password,
            settings,
            permissions
        };
    }

    hasPermission(permission) {
        return this._permissions.includes(permission);
    }

}