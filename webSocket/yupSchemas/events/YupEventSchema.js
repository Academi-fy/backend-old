/**
 * @file YupMessageContentSchema.js - Yup schema for validating event objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";
import YupEventInformationSchema from "./YupEventInformationSchema.js";

/**
 * @typedef {Object} YupEventschema
 * @param {String} title - The title of the event.
 * @param {String} description - The description of the event.
 * @param {String} location - The location of the event.
 * @param {String} host - The host of the event.
 * @param {Array<String>} clubs - The ids of the clubs of the event.
 * @param {Number} startDate - The start date of the event.
 * @param {Number} endDate - The end date of the event.
 * @param {Array<EventInformation>} information - The information of the event.
 * @param {Array<String>} tickets - The ids of the tickets of the event.
 * @param {String} state - The state of the event. Valid states are:
 * 'SUGGESTED', 'REJECTED', 'APPROVED',
 * 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED',
 * 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * @param {Array<Event>} editHistory - The edit history of the event.
 * @param {Array<String>} subscribers - The ids of the subscribers of the event.
 */
export default yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    location: yup.string().required(),
    host: yup.string().required(),
    clubs: yup.array().of(
            yup.string()
    ).required(),
    startDate: yup.number().required(),
    endDate: yup.number().required(),
    information: YupEventInformationSchema.required(),
    tickets: yup.array().of(
        yup.string()
    ).required(),
    state: yup.string().required(),
    editHistory: yup.array().required(),
    subscribers: yup.array().of(
        yup.string()
    ).required()
});