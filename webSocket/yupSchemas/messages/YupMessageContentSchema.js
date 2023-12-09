/**
 * @file YupMessageContentSchema.js - Yup schema for validating messages content objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";
import YupMessageReactionSchema from "./YupMessageReactionSchema.js";

/**
 * @typedef {Object} YupMessageReactionSchema
 * @param {String} type - The type of the messages content. Valid values are: "FILE", "IMAGE", "POLL", "TEXT", "VIDEO".
 * @param {Object} value - The value of the messages content.
 */
export default yup.object().shape({
    type: yup.string().oneOf(['FILE', 'IMAGE', 'POLL', 'TEXT', 'VIDEO']),
    value: yup.mixed().required()
})
