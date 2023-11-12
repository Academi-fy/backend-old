import yup from "yup";

import YupContentTypeSchema from "./YupContentTypeSchema.js";
import YupMessageReaction from "./YupMessageReaction.js";
import YupEditedMessage from "./YupEditedMessage.js";

export default {
    id: yup.string().required(),
    chat: yup.string().required(),
    author: yup.string().required(),
    content: yup.array().of({
        YupContentTypeSchema
    }).required(),
    reactions: yup.array().of({
        YupMessageReaction
    }).required(),
    edits: yup.array().of({
            YupEditedMessage
    }).required()
}