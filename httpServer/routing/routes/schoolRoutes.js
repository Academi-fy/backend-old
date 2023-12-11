/**
 * @file index.js - Class handling the school routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import School from "../../../models/general/setup/School.js";

const router = express.Router();

// properties that are required for a school
const requiredProperties = [ 'name', 'grades', 'courses', 'members',
    'classes', 'messages', 'subjects',
    'clubs', 'events', 'blackboards' ];

/**
 * @description Formats the request body into a school
 * @param body - The request body
 * @returns {School} - The formatted school
 * */
function bodyToSchool(body) {

    const school = body.school;

    return new School(
        school.name,
        school.grades,
        school.courses,
        school.members,
        school.classes,
        school.messages,
        school.subjects,
        school.clubs,
        school.events,
        school.blackboards,
    );

}

/**
 * @description Gets all schools existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<School>>} - The list of all schools existing in the database
 * */
router.get('/', async (req, res) => {

    const schools = await School.getAllSchools();
    res.json(schools);

});

/**
 * @description Gets all schools that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the schools should match
 * @returns {JSON<Array<School>>} - The list of all schools matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: School query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "School filter missing in body."
                }
            );
            return;
        }

        const schools = await School.getAllSchoolsByRule(filter);
        res.json(schools)
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
 * @description Gets the school matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the school
 * @returns {JSON<School>} - The school matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: School query from '${ req.ip }' does not contain school id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "School id missing in URL."
                }
            );
            return;
        }

        const school = await School.getSchoolById(id);
        res.json(school);
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
 * @description Creates a school
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.school - The school to be created
 * @returns {JSON<School>} - The created school
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.school, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: School creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "School missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/School]"
                }
            );
            return;
        }

        const newSchool = bodyToSchool(req.body);
        newSchool._id = req.body.school._id.toString();

        if (!newSchool) {
            logger.server.error(`Request #${ req.requestId }: School creation from '${ req.ip }' does not contain school in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "School missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/School]"
                }
            );
            return;
        }

        if (!newSchool._id) {
            logger.server.error(`Request #${ req.requestId }: School creation from '${ req.ip }' does not contain school id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "School id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/School]"
                }
            );
            return;
        }

        const school = await School.createSchool(newSchool);
        res.json(school);
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
 * @description Updates a school matching an id
 * @param req.params.id - The id of the school to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.school - The school update
 * @returns {JSON<School>} - The updated school
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.school, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: School creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "School missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/School]"
                }
            );
            return;
        }

        const updatedSchool = bodyToSchool(req.body);
        updatedSchool._id = req.body.school._id.toString();

        if (!updatedSchool) {
            logger.server.error(`Request #${ req.requestId }: School update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "School missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedSchool._id) {
            logger.server.error(`Request #${ req.requestId }: School update from '${ req.ip }' with URL '${ req.params.id }' does not match school id in body '${ updatedSchool._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "School id in URL does not match school id in body."
                }
            );
            return;
        }

        if (!updatedSchool._id) {
            logger.server.error(`Request #${ req.requestId }: School update from '${ req.ip }' with URL '${ req.params.id }' does not contain school id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "School id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/School]"
                }
            );
            return;
        }

        if (await School.getSchoolById(updatedSchool._id) === null) {
            logger.server.error(`Request #${ req.requestId }: School update from '${ req.ip }' with URL '${ req.url }' does not match any school`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "School id in body does not match any school."
                }
            );
            return;
        }

        const school = await School.updateSchool(req.params.id, updatedSchool);
        res.json(school);
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
 * @description Deletes a school matching an id
 * @param req.params.id - The id of the school to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: School deletion from '${ req.ip }' does not contain school id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "School id missing in URL."
                }
            );
            return;
        }

        const deleted = await School.deleteSchool(id);

        if (!deleted) {
            logger.server.error(`Request #${ req.requestId }: School deletion from '${ req.ip }' for school with id '${ id }' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "School could not be deleted."
                }
            );
            return;
        }

        res.send(deleted);
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