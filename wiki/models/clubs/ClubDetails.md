Ein Club ist eine AG. \
ClubsDetails beschreiben einen Club genauer. Sie werden bei der Erstellung
des [Clubs](https://github.com/Academi-fy/backend/wiki/Club) angegeben und können später geändert werden.
Sie werden nicht explizit in MongoDB gespeichert, sondern nur in dem
jeweiligen [Club](https://github.com/Academi-fy/backend/wiki/Club). \
ClubDetails sind, genau wie [Clubs](https://github.com/Academi-fy/backend/wiki/Club), unabhängig von
der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## ClubDetails-Objekt

Das ClubDetails-Objekt ist ein Teil des [Club-Objekts](https://github.com/Academi-fy/backend/wiki/Club).\
Die ClubDetails werden im [Club](https://github.com/Academi-fy/backend/wiki/Club) unter `club.details` gespeichert.

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

#### [Club](https://github.com/Academi-fy/backend/wiki/Club) verändern

| Operation      | Permission            | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User)<sup>1</sup> | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|----------------|-----------------------|-------------------------------------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------|
| Details ÄNDERN | `CLUB_DETAILS_CHANGE` | 🔴                                                          | 🟢                                                                    | 🟢                                                       |

> (_aus [Club](https://github.com/Academi-fy/backend/wiki/Club)_)\
> <sup>1</sup> User haben, wenn sie die Leiter des Clubs sind, Lehrer-Rechte

## Attribute

Attribute des ClubDetails-Objekts:

```javascript
new ClubDetails(
    /*coverImage*/ "https://example.com/image.png",
    /*description*/ "Beschreibung des Clubs",
    /*location*/ "Raum 101",
    /*meetingTime*/ "12:00",
    /*meetingDay*/ "Montag",
    /*requirements*/ [ { ... } ],
    /*tags*/ [ { ... } ],
    /*events*/ [ { ... } ]
)
```

| Attribut       | Type                                                                                 | Beschreibung                 |
|----------------|--------------------------------------------------------------------------------------|------------------------------|
| `coverImage`   | String                                                                               | URL zum Cover-Bild des Clubs |
| `description`  | String                                                                               | Beschreibung des Clubs       |
| `location`     | String                                                                               | Ort des Clubs                |
| `meetingTime`  | String                                                                               | Zeitpunkt des Treffens       |
| `meetingDay`   | String                                                                               | Tag des Treffens             |
| `requirements` | Array<[ClubRequirement](https://github.com/Academi-fy/backend/wiki/ClubRequirement)> | Voraussetzungen für den Club |
| `tags`         | Array<[ClubTag](https://github.com/Academi-fy/backend/wiki/ClubTag)>                 | Tags des Clubs               |
| `events`       | Array<[Event](https://github.com/Academi-fy/backend/wiki/ClubRequirement)>           | Events des Clubs             |

#### Besonderheiten

- `events` sind MongoDB Referenzen zu den jeweiligen Objekten
    - sie werden erste beim Abrufen auf dem HTTP-Server aufgelöst

Beim Abfragen eines [Clubs](https://github.com/Academi-fy/backend/wiki/Club) über den HTTP-Server werden die `events`
aufgelöst und mit den jeweiligen Objekten ersetzt.

### Schema in MongoDB

`club.details` ist ein Teil des [Club Schemas](https://github.com/Academi-fy/backend/wiki/Club#club-schema-in-mongodb)

```javascript
details: {

    description: {
        type: String,
            required
    :
        true,
    default:
        'AG Beschreibung'
    }
,
    location: {
        type: String,
            required
    :
        true,
    default:
        'AG Ort'
    }
,
    meetingTime: {
        type: String,
            required
    :
        true,
    default:
        '13:00'
    }
,
    meetingDay: {
        type: String,
            required
    :
        true,
    default:
        'Montag'
    }
,
    requirements: [
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
    ],
        tags
:
    [
        {
            type: String,
            required: true
        }
    ]
    events: [
        {
            type: ObjectId,
            ref: 'Event'
        }
    ]

}
```