Chats sind Unterhaltungen zwischen zwei oder mehreren [Usern](https://github.com/Academi-fy/backend/wiki/User). \
Chats können sowohl zwischen [Schülern](https://github.com/Academi-fy/backend/wiki/User), [Lehrern](https://github.com/Academi-fy/backend/wiki/User) (auch mehreren) stattfinden als auch [Kursen](https://github.com/Academi-fy/backend/wiki/Course) bzw. [AGs](https://github.com/Academi-fy/backend/wiki/Club) zugewiesen werden. \
Chats sind unabhängig von der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## Chat-Objekt

Das Chat-Objekt ist ein eigenes JSON-Objekt. Die Chats werde in MongoDB gespeichert und sind über den HTTP Server abzurufen, wo sie gecacht werden. \
Der Chat-Cache wird alle **2 Minuten** aktualisiert sowie:
- beim Start des HTTP Servers
- beim Erstellen eines Chats
- beim Hinzufügen eines [Kurses](https://github.com/Academi-fy/backend/wiki/Course) bzw. einer [AG](https://github.com/Academi-fy/backend/wiki/Club) zu einem Chat

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation  | Permission      | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|------------|-----------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN  | `CHAT_CREATE`   | 🟢<sup>1</sup>                                              | 🟢                                                        | 🟢                                                       |
| LÖSCHEN    | `CHAT_DELETE`   | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| ANSEHEN    | `CHAT_VIEW`     | 🟢                                                          | 🟢                                                        | 🟢                                                       |

> <sup>1</sup> [User](https://github.com/Academi-fy/backend/wiki/User) können nur Chats mit Lehrern erstellen

### Chat verändern

| Operation                                                             | Permission       | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------------------------------------------------------------------|------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN                                                            | `CHAT_EDIT`      | 🔴                                                          | 🟢                                                        | 🟢                                                       |
| [User](https://github.com/Academi-fy/backend/wiki/User) HINZUFÜGEN    | `CHAT_ADD_USER`  | 🔴                                                          | 🟢                                                        | 🟢                                                       |
| [Club](https://github.com/Academi-fy/backend/wiki/Club) HINZUFÜGEN    | `CHAT_ADD_CLUB`  | 🔴                                                          | 🟢                                                        | 🟢                                                       |
| [Klasse](https://github.com/Academi-fy/backend/wiki/Class) HINZUFÜGEN | `CHAT_ADD_CLASS` | 🔴                                                          | 🟢                                                        | 🟢                                                       |

## Attribute

```javascript
new Chat(
    /*id*/ "507f191e810c19729de860ea",
    /*type*/ 'GROUP',
    /*targets*/ [ {...} ],
    /*courses*/ [ {...} ],
    /*clubs*/ [ {...} ],
    /*name*/ "Klasse 10a",
    /*avatar*/ "http://example.com/avatar.png",
    /*messages*/ [ {...} ],
)
```

| Attribut | Type                                                                 | Beschreibung                                                                                                                                                                                      |
|----------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id       | String                                                               | Die einzigartige ID des Chats.                                                                                                                                                                    |
| type     | String                                                               | Der Typ des Chats. Mögliche Types: `PRIVATE`, `GROUP`, `COURSE`, `CLUB`. Für die eigentliche Funktion des Chats ist der type irrelevant. Er kann nur zum Filtern bzw. Sortieren verwendet werden. |
| targets  | Array<[User](https://github.com/Academi-fy/backend/wiki/User)>       | Liste mit den [Usern](https://github.com/Academi-fy/backend/wiki/User) des Chats.                                                                                                                 |
| courses  | Array<[Course](https://github.com/Academi-fy/backend/wiki/Course)>   | Liste mit den [Kursen](https://github.com/Academi-fy/backend/wiki/Course) des Chats.                                                                                                              |
| clubs    | Array<[Club](https://github.com/Academi-fy/backend/wiki/Club)>       | Liste mit den [Clubs](https://github.com/Academi-fy/backend/wiki/Club) des Chats.                                                                                                                 |
| name     | String                                                               | Der Name des Chats.                                                                                                                                                                               |
| avatar   | String                                                               | Der Avatar des Chats.                                                                                                                                                                             |
| messages | Array<[Message](https://github.com/Academi-fy/backend/wiki/Message)> | Liste mit den Nachrichten des Chats.                                                                                                                                                              |

#### Besonderheiten

- `targets`, `courses` und `clubs` sind MongoDB Referenzen zu den jeweiligen Objekten
    - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

- `type` ist ein Enum, der in der Datenbank als String gespeichert wird
  - der type wird geändert, sobald man zwei eine Instanz eines anderen Types hinzufügt wird
  - beim Hinzufügen anderer Instanzen ändert sich der type wie folgt nach unten:
    1. `PRIVATE` = Privater Chat
    2. `COURSE` = Kurschat oder `CLUB` = Clubchat
    3. `GROUP` = Gruppenchat

> Beispiele:\
> `PRIVATE`-Chat wird zum `COURSE`-Chat, wenn ein [Course](https://github.com/Academi-fy/backend/wiki/Course) hinzugefügt wird. \
> `COURSE`-Chat wird zum `GROUP`-Chat, wenn ein [Club](https://github.com/Academi-fy/backend/wiki/Club) hinzugefügt wird. \
> `CLUB`-Chat wird zum `GROUP`-Chat, wenn ein [Course](https://github.com/Academi-fy/backend/wiki/Course) hinzugefügt wird.

## Zugriff auf Chats über den HTTP Server

#### Alle Chats abrufen

Ruft alle Chats ab. Die Chats werden gecacht und alle 2 Minuten aktualisiert.

``` http request
GET /api/chats
```

#### Chat über ID abrufen

Ruft einen Chat über die ID ab. Die Chats werden gecacht und alle 2 Minuten aktualisiert.

``` http request
GET /api/chats/:id
```

> weitere Möglichkeiten, einen Chat abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Chat erstellen oder bearbeiten

Erstellt einen Chat. Der Chat wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/chats/<chat>
```

#### Chat löschen

Löscht einen Chat. Der Chat wird aus der Datenbank gelöscht und aus dem Cache entfernt.

``` http request
DELETE /api/chats/:id
```

## Chat Schema in MongoDB

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
    edits: {
        type: Array,
        required: true,
        default: []
    }
},
{
    timestamps: true
}
```

<sub>© Copyright: Daniel Dopatka, Linus Bung (2023)</sub>