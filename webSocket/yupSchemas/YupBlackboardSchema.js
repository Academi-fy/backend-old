/**
 * @file YupMessageSchema.js - Yup schema for validating blackboard objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";
import YupTagSchema from "./YupTagSchema.js";

/**
 * @typedef {Object} YupBlackboardSchema
 * @param {String} _id - The id of the blackboard.
 * @param {String} title - The title of the blackboard.
 * @param {User} author - The author of the blackboard.
 * @param {String} coverImage - The cover image of the blackboard.
 * @param {String} text - The text of the blackboard.
 * @param {Array<String>} tags - The tags of the blackboard.
 * @param {Number} date - The date of the blackboard.
 * @param {String} state - The state of the blackboard. Valid states are: 'SUGGESTED', 'REJECTED', 'APPROVED', 'EDIT_SUGGESTED', 'EDIT_REJECTED', 'EDIT_APPROVED', 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED'
 * */
export default yup.object().shape({
    title: yup.string().required(),
    author: yup.string().required(),
    coverImage: yup.string().required(),
    text: yup.string().required(),
    tags: yup.array().of(YupTagSchema).required(),
    date: yup.number().required(),
    state: yup.string().oneOf(
        [ 'SUGGESTED', 'REJECTED', 'APPROVED', 'EDIT_SUGGESTED', 'EDIT_REJECTED',
            'EDIT_APPROVED', 'DELETE_SUGGESTED', 'DELETE_REJECTED', 'DELETE_APPROVED' ]
    ).required()
})
