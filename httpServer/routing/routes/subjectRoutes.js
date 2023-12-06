/**
 * @file index.js - Class handling the subject routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
const router = express.Router();

import Subject from "../../models/general/Subject.js";
import errors from "../../errors/errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../logger.js";

// properties that are required for a subject
const requiredProperties = ['type', 'shortName', 'courses'];

/**
 * @description Formats the request body into a subject
 * @param req - The request
 * @returns {Subject} - The formatted subject
 * */
function bodyToSubject(req){

    return new Subject(
        req.body.subject.type,
        req.body.subject.shortName,
        req.body.subject.courses
    );

}

/**
 * @description Gets all subjects existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Subject>>} - The list of all subjects existing in the database
 * */
router.get('/',async (req, res) => {

    const subjects = await Subject.getAllSubjects();
    res.json(subjects);

});

/**
 * @description Gets all subjects that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the subjects should match
 * @returns {JSON<Array<Subject>>} - The list of all subjects matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter',async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Request #${req.requestId}: Subject query from '${req.ip}' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Subject filter missing in body."
                }
            );
            return;
        }

        const subjects = await Subject.getAllSubjectsByRule(filter);
        res.json(subjects)
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
 * @description Gets the subject matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the subject
 * @returns {JSON<Subject>} - The subject matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${req.requestId}: Subject query from '${req.ip}' does not contain subject id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Subject id missing in URL."
                }
            );
            return;
        }

        const subject = await Subject.getSubjectById(id);
        res.json(subject);
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
 * @description Creates a subject
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.subject - The subject to be created
 * @returns {JSON<Subject>} - The created subject
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.subject, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Subject creation from '${req.ip}' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Subject missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Subject]"
                }
            );
            return;
        }

        const newSubject = bodyToSubject(req);
        newSubject._id = req.body.subject._id.toString();

        if(!newSubject){
            logger.server.error(`Request #${req.requestId}: Subject creation from '${req.ip}' does not contain subject in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Subject missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Subject]"
                }
            );
            return;
        }

        if(!newSubject._id){
            logger.server.error(`Request #${req.requestId}: Subject creation from '${req.ip}' does not contain subject id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Subject id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Subject]"
                }
            );
            return;
        }

        const subject = await Subject.createSubject(newSubject);
        res.json(subject);
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
 * @description Updates a subject matching an id
 * @param req.params.id - The id of the subject to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.subject - The subject update
 * @returns {JSON<Subject>} - The updated subject
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.subject, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Subject creation from '${req.ip}' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Subject missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Subject]"
                }
            );
            return;
        }

        const updatedSubject = bodyToSubject(req);
        updatedSubject._id = req.body.subject._id.toString();

        if(!updatedSubject){
            logger.server.error(`Request #${req.requestId}: Subject update from '${req.ip}' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Subject missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if(req.params.id !== updatedSubject._id){
            logger.server.error(`Request #${req.requestId}: Subject update from '${req.ip}' with URL '${req.params.id}' does not match subject id in body '${updatedSubject._id}'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Subject id in URL does not match subject id in body."
                }
            );
            return;
        }

        if(!updatedSubject._id){
            logger.server.error(`Request #${req.requestId}: Subject update from '${req.ip}' with URL '${req.params.id}' does not contain subject id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Subject id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Subject]"
                }
            );
            return;
        }

        if(await Subject.getSubjectById(updatedSubject._id) === null){
            logger.server.error(`Request #${req.requestId}: Subject update from '${req.ip}' with URL '${req.url}' does not match any subject`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Subject id in body does not match any subject."
                }
            );
            return;
        }

        const subject = await Subject.updateSubject(req.params.id, updatedSubject);
        res.json(subject);
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
 * @description Deletes a subject matching an id
 * @param req.params.id - The id of the subject to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${ req.requestId }: Subject deletion from '${req.ip}' does not contain subject id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Subject id missing in URL."
                }
            );
            return;
        }

        const deleted = await Subject.deleteSubject(id);

        if(!deleted){
            logger.server.error(`Request #${ req.requestId }: Subject deletion from '${req.ip}' for subject with id '${id}' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Subject could not be deleted."
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