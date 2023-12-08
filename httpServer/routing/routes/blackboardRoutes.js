/**
 * @file index.js - Class handling the blackboard routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import express from "express";
const router = express.Router();

import errors from "../../../errors.js";
import logger from "../../../logger.js";
import isMissingProperty from "../isMissingProperty.js";
import Blackboard from "../../models/general/Blackboard.js";

// properties that are required for a blackboard
const requiredProperties = ['title', 'author', 'coverImage', 'text', 'tags', 'date', 'state'];

/**
 * @description Formats the request body into a blackboard
 * @param body - The request body
 * @returns {Blackboard} - The formatted blackboard
 * */
function bodyToBlackboard(body){

    const blackboard = body.blackboard;

    return new Blackboard(
        blackboard.title,
        blackboard.author,
        blackboard.coverImage,
        blackboard.text,
        blackboard.tags,
        blackboard.date,
        blackboard.state
    );

}

/**
 * @description Gets all blackboards existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Blackboard>>} - The list of all blackboards existing in the database
 * */
router.get('/', async (req, res) => {

    const blackboards = await Blackboard.getAllBlackboards();
    res.json(blackboards);

});

/**
 * @description Gets all blackboards that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the blackboards should match
 * @returns {JSON<Array<Blackboard>>} - The list of all blackboards matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Request #${req.requestId}: Blackboard query from '${req.ip}' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Blackboard filter missing in body."
                }
            );
            return;
        }

        const blackboards = await Blackboard.getAllBlackboardsByRule(filter);
        res.json(blackboards)
    }
    catch (error){
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.query.failed,
                errorMessage: error.message
            }
        );
    }

});

/**
 * @description Gets the blackboard matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the blackboard
 * @returns {JSON<Blackboard>} - The blackboard matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${req.requestId}: Blackboard query from '${req.ip}' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Blackboard id missing in params."
                }
            );
            return;
        }

        const blackboard = await Blackboard.getBlackboardById(id);
        res.json(blackboard)
    }
    catch (error){
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.query.failed,
                errorMessage: error.message
            }
        );
    }

});

/**
 * @description Creates a blackboard
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.blackboard - The blackboard to be created
 * @returns {JSON<Blackboard>} - The created blackboard
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try{

        if(isMissingProperty(req.body.blackboard, requiredProperties)){
            logger.server.error(`Request #${req.requestId}: Blackboard creation from '${req.ip}' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Blackboard creation missing required properties. See documentation for more information [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        const newBlackboard = bodyToBlackboard(req.body);
        newBlackboard._id = req.body.blackboard._id.toString();

        if(!newBlackboard){
            logger.server.error(`Request #${req.requestId}: Blackboard creation from '${req.ip}' failed.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Blackboard creation failed."
                }
            );
            return;
        }

        if(!newBlackboard._id){
            logger.server.error(`Request #${req.requestId}: Blackboard creation from '${req.ip}' does not contain blackboard id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Blackboard id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        const blackboard = await Blackboard.createBlackboard(newBlackboard);
        res.json(blackboard);

    }
    catch (error){
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.creation.failed,
                errorMessage: error.message
            }
        );
    }

});

/**
 * @description Updates a blackboard matching an id
 * @param req.params.id - The id of the blackboard to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.blackboard - The blackboard update
 * @returns {JSON<Blackboard>} - The updated blackboard
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.blackboard, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Blackboard update from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Blackboard update missing required properties. See documentation for more information [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        const updatedBlackboard = bodyToBlackboard(req.body);
        updatedBlackboard._id = req.body.blackboard._id.toString();

        if (!updatedBlackboard) {
            logger.server.error(`Request #${ req.requestId }: Blackboard update from '${ req.ip }' failed.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Blackboard update failed."
                }
            );
            return;
        }

        if (updatedBlackboard._id !== req.params.id) {
            logger.server.error(`Request #${ req.requestId }: Blackboard update from '${ req.ip }' with URL '${ req.params.id }' does not match blackboard id in body '${ updatedBlackboard._id }'`);
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Blackboard id in URL does not match blackboard id in body."
                }
            );
            return;
        }

        if (!updatedBlackboard._id) {
            logger.server.error(`Request #${ req.requestId }: Blackboard update from '${ req.ip }' with URL '${ req.params.id }' does not contain blackboard id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Blackboard id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (await Blackboard.getBlackboardById(updatedBlackboard._id) === null) {
            logger.server.error(`Request #${ req.requestId }: Blackboard update from '${ req.ip }' with URL '${ req.url }' does not match any blackboard`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Blackboard id in body does not match any blackboard."
                }
            );
            return;
        }

        const blackboard = await Blackboard.updateBlackboard(req.params.id, updatedBlackboard);
        res.json(blackboard);

    } catch (error) {
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: error.message
            }
        );
    }
});

/**
 * @description Deletes a blackboard matching an id
 * @param req.params.id - The id of the blackboard to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Blackboard deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Blackboard id missing in params."
                }
            );
            return;
        }

        const blackboard = await Blackboard.getBlackboardById(id);

        if (blackboard === null) {
            logger.server.error(`Request #${ req.requestId }: Blackboard deletion from '${ req.ip }' with URL '${ req.url }' does not match any blackboard`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Blackboard id in params does not match any blackboard."
                }
            );
            return;
        }

        const deletionState = await Blackboard.deleteBlackboard(id);
        res.json(deletionState);

    } catch (error) {
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.deletion.failed,
                errorMessage: error.message
            }
        );
    }

});

export default router;