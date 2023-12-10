Eine MessageReaction ist eine Emoji-Reaktion auf eine [Nachricht](https://github.com/Academi-fy/backend/wiki/Message). 
Sie wird durch einen [User](https://github.com/Academi-fy/backend/wiki/User) gesetzt und kann auch wieder entfernt werden. 
Eine MessageReaction kann auch mehrfach von verschiedenen Usern gesetzt werden.

## Attribute

```javascript
MessageReaction {
    emoji: "💘",
    count: 67
}
```

| Attribut | Datentyp | Beschreibung                               |
|----------|----------|--------------------------------------------|
| emoji    | String   | Das Emoji, das die Reaktion repräsentiert. |
| count    | Integer  | Die Anzahl der Reaktionen.                 |

## MessageReactions in Message Schema in MongoDB

```javascript
reactions: [
    {
        emoji: {
            type: Object,
            required: true
        },
        count: {
            type: Number,
            required: true,
            default: 0
        },
    }
]
```