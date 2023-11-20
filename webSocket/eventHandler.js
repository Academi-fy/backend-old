/**
 * @file eventHandler.js - Handles different types of events that can occur in a WebSocket connection.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 *
 * @description This function handles different types of events that can occur in a WebSocket connection.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 */
export function handleEvents(ws, data) {

    switch (data.event) {

        case "MESSAGE_SEND":
            break;

        case "MESSAGE_EDIT":
            break;

        case "MESSAGE_DELETE":
            break;

        case "MESSAGE_REACTION_ADD":
            break;

        case "MESSAGE_REACTION_REMOVE":
            break;

        case "TYPING":
            break;

        case "POLL_VOTE":
            break;

        default:
            console.error(`Unknown event: ${ data.event }`);
            ws.send(
                JSON.stringify({
                    event: "ERROR",
                    payload: {
                        errorCode: 2,
                        errorMessage: `Unknown event: ${ data.event }`
                    }
                })
            );
    }

}