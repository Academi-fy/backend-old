/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import logger from '@xom9ik/logger';

/**
 * @description MongoDB connection:
 * */
import * as db from './mongoDb/db.js';
import config from "./config.js";
db.connect().then(() => logger.database.trace("Connected."));


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

import courseRoutes from './httpServer/routing/routes/courseRoutes.js'
app.use('/courses', courseRoutes)