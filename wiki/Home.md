# Academi-fy

Academi-fy ist ein umfassendes Schulverwaltungssystem, das mit JavaScript und MongoDB erstellt wurde. Es bietet eine robuste und skalierbare Lösung für die Verwaltung von Kursen, Klassen und Benutzern innerhalb einer Bildungseinrichtung.

## Funktionen

- **Kursverwaltung**: Definieren und verwalten Sie Kurse mit zugehörigen Mitgliedern, Klassen, Lehrern, Chats und Fächern.
- **Klassenverwaltung**: Verwalten Sie tatsächliche Schulstunden, einschließlich einer Liste von Schülern, Lehrern und zugehörigen Kursen.
- **Benutzerverwaltung**: Verwalten Sie Benutzer innerhalb des Systems, einschließlich sowohl Schüler als auch Lehrer.
- **Cache-System**: Verbessern Sie die Leistung und reduzieren Sie die Datenbanklast mit einem Caching-System, das alle 5 Minuten aktualisiert wird.
- **Robuste Fehlerbehandlung**: Enthält benutzerdefinierte Fehlerklassen zur Behandlung von Abruf-, Datenbank- und Cache-Fehlern.

## Technologie-Stack

- **Sprache**: JavaScript
- **Datenbank**: MongoDB
- **ORM**: Mongoose
- **Cache**: Node-Cache

## Projektstruktur

Das Projekt ist in mehrere Verzeichnisse unterteilt:

- `mongoDb/schemas/general`: Enthält die MongoDB-Schemas für die verschiedenen Entitäten im System.
- `httpServer/models/general`: Enthält die Modelle für die verschiedenen Entitäten, einschließlich Methoden für CRUD-Operationen und Cache-Management.
- `wiki/models/general`: Enthält Markdown-Dateien mit detaillierten Beschreibungen der verschiedenen Entitäten.

## Einrichtung

Um das Projekt einzurichten, müssen Sie Node.js und MongoDB auf Ihrem Computer installiert haben. Befolgen Sie dann diese Schritte:

1. Klonen Sie das Repository.
2. Navigieren Sie zum Projektverzeichnis.
3. Führen Sie `npm install` aus, um die Abhängigkeiten zu installieren.
4. Starten Sie den MongoDB-Server.
5. Führen Sie `npm start` aus, um die Anwendung zu starten.

## Verwendung

Die Anwendung bietet eine Reihe von HTTP-Endpunkten zur Interaktion mit dem System. Zum Beispiel:

- `GET /api/classes`: Abrufen aller Klassen.
- `GET /api/classes/:id`: Abrufen einer Klasse anhand ihrer ID.
- `PUT /api/classes/<class>`: Erstellen oder Aktualisieren einer Klasse.
- `DELETE /api/classes/:id`: Löschen einer Klasse.

Weitere Details zu den verfügbaren Endpunkten und ihrer Verwendung finden Sie in den einzelnen Markdown-Dateien im Verzeichnis `wiki/models/general`.

## Mitwirken

Beiträge sind willkommen! Bitte lesen Sie die Richtlinien zur Mitwirkung, bevor Sie Änderungen vornehmen.

## Lizenz

Dieses Projekt steht unter den Bedingungen der MIT-Lizenz.

<sub>© Copyright: Daniel Dopatka, Linus Bung (2023)</sub>