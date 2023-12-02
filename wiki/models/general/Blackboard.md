Blackboards sind Nachrichten, die als Broadcast für große Teile der Schule gedacht sind. \
Sie funktionieren grundlegend wie Artikel, die von jedem geschrieben werden können. Es kann ausgewählt werden, ob ein Blackboard nur für eine bestimmte Klasse oder für alle sichtbar sein soll. \
Außerdem kann ein Blackboard mit einem Ablaufdatum versehen werden, sodass es nach diesem nicht mehr sichtbar ist. \
Blackboards sind unabhängig von der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## Blackboard-Objekt

Das Blackboard-Objekt ist ein eigenes JSON-Objekt. Die Blackboards werden in MongoDB gespeichert und sind über den HTTP Server abzurufen, wo sie gecacht werden. \
Der Blackboard-Cache wird alle **10 Minuten** aktualisiert sowie:
- beim Start des HTTP Servers

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation | Permission          | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|-----------|---------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN | `BLACKBOARD_CREATE` | 🟡                                                          | 🟡                                                        | 🟢                                                       |
| LÖSCHEN   | `BLACKBOARD_DELETE` | 🔴                                                          | 🟡                                                        | 🟢                                                       |

### Blackboard verändern

| Operation  | Permission        | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|------------|-------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN | `BLACKBOARD_EDIT` | 🟡                                                          | 🟡                                                        | 🟢                                                       |

## Attribute

```javascript
new Blackboard(
    /*id*/ "616f6c6c6f7765646e657773",
    /*title*/ "Titel",
    /*author*/ {...},
    /*coverImage*/ "https://example.com/image.png",
    /*text*/ "Text",
    /*date*/ 1701475668245
)
```

| Attribut     | Typ                                                     | Beschreibung                                                                           |
|--------------|---------------------------------------------------------|----------------------------------------------------------------------------------------|
| `id`         | String                                                  | Die ID des Blackboards.                                                                |
| `title`      | String                                                  | Der Titel des Blackboards.                                                             |
| `author`     | [User](https://github.com/Academi-fy/backend/wiki/User) | Der Autor des Blackboards.                                                             |
| `coverImage` | String                                                  | Der Link zum Coverbild des Blackboards.                                                |
| `text`       | String                                                  | Der Text des Blackboards.                                                              |
| `date`       | Number                                                  | Das Datum, an dem das Blackboard erstellt wurde. Angegeben in Millisekunden seit 1970. |

#### Besonderheiten

- `author`ist eine MongoDB Referenz zum jeweiligen Objekten
    - er wird erst beim Abrufen auf dem HTTP-Server aufgelöst

## Zugriff auf Blackboards über den HTTP-Server

#### Alle Blackboards abrufen

Ruft alle Blackboards ab. Die Blackboards werden gecacht und alle 10 Minuten aktualisiert.

``` http request
GET /api/blackboards
```              

#### Blackboard über ID abrufen

Ruft ein Blackboard über die ID ab. Die Blackboards werden gecacht und alle 10 Minuten aktualisiert.

``` http request
GET /api/blackboards/:id
```

> weitere Möglichkeiten, ein Blackboard abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Blackboard erstellen oder bearbeiten

Erstellt ein Blackboard. Das Blackboard wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/blackboards/<club>
```

#### Blackboard löschen

Löscht ein Blackboard. Das Blackboard wird aus der Datenbank gelöscht und aus dem Cache entfernt.

```http request
DELETE /api/blackboards/:id
```

## Club Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{

    title: {
        type: String,
        required: true
    },
    author: {
        type: ObjectId,
        ref: 'User'
    },
    coverImage: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Number,
        required: false
    },
    state: {
        type: String,
        required: true,
        default: "SUGGESTED"
    },
    editHistory: [
        {
            type: Object,
            required: false
        }
    ]

},
{
    timestamps: true
}
```

<sub>© Copyright: Daniel Dopatka, Linus Bung (2023)</sub>