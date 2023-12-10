import config from "../config.js";
import ConfigError from "../httpServer/errors/ConfigError.js";
import mongoose from "mongoose";
import { initializeSchemas } from "./initializeSchemas.js";
import logger from "../tools/logging/logger.js";

const mongoPassword = config.MONGODB_PASSWORD;
if (!mongoPassword) throw new ConfigError('MONGODB_PASSWORD cannot be accessed from config')

const mongoURI = `mongodb+srv://admin:${ mongoPassword }@rotteck-messenger.fejn8su.mongodb.net/?retryWrites=true&w=majority`;

export async function connect() {
    await mongoose.connect(mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then(() => logger.database.info("Connection established.")).catch(err => logger.database.error(err));

    initializeSchemas();
}