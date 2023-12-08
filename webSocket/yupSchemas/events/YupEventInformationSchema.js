/**
 * @file YupMessageContentSchema.js - Yup schema for validating event information objects.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import yup from "yup";

/**
 * @typedef {Object} YupEventInformationSchema
 * @param {String} title - The title of the event information.
 * @param {Array<{ emoji : String, description : String }>} items - The description elements of the event information.
 */
export default yup.object().shape({
    title: yup.string().required(),
    items: yup.array().of(
        yup.object().shape({
            emoji: yup.string(),
            description: yup.string()
        })
    )
});