SEITE NOCH NICHT FERTIG

## Events


### Messages

#### `MESSAGE_RECEIVE`

Ein Client empfängt eine Nachricht in einem Chat.

```json
{
    "event": "MESSAGE_RECEIVE",
    "payload": {
        "sender": "socket",
        "data": {
            ...Message
        }
    }
}
```

Message im Format von [Message](https://github.com/Academi-fy/backend/wiki/Message)

#### `MESSAGE_SEND`

Ein Client schickt eineNachricht in einen Chat.

```json
{
    "event": "MESSAGE_SEND",
    "payload": {
        "sender": "656f0d57a412c83c2695d795",
        "data": {
            ...Message
        }
    }
}
```

Message im Format von [Message](https://github.com/Academi-fy/backend/wiki/Message)