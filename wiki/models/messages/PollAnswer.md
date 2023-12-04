Eine PollAnswer ist eine Antwort auf eine [Poll](https://github.com/Academi-fy/backend/wiki/Poll). \
Sie enthält den Text der Antwort mit einem Emoji und die Stimmen, die diese Antwort erhalten hat.

## PollAnswer Objekt

```javascript
PollAnswer {
    id: 1,
    text: "Seepark",
    emoji: "🏞",
    voters: [ {...}]
}
```

| Attribut | Typ                                                            | Beschreibung                                                                                               |
|----------|----------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `id`     | Number                                                         | Die ID der Antwort.                                                                                        |
| `text`   | String                                                         | Der Text der Antwort.                                                                                      |
| `emoji`  | String                                                         | Das Emoji der Antwort.                                                                                     |
| `voters` | Array<[User](https://github.com/Academi-fy/backend/wiki/User)> | List mit den [Usern](https://github.com/Academi-fy/backend/wiki/User), die für die Antwort gestimmt haben. |

#### Bersonderheiten

- `voters` ist ein Array mit MongoDB Referenzen zu den jeweiligen [Usern](https://github.com/Academi-fy/backend/wiki/User). \
  - sie werden beim Abfragen nicht aufgelöst, es wird also nur die ID des Users zurückgegeben. \

## PollAnswer in Poll Schema in MongoDB

```javascript
{
    type: "poll",
    data: {
        question: String,
        answers: [ 
            {
                id: Number,
                text: String,
                emoji: String,
                voters: [
                    {
                        type: ObjectId,
                        ref: "User"
                    }
                ]
            } 
        ]
    }
}
```