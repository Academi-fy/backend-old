import { nanoid, customAlphabet } from 'nanoid';
import express from "express";
import logger from "../../logger.js";

const app = express();

const requestDebugger = (req, res, next) => {
    req.requestId = `req-${nanoid(16)}`;

    logger.server.debug(`Received request #${req.requestId}: ${req.method} ${req.url} from ${req.ip}`);

    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;

        if(res.statusCode === 400){
            logger.server.error(`Request #${req.requestId}: FAILED - CODE ${res.statusCode}, ${res.statusMessage}`);
            return;
        }

        logger.server.debug(`Request #${req.requestId}: processed in ${duration} ms`);
    });

    res.on('error', (error) => {
        logger.server.error(`Request #${req.requestId}: FAILED - ${error.stack}`);
    });
    next();
};

app.use(requestDebugger);

export default requestDebugger;