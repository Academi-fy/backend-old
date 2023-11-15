/**
 * @description Validates that the provided value is not empty.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is empty.
 */
export function validateNotEmpty(propertyName, value) {
    if (!value) throw new Error(`${ propertyName } cannot be empty`);
}

/**
 * @description Validates that the provided value is a number.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is not a number.
 */
export function validateNumber(propertyName, value) {
    if (isNaN(value)) throw new Error(`${ propertyName } must be a number`);
}

/**
 * @description Validates that the provided value is a string.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is not a string.
 */
export function validateString(propertyName, value) {
    if (typeof value !== "string") throw new Error(`${ propertyName } must be a string`);
}

/**
 * @description Validates that the provided value is an array.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is not an array.
 */
export function validateArray(propertyName, value) {
    if (!Array.isArray(value)) throw new Error(`${ propertyName } must be an array`);
}

/**
 * @description Validates that the provided value is an object.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is not an object.
 */
export function validateObject(propertyName, value) {
    if (typeof value !== "object") throw new Error(`${ propertyName } must be an object`);
}

/**
 * Validates that the provided value is a boolean.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is not a boolean.
 */
export function validateBoolean(propertyName, value) {
    if (typeof value !== "boolean") throw new Error(`${ propertyName } must be a boolean`);
}

/**
 * Validates that the provided value is a date.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is not a date.
 */
export function validateDate(propertyName, value) {
    if (typeof value !== "object" || value.constructor !== Date) throw new Error(`${ propertyName } must be a date`);
}

/**
 * Validates that the provided value is a function.
 * @param {string} propertyName - The name of the property.
 * @param {any} value - The value of the property.
 * @throws {Error} If the value is not a function.
 */
export function validateFunction(propertyName, value) {
    if (typeof value !== "function") throw new Error(`${ propertyName } must be a function`);
}

/**
 * Verifies if a given object is in a list, if not it calls an update function and retries up to 3 times.
 * @param {Array} list - The list to check.
 * @param {Object} testObject - The object to verify.
 * @param {Function} updateFunction - The function to call to update the list.
 * @return {boolean} True if the object is in the list, false otherwise.
 */
export async function verifyInCache(list, testObject, updateFunction) {

    let retries = 3;
    while (retries > 0) {

        if (list.includes(testObject)) {
            return true;
        }
        else {
            updateFunction();
            retries--;
            await new Promise(resolve => setTimeout(resolve, 500)); // wait before retrying
        }
    }

    return false;

}