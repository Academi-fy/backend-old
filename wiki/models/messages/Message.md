Nachrichten sind die Grundlage für die Kommunikation zwischen [Benutzern](https://github.com/Academi-fy/backend/wiki/User). Sie können in [Chats](https://github.com/Academi-fy/backend/wiki/Chat) gesendet werden. \
Si können aus Text, Bild, Video, Datei oder Umfrage bestehen sowie aus einer Kombination aus allen. \
Nachrichten können auch [Reaktionen](https://github.com/Academi-fy/backend/wiki/MessageReaction), also Emojis, hinzugefügt werden. \
Außerdem kann auf eine andere Nachricht mit einer Nachricht geantwortet werden. \
Nachrichten sind unabhängig von der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## Message-Objekt

Das Message-Objekt ist ein eigenes JSON-Objekt. Die Messages werden in MongoDB gespeichert und sind über den HTTP-Server
abzurufen, wo sie gecacht werden. \
Der Message-Cache wird alle **2 Minuten** aktualisiert sowie:
- beim Start des HTTP Servers
- beim Antworten auf eine Nachricht

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

#### Basic Operations

| Operation                 | Permission                    | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User)<sup>1</sup> | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|---------------------------|-------------------------------|:-----------------------------------------------------------:|:---------------------------------------------------------------------:|:--------------------------------------------------------:|
| Nachricht SCHICKEN        | `MESSAGE_SEND`                |                             🟢                              |                                  🟢                                   |                            🟢                            |
| eigene Nachricht LÖSCHEN  | `MESSAGE_DELETE_OWN`          |                             🟢                              |                                  🟢                                   |                            🟢                            |
| andere Nachricht LÖSCHEN  | `MESSAGE_DELETE`              |                             🔴                              |                                  🟢                                   |                            🟢                            |
| Reaktion HINZUFÜGEN       | `MESSAGE_REACTION_ADD`        |                             🟢                              |                                  🟢                                   |                            🟢                            |
| eigene Reaktion ENTFERNEN | `MESSAGE_REACTION_DELETE_OWN` |                             🟢                              |                                  🟢                                   |                            🟢                            |
| andere Reaktion ENTFERNEN | `MESSAGE_REACTION_DELETE`     |                             🔴                              |                                  🟢                                   |                            🟢                            |
| Nachricht ANTWORTEN       | `MESSAGE_REPLY`               |                             🟢                              |                                  🟢                                   |                            🟢                            |

#### Nachricht verändern

| Operation                | Permission     | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User)<sup>1</sup> | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|--------------------------|----------------|:-----------------------------------------------------------:|:---------------------------------------------------------------------:|:--------------------------------------------------------:|
| Nachricht EDITIEREN      | `MESSAGE_EDIT` |                             🟢                              |                                  🟢                                   |                            🟢                            |

## Attribute

Attribute des Message-Objekts:

```javascript
Message {
    _id: "507f191e810c19729de860ea",
    chat: {...},
    author: {...},
    content: [{...}],
    reactions: [ {...} ],
    answer: {...},
    editHistory: [ {...} ],
    date: 1700835015126
}
```

| Attribut      | Typ                                                                                 | Beschreibung                                                                                       |
|---------------|-------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `_id`         | String                                                                              | Die ID der Nachricht.                                                                              |
| `chat`        | [Chat](https://github.com/Academi-fy/backend/wiki/Chat)                             | Der Chat, in dem die Nachricht gesendet wurde.                                                     |
| `author`      | [User](https://github.com/Academi-fy/backend/wiki/User)                             | Der Autor der Nachricht.                                                                           |
| `content`     | Array<[MessageContent](https://github.com/Academi-fy/backend/wiki/MessageContent)>  | Der Inhalt der Nachricht.                                                                          |
| `reactions`   | Array<[MessageReaction](https://github.com/Academi-fy/backend/wiki/MessageReaction) | Die Reaktionen auf die Nachricht.                                                                  |
| `answer`      | [Message](https://github.com/Academi-fy/backend/wiki/Message)                       | Die Nachricht, auf die geantwortet wurde.                                                          |
| `editHistory` | Array<Message>                                                                      | Vergangene Bearbeitungen der Nachricht.                                                            |
| `date`        | Number                                                                              | Das Datum, an dem die Nachricht gesendet wurde. Angegeben in Millisekunden seit 1970 (JS Standard) |

### Besonderheiten

- `author` und `answer` sind MongoDB Referenzen zu den jeweiligen Objekten
    - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

## Zugriff auf Messages über den WebSocket

> TODO: erst möglich, wenn WebSocket fertig erstellt ist\

grobe Idee:
```javascript  
{
    event: "MESSAGE_SEND",
    payload: {
        sender: {
            { /*user*/ }
        },
        data: {
            id: "",
            chat: {
                { /*chat*/ }
            },
            author: {
                { /*user*/ }
            },
            content: [
                { /*content*/ }
            ],
            reactions: [
                { /*reaction*/ }
            ],
            edits: [
                { /*edited message*/ }
            ]
        }
    }
}
```


## Zugriff auf Messages über den HTTP-Server

#### Alle Messages abrufen

Ruft alle Clubs ab. Die Clubs werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/messages
```              

#### Club über ID abrufen

Ruft einen Club über die ID ab. Die Clubs werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/clubs/:id
```

> weitere Möglichkeiten, einen Club abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Club erstellen oder bearbeiten

Erstellt einen Club. Der Club wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/clubs/<club>
```

#### Club löschen

Löscht einen Club. Der Club wird aus der Datenbank gelöscht und aus dem Cache entfernt.

```http request
DELETE /api/clubs/:id
```

## Club Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{

    chat: {
        type: ObjectId,
        ref: 'Chat'
    },
    author: {
        type: ObjectId,
        ref: 'User'
    },
    content: {
        type: Array,
        required: true,
        default: ""
    },
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
    ],
    answer: {
        type: ObjectId,
        ref: 'Message'
    },
    editHistory: {
        type: Array,
        required: true,
        default: []
    }
},
{
    timestamps: true
}
```