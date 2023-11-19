import {
    createDocument,
    deleteDocument,
    getDocument,
    getDocumentByRule,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import UserAccountSchema from "../../../mongoDb/schemas/user/UserAccountSchema.js";

/**
 * @description The model for a user account.
 * @param {String} user - The id of the user of the user account.
 * @param {String} username - The username of the user.
 * @param {String} password - The password of the user.
 * @param {Array<UserAccountSetting>} settings - The settings of the user.
 * */
export default class UserAccount {

    /**
     * @description The constructor for a user account.
     * @param {User} user - The user of the user account.
     * @param {String} username - The username of the user.
     * @param {String} password - The password of the user.
     * @param {Array<UserAccountSetting>} settings - The settings of the user.
     * @param {Array<String>} permissions - The permissions of the user.
     */
    constructor(
        user,
        username,
        password,
        settings,
        permissions
    ) {
        this.username = username;
        this.password = password;
        this.settings = settings;
        this.permissions = permissions;
    }

    get _user() {
        return this.user;
    }

    set _user(user) {
        this.user = user;
    }

    get _username() {
        return this.username;
    }

    set _username(username) {
        this.username = username;
    }

    get _password() {
        return this.password;
    }

    set _password(password) {
        this.password = password;
    }

    get _settings() {
        return this.settings;
    }

    set _settings(settings) {
        this.settings = settings;
    }

    get _permissions() {
        return this.permissions;
    }

    set _permissions(permissions) {
        this.permissions = permissions;
    }

    /**
    * @description Get a user account by its id.
    * @param {String} id - The id of the user account.
    * @return {Object} The user account.
    * */
    static getUserAccountById(id) {
        return getDocument('userAccounts', id);
    }

    /**
     * @description Get a user account by its username.
     * @param {String} username - The username of the user account.
     * @return {Object} The user account.
     */
    static getUserAccountByUsername(username) {
        return getDocumentByRule(UserAccountSchema, {
            username: username
        });
    }

    /**
     * @description Get a user account by its user.
     * @param {User} user - The user of the user account.
     * @return {Object} The user account.
     */
    static getUserAccountByUser(user) {
        return getDocumentByRule(UserAccountSchema, {
            user: {
                id: user._id
            }
        });
    }

    /**
     * @description Create a user account.
     * @param {UserAccount} userAccount - The user account to create.
     * @return {UserAccount} The created user account.
     */
    static async createUserAccount(userAccount) {

        const insertedUserAccount = await createDocument(UserAccountSchema, userAccount);
        if (!insertedUserAccount) throw new Error(`Failed to create user account:\n${ userAccount }`);

        return insertedUserAccount;
    }

    /**
     * @description Update a user account.
     * @param {UserAccount} userAccount - The user account to update.
     * @return {UserAccount} The updated user account.
     */
    static async updateUserAccount(userAccount) {

        const updatedUserAccount = await updateDocument(UserAccountSchema, userAccount._id, userAccount);
        if (!updatedUserAccount) throw new Error(`Failed to update user account:\n${ userAccount }`);

        return this.populateUserAccount(updatedUserAccount);

    }

    /**
     * @description Delete a user account.
     * @param {UserAccount} userAccount - The user account to delete.
     * @return {UserAccount} The deleted user account.
     */
    static async deleteUserAccount(userAccount) {

        const deletedUserAccount = await deleteDocument(UserAccountSchema, userAccount._id);
        if (!deletedUserAccount) throw new Error(`Failed to delete user account:\n${ userAccount }`);

        return deletedUserAccount;
    }

    /**
     * @description Populate a user account.
     * @param {Object} userAccount - The user account to populate.
     * @return {UserAccount} The populated user account.
     */
    static populateUserAccount(userAccount) {
        return userAccount
            .populate('user');
    }

}