Event Informationen beschreiben das Event genauer. Sie werden bei der Erstellung des [Events](https://github.com/Academi-fy/backend/wiki/Event) 
in den Informationen angegeben und können später geändert werden.\
Sie werden nicht explizit in MongoDB gespeichert, sondern nur in den jeweiligen `event.information`. \
EventInformations sind, genau wie [Events](https://github.com/Academi-fy/backend/wiki/Event), unabhängig von der [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

In der App werden Requirements mit der Überschrift angezeigt, der in `event.information.title` gespeichert ist.

## EventInformation-Objekt

Das EventInformation-Objekt ist ein Teil des [Event-Objekts](https://github.com/Academi-fy/backend/wiki/Event).\
Die EventInformations werden im [Event](https://github.com/Academi-fy/backend/wiki/Club) in einem Array unter `event.information` gespeichert.

## Attribute

```javascript
EventInformation {
    title: "Genres heute:",
    items: [
        {
            emoji: "🎭",
            description: "Salsa"
        }
    ]
}
```

| Attribut            | Type          | Beschreibung                                                               |
|---------------------|---------------|----------------------------------------------------------------------------|
| `title`             | String        | Titel der EventInformation                                                 |
| `items`             | Array<Object> | Array mit Elementen, die die Beschreibung der EventInformation beschreiben |
| `items.emoji`       | String        | Emoji des Elements                                                         |
| `items.description` | String        | Beschreibung des Elements                                                  |

### Schema in MongoDB

`event.information` ist ein Teil des [Events](https://github.com/Academi-fy/backend/wiki/Event)

```javascript
information: [
    {
        title: {
            type: String
        },
        items: [
            {
                emoji: {
                    type: String
                },
                description: {
                    type: String
                }
            }
        ],
        type: Array,
        required: false
    },

]
```