Innerhalb des Systems gibt es verschiedene Fehler, die auftreten können. \
Dafür gibt es hier vorgesehene Error Arten.

### CacheError

`name`: CacheError \
`description`: Fehler, der auftritt, wenn ein Objekt in der Cache des HTTP-Servers nicht erstellt bzw. gelöscht werden kann.

#### Beispiel

```javascript
throw new CacheError(`Failed to put user in cache:\n${ insertedUser }`);
```
> aus `httpServer/models/User.js`

### ConfigError

`name`: ConfigError \
`description`: Fehler, der auftritt, wenn die Config des HTTP-Servers intern nicht geladen werden kann.

#### Beispiel

```javascript
throw new ConfigError('MONGODB_PASSWORD cannot be accessed from config')
```
> aus `index.js`

### DatabaseError

`name`: DatabaseError \
`description`: Fehler, der auftritt, wenn ein Objekt in der Datenbank nicht gefunden, nicht geladen oder nicht erstellt bzw. gelöscht werden kann. Außerdem, wenn ein Mongo Objekt nicht populated werden kann.

#### Beispiel

```javascript
throw new DatabaseError(`Failed to populate setup account with id '${ setupAccount._id }:'\n${ error }`);
```
> aus `httpServer/models/SetupAccount.js`

### RetrievalError

`name`: RetrievalError \
`description`: Fehler, der auftritt, wenn ein Objekt nicht gefunden werden kann.

#### Beispiel

```javascript
throw new RetrievalError(`Failed to find blackboards matching rule:\n${ rule }`);
```
> aus `httpServer/models/Blackboard.js`