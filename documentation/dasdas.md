Ein Chat ist ein Kommunikations-Kanal zwischen Usern. Ein Chat kann mit einem Kurs verknüpft werden, aber auch zwischen
zwei [Benutzern](https://github.com/Daanieeel/rotteck-messenger/wiki/User) erstellt werden.\
Chats sind unabhängig von
der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## Chat-Objekt

Das Chat-Objekt ist ein eigenes JSON-Objekt.
Die Chats werden in MongoDB gespeichert und sind über den HTTP-Server abzurufen, wo sie gecacht werden. Die Chat-Cache
wird alle 2 Minuten aktualisiert sowie bei jeder Registrierung eines Benutzers als auch beim Hinzufügen oder Entfernen
eines Benutzers aus einem Chat.

## Berechtigungen

[Benutzer](https://github.com/Daanieeel/rotteck-messenger/wiki/User) können:

- zu Chats hinzugefügt werden
- [Nachrichten](https://github.com/Daanieeel/rotteck-messenger/wiki/Message) versenden/empfangen/bearbeiten
    - Anhänge an [Nachrichten](https://github.com/Daanieeel/rotteck-messenger/wiki/Message) anhängen
    - auf Nachrichten reagieren

[Lehrer](https://github.com/Daanieeel/rotteck-messenger/wiki/User#user-objekt) können:

- jegliches, was [Benutzer](https://github.com/Daanieeel/rotteck-messenger/wiki/User) können
- [Nachrichten](https://github.com/Daanieeel/rotteck-messenger/wiki/Message) löschen

[Admins](https://github.com/Daanieeel/rotteck-messenger/wiki/User) können:

- jegliches, was [Lehrer](https://github.com/Daanieeel/rotteck-messenger/wiki/User) können
- Chats [Kursen](https://github.com/Daanieeel/rotteck-messenger/wiki/Course) zuweisen

## Attribute

Attribute des Chat-Objekts:

### Beispiel Chat

```javascript
const chat = {
    id: "507f191e810c19729de860ea",
    type: "COURSE",
    targets: [ { $ref: 'User', $id: "132f191e810c19729de860ea" } ],
    courses: [ { $ref: 'Course', $id: "507f191e810c19729de860ea" } ],
    clubs: [ { $ref: 'Club', $id: "507f191e810c19729de860ea" } ],
    name: "K2A24: Mathe LK, JEH",
    avatar: "link.to/avatar.png",
    messages: [ { $ref: 'Message', $id: "507f191e810c19729de860ea" } ] // nicht in DB
};
```

| Attribut | Type                                                                                                                                                                          | Beschreibung                                                                                                                                                                                                                                                                  | Beispiel                                                           |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| id       | String                                                                                                                                                                        | Der einzigartige Identifier für den Chat.                                                                                                                                                                                                                                     | *`id: "507f191e810c19729de860ea"`*                                 |
| type     | String                                                                                                                                                                        | Art des Chats. Möglich: `COURSE`, `GROUP`,`AG` oder `PRIVATE`                                                                                                                                                                                                                 | *`type: COURSE`*                                                   |
| targets  | Array: Referenz zu [Course](https://github.com/Daanieeel/rotteck-messenger/wiki/Course) sowie Referenzen zu [Users](https://github.com/Daanieeel/rotteck-messenger/wiki/User) | MongoDB Referenz zu [Empfängern](https://github.com/Daanieeel/rotteck-messenger/wiki/User) der Chat-Nachrichten                                                                                                                                                               | *`targets: [{ $ref: 'User', $id: "132f191e810c19729de860ea" }]`*   |
| courses  | Referenz zu [Course](https://github.com/Daanieeel/rotteck-messenger/wiki/Course)                                                                                              | Die [Kurse](https://github.com/Daanieeel/rotteck-messenger/wiki/Course), die dem Chat angehören.                                                                                                                                                                              | *`courses: { $ref: 'Course', $id: "507f191e810c19729de860ea" }` *  |
| clubs    | Referenz zu [Club](https://github.com/Daanieeel/rotteck-messenger/wiki/Club)                                                                                                  | Die [AGs](https://github.com/Daanieeel/rotteck-messenger/wiki/Club), die dem Chat angehören.                                                                                                                                                                                  | *`courses: { $ref: 'Course', $id: "507f191e810c19729de860ea" }` *  |
| name     | String                                                                                                                                                                        | Name des Chats.                                                                                                                                                                                                                                                               | *`name: "K2A24: Mathe LK, JEH" `*                                  |
| avatar   | String                                                                                                                                                                        | Link zu Chat-Avatar                                                                                                                                                                                                                                                           | *`avatar: "link.to/avatar.png"`*                                   |
| messages | Array: [Referenzen zu [Message](https://github.com/Daanieeel/rotteck-messenger/wiki/Message), ...]                                                                            | MongoDB Referenzen zu Nachrichten, die in dem Chat versendet wurden. Dieses Attribut wird nicht in der Datenbank gespeichert, sondern bei der Initialisierung des Backend-Servers für jeden Chat anhand der `messages` Collection der Datenbank gesetzt und aktuell gehalten. | *`messages: [{$ref: 'Message', $id: "507f191e810c19729de860ea"}]`* |

> Default-Values, wenn nichts gesetzt wird

```javascript
id //wird automatisch gesetzt
type = 'GROUP',
    targets = [],
    courses = [],
    clubs = [],
    name = "Gruppen Chat",
    avatar = "https://media.istockphoto.com/id/1147544807/de/vektor/miniaturbild-vektorgrafik.jpg?s=612x612&w=0&k=20&c=IIK_u_RTeRFyL6kB1EMzBufT4H7MYT3g04sz903fXAk=",
    messages = []
```

## Zugriff auf Chats über HTTP-Server

Alle Chats abrufen: `GET /api/chats`

```javascript
const allChats = fetch('http://messenger.rotteck.de/api/chats');
```

Chat mit ID abrufen: `GET /api/chats/get/:id`

```javascript
const chat = fetch('http://messenger.rotteck.de/api/chats/get/:id');
```

Chat erstellen: `POST /api/chats/create/[{course]}`

```javascript
let chat = {
    id: "507f191e810c19729de860ea",
    //...
};
post(`http://messenger.rotteck.de/api/chats/create`, chat);
```

Chat aktualisieren: `POST /api/chats/update/:id`

```javascript
let updatedChat = {...};
patch(`http://messenger.rotteck.de/api/chats/update/${updatedCourse.id}`, updatedCourse);
```

Chat löschen: `POST /api/chats/delete/:id`

```javascript
let courseId = "507f191e810c19729de860ea";
delete (`http://messenger.rotteck.de/api/chats/delete/${courseId}`);
```

### Chat Schema in Mongodb

> `chats` Collection: jeder Chat = 1 Dokument

```javascript
{
    id: {
        type: ObjectId,
            required
    :
        true,
            unique
    :
        true
    }
,
    type: {
        type: String,
            required
    :
        true
    }
,
    targets: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
        courses
:
    [
        {
            type: ObjectId,
            ref: 'Course'
        }
    ],
        clubs
:
    [
        {
            type: ObjectId,
            ref: 'Club'
        }
    ],
        name
:
    {
        type: String,
            required
    :
        true,
    default:
        'Neuer Chat'
    }
,
    avatar: {
        type: String,
            required
    :
        true,
    default:
        'https://media.istockphoto.com/id/1147544807/de/vektor/miniaturbild-vektorgrafik.jpg?s=612x612&w=0&k=20&c=IIK_u_RTeRFyL6kB1EMzBufT4H7MYT3g04sz903fXAk='
    }
}

```