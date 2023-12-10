/**
 * @file index.js - Class handling the course routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import Course from "../../models/general/Course.js";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";

const router = express.Router();

// properties that are required for a course
const requiredProperties = [ 'members', 'classes', 'teacher', 'chat', 'subject' ];

/**
 * @description Formats the request body into a course
 * @param body - The request body
 * @returns {Course} - The formatted course
 * */
function bodyToCourse(body) {

    const course = body.course;

    return new Course(
        course.members,
        course.classes,
        course.teacher,
        course.chat,
        course.subject
    );

}

/**
 * @description Gets all courses existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Course>>} - The list of all courses existing in the database
 * */
router.get('/', async (req, res) => {

    const courses = await Course.getAllCourses();
    res.json(courses);

});

/**
 * @description Gets all courses that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the courses should match
 * @returns {JSON<Array<Course>>} - The list of all courses matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: Course query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Course filter missing in body."
                }
            );
            return;
        }

        const courses = await Course.getAllCoursesByRule(filter);
        res.json(courses)
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
 * @description Gets the course matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the course
 * @returns {JSON<Course>} - The course matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Course query from '${ req.ip }' does not contain course id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Course id missing in URL."
                }
            );
            return;
        }

        const course = await Course.getCourseById(id);
        res.json(course);
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
 * @description Creates a course
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.course - The course to be created
 * @returns {JSON<Course>} - The created course
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.course, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Course creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Course missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
                }
            );
            return;
        }

        const newCourse = bodyToCourse(req.body);
        newCourse._id = req.body.course._id.toString();

        if (!newCourse) {
            logger.server.error(`Request #${ req.requestId }: Course creation from '${ req.ip }' does not contain course in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Course missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
                }
            );
            return;
        }

        if (!newCourse._id) {
            logger.server.error(`Request #${ req.requestId }: Course creation from '${ req.ip }' does not contain course id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Course id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
                }
            );
            return;
        }

        const course = await Course.createCourse(newCourse);
        res.json(course);
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
 * @description Updates a course matching an id
 * @param req.params.id - The id of the course to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.course - The course update
 * @returns {JSON<Course>} - The updated course
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.course, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Course creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Course missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
                }
            );
            return;
        }

        const updatedCourse = bodyToCourse(req.body);
        updatedCourse._id = req.body.course._id.toString();

        if (!updatedCourse) {
            logger.server.error(`Request #${ req.requestId }: Course update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Course missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedCourse._id) {
            logger.server.error(`Request #${ req.requestId }: Course update from '${ req.ip }' with URL '${ req.params.id }' does not match course id in body '${ updatedCourse._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Course id in URL does not match course id in body."
                }
            );
            return;
        }

        if (!updatedCourse._id) {
            logger.server.error(`Request #${ req.requestId }: Course update from '${ req.ip }' with URL '${ req.params.id }' does not contain course id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Course id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
                }
            );
            return;
        }

        if (await Course.getCourseById(updatedCourse._id) === null) {
            logger.server.error(`Request #${ req.requestId }: Course update from '${ req.ip }' with URL '${ req.url }' does not match any course`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Course id in body does not match any course."
                }
            );
            return;
        }

        const course = await Course.updateCourse(req.params.id, updatedCourse);
        res.json(course);
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
 * @description Deletes a course matching an id
 * @param req.params.id - The id of the course to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Course deletion from '${ req.ip }' does not contain course id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Course id missing in URL."
                }
            );
            return;
        }

        const deleted = await Course.deleteCourse(id);

        if (!deleted) {
            logger.server.error(`Request #${ req.requestId }: Course deletion from '${ req.ip }' for course with id '${ id }' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Course could not be deleted."
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