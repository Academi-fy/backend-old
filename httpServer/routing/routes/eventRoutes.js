/**
 * @file index.js - Class handling the event routes.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

import express from "express";
import Event from "../../models/events/Event.js";

import errors from "../../../errors.js";
import isMissingProperty from "../isMissingProperty.js";
import logger from "../../../tools/logging/logger.js";

const router = express.Router();

// properties that are required for an event
const requiredProperties = [ 'title', 'description', 'location', 'host',
    'clubs', 'startDate', 'endDate', 'information',
    'tickets', 'state', 'editHistory' ];

/**
 * @description Formats the request body into an event
 * @param body - The request body
 * @returns {Event} - The formatted event
 * */
function bodyToEvent(body) {

    const event = body.event;

    return new Event(
        event.title,
        event.description,
        event.location,
        event.host,
        event.clubs,
        event.startDate,
        event.endDate,
        event.information,
        event.tickets,
        event.state,
        event.editHistory
    );

}

/**
 * @description Gets all events existing in the database.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Array<Event>>} - The list of all events existing in the database
 * */
router.get('/', async (req, res) => {

    const events = await Event.getAllEvents();
    res.json(events);

});

/**
 * @description Gets all events that exist in the database and match a certain filter.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.filter - The filter that the events should match
 * @returns {JSON<Array<Event>>} - The list of all events matching the filter
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if (!filter) {
            logger.server.error(`Request #${ req.requestId }: Event query from '${ req.ip }' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Event filter missing in body."
                }
            );
            return;
        }

        const events = await Event.getAllEventsByRule(filter);
        res.json(events)
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
 * @description Gets the event matching the id
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.params.id - The id of the event
 * @returns {JSON<Event>} - The event matching the id
 * @throws errors.server.document.query.failed - When the query failed
 * */
router.get('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Event query from '${ req.ip }' does not contain event id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Event id missing in URL."
                }
            );
            return;
        }

        const event = await Event.getEventById(id);
        res.json(event);
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
 * @description Creates an event
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.event - The event to be created
 * @returns {JSON<Event>} - The created event
 * @throws errors.server.document.creation.failed - When the creation failed
 * */
router.post('/', async (req, res) => {

    try {

        if (isMissingProperty(req.body.event, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Event creation from '${ req.ip }' does not contain all required properties`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Event missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Event]"
                }
            );
            return;
        }

        const newEvent = bodyToEvent(req.body);
        newEvent._id = req.body.event._id.toString();

        if (!newEvent) {
            logger.server.error(`Request #${ req.requestId }: Event creation from '${ req.ip }' does not contain event in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Event missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Event]"
                }
            );
            return;
        }

        if (!newEvent._id) {
            logger.server.error(`Request #${ req.requestId }: Event creation from '${ req.ip }' does not contain event id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.creation.failed,
                    errorMessage: "Event id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Event]"
                }
            );
            return;
        }

        const event = await Event.createEvent(newEvent);
        res.json(event);
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
 * @description Updates an event matching an id
 * @param req.params.id - The id of the event to be updated.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @param req.body.event - The event update
 * @returns {JSON<Event>} - The updated event
 * @throws errors.server.document.update.failed - When the update failed
 * */
router.put('/:id', async (req, res) => {

    try {

        if (isMissingProperty(req.body.event, requiredProperties)) {
            logger.server.error(`Request #${ req.requestId }: Event creation from '${ req.ip }' does not contain all required properties.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Event missing required properties. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Event]"
                }
            );
            return;
        }

        const updatedEvent = bodyToEvent(req.body);
        updatedEvent._id = req.body.event._id.toString();

        if (!updatedEvent) {
            logger.server.error(`Request #${ req.requestId }: Event update from '${ req.ip }' does not contain the full information.`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Event missing information. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Blackboard]"
                }
            );
            return;
        }

        if (req.params.id !== updatedEvent._id) {
            logger.server.error(`Request #${ req.requestId }: Event update from '${ req.ip }' with URL '${ req.params.id }' does not match event id in body '${ updatedEvent._id }'`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Event id in URL does not match event id in body."
                }
            );
            return;
        }

        if (!updatedEvent._id) {
            logger.server.error(`Request #${ req.requestId }: Event update from '${ req.ip }' with URL '${ req.params.id }' does not contain event id in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Event id missing in body. See documentation for more information. [https://github.com/Academi-fy/backend/wiki/Event]"
                }
            );
            return;
        }

        if (await Event.getEventById(updatedEvent._id) === null) {
            logger.server.error(`Request #${ req.requestId }: Event update from '${ req.ip }' with URL '${ req.url }' does not match any event`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.update.failed,
                    errorMessage: "Event id in body does not match any event."
                }
            );
            return;
        }

        const event = await Event.updateEvent(req.params.id, updatedEvent);
        res.json(event);
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
 * @description Deletes an event matching an id
 * @param req.params.id - The id of the event to be deleted.
 * @param req.body.inquirer - The id of the user querying. '1' for setup accounts.
 * @returns {JSON<Boolean>} - The state of the deletion
 * @throws errors.server.document.deletion.failed - When the deletion failed
 * */
router.delete('/:id', async (req, res) => {

    try {
        const id = req.params.id;

        if (!id) {
            logger.server.error(`Request #${ req.requestId }: Event deletion from '${ req.ip }' does not contain event id in URL`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Event id missing in URL."
                }
            );
            return;
        }

        const deleted = await Event.deleteEvent(id);

        if (!deleted) {
            logger.server.error(`Request #${ req.requestId }: Event deletion from '${ req.ip }' for event with id '${ id }' could not be completed`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.deletion.failed,
                    errorMessage: "Event could not be deleted."
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