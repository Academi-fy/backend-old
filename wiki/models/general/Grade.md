Grades entsprechen Klassenstufen. \
Sie beinhalten eine Liste von [Klassen](https://github.com/Academi-fy/backend/wiki/Class), die zu der Klassenstufe
gehören. \
Grades werden [Klassen](https://github.com/Academi-fy/backend/wiki/Class) aus
der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners)
manuell zugewiesen. \

## Grade-Objekt

Das Grade-Objekt ist ein eigenes JSON-Objekt. Die Grades werden in MongoDB gespeichert und sind über den HTTP Server
abzurufen, wo sie gecacht werden. \
Der Grade-Cache wird alle **10 Minuten** aktualisiert sowie:

- beim Start des HTTP Servers

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation | Permission     | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------|----------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN | `GRADE_CREATE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| LÖSCHEN   | `GRADE_DELETE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

### Grades verändern

| Operation                                                             | Permission           | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------------------------------------------------------------------|----------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN                                                            | `GRADE_EDIT`         | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Klasse](https://github.com/Academi-fy/backend/wiki/Class) hinzufügen | `GRADE_CLASS_ADD`    | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| [Klasse](https://github.com/Academi-fy/backend/wiki/Class) entfernen  | `GRADE_CLASS_REMOVE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

## Attribute

```javascript
Grade
{
    _id: "507f191e810c19729de860ea",
        level
:
    10,
        classes
:
    [ { ... } ]
}
```

| Attribut  | Type                                                             | Beschreibung                                               |
|-----------|------------------------------------------------------------------|------------------------------------------------------------|
| `_id`     | String                                                           | Die einzigartige ID des Grades.                            |
| `level`   | Integer                                                          | Der Stufe des Grades. Möglich: `5``6``7``8``9``10``11``12` |
| `classes` | Array<[Class](https://github.com/Academi-fy/backend/wiki/Class)> | Liste mit den Klassen des Grades.                          |

#### Besonderheiten

- `classes` ist eine MongoDB Referenz zu den jeweiligen Objekten
    - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

## Zugriff auf Grades über den HTTP Server

#### Alle Grades abrufen

Ruft alle Grades ab. Die Grades werden gecacht und alle 10 Minuten aktualisiert.

``` http request
GET /api/grades
```

#### Grade über ID abrufen

Ruft eine Grade über die ID ab. Die Grades werden gecacht und alle 10 Minuten aktualisiert.

``` http request
GET /api/grades/:id
```

> weitere Möglichkeiten, eine Grade abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Grade erstellen oder bearbeiten

Erstellt eine Grade. Die Grade wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/grades/<grade>
```

#### Grade löschen

Löscht eine Grade. Die Grade wird aus der Datenbank gelöscht und aus dem Cache entfernt.

``` http request
DELETE /api/grades/:id
```

## Grade Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{
    level: {
        type: Number,
            unique
    :
        true,
            required
    :
        true
    }
,
    classes: [
        {
            type: ObjectId,
            ref: 'Class'
        }
    ]
}
,
{
    timestamps: true
}
```