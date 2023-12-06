import nodemon from 'nodemon';
import chalk from 'chalk';
import moment from 'moment';
import logger from "./logging/logger.js";

nodemon({
    script: 'webSocket/socket.js',
    ext: 'js json'
});

const hex = 'f542ef';
nodemon
    .on('start', function () {
        logger.socket.info(`App started`);
    })
    .on('quit', function () {
        logger.socket.info('App has quit');
        process.exit();
    })
    .on('restart', function (files) {
        logger.socket.info(`App restarted due to: ${files}`);
    });