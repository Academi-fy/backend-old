import { getModel } from "./initializeSchemas.js";
import logger from "../logger.js";

/**
 * @file collectionAccess.js - Class exporting functions to access the database.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 *
 * @description Creates a document in the database.
 * @param {Object} model - The model to create the document in.
 * @param {Object} document - The document to create.
 * @return {Promise<any>} The created document.
 * */
export async function createDocument(model, document) {
    model = getModel(model);
    await model.create(document);
    logger.database.debug(`${model.name} created:`, document);
    return model.findById(document._id);
}

/**
 * @description Updates a document in the database.
 * @param {Object} model - The model to update the document in.
 * @param {String} oldDocumentId - The ID of the document to update.
 * @param {Object} newDocument - The new document.
 * @return {Promise<any>} The updated document.
 * */
export async function updateDocument(model, oldDocumentId, newDocument) {
    model = getModel(model);
    await model.findOneAndUpdate({ _id: oldDocumentId }, newDocument, { new: true });
    logger.database.debug(`${model.name} updated:`, newDocument);
    return model.findById(oldDocumentId);
}

/**
 * @description Deletes a document in the database.
 * @param {Object} model - The model to delete the document in.
 * @param {String} id - The ID of the document to delete.
 * @return {Promise<any>} The deleted document.
 * */
export async function deleteDocument(model, id) {
    model = getModel(model);
    let deleted = getDocument(model, id);
    await model.deleteOne({ id: id });
    logger.database.warning(`${model.name} deleted:`, deleted);
    return deleted;
}

/**
 * @description Gets a document in the database.
 * @param {Object} model - The model to get the document in.
 * @param {String} id - The ID of the document to get.
 * @return {Promise<any>} The document.
 * */
export async function getDocument(model, id) {
    model = getModel(model);
    return await model.findOne({ id: id });
}

/**
 * @description Gets all documents in the database.
 * @param {Object} model - The model to get the documents in.
 * @return {Promise<Array<any>>} The documents.
 * */
export async function getAllDocuments(model) {
    model = getModel(model);
    return await model.find({});
}

/**
 * @description Gets a document in the database by a custom rule.
 * @param {Object} model - The model to get the document in.
 * @param {Object} criteria - The searching criteria to get the document by.
 * */
export async function getDocumentsByRule(model, criteria) {
    model = getModel(model);
    return await model.findOne(criteria);
}