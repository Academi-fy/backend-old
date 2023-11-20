import {
    createDocument,
    deleteDocument,
    getDocument,
    getDocumentByRule,
    updateDocument
} from "../../../mongoDb/collectionAccess.js";
import UserAccountSchema from "../../../mongoDb/schemas/user/UserAccountSchema.js";

/**
 * @description The model for a users account.
 * @param {String} id - The id of the users account.
 * @param {String} users - The id of the users of the users account.
 * @param {String} username - The username of the users.
 * @param {String} password - The password of the users.
 * @param {Array<UserAccountSetting>} settings - The settings of the users.
 * */
export default class UserAccount {

    /**
     * @description The constructor for a users account.
     * @param {String} id - The id of the users account.
     * @param {User} user - The users of the users account.
     * @param {String} username - The username of the users.
     * @param {String} password - The password of the users.
     * @param {Array<UserAccountSetting>} settings - The settings of the users.
     * @param {Array<String>} permissions - The permissions of the users.
     */
    constructor(
        id,
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

    get _id() {
        return this.id;
    }

    set _id(id) {
        this.id = id;
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

    hasPermission(permission) {
        return this._permissions.includes(permission);
    }

    /**
     * @description Get a users account by its id.
     * @param {String} id - The id of the users account.
     * @return {Promise<Object>} The users account.
     * */
    static async getUserAccountById(id) {
        return await getDocument('userAccounts', id);
    }

    /**
     * @description Get a users account by its username.
     * @param {String} username - The username of the users account.
     * @return {Promise<UserAccount>} The users account.
     */
    static async getUserAccountByUsername(username) {
        return await getDocumentByRule(UserAccountSchema, {
            username: username
        });
    }

    /**
     * @description Get a users account by its users.
     * @param {User} user - The users of the users account.
     * @return {Promise<UserAccount>} The users account.
     */
    static async getUserAccountByUser(user) {
        return await getDocumentByRule(UserAccountSchema, {
            user: {
                id: user._id
            }
        });
    }

    /**
     * @description Create a users account.
     * @param {UserAccount} userAccount - The users account to create.
     * @return {Promise<UserAccount>} The created users account.
     */
    static async createUserAccount(userAccount) {

        const insertedUserAccount = await createDocument(UserAccountSchema, userAccount);
        if (!insertedUserAccount) throw new Error(`Failed to create user account:\n${ userAccount }`);

        return insertedUserAccount;
    }

    /**
     * @description Update a users account.
     * @param {UserAccount} userAccount - The users account to update.
     * @return {Promise<UserAccount>} The updated users account.
     */
    static async updateUserAccount(userAccount) {

        const updatedUserAccount = await updateDocument(UserAccountSchema, userAccount._id, userAccount);
        if (!updatedUserAccount) throw new Error(`Failed to update user account:\n${ userAccount }`);

        return this.populateUserAccount(updatedUserAccount);

    }

    /**
     * @description Delete a users account.
     * @param {UserAccount} userAccount - The users account to delete.
     * @return {Promise<Boolean>} The deleted users account.
     */
    static async deleteUserAccount(userAccount) {

        const deletedUserAccount = await deleteDocument(UserAccountSchema, userAccount._id);
        if (!deletedUserAccount) throw new Error(`Failed to delete user account:\n${ userAccount }`);

        return true;
    }

    /**
     * @description Populate a users account.
     * @param {Object} userAccount - The users account to populate.
     * @return {UserAccount} The populated users account.
     */
    static populateUserAccount(userAccount) {
        return userAccount
            .populate('user');
    }

}