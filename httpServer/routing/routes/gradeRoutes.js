/**
 * @file index.js - Class handling the grade routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import Grade from "../../../models/general/Grade.js";

const router = express.Router();

// properties that are required for a grade
const requiredProperties = [ 'level', 'classes' ];

/**
 * @description Formats the request body into a grade
 * @param body - The request body
 * @returns {Grade} - The formatted grade
 * */
function bodyToGrade(body) {
    return Grade.castToGrade(body.grade);
}

/**
 * @description Gets all grades existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Grade>>} - The list of all grades existing in the database
 * */
router.get('/', async (req, res) => {

    const grades = await Grade.getAll();
    res.json(grades);

});

/**
 * @description Gets all grades that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the grades should match
 * @returns {JSON<Array<Grade>>} - The list of all grades matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: Grade query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Grade filter missing in body."
                }
            );
            return;
        }

        const grades = await Grade.getAllByRule(filter);
        res.json(grades)
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
 * @description Gets the grade matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the grade
 * @returns {JSON<Grade>} - The grade matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Grade query from '${ req.ip }' does not contain grade id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Grade id missing in URL."
                }
            );
            return;
        }

        const grade = await Grade.getById(id);
        res.json(grade);
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
 * @description Creates a grade
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.grade - The grade to be created
 * @returns {JSON<Grade>} - The created grade
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.grade, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Grade creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Grade missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Grade]"
                }
            );
            return;
        }

        const newGrade = bodyToGrade(req.body);
        newGrade._id = req.body.grade._id.toString();

        if (!newGrade) {
            logger.server.error(`Request #${ req.requestId }: Grade creation from '${ req.ip }' does not contain grade in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Grade missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Grade]"
                }
            );
            return;
        }

        if (!newGrade._id) {
            logger.server.error(`Request #${ req.requestId }: Grade creation from '${ req.ip }' does not contain grade id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Grade id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Grade]"
                }
            );
            return;
        }

        const grade = await newGrade.create();
        res.json(grade);
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
 * @description Updates a grade matching an id
 * @param req.params.id - The id of the grade to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.grade - The grade update
 * @returns {JSON<Grade>} - The updated grade
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {
        const oldGrade = await Grade.getById(req.params.id);

        if (isMissingProperty(req.body.grade, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Grade creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Grade missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Grade]"
                }
            );
            return;
        }

        const updatedGrade = bodyToGrade(req.body);
        updatedGrade._id = req.body.grade._id.toString();

        if (!updatedGrade) {
            logger.server.error(`Request #${ req.requestId }: Grade update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Grade missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedGrade._id) {
            logger.server.error(`Request #${ req.requestId }: Grade update from '${ req.ip }' with URL '${ req.params.id }' does not match grade id in body '${ updatedGrade._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Grade id in URL does not match grade id in body."
                }
            );
            return;
        }

        if (!updatedGrade._id) {
            logger.server.error(`Request #${ req.requestId }: Grade update from '${ req.ip }' with URL '${ req.params.id }' does not contain grade id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Grade id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Grade]"
                }
            );
            return;
        }

        if (oldGrade === null) {
            logger.server.error(`Request #${ req.requestId }: Grade update from '${ req.ip }' with URL '${ req.url }' does not match any grade`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Grade id in body does not match any grade."
                }
            );
            return;
        }

        const grade = await oldGrade.update(updatedGrade);
        res.json(grade);
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
 * @description Deletes a grade matching an id
 * @param req.params.id - The id of the grade to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Grade deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Grade id missing in params."
                }
            );
            return;
        }

        const grade = await Grade.getById(id);

        if (grade === null) {
            logger.server.error(`Request #${ req.requestId }: Grade deletion from '${ req.ip }' with URL '${ req.url }' does not match any grade`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Grade id in params does not match any grade."
                }
            );
            return;
        }

        const deletionState = await grade.delete();
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