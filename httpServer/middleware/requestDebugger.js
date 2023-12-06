import { nanoid } from 'nanoid';
import express from "express";
import logger from "../../logging/logger.js";

const app = express();

const requestDebugger = (req, res, next) => {
    req.requestId = nanoid(12);

    logger.server.debug(`Received request #${req.requestId}: ${req.method} ${req.url} from ${req.ip}`);

    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.server.debug(`Request #${req.requestId} processed in ${duration} ms`);
    });

    res.on('error', (error) => {
        logger.server.error(`Request #${req.requestId} failed: ${error.stack}`);
    });
    next();
};

app.use(requestDebugger);

export default requestDebugger;