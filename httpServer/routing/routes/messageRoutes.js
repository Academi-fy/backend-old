/**
 * @file index.js - Class handling the message routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
const router = express.Router();

import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../logger.js";
import Message from "../../models/messages/Message.js";

// properties that are required for a message
const requiredProperties = ['chat', 'author', 'content', 'reactions', 'answer', 'editHistory', 'date'];

/**
 * @description Formats the request body into a message
 * @param body - The request body
 * @returns {Message} - The formatted message
 * */
function bodyToMessage(body){

    const message = body.message;

    return new Message(
        message.chat,
        message.content,
        message.author,
        message.reactions,
        message.answer,
        message.editHistory,
        message.date
    );

}

/**
 * @description Gets all messages existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Message>>} - The list of all messages existing in the database
 * */
router.get('/',async (req, res) => {

    const messages = await Message.getAllMessages();
    res.json(messages);

});

/**
 * @description Gets all messages that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the messages should match
 * @returns {JSON<Array<Message>>} - The list of all messages matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter',async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Request #${req.requestId}: Message query from '${req.ip}' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Message filter missing in body."
                }
            );
            return;
        }

        const messages = await Message.getAllMessagesByRule(filter);
        res.json(messages)
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
 * @description Gets the message matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the message
 * @returns {JSON<Message>} - The message matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${req.requestId}: Message query from '${req.ip}' does not contain message id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Message id missing in URL."
                }
            );
            return;
        }

        const message = await Message.getMessageById(id);
        res.json(message);
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
 * @description Creates a message
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.message - The message to be created
 * @returns {JSON<Message>} - The created message
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.message, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Message creation from '${req.ip}' does not contain all required properties`)
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

        if(!newMessage){
            logger.server.error(`Request #${req.requestId}: Message creation from '${req.ip}' does not contain message in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Message missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        if(!newMessage._id){
            logger.server.error(`Request #${req.requestId}: Message creation from '${req.ip}' does not contain message id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Message id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        const message = await Message.createMessage(newMessage);
        res.json(message);
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
 * @description Updates a message matching an id
 * @param req.params.id - The id of the message to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.message - The message update
 * @returns {JSON<Message>} - The updated message
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.message, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Message creation from '${req.ip}' does not contain all required properties.`)
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

        if(!updatedMessage){
            logger.server.error(`Request #${req.requestId}: Message update from '${req.ip}' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if(req.params.id !== updatedMessage._id){
            logger.server.error(`Request #${req.requestId}: Message update from '${req.ip}' with URL '${req.params.id}' does not match message id in body '${updatedMessage._id}'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message id in URL does not match message id in body."
                }
            );
            return;
        }

        if(!updatedMessage._id){
            logger.server.error(`Request #${req.requestId}: Message update from '${req.ip}' with URL '${req.params.id}' does not contain message id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Message]"
                }
            );
            return;
        }

        if(await Message.getMessageById(updatedMessage._id) === null){
            logger.server.error(`Request #${req.requestId}: Message update from '${req.ip}' with URL '${req.url}' does not match any message`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Message id in body does not match any message."
                }
            );
            return;
        }

        const message = await Message.updateMessage(req.params.id, updatedMessage);
        res.json(message);
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
 * @description Deletes a message matching an id
 * @param req.params.id - The id of the message to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${ req.requestId }: Message deletion from '${req.ip}' does not contain message id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Message id missing in URL."
                }
            );
            return;
        }

        const deleted = await Message.deleteMessage(id);

        if(!deleted){
            logger.server.error(`Request #${ req.requestId }: Message deletion from '${req.ip}' for message with id '${id}' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Message could not be deleted."
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