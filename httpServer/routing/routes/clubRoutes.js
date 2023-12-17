/**
 * @file index.js - Class handling the club routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import Club from "../../../models/clubs/Club.js";
import Class from "../../../models/general/Class.js";

const router = express.Router();

// properties that are required for a club
const requiredProperties = [ 'name', 'details', 'leaders', 'members', 'chat', 'events', 'state', 'editHistory' ];

/**
 * @description Formats the request body into a club
 * @param body - The request body
 * @returns {Club} - The formatted club
 * */
function bodyToClub(body) {
    return Club.castToClub(body.club);
}

/**
 * @description Gets all clubs existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Club>>} - The list of all clubs existing in the database
 * */
router.get('/', async (req, res) => {

    const clubs = await Club.getAll();
    res.json(clubs);

});

/**
 * @description Gets all clubs that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the clubs should match
 * @returns {JSON<Array<Club>>} - The list of all clubs matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: Club query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Club filter missing in body."
                }
            );
            return;
        }

        const clubs = await Club.getAllByRule(filter);
        res.json(clubs)
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
 * @description Gets the club matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the club
 * @returns {JSON<Club>} - The club matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Club query from '${ req.ip }' does not contain club id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Club id missing in URL."
                }
            );
            return;
        }

        const club = await Club.getById(id);
        res.json(club);
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
 * @description Creates a club
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.club - The club to be created
 * @returns {JSON<Club>} - The created club
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.club, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Club creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Club missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        const newClub = bodyToClub(req.body);
        newClub._id = req.body.club._id.toString();

        if (!newClub) {
            logger.server.error(`Request #${ req.requestId }: Club creation from '${ req.ip }' does not contain club in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Club missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        if (!newClub._id) {
            logger.server.error(`Request #${ req.requestId }: Club creation from '${ req.ip }' does not contain club id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Club id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        const club = await newClub.create();
        res.json(club);
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
 * @description Updates a club matching an id
 * @param req.params.id - The id of the club to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.club - The club update
 * @returns {JSON<Club>} - The updated club
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {
        const oldClub = await Club.getById(req.params.id);

        if (isMissingProperty(req.body.club, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Club creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        const updatedClub = bodyToClub(req.body);
        updatedClub._id = req.body.club._id.toString();

        if (!updatedClub) {
            logger.server.error(`Request #${ req.requestId }: Club update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedClub._id) {
            logger.server.error(`Request #${ req.requestId }: Club update from '${ req.ip }' with URL '${ req.params.id }' does not match club id in body '${ updatedClub._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club id in URL does not match club id in body."
                }
            );
            return;
        }

        if (!updatedClub._id) {
            logger.server.error(`Request #${ req.requestId }: Club update from '${ req.ip }' with URL '${ req.params.id }' does not contain club id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        if (oldClub === null) {
            logger.server.error(`Request #${ req.requestId }: Club update from '${ req.ip }' with URL '${ req.url }' does not match any club`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club id in body does not match any club."
                }
            );
            return;
        }

        const club = await oldClub.update(updatedClub);
        res.json(club);
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
 * @description Deletes a club matching an id
 * @param req.params.id - The id of the club to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {

        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Club deletion from '${ req.ip }' does not contain id in params`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Club id missing in params."
                }
            );
            return;
        }

        const club = await Club.getById(id);

        if (club === null) {
            logger.server.error(`Request #${ req.requestId }: Club deletion from '${ req.ip }' with URL '${ req.url }' does not match any club`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Club id in params does not match any club."
                }
            );
            return;
        }

        const deletionState = await club.delete();
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