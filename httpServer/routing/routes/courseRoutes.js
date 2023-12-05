/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import logger from '@xom9ik/logger';

import express from "express";
const router = express.Router();

import Course from "../../models/general/Course.js";
import errors from "../../errors/errors.js";
import isMissingProperty from "../isMissingProperty.js";

const requiredProperties = ['members', 'classes', 'teacher', 'chat', 'subject'];

router.get('/',async (req, res) => {

    const courses = await Course.getAllCourses();
    logger.server.trace(`Courses queried from '${ req.ip }'`)
    res.json(courses);

});

router.get('/filter',async (req, res) => {

    try {
        const filter = req.body;

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
        logger.server.trace(`Courses queried from '${ req.ip }' using filter: \n${filter}`)
        res.json(courses)
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
        logger.server.trace(`Course with id '${id}' queried from '${req.ip}'`)
        res.json(course);
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

router.post('/', async (req, res) => {

    try {

        const newCourse = new Course(
            req.body.members,
            req.body.classes,
            req.body.teacher,
            req.body.chat,
            req.body.subject);
        newCourse._id = req.body._id;

        if (isMissingProperty(req.body, requiredProperties)) {
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
        logger.server.trace(`Course with id '${course._id}' created from '${req.ip}'`)
        res.json(course);
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

router.put('/:id', async (req, res) => {

    const updatedCourse = new Course(
        req.body.members,
        req.body.classes,
        req.body.teacher,
        req.body.chat,
        req.body.subject);
    updatedCourse._id = req.body._id;

    if (isMissingProperty(req.body, requiredProperties)) {
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
        logger.server.trace(`Course with id '${course._id}' updated from '${req.ip}'`)
        res.json(course);
    }
    catch (error){
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.update.failed,
                errorMessage: error.message
            }
        );
    }

});

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

        logger.server.trace(`Course with id '${id}' deleted from '${req.ip}'`)

    }
    catch (error){
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