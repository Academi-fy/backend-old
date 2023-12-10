/**
 * @file socket.js - Class launching the WebSocket server and handling incoming connections.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { parseMessage } from "./parseMessage.js";
import { handleEvents } from "./eventHandling/eventHandler.js";
import config from "../config.js";
import logger from "../tools/logging/logger.js";
import { nanoid } from "nanoid";
import errors from "../errors.js";
import memoryLogger from "../tools/logging/memoryLogger.js";
import BlackboardCreateEvent from "./eventHandling/handlers/blackboards/BlackboardCreateEvent.js";
import socketEvents from "./eventHandling/socketEvents.js";

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

        const messageId = `msg-${ nanoid(16) }`;
        logger.socket.debug(`Received message #${ messageId } from connection #${ connectionId }`)

        let data;
        try {
            /**
             * The messages is parsed and validated by yup to be processed
             * */
            data = parseMessage(message);
        } catch (error) {
            logger.socket.error(`Invalid message: \n${ error.stack }`);

            /**
             * Sends an error messages to the client if the messages could not be parsed.
             * */
            if (error.name === "SocketMessageParsingError") {
                logger.socket.debug(`Message #${ messageId } could not be parsed: ${ error.stack }`);
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
             * Sends an error messages to the client if the messages could not be parsed due to an unknown event.
             * */
            if (error.name === "UnknownEventError") {
                logger.socket.debug(`Message #${ messageId } contains unknown event: ${ error.message }`);
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
             * Sends an error messages to the client if the messages could not be parsed due to an unknown reason.
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
        logger.socket.debug(`Message #${ messageId } sent event: ${ data.event }`)

        /**
         * Handle the parsed messages
         * */
        try {
            handleEvents(ws, data, messageId, Date.now());
        } catch (error) {
            logger.socket.error(`Error while handling event: ${ error.stack }`);
            ws.send(
                JSON.stringify({
                    event: "ERROR",
                    payload: {
                        errorCode: errors.socket.messages.parsing.failed.unknownReason,
                        errorMessage: `Event ${ data.event } could not be handled.`,
                        errorStack: error.stack
                    }
                })
            );
        }
    });

});

logger.socket.info(`WebSocket server running at http://localhost:${config.WEBSOCKET_PORT}`);

memoryLogger(logger.socket);