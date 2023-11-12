import yup from "yup";
import YupMessageSchema from "./yupSchemas/message/YupMessageSchema.js";

export default {

    "MESSAGE_SEND": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object.shape(YupMessageSchema).required()
    }),

    "MESSAGE_EDIT": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            oldMessageId: yup.string().required(),
            newMessage: yup.object.shape(YupMessageSchema).required()
        }).required()
    }),

    "MESSAGE_DELETE": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required()
        }).required()
    }),

    "MESSAGE_REACTION_ADD": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required(),
            emoji: yup.string().required()
        }).required()
    }),

    "MESSAGE_REACTION_REMOVE": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required(),
            emoji: yup.string().required()
        }).required()
    }),

    "TYPING": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            isTyping: yup.boolean().required()
        }).required()
    }),

    "POLL_VOTE": yup.object().shape({
        sender: yup.string().required(),
        data: yup.object().shape({
            messageId: yup.string().required(),
            answerId: yup.string().required()
        }).required()
    }),

    "ERROR": yup.object().shape({
        sender: yup.string().required(),
        error: yup.object.shape({
            errorCode: yup.number().required(),
            errorMessage: yup.string().required()
        })
    }),

}