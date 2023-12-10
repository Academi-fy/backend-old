/**
 * @file index.js - Function logging the current memory usage of a process
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */

export default function (logger) {

    setInterval(() => {
        try {
            const memoryUsage = process.memoryUsage();
            const rss = memoryUsage.rss / (1024 * 1024 * 1024);
            const heapTotal = memoryUsage.heapTotal / (1024 * 1024 * 1024);
            const heapUsed = memoryUsage.heapUsed / (1024 * 1024 * 1024);
            const external = memoryUsage.external / (1024 * 1024 * 1024);

            logger.info(`---------[ MEMORY INFO ]---------`);
            logger.info(`RSS memory: ${ rss.toFixed(4) } GB`);
            logger.info(`Heap Total memory: ${ heapTotal.toFixed(4) } GB`);
            logger.info(`Heap Used memory: ${ heapUsed.toFixed(4) } GB`);
            logger.info(`External memory: ${ external.toFixed(4) } GB`);
            logger.info(`---------------------------------`);
        } catch (error) {
            logger.fatal(error.stack);
        }
    }, 1000 * 60 * 30);

}