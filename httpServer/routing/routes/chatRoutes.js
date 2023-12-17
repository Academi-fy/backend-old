/**
 * @file index.js - Class handling the chat routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import Chat from "../../../models/messages/Chat.js";

const router = express.Router();

// properties that are required for a chat
const requiredProperties = [ 'type', 'targets', 'courses', 'clubs', 'name', 'avatar', 'messages' ];

/**
 * @description Formats the request body into a chat
 * @param body - The request
 * @returns {Chat} - The formatted chat
 * */
function bodyToChat(body) {
    Chat.castToChat(body.chat);
}

/**
 * @description Gets all chats existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Chat>>} - The list of all chats existing in the database
 * */
router.get('/', async (req, res) => {

    const chats = await Chat.getAll();
    res.json(chats);

});

/**
 * @description Gets all chats that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the chats should match
 * @returns {JSON<Array<Chat>>} - The list of all chats matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: Chat query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Chat filter missing in body."
                }
            );
            return;
        }

        const chats = await Chat.getAllByRule(filter);
        res.json(chats)
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
 * @description Gets the chat matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the chat
 * @returns {JSON<Chat>} - The chat matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Chat query from '${ req.ip }' does not contain chat id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Chat id missing in URL."
                }
            );
            return;
        }

        const chat = await Chat.getById(id);
        res.json(chat);
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
 * @description Creates a chat
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.chat - The chat to be created
 * @returns {JSON<Chat>} - The created chat
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.chat, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Chat creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Chat missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Chat]"
                }
            );
            return;
        }

        const newChat = bodyToChat(req.body);
        newChat._id = req.body.chat._id.toString();

        if (!newChat) {
            logger.server.error(`Request #${ req.requestId }: Chat creation from '${ req.ip }' does not contain chat in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Chat missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Chat]"
                }
            );
            return;
        }

        if (!newChat._id) {
            logger.server.error(`Request #${ req.requestId }: Chat creation from '${ req.ip }' does not contain chat id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Chat id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Chat]"
                }
            );
            return;
        }

        const chat = await newChat.create();
        res.json(chat);
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
 * @description Updates a chat matching an id
 * @param req.params.id - The id of the chat to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.chat - The chat update
 * @returns {JSON<Chat>} - The updated chat
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {
        const oldChat = await Chat.getById(req.params.id);

        if (isMissingProperty(req.body.chat, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Chat creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Chat missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Chat]"
                }
            );
            return;
        }

        const updatedChat = bodyToChat(req.body);
        updatedChat._id = req.body.chat.id.toString();

        if (!updatedChat) {
            logger.server.error(`Request #${ req.requestId }: Chat update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Chat missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Chat]"
                }
            );
            return;
        }

        if (req.params.id !== updatedChat._id) {
            logger.server.error(`Request #${ req.requestId }: Chat update from '${ req.ip }' with URL '${ req.params.id }' does not match chat id in body '${ updatedChat.id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Chat id in URL does not match chat id in body."
                }
            );
            return;
        }

        if (!updatedChat._id) {
            logger.server.error(`Request #${ req.requestId }: Chat update from '${ req.ip }' with URL '${ req.params.id }' does not contain chat id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Chat id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Chat]"
                }
            );
            return;
        }

        if (oldChat === null) {
            logger.server.error(`Request #${ req.requestId }: Chat update from '${ req.ip }' with URL '${ req.url }' does not match any chat`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Chat id in body does not match any chat."
                }
            );
            return;
        }

        const chat = await oldChat.update(updatedChat);
        res.json(chat);
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
 * @description Deletes a chat matching an id
 * @param req.params.id - The id of the chat to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Chat deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Chat id missing in params."
                }
            );
            return;
        }

        const chat = await Chat.getById(id);

        if (chat === null) {
            logger.server.error(`Request #${ req.requestId }: Chat deletion from '${ req.ip }' with URL '${ req.url }' does not match any chat`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Chat id in params does not match any chat."
                }
            );
            return;
        }

        const deletionState = await chat.delete();
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