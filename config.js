/**
 * @file config.js - Combines all environment variables.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import dotenv from 'dotenv';

dotenv.config();

function ensureEnvVariable(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${ name }`);
    }
    return value;
}

const MONGODB_PASSWORD = ensureEnvVariable('MONGODB_PASSWORD');
const WEBSOCKET_PORT = ensureEnvVariable('WEBSOCKET_PORT');

export default {
    MONGODB_PASSWORD,
    WEBSOCKET_PORT
};