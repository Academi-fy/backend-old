import dotenv from "dotenv";
dotenv.config();
import { WebSocketServer } from "ws";
import { parseMessage } from "./parseMessage.js";
import { handleEvents } from "./eventHandler.js";

const wss = new WebSocketServer({ port: parseInt(process.env.WEBSOCKET_PORT) });
wss.on('connection', ws => {

    ws.on('message', message => {

        let data;
        try {
            data = parseMessage(message);
        }
        catch(error){
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

        handleEvents(ws, data);
    });

});

console.log("WebSocket server running on port 8080");