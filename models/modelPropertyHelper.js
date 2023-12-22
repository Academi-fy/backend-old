import RetrievalError from "../httpServer/errors/RetrievalError.js";

/**
 * Casts the given object using the provided function, or returns null if the object is nullish.
 * @param {Object} object - The object to cast.
 * @param {Function} castFunction - The function to use for casting the object.
 * @returns {Object|null} The cast object, or null if the input object was nullish.
 */
function castOrNull(object, castFunction) {
    if (typeof object !== 'object') {
        throw new RetrievalError('Not object: ' + object);
    }
    return object ? castFunction(object) : null;
}

/**
 * Maps each element in the array using the provided function, or returns null if the array is nullish.
 * @param {Array} array - The array to map.
 * @param {Function} mapFunction - The function to call on every element of the array.
 * @returns {Array|null} A new array with each element being the result of the map function, or null if the input array was nullish.
 */
function mapOrNull(array, mapFunction) {
    if (!Array.isArray(array)) {
        throw new RetrievalError('Not array: ' + array);
    }
    return array ? array.map(object => object ? mapFunction(object) : null) : null;
}

/**
 * Casts the property of the given object using the provided function, or sets it to null if the property is nullish. It updates the property in place.
 * @param {Object} object - The object containing the property to cast.
 * @param {string} property - The property of the object to cast.
 * @param {Function} castFunction - The function to use for casting the property.
 */
export function castPropertyOrNull(object, property, castFunction) {
    if (object[property]) {
        object[property] = castOrNull(object[property], castFunction);
    }
}

/**
 * Maps each element in the property of the given object using the provided function, or sets it to null if the property is nullish. It updates the property in place.
 * @param {Object} object - The object containing the property to map.
 * @param {string} property - The property of the object to map.
 * @param {Function} mapFunction - The function to call on every element of the property.
 */
function mapPropertyOrNull(object, property, mapFunction) {
    if (object[property]) {
        object[property] = mapOrNull(object[property], mapFunction);
    }
}

/**
 * Casts each property in the given object using the provided function, or sets it to null if the property is nullish.
 * @param {Object} object - The object containing the properties to cast.
 * @param {Array<Object>} casts - The objects containing the properties to cast.
 */
export function castProperties(object, casts) {
    casts.forEach((cast) => castPropertyOrNull(object, cast.path, cast.function));
}

/**
 * Maps each property in the given object using the provided function, or sets it to null if the property is nullish.
 * @param {Object} object - The object containing the properties to map.
 * @param {Array<Object>} maps - The objects containing the properties to map.
 */
export function mapProperties(object, maps) {
    maps.forEach((map) => mapPropertyOrNull(object, map.path, map.function));
}