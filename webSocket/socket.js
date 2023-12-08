/**
 * @file socket.js - Class launching the WebSocket server and handling incoming connections.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { parseMessage } from "./parseMessage.js";
import { handleEvents } from "./eventHandler.js";
import config from "../config.js";
import logger from "../logger.js";
import { nanoid } from "nanoid";
import errors from "../errors.js";

dotenv.config();

/**
 * @description Creates a new WebSocket server instance and listens for incoming connections.
 * @type {WebSocketServer}
 */
const wss = new WebSocketServer({ port: parseInt(config.WEBSOCKET_PORT) });
wss.on('connection', (ws, req) => {
    const connectionId = `con-${nanoid(16)}`;
    logger.socket.debug(`New connection #${connectionId} to: ${req.socket.remoteAddress}`);
    logger.socket.debug(`Connection #${connectionId}: established at: ${new Date().toISOString()}`);
    logger.socket.debug(`Connection #${connectionId}: user-agent: ${req.headers['user-agent']}`);

    /**
     * Event listener for incoming messages
     * */
    ws.on('message', message => {

        const messageId = `msg-${nanoid(16)}`;
        logger.socket.debug(`Received message #${messageId} from connection #${connectionId}`)

        let data;
        try {
            /**
             * The message is parsed and validated by yup to be processed
             * */
            data = parseMessage(message);
        } catch (error) {
            logger.socket.error(`Invalid message: \n${ error.stack }`);

            /**
             * Sends an error message to the client if the message could not be parsed.
             * */
            if(error.name === "SocketMessageParsingError") {
                logger.socket.debug(`Message #${messageId} could not be parsed: ${error.stack}`);
                ws.send(
                    JSON.stringify({
                        event: "ERROR",
                        payload: {
                            errorCode: errors.socket.messages.parsing.failed.invalidFormBody,
                            errorMessage: `Invalid message format. \nSee documentation for more information [https://github.com/Academi-fy/backend/wiki/MessageParsing]`,
                            errorStack: error.stack
                        }
                    })
                );
                return;
            }

            /**
             * Sends an error message to the client if the message could not be parsed due to an unknown event.
             * */
            if(error.name === "UnknownEventError") {
                logger.socket.debug(`Message #${messageId} contains unknown event: ${error.message}`);
                ws.send(
                    JSON.stringify({
                        event: "ERROR",
                        payload: {
                            errorCode: errors.socket.messages.parsing.failed.unknownEvent,
                            errorMessage: `Invalid event type. \nSee documentation for more information [https://github.com/Academi-fy/backend/wiki/SocketEvents]`,
                            errorStack: error.stack
                        }
                    })
                );
                return;
            }

            /**
             * Sends an error message to the client if the message could not be parsed due to an unknown reason.
             * */
            ws.send(
                JSON.stringify({
                    event: "ERROR",
                    payload: {
                        errorCode: 1,
                        errorMessage: `Invalid message format. \nSee documentation for more information [https://github.com/Academi-fy/backend/wiki/MessageParsing]`,
                        errorStack: error.stack
                    }
                })
            );

            return;
        }
        logger.socket.debug(`Message #${messageId} sent event: ${data.event}`)
        /**
         * Handle the parsed message
         * */
        handleEvents(ws, data, messageId);
    });

});

logger.socket.info("WebSocket server running on port 8080")