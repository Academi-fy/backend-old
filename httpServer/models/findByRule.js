/**
 * @file findByRule.js - Method to find objects in a list that are matching a certain rule. Mostly user for models.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 *
 * @description Finds an object in a list by a rule.
 * @param {Array<Object>} list - The list to search.
 * @param {Object} rule - The rule to find the object by.
 * @returns {Array} - The list of object that match the rule.
 * */
export function findByRule(list, rule) {
    const ruleKey = Object.keys(rule)[0];
    const ruleValue = rule[ruleKey];
    if (typeof ruleValue === 'object' && !Array.isArray(ruleValue)) {
        const nestedKey = Object.keys(ruleValue)[0];
        const nestedValue = ruleValue[nestedKey];
        return list.filter(obj => obj[ruleKey] && obj[ruleKey][nestedKey] === nestedValue);
    } else {
        return list.filter(obj => obj[ruleKey] === ruleValue);
    }
}