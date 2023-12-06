/**
 * @file index.js - Class handling the club routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import express from "express";
const router = express.Router();

import errors from "../../errors/errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../logger.js";
import Club from "../../models/clubs/Club.js";

// properties that are required for a club
const requiredProperties = ['name', 'details', 'leaders', 'members', 'chat', 'events', 'state', 'editHistory'];

/**
 * @description Formats the request body into a club
 * @param req - The request
 * @returns {Club} - The formatted club
 * */
function bodyToClub(req){

    return new Club(
        req.body.club.name,
        req.body.club.details,
        req.body.club.leaders,
        req.body.club.members,
        req.body.club.chat,
        req.body.club.events,
        req.body.club.state,
        req.body.club.editHistory
    );

}

/**
 * @description Gets all clubs existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Club>>} - The list of all clubs existing in the database
 * */
router.get('/',async (req, res) => {

    const clubs = await Club.getAllClubs();
    res.json(clubs);

});

/**
 * @description Gets all clubs that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the clubs should match
 * @returns {JSON<Array<Club>>} - The list of all clubs matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter',async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Request #${req.requestId}: Club query from '${req.ip}' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Club filter missing in body."
                }
            );
            return;
        }

        const clubs = await Club.getAllClubsByRule(filter);
        res.json(clubs)
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
 * @description Gets the club matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the club
 * @returns {JSON<Club>} - The club matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${req.requestId}: Club query from '${req.ip}' does not contain club id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Club id missing in URL."
                }
            );
            return;
        }

        const club = await Club.getClubById(id);
        res.json(club);
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
 * @description Creates a club
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.club - The club to be created
 * @returns {JSON<Club>} - The created club
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.club, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Club creation from '${req.ip}' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Club missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        const newClub = bodyToClub(req);
        newClub._id = req.body.club._id.toString();

        if(!newClub){
            logger.server.error(`Request #${req.requestId}: Club creation from '${req.ip}' does not contain club in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Club missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        if(!newClub._id){
            logger.server.error(`Request #${req.requestId}: Club creation from '${req.ip}' does not contain club id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Club id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        const club = await Club.createClub(newClub);
        res.json(club);
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
 * @description Updates a club matching an id
 * @param req.params.id - The id of the club to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.club - The club update
 * @returns {JSON<Club>} - The updated club
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.club, requiredProperties)) {
            logger.server.error(`Request #${req.requestId}: Club creation from '${req.ip}' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        const updatedClub = bodyToClub(req);
        updatedClub._id = req.body.club._id.toString();

        if(!updatedClub){
            logger.server.error(`Request #${req.requestId}: Club update from '${req.ip}' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if(req.params.id !== updatedClub._id){
            logger.server.error(`Request #${req.requestId}: Club update from '${req.ip}' with URL '${req.params.id}' does not match club id in body '${updatedClub._id}'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club id in URL does not match club id in body."
                }
            );
            return;
        }

        if(!updatedClub._id){
            logger.server.error(`Request #${req.requestId}: Club update from '${req.ip}' with URL '${req.params.id}' does not contain club id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Club]"
                }
            );
            return;
        }

        if(await Club.getClubById(updatedClub._id) === null){
            logger.server.error(`Request #${req.requestId}: Club update from '${req.ip}' with URL '${req.url}' does not match any club`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Club id in body does not match any club."
                }
            );
            return;
        }

        const club = await Club.updateClub(req.params.id, updatedClub);
        res.json(club);
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
 * @description Deletes a club matching an id
 * @param req.params.id - The id of the club to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if(!id){
            logger.server.error(`Request #${ req.requestId }: Club deletion from '${req.ip}' does not contain club id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Club id missing in URL."
                }
            );
            return;
        }

        const deleted = await Club.deleteClub(id);

        if(!deleted){
            logger.server.error(`Request #${ req.requestId }: Club deletion from '${req.ip}' for club with id '${id}' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Club could not be deleted."
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