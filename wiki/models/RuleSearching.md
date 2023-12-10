Bei Models kann neben den regulären Methoden `getAll...()` und `get...ById(id)` auch die Methode `get...ByRule(filter)` verwendet werden. \
Diese Methode nimmt ein JSON-Objekt als Parameter, das die Filtereigenschaften enthält. 
Die Filtereigenschaften sind die gleichen wie die Attribute des Models. 
Die Methode gibt ein Array mit allen Objekten zurück, die den Filtereigenschaften entsprechen.

Dabei wird der Filter immer so gebildet:

```javascript
{
    "filter": {
        "property1": "value1",
        "property2": "value2",
        ...   
    }
}
```

## Beispiel für eine Nachricht

```javascript
{
    "filter": {
        author: "656cf418a7b20d606810c92c",
        chat: "656cf418a7b20d606810c91f",
    }
}
```

Gibt alle Nachrichten als Array<[Message](https://github.com/Academi-fy/backend/wiki/Message)> zurück, bei denen:
- der Autor die ID "656cf418a7b20d606810c92c" hat
- der Chat die ID "656cf418a7b20d606810c91f" hat