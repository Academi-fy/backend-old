/**
 * @file YupMessageContentSchema.js - Yup schema for validating event ping objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";

/**
 * @typedef {Object} YupEventPingschema
 * @param {String} title - The title of the ping.
 * @param {String} description - The description of the ping.
 */
export default yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
});