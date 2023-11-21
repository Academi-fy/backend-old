Ein Event ist eine schulische Veranstaltung bzw. ein schulisches Ereignis, das mit der Schulgemeinschaft geteilt werden soll. \
Events können einer oder mehreren AGs zugeordnet werden. \
Events sind unabhängig von der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## Event-Objekt

Das Event-Objekt ist ein eigenes JSON-Objekt. Die Events werde in MongoDB gespeichert und sind über den HTTP Server abzurufen, wo sie gecacht werden. \
Der Event-Cache wird alle **5 Minuten** aktualisiert sowie:
- beim Start des HTTP Servers
- beim Erstellen eines Events

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

### Basic Operations

| Operation  | Permission      | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|------------|-----------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN  | `EVENT_CREATE`  | 🟡                                                          | 🟡<sup>🟢1</sup>                                          | 🟢                                                       |
| LÖSCHEN    | `EVENT_DELETE`  | 🔴                                                          | 🟡<sup>🟢1</sup>                                          | 🟢                                                       |
| ANSEHEN    | `EVENT_VIEW`    | 🟢                                                          | 🟢                                                        | 🟢                                                       |
| GENEHMIGEN | `EVENT_APPROVE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |
| ABLEHNEN   | `EVENT_REJECT`  | 🔴                                                          | 🔴                                                        | 🟢                                                       |

### Event verändern

| Operation                                                            | Permission            | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User) | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|----------------------------------------------------------------------|-----------------------|-------------------------------------------------------------|-----------------------------------------------------------|----------------------------------------------------------|
| BEARBEITEN                                                           | `EVENT_EDIT`          | 🟡                                                          | 🟡<sup>🟢1</sup>                                          | 🟢                                                       |
| [Tickets](https://github.com/Academi-fy/backend/wiki/User) VERWALTEN | `EVENT_TICKET_MANAGE` | 🔴                                                          | 🔴                                                        | 🟢                                                       |

> <sup>1</sup> [Lehrer](https://github.com/Academi-fy/backend/wiki/User) können nur Events erstellen/löschen, die einem [Club](https://github.com/Academi-fy/backend/wiki/Club) zugeordnet sind, die sie leiten.

## Attribute

```javascript
new Event(
    /*id*/ "507f191e810c19729de860ea",
    /*title*/ "Weihnachtskonzert 2023",
    /*description*/ "Auch in diesem Jahr findet wieder das Weihnachtskonzert statt [...]", // [...] = nur hier gekürzt
    /*location*/ "Rotteck Aula",
    /*host*/ "M. Pöll und die Schulband",
    /*clubs*/ [ {...} ],
    /*startDate*/ 1690588750679,
    /*endDate*/ 1700588810679,
    /*information*/ [ {...} ],
    /*tickets*/ [ {...} ],
)
```

| Attribut    | Type                                                                                   | Beschreibung                                                     |
|-------------|----------------------------------------------------------------------------------------|------------------------------------------------------------------|
| id          | String                                                                                 | Die einzigartige ID des Events.                                  |
| title       | String                                                                                 | Der Titel des Events.                                            |
| description | String                                                                                 | Die Beschreibung des Events.                                     |
| location    | String                                                                                 | Der Ort des Events.                                              |
| host        | String                                                                                 | Der Host des Events.                                             |
| clubs       | Array<[Club](https://github.com/Academi-fy/backend/wiki/Club)>                         | Die Clubs, die dem Event zugeordnet sind.                        |
| startDate   | Number                                                                                 | Das Startdatum des Events. Angegeben in Millisekunden seit 1970. |
| endDate     | Number                                                                                 | Das Enddatum des Events. Angegeben in Millisekunden seit 1970.   |
| information | Array<[EventInformation](https://github.com/Academi-fy/backend/wiki/EventInformation)> | Die Informationen, die dem Event zugeordnet sind.                |
| tickets     | Array<[EventTicket](https://github.com/Academi-fy/backend/wiki/EventTicket)>           | Die Tickets, die dem Event zugeordnet sind.                      |

#### Besonderheiten

- Die Attribute `startDate` und `endDate` sind in Millisekunden seit 1970 angegeben. Dies ist der Standard für die Zeitangabe in JavaScript.
  - sie sind in UTC angegeben

- `clubs` und `tickets` sind MongoDB Referenzen zu den jeweiligen Objekten
  - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

## Zugriff auf Events über den HTTP Server

#### Alle Events abrufen

Ruft alle Events ab. Die Events werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/events
```              

#### Event über ID abrufen

Ruft ein Event über die ID ab. Die Events werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/events/:id
```

> weitere Möglichkeiten, ein Event abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Event erstellen oder bearbeiten

Erstellt ein Event. Das Event wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/events/<event>
```

#### Event löschen

Löscht ein Event. Das Event wird aus der Datenbank gelöscht und aus dem Cache entfernt.

```http request
DELETE /api/events/:id
```

## Club Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    clubs: [
        {
            type: ObjectId,
            ref: 'Club'
        }
    ],
    startDate: {
        type: Number,
        required: true
    },
    endDate: {
        type: Number,
        required: true
    },
    information: [
        {
            title: {
                type: String,
                required: true
            },
            items: [
                {
                    emoji: {
                        type: String,
                        required: true
                    },
                    description: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    ],
    tickets: {
        ticketDetails: {
            price: {
                type: Number,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
        },
        sold: [
            {
                type: ObjectId,
                ref: 'EventTicket'
            }
        ]
    }
},
{
    timestamps: true,
}
```

<sub>@ Copyright: Daniel Dopatka, Linus Bung (2023)</sub>