/**
 * @file index.js - Class handling the class routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import Class from "../../../models/general/Class.js";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";

const router = express.Router();

// properties that are required for a class
const requiredProperties = [ 'grade', 'courses', 'members', 'specifiedGrade' ];

/**
 * @description Formats the request body into a blackboard
 * @param body - The request body
 * @returns {Class} - The formatted blackboard
 * */
function bodyToClass(body) {
    return Class.castToClass(body.class);
}

/**
 * @description Gets all class existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Class>>} - The list of all class existing in the database
 * */
router.get('/', async (req, res) => {

    const class_ = await Class.getAll(null);
    res.json(class_);

});

/**
 * @description Gets all class that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the class should match
 * @returns {JSON<Array<Class>>} - The list of all class matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: Class query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Class filter missing in body."
                }
            );
            return;
        }

        const class_ = await Class.getAllByRule(filter);
        res.json(class_)
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
 * @description Gets the class matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the class
 * @returns {JSON<Class>} - The class matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Class query from '${ req.ip }' does not contain class id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Class id missing in URL."
                }
            );
            return;
        }

        const class_ = await Class.getById(id);
        res.json(class_);
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
 * @description Creates a class
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.class - The class to be created
 * @returns {JSON<Class>} - The created class
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.class, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Class creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Class missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        const newClass = bodyToClass(req.body);
        newClass._id = req.body.class.id.toString();

        if (!newClass) {
            logger.server.error(`Request #${ req.requestId }: Class creation from '${ req.ip }' does not contain class in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Class missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        if (!newClass._id) {
            logger.server.error(`Request #${ req.requestId }: Class creation from '${ req.ip }' does not contain class id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Class id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        const class_ = await newClass.create();
        res.json(class_);
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
 * @description Updates a class matching an id
 * @param req.params.id - The id of the class to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.class - The class update
 * @returns {JSON<Class>} - The updated class
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {
        const oldClass = await Class.getById(req.params.id)

        if (isMissingProperty(req.body.class, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Class creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        const updatedClass = bodyToClass(req.body);
        updatedClass._id = req.body.class.id.toString();

        if (!updatedClass) {
            logger.server.error(`Request #${ req.requestId }: Class update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedClass._id) {
            logger.server.error(`Request #${ req.requestId }: Class update from '${ req.ip }' with URL '${ req.params.id }' does not match class id in body '${ updatedClass.id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class id in URL does not match class id in body."
                }
            );
            return;
        }

        if (!updatedClass._id) {
            logger.server.error(`Request #${ req.requestId }: Class update from '${ req.ip }' with URL '${ req.params.id }' does not contain class id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Class]"
                }
            );
            return;
        }

        if (oldClass === null) {
            logger.server.error(`Request #${ req.requestId }: Class update from '${ req.ip }' with URL '${ req.url }' does not match any class`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Class id in body does not match any class."
                }
            );
            return;
        }

        const class_ = await oldClass.update(updatedClass);
        res.json(class_);
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
 * @description Deletes a class matching an id
 * @param req.params.id - The id of the class to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Class deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Class id missing in params."
                }
            );
            return;
        }

        const class_ = await Class.getById(id);

        if (class_ === null) {
            logger.server.error(`Request #${ req.requestId }: Class deletion from '${ req.ip }' with URL '${ req.url }' does not match any class`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Class id in params does not match any class."
                }
            );
            return;
        }

        const deletionState = await class_.delete();
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