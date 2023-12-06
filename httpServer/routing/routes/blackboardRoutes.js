
import express from "express";
const router = express.Router();

import Blackboard from "../../models/general/Blackboard.js";
import errors from "../../errors/errors.js";
import logger from "../../../logging/logger.js";


const requiredProperties = ['title', 'author', 'coverImage', 'text', 'tags', 'date', 'state'];

router.get('/', async (req, res) => {

    const blackboards = await Blackboard.getAllBlackboards();
    res.json(blackboards);

});

router.get('/filter', async (req, res) => {

    try {
        const filter = req.body.filter;

        if(!filter){
            logger.server.error(`Blackboard query from '${req.ip}' does not contain filter in body`)
            res.status(400).send(
                {
                    errorCode: errors.server.document.query.failed,
                    errorMessage: "Blackboard filter missing in body."
                }
            );
            return;
        }

        const blackboards = await Blackboard.getAllBlackboardsByRule(filter);
        res.json(blackboards)
    }
    catch (error){
        logger.server.error(error);
        res.status(400).send(
            {
                errorCode: errors.server.document.query.failed,
                errorMessage: error.message
            }
        );
    }

});

export default router;