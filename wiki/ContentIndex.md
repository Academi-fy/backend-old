# Inhaltsverzeichnis: Backend Server

[Home](https://github.com/Academi-fy/backend/wiki/)

# Documentation

## HTTP Server
- [Caching](https://github.com/Academi-fy/backend/wiki/Caching)
- [Index](https://github.com/Academi-fy/backend/wiki/Index)
- [PropertyValidation](https://github.com/Academi-fy/backend/wiki/PropertyValidation)
- [Errors](https://github.com/Academi-fy/backend/wiki/Errors)
- [ErrorCodes](https://github.com/Academi-fy/backend/wiki/ErrorCodes)
- [RuleSearching](https://github.com/Academi-fy/backend/wiki/RuleSearching)

## Models

### [Blackboard](https://github.com/Academi-fy/backend/wiki/Blackboard) 

Blackboards sind Nachrichten, die als Broadcast für große Teile der Schule gedacht sind. \
Sie funktionieren grundlegend wie Artikel, die von jedem geschrieben werden können. Es kann ausgewählt werden, ob ein Blackboard nur für eine bestimmte Klasse oder für alle sichtbar sein soll. \
Außerdem kann ein Blackboard mit einem Ablaufdatum versehen werden, sodass es nach diesem nicht mehr sichtbar ist. 

### [Class](https://github.com/Academi-fy/backend/wiki/Class)

Klassen entsprechen den tatsächlichen Schulklassen. \
Sie beinhalten eine Liste von [Schülern](https://github.com/Academi-fy/backend/wiki/User) sowie [Lehrern](https://github.com/Academi-fy/backend/wiki/User) und den dazu gehörigen [Kursen](https://github.com/Academi-fy/backend/wiki/Course). 

### [Course](https://github.com/Academi-fy/backend/wiki/Course)

Ein Kurs entspricht einer Versammlung aus [Schülern](https://github.com/Academi-fy/backend/wiki/User), die zusammen Unterricht haben. Dabei müssen sie nicht in der gleichen Klasse oder Stufe sein. \
Einem Kurs können daher mehrere [Klassen](https://github.com/Academi-fy/backend/wiki/Class) zugeordnet werden, aber auch einzelne Schüler. \
Außerdem wird ein zentraler Lehrer für den Kurs festgelegt. Es können trotzdem, genau wie bei Schülern, mehrere Lehrer zu einem Kurs hinzugefügt werden. 

### [Grade](https://github.com/Academi-fy/backend/wiki/Grade)

Grades entsprechen Klassenstufen. \
Sie beinhalten eine Liste von [Klassen](https://github.com/Academi-fy/backend/wiki/Class), die zu der Klassenstufe gehören. 

### [Subject](https://github.com/Academi-fy/backend/wiki/Subject)

Subjects entsprechen Fächern. \
Sie beinhalten eine Liste von [Kursen](https://github.com/Academi-fy/backend/wiki/Course), die zu den Fächern gehören. 

### System Setup

#### [School](https://github.com/Academi-fy/backend/wiki/School)

TODO

#### [SetupAccount](https://github.com/Academi-fy/backend/wiki/)

TODO

****

### Clubs

#### [Club](https://github.com/Academi-fy/backend/wiki/Club)

Ein Club ist eine AG.\
Clubs können mit einem Chat verbunden werden. Dieser Chat ist dann nur für
die [Mitglieder](https://github.com/Academi-fy/backend/wiki/User) des Clubs sichtbar.
Ein Club kann mehrere [Mitglieder](https://github.com/Academi-fy/backend/wiki/User) haben.
Ein [Mitglied](https://github.com/Academi-fy/backend/wiki/User) kann in mehreren Clubs sein.
Ein Club kann mehrere [Events](https://github.com/Academi-fy/backend/wiki/Event) haben. \
Jeder Club hat einen oder mehrere [Leiter](https://github.com/Academi-fy/backend/wiki/User).

#### Club Setup
- [ClubDetails](https://github.com/Academi-fy/backend/wiki/ClubDetails)

ClubsDetails beschreiben einen Club genauer. Sie werden bei der Erstellung
des [Clubs](https://github.com/Academi-fy/backend/wiki/Club) angegeben und können später geändert werden.
Sie werden nicht explizit in MongoDB gespeichert, sondern nur in dem
jeweiligen [Club](https://github.com/Academi-fy/backend/wiki/Club). 

- [ClubRequirement](https://github.com/Academi-fy/backend/wiki/ClubRequirement)

ClubsRequirements beschreiben die "Voraussetzungen" (soft skills), die für den Club empfohlen werden. Sie werden bei der
Erstellung des [Clubs](https://github.com/Academi-fy/backend/wiki/Club) in
den [ClubDetails](https://github.com/Academi-fy/backend/wiki/ClubDetails) angegeben und können später geändert werden.\
Sie werden nicht explizit in MongoDB gespeichert, sondern nur in den
jeweiligen [ClubDetails](https://github.com/Academi-fy/backend/wiki/ClubDetails). \
ClubRequirements sind, genau wie [Clubs](https://github.com/Academi-fy/backend/wiki/Club)

****

### Events

#### [Event](https://github.com/Academi-fy/backend/wiki/Event)

Ein Event ist eine schulische Veranstaltung bzw. ein schulisches Ereignis, das mit der Schulgemeinschaft geteilt werden soll. \
Events können einer oder mehreren AGs zugeordnet werden. 

#### Event Setup
- [EventInformation](https://github.com/Academi-fy/backend/wiki/EventInformation)

TODO

- [EventTicket](https://github.com/Academi-fy/backend/wiki/EventTicket)

TODO

****

### Messages

#### [Chat](https://github.com/Academi-fy/backend/wiki/Chat)

Chats sind Unterhaltungen zwischen zwei oder mehreren [Usern](https://github.com/Academi-fy/backend/wiki/User). \
Chats können sowohl zwischen [Schülern](https://github.com/Academi-fy/backend/wiki/User), [Lehrern](https://github.com/Academi-fy/backend/wiki/User) (auch mehreren) stattfinden als auch [Kursen](https://github.com/Academi-fy/backend/wiki/Course) bzw. [AGs](https://github.com/Academi-fy/backend/wiki/Club) zugewiesen werden. 

#### [Message](https://github.com/Academi-fy/backend/wiki/Message)

Nachrichten sind die Grundlage für die Kommunikation zwischen [Benutzern](https://github.com/Academi-fy/backend/wiki/User). Sie können in [Chats](https://github.com/Academi-fy/backend/wiki/Chat) gesendet werden. \
Si können aus Text, Bild, Video, Datei oder Umfrage bestehen sowie aus einer Kombination aus allen. \
Nachrichten können auch [Reaktionen](https://github.com/Academi-fy/backend/wiki/MessageReaction), also Emojis, hinzugefügt werden. \
Außerdem kann auf eine andere Nachricht mit einer Nachricht geantwortet werden. 

#### [Poll](https://github.com/Academi-fy/backend/wiki/Poll)

Eine Poll ist eine Abstimmung in einem Chat. \
Sie wird als [MessageContent](https://github.com/Academi-fy/backend/wiki/MessageContent) in [Nachrichten](https://github.com/Academi-fy/backend/wiki/Message) versendet. 

#### [PollAnswer](https://github.com/Academi-fy/backend/wiki/PollAnswer)

Eine PollAnswer ist eine Antwort auf eine [Poll](https://github.com/Academi-fy/backend/wiki/Poll). \
Sie enthält den Text der Antwort mit einem Emoji und die Stimmen, die diese Antwort erhalten hat.

#### Message Setup
- [MessageContent](https://github.com/Academi-fy/backend/wiki/MessageContent)

Eine [Nachricht](https://github.com/Academi-fy/backend/wiki/Message) besteht auch aus dem MessageContent.
Dieser beinhaltet den eigentlichen Inhalt der Nachricht, wie z.B. den Text oder ein Bild.

- [MessageReaction](https://github.com/Academi-fy/backend/wiki/MessageReaction)

****

### Users

#### [User](https://github.com/Academi-fy/backend/wiki/User)

User sind die eigentlichen Akteure in der App. Sie sind Lehrer sowie Schüler als auch Admins. \
User können sich in der App über ihre [UserAccounts](https://github.com/Academi-fy/backend/wiki/UserAccounts) anmelden und haben dann Zugriff auf die ihnen zugewiesenen Bereiche. 

#### [UserAccount](https://github.com/Academi-fy/backend/wiki/UserAccount)

UserAccounts enthalten die Daten, die für die Authentifizierung eines Users benötigt werden. Sie werden beim Erstellen eines Users automatisch erstellt und können nicht manuell erstellt werden. \
Bei der ersten Anmeldung gibt der [User](https://github.com/Academi-fy/backend/wiki/User) seine Daten ein und diese werden dann in der Datenbank gespeichert. 

- [UserAccountPermissions](https://github.com/Academi-fy/backend/wiki/UserAccountPermissions)

TODO

- [UserAccountSettings](https://github.com/Academi-fy/backend/wiki/UserAccountSettings)

TODO

## WebSocket

- [EventHandling](https://github.com/Academi-fy/backend/wiki/EventHandling)
- [SocketEvents](https://github.com/Academi-fy/backend/wiki/SocketEvents)
- [MessageParsing](https://github.com/Academi-fy/backend/wiki/MessageParsing)
- [Socket](https://github.com/Academi-fy/backend/wiki/Socket)