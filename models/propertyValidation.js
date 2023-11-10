export function validateNotEmpty(propertyName, value) {
    if (!value) throw new Error(`${ propertyName } cannot be empty`);
}

export function validateNumber(propertyName, value) {
    if (isNaN(value)) throw new Error(`${ propertyName } must be a number`);
}

export function validateString(propertyName, value) {
    if (typeof value !== "string") throw new Error(`${ propertyName } must be a string`);
}

export function validateArray(propertyName, value) {
    if (!Array.isArray(value)) throw new Error(`${ propertyName } must be an array`);
}

export function validateObject(propertyName, value) {
    if (typeof value !== "object") throw new Error(`${ propertyName } must be an object`);
}

export function validateBoolean(propertyName, value) {
    if (typeof value !== "boolean") throw new Error(`${ propertyName } must be a boolean`);
}

export function validateDate(propertyName, value) {
    if (typeof value !== "object" || value.constructor !== Date) throw new Error(`${ propertyName } must be a date`);
}

export function validateFunction(propertyName, value) {
    if (typeof value !== "function") throw new Error(`${ propertyName } must be a function`);
}