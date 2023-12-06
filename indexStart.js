import nodemon from 'nodemon';
import chalk from 'chalk';
import moment from 'moment';
import logger from "./logging/logger.js";

nodemon({
  script: 'index.js',
  ext: 'js json'
});

const hex = 'f5ec42';
nodemon
  .on('start', function () {
    logger.server.info(`App started`);
  })
  .on('quit', function () {
    logger.server.info('App has quit');
    process.exit();
  })
  .on('restart', function (files) {
    logger.server.info(`App restarted due to: ${files}`);
  });