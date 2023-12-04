Subjects entsprechen Fächern. \
Sie beinhalten eine Liste von [Kursen](https://github.com/Academi-fy/backend/wiki/Course), die zu den Fächern gehören. \
Fächer werden [Kursen](https://github.com/Academi-fy/backend/wiki/Course) aus
der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners)
manuell zugewiesen. \

## Subject-Objekt

Das Subject-Objekt ist ein eigenes JSON-Objekt. Die Subjects werden in MongoDB gespeichert und sind über den HTTP Server
abzurufen, wo sie gecacht werden. \
Der Subject-Cache wird alle **10 Minuten** aktualisiert sowie:

- beim Start des HTTP Servers

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation | Permission       | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------|------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN | `SUBJECT_CREATE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| LÖSCHEN   | `SUBJECT_DELETE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

### Subjects verändern

| Operation                                                            | Permission              | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|----------------------------------------------------------------------|-------------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN                                                           | `SUBJECT_EDIT`          | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Kurs](https://github.com/Academi-fy/backend/wiki/Course) HINZUFÜGEN | `SUBJECT_COURSE_ADD`    | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Kurs](https://github.com/Academi-fy/backend/wiki/Course) ENTFERNEN  | `SUBJECT_COURSE_REMOVE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

## Attribute

```javascript
Subject
{
    _id: "507f191e810c19729de860ea",
        name
:
    "Deutsch",
        shortName
:
    "D",
        courses
:
    [ { ... } ]
}
```

| Attribut    | Type                                                               | Beschreibung                       |
|-------------|--------------------------------------------------------------------|------------------------------------|
| `_id`       | String                                                             | Die einzigartige ID des Subjects.  |
| `name`      | String                                                             | Der Name des Subjects.             |
| `shortName` | String                                                             | Der Kurzname des Subjects.         |
| `courses`   | Array<[Course](https://github.com/Academi-fy/backend/wiki/Course)> | Liste mit den Kursen des Subjects. |

#### Besonderheiten

- `courses` ist eine MongoDB Referenz zu den jeweiligen Objekten
    - sie wird erst beim Abrufen auf dem HTTP-Server aufgelöst

## Zugriff auf Subjects über den HTTP Server

#### Alle Subjects abrufen

Ruft alle Subjects ab. Die Subjects werden gecacht und alle 10 Minuten aktualisiert.

``` http request
GET /api/subjects
```

#### Subjects über ID abrufen

Ruft eine Subjects über die ID ab. Die Subjects werden gecacht und alle 10 Minuten aktualisiert.

``` http request
GET /api/subjects/:id
```

> weitere Möglichkeiten, eine Subjects
> abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Subjects erstellen oder bearbeiten

Erstellt eine Subjects. Die Subjects wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/subjects/<subject>
```

#### Subjects löschen

Löscht eine Subjects. Die Subjects wird aus der Datenbank gelöscht und aus dem Cache entfernt.

``` http request
DELETE /api/subjects/:id
```

## Subjects Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{

    type: {
        type: String,
            unique
    :
        true,
            required
    :
        true
    }
,
    shortName: {
        type: String,
            unique
    :
        true,
            required
    :
        true
    }
,
    courses: [
        {
            type: ObjectId,
            ref: 'Course'
        }
    ]
}
,
{
    timestamps: true
}
```