import Poll from "./messages/Poll.js";

/**
 * @description Validates that the provided value is not empty.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {SyntaxError} If the value is empty.
 */
export function validateNotEmpty(propertyName, value) {
    if (!value) throw new SyntaxError(`${ propertyName } cannot be empty`);
}

/**
 * @description Validates that the provided value is a number.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not a number.
 */
export function validateNumber(propertyName, value) {
    if (isNaN(value)) throw new TypeError(`${ propertyName } must be a number`);
}

/**
 * @description Validates that the provided value is a string.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not a string.
 */
export function validateString(propertyName, value) {
    if (typeof value !== "string") throw new TypeError(`${ propertyName } must be a string`);
}

/**
 * @description Validates that the provided value is an array.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not an array.
 */
export function validateArray(propertyName, value) {
    if (!Array.isArray(value)) throw new TypeError(`${ propertyName } must be an array`);
}

/**
 * @description Validates that the provided value is an object.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not an object.
 */
export function validateObject(propertyName, value) {
    if (typeof value !== "object") throw new TypeError(`${ propertyName } must be an object`);
}

/**
 * Validates that the provided value is a boolean.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not a boolean.
 */
export function validateBoolean(propertyName, value) {
    if (typeof value !== "boolean") throw new TypeError(`${ propertyName } must be a boolean`);
}

/**
 * Validates that the provided value is a date.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not a date.
 */
export function validateDate(propertyName, value) {
    if (typeof value !== "object" || value.constructor !== Date) throw new TypeError(`${ propertyName } must be a date`);
}

/**
 * Validates that the provided value is a function.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not a function.
 */
export function validateFunction(propertyName, value) {
    if (typeof value !== "function") throw new TypeError(`${ propertyName } must be a function`);
}

/**
 * Validates that the provided value is a poll.
 * @param {String} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {TypeError} If the value is not a poll.
 */
export function validatePoll(propertyName, value) {
    if (!(value instanceof Poll)) throw new TypeError(`${ propertyName } must be instance of Poll`);
}

/**
 * Verifies if a given object is in a list, if not it calls an update function and retries up to 3 times.
 * @param {Array} list - The list to check.
 * @param {Object} testObject - The object to verify.
 * @param {Function} updateFunction - The function to call to update the list.
 * @return {Promise<Boolean>} True if the object is in the list, false otherwise.
 */
export async function verifyInCache(list, testObject, updateFunction) {

    let retries = 3;
    while (retries > 0) {

        if (list.includes(testObject)) {
            return true;
        }
        else {
            await updateFunction();
            retries--;
            await new Promise(resolve => setTimeout(resolve, 500)); // wait before retrying
        }
    }

    return false;

}