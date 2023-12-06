/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

/**
 * @description MongoDB connection:
 * */
import * as db from './mongoDb/db.js';
import config from "./config.js";
db.connect().then(() => logger.database.info("Connected."));

/**
 * @description HTTP Server:
 * @host localhost
 * @port 3000
 * */
import express from 'express';
const app = express();

const port = config.SERVER_PORT;
const host = config.SERVER_HOST;
app.listen(port, () => {
  logger.server.info(`HTTP Server is running at http://${ host }:${ port }`);
});

app.use(express.json());

// middleware
import requestDebugger from "./httpServer/middleware/requestDebugger.js";
app.use(requestDebugger);
app.use(express.static('public'));

// routes
import courseRoutes from './httpServer/routing/routes/courseRoutes.js'
import blackboardRoutes from "./httpServer/routing/routes/blackboardRoutes.js";
import logger from "./logging/logger.js";
app.use('/api/courses', courseRoutes)
app.use('/api/blackboards', blackboardRoutes)