import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { parseMessage } from "./parseMessage.js";
import { handleEvents } from "./eventHandler.js";

dotenv.config();

/**
 * @description Creates a new WebSocket server instance and listens for incoming connections.
 * @type {WebSocketServer}
 */
const wss = new WebSocketServer({ port: parseInt(process.env.WEBSOCKET_PORT) });
wss.on('connection', ws => {

    // Event listener for incoming messages
    ws.on('message', message => {

        let data;
        try {
            data = parseMessage(message);
        } catch (error) {
            console.error(`Invalid message: ${ error.message }`);

            ws.send(
                JSON.stringify({
                    event: "ERROR",
                    payload: {
                        errorCode: 1,
                        errorMessage: error.message
                    }
                })
            );

            return;
        }

        // Handle the parsed message
        handleEvents(ws, data);
    });

});

console.log("WebSocket server running on port 8080");