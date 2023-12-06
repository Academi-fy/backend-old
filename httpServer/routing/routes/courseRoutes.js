/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
const router = express.Router();

import Course from "../../models/general/Course.js";
import errors from "../../errors/errors.js";
import isMissingProperty from "../isMissingProperty.js";
import UserAccount from "../../models/users/UserAccount.js";
import logger from "../../../logging/logger.js";

const requiredProperties = ['members', 'classes', 'teacher', 'chat', 'subject'];

/**
 * @description Gets all courses existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Course>>} - The list of all courses existing in the database
 * */
router.get('/',async (req, res) => {

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
router.get('/filter',async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Course query from '${req.ip}' does not contain filter in body`)
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
 * @description Gets all the course matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the course
 * @returns {JSON<Course>} - The course matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Course query from '${req.ip}' does not contain course id in URL`)
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
 * @description Creates a course
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.course - The course to be created
 * @returns {JSON<Course>} - The updated course
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        const newCourse = new Course(
            req.body.course.members,
            req.body.course.classes,
            req.body.course.teacher,
            req.body.course.chat,
            req.body.course.subject);
        newCourse._id = req.body.course._id;

        if (isMissingProperty(req.body.course, requiredProperties)) {
            logger.server.error(`Course creation from '${req.ip}' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Course missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
                }
            );
            return;
        }

        if(!newCourse){
            logger.server.error(`Course creation from '${req.ip}' does not contain course in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Course missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
                }
            );
            return;
        }

        if(!newCourse._id){
            logger.server.error(`Course creation from '${req.ip}' does not contain course id in body`)
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
 * @description Updates a course matching an id
 * @param req.params.id - The id of the course to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.course - The course update
 * @returns {JSON<Course>} - The updated course
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    const updatedCourse = new Course(
        req.body.course.members,
        req.body.course.classes,
        req.body.course.teacher,
        req.body.course.chat,
        req.body.course.subject);
    updatedCourse._id = req.body.course._id;

    if (isMissingProperty(req.body.course, requiredProperties)) {
        logger.server.error(`Course creation from '${req.ip}' does not contain all required properties`)
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: "Course missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
            }
        );
        return;
    }

    if(req.params.id !== updatedCourse._id){
        logger.server.error(`Course update from '${req.ip}' with URL '${req.params.id}' does not match course id in body '${updatedCourse._id}'`)
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: "Course id in URL does not match course id in body."
            }
        );
        return;
    }

    if(!updatedCourse._id){
        logger.server.error(`Course update from '${req.ip}' with URL '${req.params.id}' does not contain course id in body`)
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: "Course id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Course]"
            }
        );
        return;
    }

    if(await Course.getCourseById(updatedCourse._id) === null){
        logger.server.error(`Course update from '${req.ip}' with URL '${req.params.id}' does not match any course`)
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: "Course id in body does not match any course."
            }
        );
        return;
    }

    try {
        const course = await Course.updateCourse(req.params.id, updatedCourse);
        res.json(course);
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
 * @description Updates a course matching an id
 * @param req.params.id - The id of the course to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Course deletion from '${req.ip}' does not contain course id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Course id missing in URL."
                }
            );
            return;
        }

        const deleted = await Course.deleteCourse(id);

        if(!deleted){
            logger.server.error(`Course deletion from '${req.ip}' fore course with id '${id}' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Course could not be deleted."
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