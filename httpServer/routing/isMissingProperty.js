/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

/**
 * @description Checks if an object is missing a property.
 * @param {Object} object - The object to check.
 * @param {Array<String>} requiredProperties - The properties that are required.
 * */
export default function isMissingProperty(object, requiredProperties) {
    return requiredProperties.some(prop => !object.hasOwnProperty(prop));
}