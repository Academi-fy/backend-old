Ein Club ist eine AG.\
Clubs können mit einem Chat verbunden werden. Dieser Chat ist dann nur für
die [Mitglieder](https://github.com/Academi-fy/backend/wiki/User) des Clubs sichtbar.
Ein Club kann mehrere [Mitglieder](https://github.com/Academi-fy/backend/wiki/User) haben.
Ein [Mitglied](https://github.com/Academi-fy/backend/wiki/User) kann in mehreren Clubs sein.
Ein Club kann mehrere [Events](https://github.com/Academi-fy/backend/wiki/Event) haben. \
Jeder Club hat einen oder mehrere [Leiter](https://github.com/Academi-fy/backend/wiki/User).\
Clubs sind unabhängig von
der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## Club-Objekt

Das Club-Objekt ist ein eigenes JSON-Objekt. Die Clubs werden in MongoDB gespeichert und sind über den HTTP-Server
abzurufen, wo sie gecacht werden. \
Die Club-Cache wird alle **5 Minuten** aktualisiert sowie:
- beim Start des HTTP Servers
- beim Erstellen eines Clubs
- beim Löschen eines Clubs

## Standard Berechtigungen

🟢 = Erlaubt,
🟡 = Vorschlag erlaubt,
🔴 = Nicht erlaubt

#### Basic Operations

| Operation  | Permission     | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User)<sup>1</sup> | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|------------|----------------|-------------------------------------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------|
| ERSTELLEN  | `CLUB_CREATE`  | 🟡                                                          | 🟢                                                                    | 🟢                                                       |
| LÖSCHEN    | `CLUB_DELETE`  | 🔴                                                          | 🟡                                                                    | 🟢                                                       |
| GENEHMIGEN | `CLUB_APPROVE` | 🔴                                                          | 🔴                                                                    | 🟢                                                       |
| ABLEHNEN   | `CLUB_REJECT`  | 🔴                                                          | 🔴                                                                    | 🟢                                                       |
| BEITRETEN  | `CLUB_JOIN`    | 🟢                                                          | 🟢                                                                    | 🟢                                                       |
| VERLASSEN  | `CLUB_LEAVE`   | 🟢                                                          | 🟢                                                                    | 🟢                                                       |

> <sup>1</sup> [User](https://github.com/Academi-fy/backend/wiki/User) haben, wenn sie die Leiter des Clubs sind, Lehrer-Rechte

#### Club verändern

| Operation                                                                          | Permission                   | [Benutzer](https://github.com/Academi-fy/backend/wiki/User) | [Lehrer](https://github.com/Academi-fy/backend/wiki/User)<sup>1</sup> | [Admin](https://github.com/Academi-fy/backend/wiki/User) |
|------------------------------------------------------------------------------------|------------------------------|-------------------------------------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------|
| Name ÄNDERN                                                                        | `CLUB_NAME_CHANGE`           | 🔴                                                          | 🟢                                                                    | 🟢                                                       |
| [Details](https://github.com/Academi-fy/backend/wiki/ClubDetails) ÄNDERN           | `CLUB_DETAILS_CHANGE`        | 🔴                                                          | 🟢                                                                    | 🟢                                                       |
| [Event](https://github.com/Academi-fy/backend/wiki/Event) HINZUFÜGEN & ENTFERNEN   | `CLUB_EVENT_ADMIN `          | 🟡                                                          | 🟢                                                                    | 🟢                                                       | 
| [Leader](https://github.com/Academi-fy/backend/wiki/User) SETZEN & ENTFERNEN       | `CLUB_MEMBER_PROMOTE_DEMOTE` | 🔴                                                          | 🟡<sup>2,3</sup>                                                      | 🟢                                                       |   
| [Benutzer](https://github.com/Academi-fy/backend/wiki/User) HINZUFÜGEN & ENTFERNEN | `CLUB_MEMBER_ADD_REMOVE`     | 🔴                                                          | 🟢                                                                    | 🟢                                                       |   
| [Lehrer](https://github.com/Academi-fy/backend/wiki/User) HINZUFÜGEN & ENTFERNEN   | `CLUB_TEACHER_ADD_REMOVE`    | 🔴                                                          | 🔴                                                                    | 🟢                                                       |   

> <sup>2</sup> noch nicht final \
> <sup>3</sup> mit dem Entfernen des letzten Leaders wird der Club gelöscht

## Attribute

Attribute des Club-Objekts:

```javascript
new Club(
    /*id:*/ "507f191e810c19729de860ea",
    /*name:*/ "Bienen AG",
    /*details:*/ { ... },
    /*avatar:*/ "https://link.to/avatar.png",
    /*events:*/ [ { ... } ],
    /*members:*/ [ { ... } ],
    /*leaders:*/ [ { ... } ],
    /*state:*/ "APPROVED"
)
```

| Attribut   | Type                                                                  | Beschreibung                                                                  |
|------------|-----------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `id`       | String                                                                | Der einzigartige Identifier für den Club.                                     |
| `name`     | String                                                                | Name des Clubs.                                                               |
| `details`  | [ClubDetails](https://github.com/Academi-fy/backend/wiki/ClubDetails) | Details des Clubs.                                                            |
| `avatar`   | String                                                                | Link zu Club-Avatar                                                           |
| `events`   | Array<[Event](https://github.com/Academi-fy/backend/wiki/Event)>      | [Events](https://github.com/Academi-fy/backend/wiki/Event) des Clubs.         |
| `members`  | Array<[User](https://github.com/Academi-fy/backend/wiki/User)>        | [Mitglieder](https://github.com/Academi-fy/backend/wiki/User) des Clubs.      |
| `leaders`  | Array<[User](https://github.com/Academi-fy/backend/wiki/User)>        | [Leiter](https://github.com/Academi-fy/backend/wiki/User) des Clubs.          |
| `approved` | String                                                                | Ob der Club genehmigt wurde. Möglich sind: `SUGGESTED`, `REJECTED`,`ACCEPTED` |

#### Besonderheiten

- `events`, `members` und `leaders` sind MongoDB Referenzen zu den jeweiligen Objekten
    - sie werden erst beim Abrufen auf dem HTTP-Server aufgelöst

Beim Abfragen eines Clubs über den HTTP-Server werden die Attribute `events`, `members` und `leaders` aufgelöst und mit
den jeweiligen Objekten ersetzt.

## Zugriff auf Clubs über den HTTP-Server

#### Alle Clubs abrufen

Ruft alle Clubs ab. Die Clubs werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/clubs
```              

#### Club über ID abrufen

Ruft einen Club über die ID ab. Die Clubs werden gecacht und alle 5 Minuten aktualisiert.

``` http request
GET /api/clubs/:id
```

> weitere Möglichkeiten, einen Club abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### Club erstellen oder bearbeiten

Erstellt einen Club. Der Club wird in der Datenbank gespeichert und gecacht.

``` http request
PUT /api/clubs/<club>
```

#### Club löschen

Löscht einen Club. Der Club wird aus der Datenbank gelöscht und aus dem Cache entfernt.

```http request
DELETE /api/clubs/:id
```

## Club Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

``` javascript
{
    id: {
        type: ObjectId,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        default: 'Neue AG'
    },
    details: {

        description: {
            type: String,
            required: true,
            default: 'AG Beschreibung'
        },
        location: {
            type: String,
            required: true,
            default: 'AG Ort'
        },
        meetingTime: {
            type: String,
            required: true,
            default: '13:00'
        },
        meetingDay: {
            type: String,
            required: true,
            default: 'Montag'
        },
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
        events: [
            {
                type: ObjectId,
                ref: 'Event'
            }
        ]

    },
    leaders: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    members: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    chat: {
        type: ObjectId,
        ref: 'Chat'
    }

},
{
    timestamps: true
}
```

<sub>@ Copyright: Daniel Dopatka, Linus Bung (2023)</sub>