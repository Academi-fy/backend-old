/**
 * @file index.js - Class handling the messages routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import Message from "../../../models/messages/Message.js";

const router = express.Router();

// properties that are required for a messages
const requiredProperties = [ 'chat', 'author', 'content', 'reactions', 'answer', 'editHistory', 'date' ];

/**
 * @description Formats the request body into a messages
 * @param body - The request body
 * @returns {Message} - The formatted messages
 * */
function bodyToMessage(body) {
    return Message.castToMessage(body.message)
}

/**
 * @description Gets all messages existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Message>>} - The list of all messages existing in the database
 * */
router.get('/', async (req, res) => {

    const messages = await Message.getAll();
    res.json(messages);

});

/**
 * @description Gets all messages that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the messages should match
 * @returns {JSON<Array<Message>>} - The list of all messages matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: Message query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Message filter missing in body."
                }
            );
            return;
        }

        const messages = await Message.getAllByRule(filter);
        res.json(messages)
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
 * @description Gets the messages matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the messages
 * @returns {JSON<Message>} - The messages matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Message query from '${ req.ip }' does not contain message id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Message id missing in URL."
                }
            );
            return;
        }

        const message = await Message.getById(id);
        res.json(message);
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
 * @description Creates a messages
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.messages - The messages to be created
 * @returns {JSON<Message>} - The created messages
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.message, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Message creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Message missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        const newMessage = bodyToMessage(req.body);
        newMessage._id = req.body.message._id.toString();

        if (!newMessage) {
            logger.server.error(`Request #${ req.requestId }: Message creation from '${ req.ip }' does not contain message in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Message missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        if (!newMessage._id) {
            logger.server.error(`Request #${ req.requestId }: Message creation from '${ req.ip }' does not contain message id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Message id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        const message = await newMessage.create();
        res.json(message);
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
 * @description Updates a messages matching an id
 * @param req.params.id - The id of the messages to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.messages - The messages update
 * @returns {JSON<Message>} - The updated messages
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {
        const oldMessage = await Message.getById(req.params.id);

        if (isMissingProperty(req.body.message, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Message creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        const updatedMessage = bodyToMessage(req.body);
        updatedMessage._id = req.body.message._id.toString();

        if (!updatedMessage) {
            logger.server.error(`Request #${ req.requestId }: Message update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedMessage._id) {
            logger.server.error(`Request #${ req.requestId }: Message update from '${ req.ip }' with URL '${ req.params.id }' does not match message id in body '${ updatedMessage._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message id in URL does not match messages id in body."
                }
            );
            return;
        }

        if (!updatedMessage._id) {
            logger.server.error(`Request #${ req.requestId }: Message update from '${ req.ip }' with URL '${ req.params.id }' does not contain message id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        if (oldMessage === null) {
            logger.server.error(`Request #${ req.requestId }: Message update from '${ req.ip }' with URL '${ req.url }' does not match any message`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message id in body does not match any messages."
                }
            );
            return;
        }

        const message = await oldMessage.update(updatedMessage);
        res.json(message);
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
 * @description Deletes a messages matching an id
 * @param req.params.id - The id of the messages to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Message deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Message id missing in params."
                }
            );
            return;
        }

        const message = await Message.getById(id);

        if (message === null) {
            logger.server.error(`Request #${ req.requestId }: Message deletion from '${ req.ip }' with URL '${ req.url }' does not match any message`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Message id in params does not match any message."
                }
            );
            return;
        }

        const deletionState = await message.delete();
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