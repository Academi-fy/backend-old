/**
 * @file sendToTargetSocket.js - Function to send a message to a target socket connection.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
/**
 * @description Sends a socket message to a client connected to the socket.
 * @param {WebSocketServer} server - The WebSocket server instance
 * @param {User} target - The target user.
 * @param {String} message - The message to be sent
 * @returns {Boolean} - If the message could be sent.
 */
export default function (server, target, message){

    const targetSocket = Array.from(server.clients).find(client => client.userId === target._id.toString());

    if (targetSocket && targetSocket.userId !== connection.userId) {
        targetSocket.send(
            message
        );
        return true;
    }
    else return false

}