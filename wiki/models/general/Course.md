Ein Kurs entspricht einer Versammlung aus [Schülern](https://github.com/Academi-fy/backend/wiki/User), die zusammen
Unterricht haben. Dabei müssen sie nicht in der gleichen Klasse oder Stufe sein. \
Einem Kurs können daher mehrere [Klassen](https://github.com/Academi-fy/backend/wiki/Class) zugeordnet werden, aber auch
einzelne Schüler. \
Außerdem wird ein zentraler Lehrer für den Kurs festgelegt. Es können trotzdem, genau wie bei Schülern, mehrere Lehrer
zu einem Kurs hinzugefügt werden. \
Kurse sind mit [Usern](https://github.com/Academi-fy/backend/wiki/User) am stärksten mit
der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners)
verknüpft.

## Kurs-Objekt

Das Kurs-Objekt ist ein eigenes JSON-Objekt. Die Kurse werden in MongoDB gespeichert und sind über den HTTP Server
abzurufen, wo sie gecacht werden. \
Der Kurs-Cache wird alle **5 Minuten** aktualisiert sowie:

- beim Start des HTTP Servers
- beim Löschen/Erstellen eines Kurses
- beim Löschen/Erstellen einer Klasse

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation | Permission      | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------|-----------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN | `COURSE_CREATE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| LÖSCHEN   | `COURSE_DELETE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

### Kurse verändern

| Operation                                                             | Permission           | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------------------------------------------------------------------|----------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN                                                            | `COURSE_EDIT`        | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Lehrer](https://github.com/Academi-fy/backend/wiki/User) SETZEN      | `COURSE_SET_TEACHER` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [User](https://github.com/Academi-fy/backend/wiki/User) HINZUFÜGEN    | `COURSE_ADD_USER`    | 🔴                                                          | 🟢                                                        | 🟢                                                       |
| [Klasse](https://github.com/Academi-fy/backend/wiki/Class) HINZUFÜGEN | `COURSE_ADD_CLASS`   | 🔴                                                          | 🟢                                                        | 🟢                                                       |
| [Subject](https://github.com/Academi-fy/backend/wiki/Subject) SETZEN  | `COURSE_SET_SUBJECT` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Chat](https://github.com/Academi-fy/backend/wiki/Chat) SETZEN        | `COURSE_SET_CHAT`    | 🔴                                                          | 🔴                                                        | 🟢                                                       |

## Attribute

```javascript
Course
{
    _id: "507f191e810c19729de860ea",
        members
:
    [ { ... } ],
        classes
:
    [ { ... } ],
        teacher
:
    {...
    }
,
    chat: {...
    }
,
    subject: {...
    }
}
```

| Attribut  | Type                                                             | Beschreibung                       |
|-----------|------------------------------------------------------------------|------------------------------------|
| `_id`     | String                                                           | Die einzigartige ID des Kurses.    |
| `members` | Array<[User](https://github.com/Academi-fy/backend/wiki/User)>   | Liste mit den Schülern des Kurses. |
| `classes` | Array<[Class](https://github.com/Academi-fy/backend/wiki/Class)> | Liste mit den Klassen des Kurses.  |
| `teacher` | [User](https://github.com/Academi-fy/backend/wiki/User)          | Der Lehrer des Kurses.             |
| `chat`    | [Chat](https://github.com/Academi-fy/backend/wiki/Chat)          | Der Chat des Kurses.               |
| `subject` | [Subject](https://github.com/Academi-fy/backend/wiki/Subject)    | Das Fach des Kurses.               |

#### Besonderheiten

- `members`, `classes`, `teacher`, `chat` und `subject` sind MongoDB Referenzen zu den jeweiligen Objekten
    - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

## Zugriff auf Chats über den HTTP Server

#### Alle Kurse abrufen

Ruft alle Kurse ab. Die Kurse werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/courses
```

#### Kurse über ID abrufen

Ruft einen Kurs über die ID ab. Die Kurse werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/courses/:id
```

> weitere Möglichkeiten, einen Kurs abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Kurse erstellen oder bearbeiten

Erstellt einen Kurs. Der Kurs wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/courses/<class>
```

#### Kurs löschen

Löscht einen Kurs. Der Kurs wird aus der Datenbank gelöscht und aus dem Cache entfernt.

``` http request
DELETE /api/courses/:id
```

## Course Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{

    members: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
        classes
:
    [
        {
            type: ObjectId,
            ref: 'Class'
        }
    ],
        teacher
:
    {
        type: ObjectId,
            ref
    :
        'User'
    }
,
    chat: {
        type: ObjectId,
            ref
    :
        'Chat'
    }
,
    subject: {
        type: ObjectId,
            ref
    :
        'Subject'
    }

}
,
{
    timestamps: true
}
```