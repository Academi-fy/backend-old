/**
 * @file index.js - Class launching the HTTP server.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import logger from '@xom9ik/logger';

import * as db from './mongoDb/db.js';
db.connect().then(() => logger.database.trace("Connected."));