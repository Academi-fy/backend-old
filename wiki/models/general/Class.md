Klassen entsprechen den tatsächlichen Schulklassen. \
Sie beinhalten eine Liste von [Schülern](https://github.com/Academi-fy/backend/wiki/User)
sowie [Lehrern](https://github.com/Academi-fy/backend/wiki/User) und den dazu
gehörigen [Kursen](https://github.com/Academi-fy/backend/wiki/Course). \
Klassen werden [Kursen](https://github.com/Academi-fy/backend/wiki/Course) aus
der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners)
manuell zugewiesen. \

## Klassen-Objekt

Das Klassen-Objekt ist ein eigenes JSON-Objekt. Die Klassen werden in MongoDB gespeichert und sind über den HTTP Server
abzurufen, wo sie gecacht werden. \
Der Klassen-Cache wird alle **5 Minuten** aktualisiert sowie:

- beim Start des HTTP Servers
- beim Löschen/Erstellen einer Klasse

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation | Permission     | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------|----------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN | `CLASS_CREATE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| LÖSCHEN   | `CLASS_DELETE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

### Klassen verändern

| Operation                                                              | Permission          | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|------------------------------------------------------------------------|---------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN                                                             | `CLASS_EDIT`        | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Benutzer](https://github.com/Academi-fy/backend/wiki/User) hinzufügen | `CLASS_ADD_USER`    | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Lehrer](https://github.com/Academi-fy/backend/wiki/User) hinzufügen   | `CLASS_ADD_TEACHER` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| KURS                                                                   | `CLASS_ADD_COURSE`  | 🔴                                                          | 🔴                                                        | 🟢                                                       |

## Attribute

```javascript
Class
{
    _id: "507f191e810c19729de860ea",
        grade
:
    {...
    }
,
    courses: [ { ... } ],
        members
:
    [ { ... } ],
        specified_grade
:
    "a"
}
```

| Attribut          | Type                                                               | Beschreibung                                                                                  |
|-------------------|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `_id`             | String                                                             | Die einzigartige ID der Klasse.                                                               |
| `grade`           | [Grade](https://github.com/Academi-fy/backend/wiki/Grade)          | Die Stufe der Klasse.                                                                         |
| `courses`         | Array<[Course](https://github.com/Academi-fy/backend/wiki/Course)> | Liste mit den Kursen der Klasse.                                                              |
| `members`         | Array<[User](https://github.com/Academi-fy/backend/wiki/User)>     | Liste mit den Mitgliedern der Klasse.                                                         |
| `specified_grade` | String                                                             | Der Klassen-Zusatz. Möglich: `a` `b` `c` `d` `e`. Außerdem `A` + `Abijahrgang` für Kursstufen |

#### Besonderheiten

- `grade`, `courses` und `members` sind MongoDB Referenzen zu den jeweiligen Objekten
    - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

- `specified_grade` ist ein String, der die Klasse genauer beschreibt
    - z.B. für die 10a `a`
    - z.B. für die K1, die im Jahr 2025 ihr Abitur macht `A25`

## Zugriff auf Chats über den HTTP Server

#### Alle Klassen abrufen

Ruft alle Klassen ab. Die Klassen werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/classes
```

#### Klasse über ID abrufen

Ruft eine Klasse über die ID ab. Die Klassen werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/classes/:id
```

> weitere Möglichkeiten, eine Klasse
> abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Klasse erstellen oder bearbeiten

Erstellt eine Klasse. Die Klasse wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/classes/<class>
```

#### Klasse löschen

Löscht eine Klasse. Die Klasse wird aus der Datenbank gelöscht und aus dem Cache entfernt.

``` http request
DELETE /api/classes/:id
```

## Chat Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{

    grade: {
        type: ObjectId,
            ref
    :
        'Grade'
    }
,
    courses: [
        {
            type: ObjectId,
            ref: 'Course'
        }
    ],
        members
:
    [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
        specified_grade
:
    {
        type: String,
            required
    :
        true
    }

}
,
{
    timestamps: true
}
```