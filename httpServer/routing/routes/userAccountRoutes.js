/**
 * @file index.js - Class handling the userAccount routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import UserAccount from "../../../models/users/UserAccount.js";

const router = express.Router();

// properties that are required for a userAccount
const requiredProperties = [ 'user', 'username', 'password', 'settings', 'permissions' ];

/**
 * @description Formats the request body into a userAccount
 * @param body - The request body
 * @returns {UserAccount} - The formatted userAccount
 * */
function bodyToUserAccount(body) {
    return UserAccount.castToUserAccount(body.userAccount);
}

/**
 * @description Gets all userAccounts existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<UserAccount>>} - The list of all userAccounts existing in the database
 * */
router.get('/', async (req, res) => {

    res.status(400).send(
        {
            errorCode: errors.server.document.query.failed,
            errorMessage: "Cannot query all user accounts at once. Please use the filter or id route.",
        }
    );

});

/**
 * @description Gets all userAccounts that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the userAccounts should match
 * @returns {JSON<Array<UserAccount>>} - The list of all userAccounts matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: UserAccount query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "UserAccount filter missing in body."
                }
            );
            return;
        }

        const userAccounts = await UserAccount.getAllUserAccountsByRule(filter);
        res.json(userAccounts)
    } catch (error) {
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.query.failed,
                errorMessage: error.stack,
            }
        );
    }

});

/**
 * @description Gets the userAccount matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the userAccount
 * @returns {JSON<UserAccount>} - The userAccount matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: UserAccount query from '${ req.ip }' does not contain user account id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "UserAccount id missing in URL."
                }
            );
            return;
        }

        const userAccount = await UserAccount.getUserAccountById(id);
        res.json(userAccount);
    } catch (error) {
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.query.failed,
                errorMessage: error.stack
            }
        );
    }

});

/**
 * @description Creates a userAccount
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.userAccount - The userAccount to be created
 * @returns {JSON<UserAccount>} - The created userAccount
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.userAccount, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: UserAccount creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "UserAccount missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/UserAccount]"
                }
            );
            return;
        }

        const newUserAccount = bodyToUserAccount(req.body);
        newUserAccount._id = req.body.userAccount._id.toString();

        if (!newUserAccount) {
            logger.server.error(`Request #${ req.requestId }: UserAccount creation from '${ req.ip }' does not contain user account in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "UserAccount missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/UserAccount]"
                }
            );
            return;
        }

        if (!newUserAccount._id) {
            logger.server.error(`Request #${ req.requestId }: UserAccount creation from '${ req.ip }' does not contain user account id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "UserAccount id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/UserAccount]"
                }
            );
            return;
        }

        const userAccount = await UserAccount.createUserAccount(newUserAccount);
        res.json(userAccount);
    } catch (error) {
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.creation.failed,
                errorMessage: error.stack
            }
        );
    }
});

/**
 * @description Updates a userAccount matching an id
 * @param req.params.id - The id of the userAccount to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.userAccount - The userAccount update
 * @returns {JSON<UserAccount>} - The updated userAccount
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.userAccount, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: UserAccount creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "UserAccount missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/UserAccount]"
                }
            );
            return;
        }

        const updatedUserAccount = bodyToUserAccount(req.body);
        updatedUserAccount._id = req.body.userAccount._id.toString();

        if (!updatedUserAccount) {
            logger.server.error(`Request #${ req.requestId }: UserAccount update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "UserAccount missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedUserAccount._id) {
            logger.server.error(`Request #${ req.requestId }: UserAccount update from '${ req.ip }' with URL '${ req.params.id }' does not match userAccount id in body '${ updatedUserAccount._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "UserAccount id in URL does not match userAccount id in body."
                }
            );
            return;
        }

        if (!updatedUserAccount._id) {
            logger.server.error(`Request #${ req.requestId }: UserAccount update from '${ req.ip }' with URL '${ req.params.id }' does not contain user account id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "UserAccount id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/UserAccount]"
                }
            );
            return;
        }

        if (await UserAccount.getUserAccountById(updatedUserAccount._id) === null) {
            logger.server.error(`Request #${ req.requestId }: UserAccount update from '${ req.ip }' with URL '${ req.url }' does not match any user account`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "UserAccount id in body does not match any user account."
                }
            );
            return;
        }

        const userAccount = await UserAccount.updateUserAccount(req.params.id, updatedUserAccount);
        res.json(userAccount);
    } catch (error) {
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: error.stack
            }
        );
    }

});

/**
 * @description Deletes a userAccount matching an id
 * @param req.params.id - The id of the userAccount to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: UserAccount deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "UserAccount id missing in params."
                }
            );
            return;
        }

        const userAccount = await UserAccount.getUserAccountById(id);

        if (userAccount === null) {
            logger.server.error(`Request #${ req.requestId }: UserAccount deletion from '${ req.ip }' with URL '${ req.url }' does not match any userAccount`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "UserAccount id in params does not match any userAccount."
                }
            );
            return;
        }

        const deletionState = await userAccount.delete();
        res.json(deletionState);

    } catch (error) {
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.deletion.failed,
                errorMessage: error.stack
            }
        );
    }

});

export default router;