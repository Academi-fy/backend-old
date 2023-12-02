Eine [Nachricht](https://github.com/Academi-fy/backend/wiki/Message) besteht auch aus dem MessageContent.
Dieser beinhaltet den eigentlichen Inhalt der Nachricht, wie z.B. den Text oder ein Bild. \

## Content Types

### File

```javascript
{
    type: "FILE",
    value: {...}
}
```

| Attribute | Type   | Description                            |
|-----------|--------|----------------------------------------|
| type      | String | Der Typ des Contents.                  |
| value     | Object | Das File-Objekt. _(noch zu erledigen)_ |


### Image

```javascript
{
    type: "IMAGE",
    value: {...}
}
```

| Attribute | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| type      | String | Der Typ des Contents.                   |
| value     | Object | Das Image-Objekt. _(noch zu erledigen)_ |

### Poll

```javascript
{
    type: "POLL",
    value: {...}
}
```

| Attribute | Type                                                    | Description           |
|-----------|---------------------------------------------------------|-----------------------|
| type      | String                                                  | Der Typ des Contents. |
| value     | [Poll](https://github.com/Academi-fy/backend/wiki/Poll) | Das Poll-Objekt.      |

### Text

```javascript
{
    type: "POLL",
    value: "Text"
}
```

| Attribute | Type   | Description           |
|-----------|--------|-----------------------|
| type      | String | Der Typ des Contents. |
| value     | String | Der Text.             |

### Video

```javascript
{
    type: "VIDEO",
    value: {...}
}
```

| Attribute | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| type      | String | Der Typ des Contents.                   |
| value     | Object | Das Video-Objekt. _(noch zu erledigen)_ |

<sub>© Copyright: Daniel Dopatka, Linus Bung (2023)</sub>