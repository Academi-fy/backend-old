User sind die eigentlichen Akteure in der App. Sie sind Lehrer sowie Schüler als auch Admins. \
User können sich in der App über ihre [UserAccounts](https://github.com/Academi-fy/backend/wiki/UserAccounts) anmelden und haben dann Zugriff auf die ihnen zugewiesenen Bereiche. \
User werden zusammen mit ihren [UserAccounts](https://github.com/Academi-fy/backend/wiki/UserAccounts) bei der Erstanmeldung in der Datenbank anhand der Daten der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners) erstellt.

## User-Objekt

Das User-Objekt ist ein eigenes JSON-Objekt. Die User werden in MongoDB gespeichert und sind über den HTTP Server abzurufen, wo sie gecacht werden. \
Der User-Cache wird alle **3 Minuten** aktualisiert sowie:
- beim Start des HTTP Servers
- beim Erstellen/Löschen eines Users
- beim Erstellen/Löschen eines [UserAccounts](https://github.com/Academi-fy/backend/wiki/UserAccounts)

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation         | Permission           | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-------------------|----------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| manuell ERSTELLEN | `USER_MANUAL_CREATE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| LÖSCHEN           | `USER_DELETE`        | 🔴                                                          | 🔴                                                        | 🟢                                                       |

### User verändern

| Operation                                                                    | Permission                   | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|------------------------------------------------------------------------------|------------------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN                                                                   | `USER_EDIT`                  | 🟡                                                          | 🟡                                                        | 🟢                                                       |
| [Klassen](https://github.com/Academi-fy/backend/wiki/Class) manuell ZUORDNEN | `USER_MANUAL_ASSIGN_CLASSES` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Kurse](https://github.com/Academi-fy/backend/wiki/Course) manuell ZUORDNEN  | `USER_MANUAL_ASSIGN_COURSES` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

## Attribute

```javascript
User {
    _id: "507f191e810c19729de860ea",
    firstName: "Max",
    lastName: "Mustermann",
    avatar: "http://example.com/avatar.png",
    type: "TEACHER",
    classes: [ { ... } ],
    extraCourses: [ { ... } ]
}
```

| Attribut       | Type                                                               | Beschreibung                                                      |
|----------------|--------------------------------------------------------------------|-------------------------------------------------------------------|
| `_id`          | String                                                             | Die einzigartige ID des Users.                                    |
| `firstName`    | String                                                             | Der Vorname des Users.                                            |
| `lastName`     | String                                                             | Der Nachname des Users.                                           |
| `avatar`       | String                                                             | Der Avatar des Users.                                             |
| `type`         | String                                                             | Der Typ des Users. Möglicher Types: `STUDENT`, `TEACHER`, `ADMIN` |
| `classes`      | Array<[Class](https://github.com/Academi-fy/backend/wiki/Class)>   | Die Klassen, die dem User zugeordnet sind.                        |
| `extraCourses` | Array<[Course](https://github.com/Academi-fy/backend/wiki/Course)> | Die Kurse, die dem User zusätzlich zugeordnet sind.               |

#### Besonderheiten

- `classes` und `extraCourses` sind MongoDB Referenzen zu den jeweiligen Objekten
    - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

- `type` ist ein Enum, der in der Datenbank als String gespeichert wird
    - `STUDENT` = Schüler
    - `TEACHER` = Lehrer
    - `ADMIN` = Admin

## Zugriff auf User über den HTTP Server

#### Alle User abrufen

Ruft alle User ab. Die User werden gecacht und alle 3 Minuten aktualisiert.

``` http request
GET /api/users
```              

#### User über ID abrufen

Ruft einen User über die ID ab. Die User werden gecacht und alle 3 Minuten aktualisiert.

``` http request
GET /api/users/:id
```

> weitere Möglichkeiten, einen User abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### User erstellen oder bearbeiten

Erstellt einen User. Der User wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/users/<user>
```

#### User löschen

Löscht einen User. Der User wird aus der Datenbank gelöscht und aus dem Cache entfernt.

```http request
DELETE /api/users/:id
```

## User Schema in MongoDB

```javascript
{
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [ 'STUDENT', 'TEACHER', 'ADMIN' ]
    },
    classes: [
        {
            type: ObjectId,
            ref: 'Class'
        }
    ],
    extraCourses: [
        {
            type: ObjectId,
            ref: 'Course'
        }
    ]

},
{
    timestamps: true
}
```

<sub>© Copyright: Daniel Dopatka, Linus Bung (2023)</sub>