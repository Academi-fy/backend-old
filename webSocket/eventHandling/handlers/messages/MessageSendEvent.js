/**
 * @file MessageSendEvent.js - Class handling the socket's MessageSendEvent.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import logger from "../../../../tools/logging/logger.js";
import Message from "../../../../models/messages/Message.js";
import EventHandlerError from "../../../errors/EventHandlerError.js";
import Chat from "../../../../models/messages/Chat.js";
import cache from "../../../../httpServer/cache.js";

/**
 * @description Function handling the MessageSendEvent.
 * @param {Object} ws - The WebSocket connection object.
 * @param {Object} data - The data received from the WebSocket connection.
 * @param {String} messageId - The id of the socket message.
 * @param {Number} date - The date when the event was received.
 */
export default async function (ws, data, messageId, date) {

    const { server, connection } = ws;
    let { chat, author, content, reactions, answer, editHistory } = data.payload.data;

    const newMessage = new Message(chat, author, content, reactions, answer, editHistory, date);

    try {

        const message = await Message.createMessage(newMessage);

        chat = await Chat.getChatById(chat);
        chat.messages.push(message._id);
        await Chat.updateChat(chat._id, chat);

        let targets = [
            ...chat.targets,
            ...chat.courses.reduce((members, course) => members.concat(course.members), []),
            ...chat.clubs.reduce((members, club) => members.concat(club.members), [])
        ];

        targets.forEach(target => {

            const targetSocket = Array.from(server.clients).find(client => client.userId === target._id.toString());

            if (targetSocket && targetSocket.userId !== connection.userId) {
                targetSocket.send(
                    JSON.stringify({
                        event: "MESSAGE_RECEIVED",
                        payload: {
                            sender: `socket`,
                            data: message
                        }
                    })
                );
            }

        });

        logger.socket.debug(`Message #${ messageId } processed in ${ Date.now() - date } ms`)
    } catch (error) {
        throw new EventHandlerError(`Failed to process Message #${ messageId }: \n${ error.stack }`);
    }

}