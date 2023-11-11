export async function createDocument(model, document) {
    return await model.create(document);
}

export async function updateDocument(model, oldDocumentId, newDocument) {
    return await model.findOneAndUpdate({ id: oldDocumentId }, newDocument, { new: true });
}

export async function deleteDocument(model, id) {
    return await model.deleteOne({ id: id });
}

export async function getDocument(model, id) {
    return await model.findOne({ id: id });
}

export async function getAllDocuments(model) {
    return await model.find({});
}

export async function getDocumentByRule(model, criteria) {
    return await model.findOne(criteria);
}