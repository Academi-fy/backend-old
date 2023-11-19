/**
 * @description Creates a document in the database.
 * @param {Object} model - The model to create the document in.
 * @param {Object} document - The document to create.
 * @return {Promise<any>} The created document.
 * */
export async function createDocument(model, document) {
    return await model.create(document);
}

/**
 * @description Updates a document in the database.
 * @param {Object} model - The model to update the document in.
 * @param {String} oldDocumentId - The ID of the document to update.
 * @param {Object} newDocument - The new document.
 * @return {Promise<any>} The updated document.
 * */
export async function updateDocument(model, oldDocumentId, newDocument) {
    await model.findOneAndUpdate({ id: oldDocumentId }, newDocument, { new: true })
    return await getDocument(model, oldDocumentId);
}

/**
 * @description Deletes a document in the database.
 * @param {Object} model - The model to delete the document in.
 * @param {String} id - The ID of the document to delete.
 * @return {Promise<any>} The deleted document.
 * */
export async function deleteDocument(model, id) {
    return await model.deleteOne({ id: id });
}

/**
 * @description Gets a document in the database.
 * @param {Object} model - The model to get the document in.
 * @param {String} id - The ID of the document to get.
 * @return {Promise<any>} The document.
 * */
export async function getDocument(model, id) {
    return await model.findOne({ id: id });
}

/**
 * @description Gets all documents in the database.
 * @param {Object} model - The model to get the documents in.
 * @return {Promise<Array<any>>} The documents.
 * */
export async function getAllDocuments(model) {
    return await model.find({});
}

/**
 * @description Gets a document in the database by a custom rule.
 * @param {Object} model - The model to get the document in.
 * @param {Promise<any>} criteria - The searching criteria to get the document by.
 * */
export async function getDocumentByRule(model, criteria) {
    return await model.findOne(criteria);
}