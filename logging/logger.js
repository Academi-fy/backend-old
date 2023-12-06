import chalk from "chalk";
import moment from "moment";

/**
 * @description Handles logging.
 * @param {Object<color, name>} name - The name of the log.
 * @param {Object<color, name>} type - The type of the action.
 * @param {String} message - The log message
 * */
function handleLog(name, type, message) {
   console.log(`${chalk.white(`${moment().format('YYYY/MM/DD HH:mm:ss.SS')}`)} [${chalk.bold.hex(name.color)(name.name)}] [${chalk.bold.hex(type.color)(type.name)}] ${chalk.white(message)}`);
}

let colors = {
    socket: '#f542ef',
    server: '#42e6f5',
    database: '#427ef5',
    client: '#a442f5',
    results: {
        info: '#60f542',
        debug: '#42f59c',
        error: '#f57842',
        warning: '#f5b642',
        fatal: '#f54242',
    }
}

export default {

    socket: {
        info: (message) => handleLog(
            { color: colors.socket, name: 'SOCKET' },
            { color: colors.results.info, name: 'INFO' },
            message
        ),
        debug: (message) => handleLog(
            { color: colors.socket, name: 'SOCKET' },
            { color: colors.results.debug, name: 'DEBUG' },
            message
        ),
        error: (message) => handleLog(
            { color: colors.socket, name: 'SOCKET' },
            { color: colors.results.error, name: 'ERROR' },
            message
        ),
        warning: (message) => handleLog(
            { color: colors.socket, name: 'SOCKET' },
            { color: colors.results.warning, name: 'WARNING' },
            message
        ),
        fatal: (message) => handleLog(
            { color: colors.socket, name: 'SOCKET' },
            { color: colors.results.fatal, name: 'FATAL' },
            message
        )
    },
    server: {
        info: (message) => handleLog(
            { color: colors.server, name: 'SERVER' },
            { color: colors.results.info, name: 'INFO' },
            message
        ),
        debug: (message) => handleLog(
            { color: colors.server, name: 'SERVER' },
            { color: colors.results.debug, name: 'DEBUG' },
            message
        ),
        error: (message) => handleLog(
            { color: colors.server, name: 'SERVER' },
            { color: colors.results.error, name: 'ERROR' },
            message
        ),
        warning: (message) => handleLog(
            { color: colors.server, name: 'SERVER' },
            { color: colors.results.warning, name: 'WARNING' },
            message
        ),
        fatal: (message) => handleLog(
            { color: colors.server, name: 'SERVER' },
            { color: colors.results.fatal, name: 'FATAL' },
            message
        )
    },
    database: {
        info: (message) => handleLog(
            { color: colors.database, name: 'DATABASE' },
            { color: colors.results.info, name: 'INFO' },
            message
        ),
        debug: (message) => handleLog(
            { color: colors.database, name: 'DATABASE' },
            { color: colors.results.debug, name: 'DEBUG' },
            message
        ),
        error: (message) => handleLog(
            { color: colors.database, name: 'DATABASE' },
            { color: colors.results.error, name: 'ERROR' },
            message
        ),
        warning: (message) => handleLog(
            { color: colors.database, name: 'DATABASE' },
            { color: colors.results.warning, name: 'WARNING' },
            message
        ),
        fatal: (message) => handleLog(
            { color: colors.database, name: 'DATABASE' },
            { color: colors.results.fatal, name: 'FATAL' },
            message
        )
    },
    client: {
        info: (message) => handleLog(
            { color: colors.client, name: 'CLIENT' },
            { color: colors.results.info, name: 'INFO' },
            message
        ),
        debug: (message) => handleLog(
            { color: colors.client, name: 'CLIENT' },
            { color: colors.results.debug, name: 'DEBUG' },
            message
        ),
        error: (message) => handleLog(
            { color: colors.client, name: 'CLIENT' },
            { color: colors.results.error, name: 'ERROR' },
            message
        ),
        warning: (message) => handleLog(
            { color: colors.client, name: 'CLIENT' },
            { color: colors.results.warning, name: 'WARNING' },
            message
        ),
        fatal: (message) => handleLog(
            { color: colors.client, name: 'CLIENT' },
            { color: colors.results.fatal, name: 'FATAL' },
            message
        )
    }

}