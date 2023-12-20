/**
 * @file messageContentCaster.js - Function to cast objects to MessageContent
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
import FileContent from "./contentTypes/FileContent.js";
import ImageContent from "./contentTypes/ImageContent.js";
import Poll from "./Poll.js";
import TextContent from "./contentTypes/TextContent.js";
import VideoContent from "./contentTypes/VideoContent.js";

/**
 * Casts an object into a MessageContent instance.
 * @param {Object} messageContent - The object to be cast into a MessageContent instance.
 * @returns {MessageContent} A new MessageContent instance.
 * @throws {TypeError} If the object cannot be cast into a MessageContent instance.
 */
export function castToMessageContent(messageContent) {
    if (typeof messageContent !== 'object' || messageContent === null) {
        throw new TypeError('Invalid object. Cannot cast to MessageContent.');
    }
    const { type, value } = messageContent;
    let content;

    switch (type){
        case 'FILE':
            content = new FileContent(value);
            break;
        case 'IMAGE':
            content = new ImageContent(value);
            break;
        case 'POLL':
            content = Poll.castToPoll(value);
            break;
        case 'TEXT':
            content = new TextContent(value);
            break;
        case 'VIDEO':
            content = new VideoContent(value);
            break;
    }

    return content;
}