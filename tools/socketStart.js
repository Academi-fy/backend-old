import nodemon from 'nodemon';
import logger from "./logging/logger.js";

nodemon({
    script: 'webSocket/socket.js',
    ext: 'js json'
});

/**
 * @description Nodemon events:
 * */
nodemon
    .on('start', function () {
        logger.socket.info(`App started`);
    })
    .on('quit', function () {
        logger.socket.info('App has quit');
        process.exit();
    })
    .on('restart', function (files) {
        logger.socket.info(`App restarted due to: ${ files }`);
    });