/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */


import * as db from '../mongoDb/db.js';
import config from "../config.js";
import logger from "../tools/logging/logger.js";
import express from 'express';

/**
 * @description MongoDB connection:
 * */
db.connect().then(() => {
    logger.database.info(`Connected to HTTP Server`)
})

/**
 * @description HTTP Server:
 * @host localhost
 * @port 3000
 * */
const app = express();
const port = config.SERVER_PORT;
const host = config.SERVER_HOST;
app.listen(port, () => {
    logger.server.info(`HTTP Server is running at http://${ host }:${ port }`);
});

import requestDebugger from "./middleware/requestDebugger.js";
import cors from 'cors';
import memoryLogger from "../tools/logging/memoryLogger.js";
import { initCache } from "../tools/cacheInitlializer.js";
try {
    app.use(requestDebugger);
    app.use(express.static('public'));
    app.use(cors());
    app.use(express.json());
} catch (error) {
    logger.server.fatal(error.stack);
}

import blackboardRoutes from "./routing/routes/blackboardRoutes.js";
import classRoutes from "./routing/routes/classRoutes.js";
import chatRoutes from "./routing/routes/chatRoutes.js";
import clubRoutes from "./routing/routes/clubRoutes.js";
import courseRoutes from './routing/routes/courseRoutes.js'
import eventRoutes from "./routing/routes/eventRoutes.js";
import eventTicketRoutes from "./routing/routes/eventTicketRoutes.js";
import gradeRoutes from "./routing/routes/gradeRoutes.js";
import messageRoutes from "./routing/routes/messageRoutes.js";
import setupAccountRoutes from "./routing/routes/setupAccountRoutes.js";
import subjectRoutes from "./routing/routes/subjectRoutes.js";
import userAccountRoutes from "./routing/routes/userAccountRoutes.js";
import userRoutes from "./routing/routes/userRoutes.js";
try {
    app.use('/api/blackboards', blackboardRoutes);
    app.use('/api/chats', chatRoutes);
    app.use('/api/classes', classRoutes);
    app.use('/api/clubs', clubRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/event-tickets', eventTicketRoutes);
    app.use('/api/grades', gradeRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/setup-accounts', setupAccountRoutes);
    app.use('/api/subjects', subjectRoutes);
    app.use('/api/user-accounts', userAccountRoutes);
    app.use('/api/users', userRoutes);
} catch (error) {
    logger.server.fatal(error.stack);
}

logger.server.debug(`Caching initialized... `)
const cacheInitStart = Date.now();
const cacheCount = await initCache();
logger.server.debug(`${cacheCount} objects cached in ${(Date.now() - cacheInitStart) / 1000} s.`)

memoryLogger(logger.server);
