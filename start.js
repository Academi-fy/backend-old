import cluster from 'cluster';

if(cluster.isMaster) {
    // Create a worker for indexStart.js
    cluster.fork({ script: './indexStart.js' });

    // Create a worker for socketStart.js
    cluster.fork({ script: './socketStart.js' });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        console.log('Starting a new worker');
        cluster.fork({ script: worker.process.env.script });
    });
} else {
    import(process.env.script).catch(err => console.error(err));
}