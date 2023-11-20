/**
 * @description Finds an object in a list by a rule.
 * @param {Array<Object>} list - The list to search.
 * @param {Object} rule - The rule to find the object by.
 * @returns {Array} - The list of object that match the rule.
 * */
export function findByRule(list, rule){
    return list.filter(obj => obj[Object.keys(rule)[0]] === Object.keys(rule)[0]);
}