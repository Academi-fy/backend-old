/**
 * @file index.js - Class handling the class routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
const router = express.Router();

import Class from "../../models/general/Class.js";
import errors from "../../errors/errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../logger.js";

// properties that are required for a class
const requiredProperties = ['members', 'classes', 'teacher', 'chat', 'subject'];

/**
 * @description Formats the request body into a blackboard
 * @param body - The request body
 * @returns {Class} - The formatted blackboard
 * */
function bodyToClass(body){

    const class_ = body.class;

    return new Class(
        class_.grade,
        class_.courses,
        class_.members,
        class_.specifiedGrade
    );

}

/**
 * @description Gets all class existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Class>>} - The list of all class existing in the database
 * */
router.get('/',async (req, res) => {

    const class_ = await Class.getAllClasses();
    res.json(class_);

});

/**
 * @description Gets all class that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the class should match
 * @returns {JSON<Array<Class>>} - The list of all class matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter',async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Request #${req.requestId}: Class query from '${req.ip}' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Class filter missing in body."
                }
            );
            return;
        }

        const class_ = await Class.getAllClassesByRule(filter);
        res.json(class_)
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
 * @description Gets the class matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the class
 * @returns {JSON<Class>} - The class matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${req.requestId}: Class query from '${req.ip}' does not contain class id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Class id missing in URL."
                }
            );
            return;
        }

        const class_ = await Class.getClassById(id);
        res.json(class_);
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
 * @description Creates a class
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.class - The class to be created
 * @returns {JSON<Class>} - The created class
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.class, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Class creation from '${req.ip}' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Class missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        const newClass = bodyToClass(req.body);
        newClass._id = req.body.class._id.toString();

        if(!newClass){
            logger.server.error(`Request #${req.requestId}: Class creation from '${req.ip}' does not contain class in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Class missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        if(!newClass._id){
            logger.server.error(`Request #${req.requestId}: Class creation from '${req.ip}' does not contain class id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Class id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        const class_ = await Class.createClass(newClass);
        res.json(class_);
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
 * @description Updates a class matching an id
 * @param req.params.id - The id of the class to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.class - The class update
 * @returns {JSON<Class>} - The updated class
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.class, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Class creation from '${req.ip}' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        const updatedClass = bodyToClass(req.body);
        updatedClass._id = req.body.class._id.toString();

        if(!updatedClass){
            logger.server.error(`Request #${req.requestId}: Class update from '${req.ip}' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if(req.params.id !== updatedClass._id){
            logger.server.error(`Request #${req.requestId}: Class update from '${req.ip}' with URL '${req.params.id}' does not match class id in body '${updatedClass._id}'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class id in URL does not match class id in body."
                }
            );
            return;
        }

        if(!updatedClass._id){
            logger.server.error(`Request #${req.requestId}: Class update from '${req.ip}' with URL '${req.params.id}' does not contain class id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        if(await Class.getClassById(updatedClass._id) === null){
            logger.server.error(`Request #${req.requestId}: Class update from '${req.ip}' with URL '${req.url}' does not match any class`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class id in body does not match any class."
                }
            );
            return;
        }

        const class_ = await Class.updateClass(req.params.id, updatedClass);
        res.json(class_);
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
 * @description Deletes a class matching an id
 * @param req.params.id - The id of the class to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${ req.requestId }: Class deletion from '${req.ip}' does not contain class id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Class id missing in URL."
                }
            );
            return;
        }

        const deleted = await Class.deleteClass(id);

        if(!deleted){
            logger.server.error(`Request #${ req.requestId }: Class deletion from '${req.ip}' for class with id '${id}' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Class could not be deleted."
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