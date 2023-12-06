// Import the child_process module
import { spawn } from  'child_process';

// Spawn a new child process for each script
const socketStart = spawn('node', ['./socketStart.js']);
const indexStart = spawn('node', ['./indexStart.js']);

// Log any output from the socketStart script
socketStart.stdout.on('data', (data) => {
  console.log(`socketStart output: ${data}`);
});

// Log any errors from the socketStart script
socketStart.stderr.on('data', (data) => {
  console.error(`socketStart error: ${data}`);
});

// Log any output from the indexStart script
indexStart.stdout.on('data', (data) => {
  console.log(`indexStart output: ${data}`);
});

// Log any errors from the indexStart script
indexStart.stderr.on('data', (data) => {
  console.error(`indexStart error: ${data}`);
});