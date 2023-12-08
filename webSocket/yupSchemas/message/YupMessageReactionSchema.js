/**
 * @file YupMessageReactionSchema.js - Yup schema for validating message reaction objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";


/**
 * @typedef {Object} YupMessageReactionSchema
 * @property {String} emoji - The emoji used for the reaction.
 * @property {Number} count - The count of the reaction (default is 0).
 */
export default yup.object().shape({
    emoji: yup.string().required(),
    count: yup.number().required()
})