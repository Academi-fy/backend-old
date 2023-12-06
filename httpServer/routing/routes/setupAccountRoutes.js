/**
 * @file index.js - Class handling the setupAccount routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
const router = express.Router();

import errors from "../../errors/errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../logger.js";
import SetupAccount from "../../models/general/setup/SetupAccount.js";

// properties that are required for a setupAccount
const requiredProperties = ['members', 'classes', 'teacher', 'chat', 'subject'];

/**
 * @description Formats the request body into a setupAccount
 * @param req - The request
 * @returns {SetupAccount} - The formatted setupAccount
 * */
function bodyToSetupAccount(req){

    return new SetupAccount(
        req.body.setupAccount.members,
        req.body.setupAccount.classes,
        req.body.setupAccount.teacher,
        req.body.setupAccount.chat,
        req.body.setupAccount.subject
    );

}

/**
 * @description Gets all setupAccounts existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<SetupAccount>>} - The list of all setupAccounts existing in the database
 * */
router.get('/',async (req, res) => {

    const setupAccounts = await SetupAccount.getAllSetupAccounts();
    res.json(setupAccounts);

});

/**
 * @description Gets all setupAccounts that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the setupAccounts should match
 * @returns {JSON<Array<SetupAccount>>} - The list of all setupAccounts matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter',async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Request #${req.requestId}: SetupAccount query from '${req.ip}' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "SetupAccount filter missing in body."
                }
            );
            return;
        }

        const setupAccounts = await SetupAccount.getAllSetupAccountsByRule(filter);
        res.json(setupAccounts)
    }
    catch (error){
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
 * @description Gets the setupAccount matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the setupAccount
 * @returns {JSON<SetupAccount>} - The setupAccount matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${req.requestId}: SetupAccount query from '${req.ip}' does not contain setup account id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "SetupAccount id missing in URL."
                }
            );
            return;
        }

        const setupAccount = await SetupAccount.getSetupAccountById(id);
        res.json(setupAccount);
    }
    catch (error){
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
 * @description Creates a setupAccount
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.setupAccount - The setupAccount to be created
 * @returns {JSON<SetupAccount>} - The created setupAccount
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.setupAccount, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: SetupAccount creation from '${req.ip}' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "SetupAccount missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/SetupAccount]"
                }
            );
            return;
        }

        const newSetupAccount = bodyToSetupAccount(req);
        newSetupAccount._id = req.body.setupAccount._id.toString();

        if(!newSetupAccount){
            logger.server.error(`Request #${req.requestId}: SetupAccount creation from '${req.ip}' does not contain setup account in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "SetupAccount missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/SetupAccount]"
                }
            );
            return;
        }

        if(!newSetupAccount._id){
            logger.server.error(`Request #${req.requestId}: SetupAccount creation from '${req.ip}' does not contain setup account id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "SetupAccount id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/SetupAccount]"
                }
            );
            return;
        }

        const setupAccount = await SetupAccount.createSetupAccount(newSetupAccount);
        res.json(setupAccount);
    }
    catch (error){
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
 * @description Updates a setupAccount matching an id
 * @param req.params.id - The id of the setupAccount to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.setupAccount - The setupAccount update
 * @returns {JSON<SetupAccount>} - The updated setupAccount
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.setupAccount, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: SetupAccount creation from '${req.ip}' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "SetupAccount missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/SetupAccount]"
                }
            );
            return;
        }

        const updatedSetupAccount = bodyToSetupAccount(req);
        updatedSetupAccount._id = req.body.setupAccount._id.toString();

        if(!updatedSetupAccount){
            logger.server.error(`Request #${req.requestId}: SetupAccount update from '${req.ip}' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "SetupAccount missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if(req.params.id !== updatedSetupAccount._id){
            logger.server.error(`Request #${req.requestId}: SetupAccount update from '${req.ip}' with URL '${req.params.id}' does not match setup account id in body '${updatedSetupAccount._id}'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "SetupAccount id in URL does not match setup account id in body."
                }
            );
            return;
        }

        if(!updatedSetupAccount._id){
            logger.server.error(`Request #${req.requestId}: SetupAccount update from '${req.ip}' with URL '${req.params.id}' does not contain setup account id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "SetupAccount id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/SetupAccount]"
                }
            );
            return;
        }

        if(await SetupAccount.getSetupAccountById(updatedSetupAccount._id) === null){
            logger.server.error(`Request #${req.requestId}: SetupAccount update from '${req.ip}' with URL '${req.url}' does not match any setup account`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "SetupAccount id in body does not match any setup account."
                }
            );
            return;
        }

        const setupAccount = await SetupAccount.updateSetupAccount(req.params.id, updatedSetupAccount);
        res.json(setupAccount);
    }
    catch (error){
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
 * @description Deletes a setupAccount matching an id
 * @param req.params.id - The id of the setupAccount to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${ req.requestId }: SetupAccount deletion from '${req.ip}' does not contain setup account id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "SetupAccount id missing in URL."
                }
            );
            return;
        }

        const deleted = await SetupAccount.deleteSetupAccount(id);

        if(!deleted){
            logger.server.error(`Request #${ req.requestId }: SetupAccount deletion from '${req.ip}' for setup account with id '${id}' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "SetupAccount could not be deleted."
                }
            );
            return;
        }

        res.send(deleted);
    }
    catch (error){
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