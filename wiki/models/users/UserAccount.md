UserAccounts enthalten die Daten, die für die Authentifizierung eines Users benötigt werden. Sie werden beim Erstellen eines Users automatisch erstellt und können nicht manuell erstellt werden. \
Bei der ersten Anmeldung gibt der [User](https://github.com/Academi-fy/backend/wiki/User) seine Daten ein und diese werden dann in der Datenbank gespeichert. \
Die Verknüpfung zwischen [User](https://github.com/Academi-fy/backend/wiki/User) und UserAccount wird über die `user._id` hergestellt. Darüber erfolgt auch die Verknüpfung zur [WebUntis API](https://help.untis.at/hc/de/articles/4886785534354-API-documentation-for-integration-partners).

## UserAccount-Objekt

Das UserAccount-Objekt ist ein eigenes JSON-Objekt. Die UserAccounts werden in MongoDB gespeichert und sind über den HTTP Server abzurufen. \
Sie werden **NICHT** gecacht. Außerdem können sie nicht manuell erstellt werden! \

## Attribute

```javascript
UserAccount {
    _id: "507f191e810c19729de860ea",
    user: {...},
    username: "DopatkaK2A24",
    password: "$2a$10$Z3J", // hashed
    settings: {...},
    permissions:  [...]
}
```

| Attribut      | Type                                                                                             | Beschreibung                                                                             |
|---------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| `_id`         | String                                                                                           | Die einzigartige ID des UserAccounts.                                                    |
| `user`        | [User](https://github.com/Academi-fy/backend/wiki/User)                                          | Der [User](https://github.com/Academi-fy/backend/wiki/User), dem der UserAccount gehört. |
| `username`    | String                                                                                           | Der Benutzername des UserAccounts.                                                       |
| `password`    | String                                                                                           | Das Passwort des UserAccounts.                                                           |
| `settings`    | [UserAccountSettings](https://github.com/Academi-fy/backend/wiki/UserAccountSettings)            | Die Einstellungen des UserAccounts.                                                      |
| `permissions` | Array<[UserAccountPermission](https://github.com/Academi-fy/backend/wiki/UserAccountPermission)> | Die Berechtigungen des UserAccounts.                                                     |

#### Besonderheiten

- `user` ist eine MongoDB Referenz zum jeweiligen Objekt
  - er wird erst beim Abrufen auf dem HTTP-Server aufgelöst
- `password` ist gehasht mit bcrypt

## Zugriff auf UserAccounts über den HTTP Server

#### Alle UserAccounts abrufen

Ruft alle UserAccounts ab.

``` http request
GET /api/accounts
```              

#### UserAccount über ID abrufen

Ruft einen UserAccount über die ID ab.

``` http request
GET /api/accounts/:id
```

> weitere Möglichkeiten, einen UserAccounts abzurufen: [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

#### UserAccount erstellen oder bearbeiten

Erstellt einen UserAccount. Der UserAccount wird in der Datenbank gespeichert.

``` http request
PUT /api/accounts/<account>
```

#### UserAccount löschen

Löscht einen UserAccount. Der UserAccount wird aus der Datenbank gelöscht.

```http request
DELETE /api/accounts/:id
```

## UserAccount Schema in MongoDB

Generiert über [mongoose](https://mongoosejs.com/docs/guide.html) [npm package]

```javascript
{
        
    user: {
        type: ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    settings: {
        type: Object,
        required: true
    },
    permissions: [
        {
            type: String
        }
    ]

},
{
    timestamps: true
}
```