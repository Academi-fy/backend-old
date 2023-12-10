/**
 * @file YupMessageSchema.js - Yup schema for validating tag objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";

/**
 * @typedef {Object} YupBlackboardSchema
 * @param {String} emoji - The emoji of the tag.
 * @param {String} description - The description of the tag.
 * */
export default yup.object().shape({
    emoji: yup.string().required(),
    description: yup.string().required()
})
