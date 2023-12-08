/**
 * @file config.js - Combines all environment variables.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import dotenv from 'dotenv';
import ConfigError from "./httpServer/errors/ConfigError.js";
import logger from "./logger.js";

dotenv.config();

/**
 * @description Ensures an environment variable exists and returns it
 * @param {String} name - The name of the environment variable
 * @returns {String} - The value of the environment variable
 * */
function ensureEnvVariable(name) {
  const value = process.env[name];
  if (!value) {
    throw new ConfigError(`Missing environment variable: ${name}`);
  }
  return value;
}

let variables= {};
try {
  variables = {
    MONGODB_PASSWORD: ensureEnvVariable('MONGODB_PASSWORD'),
    WEBSOCKET_PORT: ensureEnvVariable('WEBSOCKET_PORT'),
    SERVER_HOST: ensureEnvVariable('SERVER_HOST'),
    SERVER_PORT: ensureEnvVariable('SERVER_PORT')
  }
}
catch (error){
  logger.server.fatal(`Missing environment variable: \n${error.stack}`)
}

export default variables;