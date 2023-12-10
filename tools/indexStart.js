import nodemon from 'nodemon';
import logger from "./logging/logger.js";

nodemon({
    script: 'httpServer/index.js',
    ext: 'js json'
});

/**
 * @description Nodemon events:
 * */
nodemon
    .on('start', function () {
        logger.server.info(`App started`);
    })
    .on('quit', function () {
        logger.server.info('App has quit');
        process.exit();
    })
    .on('restart', function (files) {
        logger.server.info(`App restarted due to: ${ files }`);
    });