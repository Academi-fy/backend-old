/**
 * @file index.js - Class handling the event ticket routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";
import EventTicket from "../../models/events/EventTicket.js";

const router = express.Router();

// properties that are required for an event ticket
const requiredProperties = [ 'event', 'buyer', 'price', 'saleDate' ];

/**
 * @description Formats the request body into an event ticket
 * @param body - The request body
 * @returns {EventTicket} - The formatted eventTicket
 * */
function bodyToEventTicket(body) {

    const eventTicket = body.eventTicket;

    return new EventTicket(
        eventTicket.event,
        eventTicket.buyer,
        eventTicket.price,
        eventTicket.saleDate
    );

}

/**
 * @description Gets all eventTickets existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<EventTicket>>} - The list of all eventTickets existing in the database
 * */
router.get('/', async (req, res) => {

    const eventTickets = await EventTicket.getAllEventTickets();
    res.json(eventTickets);

});

/**
 * @description Gets all eventTickets that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the event tickets should match
 * @returns {JSON<Array<EventTicket>>} - The list of all eventTickets matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: EventTicket query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "EventTicket filter missing in body."
                }
            );
            return;
        }

        const eventTickets = await EventTicket.getAllEventTicketsByRule(filter);
        res.json(eventTickets)
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
 * @description Gets the event ticket matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the event ticket
 * @returns {JSON<EventTicket>} - The eventTicket matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: EventTicket query from '${ req.ip }' does not contain event ticket id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "EventTicket id missing in URL."
                }
            );
            return;
        }

        const eventTicket = await EventTicket.getEventTicketById(id);
        res.json(eventTicket);
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
 * @description Creates an event ticket
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.eventTicket - The eventTicket to be created
 * @returns {JSON<EventTicket>} - The created eventTicket
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.eventTicket, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: EventTicket creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "EventTicket missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/EventTicket]"
                }
            );
            return;
        }

        const newEventTicket = bodyToEventTicket(req.body);
        newEventTicket._id = req.body.eventTicket._id.toString();

        if (!newEventTicket) {
            logger.server.error(`Request #${ req.requestId }: EventTicket creation from '${ req.ip }' does not contain event ticket in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "EventTicket missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/EventTicket]"
                }
            );
            return;
        }

        if (!newEventTicket._id) {
            logger.server.error(`Request #${ req.requestId }: EventTicket creation from '${ req.ip }' does not contain event ticket id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "EventTicket id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/EventTicket]"
                }
            );
            return;
        }

        const eventTicket = await EventTicket.createEventTicket(newEventTicket);
        res.json(eventTicket);
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
 * @description Updates an event ticket matching an id
 * @param req.params.id - The id of the event ticket to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.eventTicket - The eventTicket update
 * @returns {JSON<EventTicket>} - The updated eventTicket
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.eventTicket, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: EventTicket creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "EventTicket missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/EventTicket]"
                }
            );
            return;
        }

        const updatedEventTicket = bodyToEventTicket(req.body);
        updatedEventTicket._id = req.body.eventTicket._id.toString();

        if (!updatedEventTicket) {
            logger.server.error(`Request #${ req.requestId }: EventTicket update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "EventTicket missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedEventTicket._id) {
            logger.server.error(`Request #${ req.requestId }: EventTicket update from '${ req.ip }' with URL '${ req.params.id }' does not match event ticket id in body '${ updatedEventTicket._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "EventTicket id in URL does not match event ticket id in body."
                }
            );
            return;
        }

        if (!updatedEventTicket._id) {
            logger.server.error(`Request #${ req.requestId }: EventTicket update from '${ req.ip }' with URL '${ req.params.id }' does not contain event ticket id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "EventTicket id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/EventTicket]"
                }
            );
            return;
        }

        if (await EventTicket.getEventTicketById(updatedEventTicket._id) === null) {
            logger.server.error(`Request #${ req.requestId }: EventTicket update from '${ req.ip }' with URL '${ req.url }' does not match any event ticket`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "EventTicket id in body does not match any event ticket."
                }
            );
            return;
        }

        const eventTicket = await EventTicket.updateEventTicket(req.params.id, updatedEventTicket);
        res.json(eventTicket);
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
 * @description Deletes an event ticket matching an id
 * @param req.params.id - The id of the event ticket to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: EventTicket deletion from '${ req.ip }' does not contain event ticket id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "EventTicket id missing in URL."
                }
            );
            return;
        }

        const deleted = await EventTicket.deleteEventTicket(id);

        if (!deleted) {
            logger.server.error(`Request #${ req.requestId }: EventTicket deletion from '${ req.ip }' for event ticket with id '${ id }' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "EventTicket could not be deleted."
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