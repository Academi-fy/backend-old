Eine Poll ist eine Abstimmung in einem Chat. \
Sie wird als [MessageContent](https://github.com/Academi-fy/backend/wiki/MessageContent) in [Nachrichten](https://github.com/Academi-fy/backend/wiki/Message) versendet. \
Eine Poll besteht aus einer Frage und mehreren Antwortmöglichkeiten. \

## Poll Objekt

```javascript
Poll {
    question: "Wo soll es hingehen?",
    answers: [ {...} ], 
    maxVotesPerUser: 1
}
```

| Attribut          | Typ                                                                        | Beschreibung                                                                                        |
|-------------------|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `question`        | String                                                                     | Die Frage der Abstimmung.                                                                           |
| `answers`         | Array<[PollAnswer](https://github.com/Academi-fy/backend/wiki/PollAnswer)> | Die Antwortmöglichkeiten der Abstimmung.                                                            |
| `maxVotesPeruser` | Number                                                                     | Maximale Anzahl an Stimmen, die ein [Benutzer](https://github.com/Academi-fy/backend/wiki/User) hat |

## Poll in Message Schema in MongoDB

```javascript
{
    ...
    content: [
        {
            type: "poll",
            data: {
                question: String,
                answers: [ {...} ]
            }
        }
    ],
    ...
}
```