/**
 * @file index.js - Class handling the user routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import User from "../../../models/users/User.js";

const router = express.Router();

// properties that are required for a user
const requiredProperties = [ 'firstName', 'lastName', 'avatar', 'type', 'classes', 'extraCourses', 'blackboards', 'clubs' ];

/**
 * @description Formats the request body into a user
 * @param body - The request body
 * @returns {User} - The formatted user
 * */
function bodyToUser(body) {
    return User.castToUser(body.user);
}

/**
 * @description Gets all users existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<User>>} - The list of all users existing in the database
 * */
router.get('/', async (req, res) => {

    const users = await User.getAll();
    res.json(users);

});

/**
 * @description Gets all users that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the users should match
 * @returns {JSON<Array<User>>} - The list of all users matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: User query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "User filter missing in body."
                }
            );
            return;
        }

        const users = await User.getAllByRule(filter);
        res.json(users)
    } catch (error) {
        logger.server.error(error.stack);
        res.status(400).send(
            {
                errorCode: errors.server.document.query.failed,
                errorMessage: error.stack,
            }
        );
    }

});

/**
 * @description Gets the user matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the user
 * @returns {JSON<User>} - The user matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: User query from '${ req.ip }' does not contain user id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "User id missing in URL."
                }
            );
            return;
        }

        const user = await User.getById(id);
        res.json(user);
    } catch (error) {
        logger.server.error(error.stack);
        res.status(400).send(
            {
                errorCode: errors.server.document.query.failed,
                errorMessage: error.stack
            }
        );
    }

});

/**
 * @description Creates a user
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.user - The user to be created
 * @returns {JSON<User>} - The created user
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.user, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: User creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "User missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/User]"
                }
            );
            return;
        }

        const newUser = bodyToUser(req.body);
        newUser._id = req.body.user._id.toString();

        if (!newUser) {
            logger.server.error(`Request #${ req.requestId }: User creation from '${ req.ip }' does not contain user in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "User missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/User]"
                }
            );
            return;
        }

        if (!newUser._id) {
            logger.server.error(`Request #${ req.requestId }: User creation from '${ req.ip }' does not contain user id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "User id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/User]"
                }
            );
            return;
        }

        const user = await newUser.create();
        res.json(user);
    } catch (error) {
        logger.server.error(error.stack);
        res.status(400).send(
            {
                errorCode: errors.server.document.creation.failed,
                errorMessage: error.stack
            }
        );
    }
});

/**
 * @description Updates a user matching an id
 * @param req.params.id - The id of the user to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.user - The user update
 * @returns {JSON<User>} - The updated user
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {
        const oldUser = await User.getById(req.params.id);

        if (isMissingProperty(req.body.user, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: User creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "User missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/User]"
                }
            );
            return;
        }

        const updatedUser = bodyToUser(req.body);
        updatedUser._id = req.body.user._id.toString();

        if (!updatedUser) {
            logger.server.error(`Request #${ req.requestId }: User update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "User missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedUser._id) {
            logger.server.error(`Request #${ req.requestId }: User update from '${ req.ip }' with URL '${ req.params.id }' does not match user id in body '${ updatedUser._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "User id in URL does not match user id in body."
                }
            );
            return;
        }

        if (!updatedUser._id) {
            logger.server.error(`Request #${ req.requestId }: User update from '${ req.ip }' with URL '${ req.params.id }' does not contain user id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "User id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/User]"
                }
            );
            return;
        }

        if (oldUser === null) {
            logger.server.error(`Request #${ req.requestId }: User update from '${ req.ip }' with URL '${ req.url }' does not match any user`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "User id in body does not match any user."
                }
            );
            return;
        }

        const user = await oldUser.update(updatedUser);
        res.json(user);
    } catch (error) {
        logger.server.error(error.stack);
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: error.stack
            }
        );
    }

});

/**
 * @description Deletes a user matching an id
 * @param req.params.id - The id of the user to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: User deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "User id missing in params."
                }
            );
            return;
        }

        const user = await User.getById(id);

        if (user === null) {
            logger.server.error(`Request #${ req.requestId }: User deletion from '${ req.ip }' with URL '${ req.url }' does not match any user`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "User id in params does not match any user."
                }
            );
            return;
        }

        const deletionState = await user.delete();
        res.json(deletionState);

    } catch (error) {
        logger.server.error(error.stack);
        res.status(400).send(
            {
                errorCode: errors.server.document.deletion.failed,
                errorMessage: error.stack
            }
        );
    }

});

export default router;