Ein Club ist eine AG. \
ClubsRequirements beschreiben die "Voraussetzungen" (soft skills), die für den Club empfohlen werden. Sie werden bei der Erstellung des [Clubs](https://github.com/Academi-fy/backend/wiki/Club) in den [ClubDetails](https://github.com/Academi-fy/backend/wiki/ClubDetails) angegeben und können später geändert werden.\
Sie werden nicht explizit in MongoDB gespeichert, sondern nur in den jeweiligen [ClubDetails](https://github.com/Academi-fy/backend/wiki/ClubDetails). \
ClubRequirements sind, genau wie [Clubs](https://github.com/Academi-fy/backend/wiki/Club) und [ClubDetails](https://github.com/Academi-fy/backend/wiki/Club), unabhängig von der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

In der App werden Requirements mit der überschrift "Was solltest du mitbringen?" angezeigt.

## ClubRequirement-Objekt

Das ClubRequirement-Objekt ist ein Teil des [ClubDetails-Objekts](https://github.com/Academi-fy/backend/wiki/ClubDetails).\
Die ClubRequirements werden im [Club](https://github.com/Academi-fy/backend/wiki/Club) unter `club.details.requirements` gespeichert.

## Attribute

Attribute des ClubRequirement-Objekts:

```javascript
new ClubRequirement(
    /*emoji*/ ":joy:",
    /*description*/ "Beschreibung des Clubs"
)
```

| Attribut      | Type   | Beschreibung                                                              |
|---------------|--------|---------------------------------------------------------------------------|
| `emoji`       | String | Emoji des [Clubs](https://github.com/Academi-fy/backend/wiki/Club)        |
| `description` | String | Beschreibung des [Clubs](https://github.com/Academi-fy/backend/wiki/Club) |

### Schema in MongoDB

`club.details.requirements` ist ein Teil der [ClubDetails](https://github.com/Academi-fy/backend/wiki/ClubDetails#schema-in-mongodb)
```javascript
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
]
```

<sub>@ Copyright: Daniel Dopatka, Linus Bung (2023)</sub>