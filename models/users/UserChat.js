import Chat from "../messages/Chat.js";

/**
 * Class representing a UserChat.
 * @param {boolean} pinned - The pinned status of the chat.
 * @param {boolean} hidden - The hidden status of the chat.
 * @param {boolean} read - The read status of the chat.
 * @param {Chat} chat - The chat object.
 */
export default class UserChat {

    /**
     * Create a UserChat.
     * @param {boolean} pinned - The pinned status of the chat.
     * @param {boolean} hidden - The hidden status of the chat.
     * @param {boolean} read - The read status of the chat.
     * @param {String} chat - The chat object.
     */
    constructor(
        pinned,
        hidden,
        read,
        chat
    ) {
        this._pinned = pinned;
        this._hidden = hidden;
        this._read = read;
        this._chat = chat;
    }

    /**
     * Casts a plain object to an instance of the Chat class.
     * @param {Object} userChat - The plain object to cast.
     * @returns {UserChat} The cast instance of the Chat class.
     */
    static castToUserChat(userChat) {
        const { pinned, hidden, read, chat } = userChat;
        const castUserChat =  new UserChat(
            pinned,
            hidden,
            read,
            chat
        );
        castUserChat.chat = Chat.castToChat(chat);

        return castUserChat;
    }

    get pinned() {
        return this._pinned;
    }

    set pinned(value) {
        this._pinned = value;
    }

    get hidden() {
        return this._hidden;
    }

    set hidden(value) {
        this._hidden = value;
    }

    get read() {
        return this._read;
    }

    set read(value) {
        this._read = value;
    }

    get chat() {
        return this._chat;
    }

    set chat(value) {
        this._chat = value;
    }

}