# Remembrance – Mobile App

Diese Mobile App wurde im Rahmen des Moduls **M335** entwickelt.  
Remembrance ist eine Mobile App zum Erstellen, Speichern und Verwalten persönlicher Geschichten mit Bildern.
Die Anwendung wurde mit **React Native (Expo)** umgesetzt und verwendet **Supabase** für Authentifizierung, Datenbank und Storage.

---

Die Anwendung ermöglicht es Benutzern:
- eigene Stories mit Foto zu erstellen
- Stories zu bearbeiten und zu löschen
- Inhalte übersichtlich in einer Grid-Ansicht darzustellen

---

## Technologie-Stack

- React Native (Expo)
- Expo Router
- Supabase (Auth, PostgreSQL, Storage)
- TypeScript
- Jest (Unit Tests)

---

## Voraussetzungen

Folgende Tools müssen installiert sein:

- Node.js (empfohlen: LTS)
- npm
- Expo CLI
- Expo Go App (für Tests auf einem Smartphone)

---

## Projekt installieren

```bash
npm install
npx expo start
```

## Projektstruktur (Kurzüberblick)

```text
app/
├─ index.tsx            # Login Screen
├─ _layout.tsx          # App Layout / Routing
└─ stories/
   ├─ index.tsx         # Stories List (Grid)
   ├─ add.tsx           # Add Story Screen
   ├─ [id].tsx          # Story Detail Screen
   └─ edit/
      └─ [id].tsx       # Edit Story Screen
```

## Ziel der App

- Ziel dieser App ist es, eine vollständige Mobile Anwendung zu entwickeln,
die zentrale CRUD-Funktionalitäten, Kamera-Zugriff und Navigation vereint.

- Die App kann auch als einfache Übungsanwendung zum Lesen und Schreiben von Texten
(zum Beispiel zur Verbesserung der Englischkenntnisse) verwendet werden,
da Stories frei formuliert und gespeichert werden können.




# Aufgaben 2 und 3 wurden schon abgegeben.


# Aufgabe 3: Mobile App – Mobile App programmieren
## Aufgabe 3a: Funktionalität und Mockups wie geplant umgesetzt

Die Mobile App wurde mit **React Native (Expo)** umgesetzt und auf **GitHub** verwaltet.  
Die zuvor erstellten Mockups dienten als Konzept- und Ideenbasis. Das finale Design ist nicht pixelgenau identisch mit den Mockups, die **Funktionalität entspricht jedoch vollständig den geplanten Zielen**.

---

## Umgesetzte Ziele

### 1. Authentifizierung
- Benutzer können sich registrieren (Sign up).
- Benutzer können sich einloggen (Sign in).
- Nach erfolgreichem Login erfolgt die Weiterleitung zur Stories-Übersicht.

### 2. Stories List Screen (Übersicht)
- Stories werden aus der Supabase-Datenbank geladen.
- Darstellung als Grid mit zwei Spalten.
- Jede Story zeigt ein Bild und einen Titel.
- Antippen einer Story öffnet den Detail-Screen.

### 3. Empty State
- Falls noch keine Stories vorhanden sind, wird ein Hinweis angezeigt:  
  **"You have no stories yet. Tap + to create one."**

### 4. Add Story Screen
- Neue Stories können erstellt werden.
- Titel ist ein Pflichtfeld.
- Text ist optional.
- Optionale Detailfelder: Color, Size, Location.
- Ein Foto ist erforderlich, um eine Story zu speichern.
- Story wird korrekt in der Datenbank gespeichert.

### 5. Fotoaufnahme und Upload
- Foto wird über die Gerätekamera aufgenommen.
- Das Bild wird in Supabase Storage hochgeladen.
- Nach dem Upload erscheint das Bild sofort in der Stories-Liste.

### 6. Story Detail Screen
- Anzeige einer einzelnen Story.
- Bild, Titel, Text und optionale Details werden dargestellt.

### 7. Story bearbeiten (Edit Screen)
- Vorhandene Daten werden geladen.
- Felder können bearbeitet werden.
- Neues Foto kann aufgenommen werden und ersetzt das alte Bild.
- Änderungen können gespeichert werden (Save-Button funktioniert).

### 8. Story löschen
- Story kann gelöscht werden.
- Das zugehörige Bild wird ebenfalls aus dem Storage entfernt.
- Eine Sicherheitsabfrage (Bestätigungsdialog) ist implementiert.

### 9. Navigation
- Navigation zwischen Login, Stories List, Add Story, Detail und Edit funktioniert korrekt.
- Home-, Back-, Save- und Logout-Buttons sind vorhanden und funktionsfähig.

### 10. Abgleich mit Mockups
- Die ursprünglich erstellten Mockups wurden als Ideen- und Planungsgrundlage verwendet.
- Das finale Design ist visuell leicht angepasst.
- Die geplante Funktionalität wurde vollständig umgesetzt.

---

## Ergebnis

Alle geplanten Funktionen aus **Aufgabe 3a** wurden erfolgreich umgesetzt.  
Die definierten Ziele wurden erreicht.

## Aufgabe 3b: Mobile App – Sensoren wie geplant umgesetzt

### Verwendete Sensoren

- Kamera

### Umsetzung der Sensoren

Die App nutzt die Kamera des Geräts zur Aufnahme von Bildern für Stories.  
Die Kamera-Funktion wurde wie geplant implementiert und produktiv eingesetzt.

### Einsatz der Kamera

#### Add Story Screen

- Beim Erstellen einer neuen Story ist die Aufnahme eines Fotos **zwingend erforderlich**.
- Ohne Foto kann die Story nicht gespeichert werden.
- Die Kamera wird über **Expo ImagePicker** angesprochen.
- Nach der Aufnahme wird das Bild in **Supabase Storage** hochgeladen.
- Erst nach erfolgreichem Upload wird der Datenbankeintrag gespeichert.

#### Edit Story Screen

- Beim Bearbeiten einer Story kann optional ein neues Foto aufgenommen werden.
- Das neue Foto ersetzt das bestehende Bild.
- Das aktualisierte Bild wird erneut in **Supabase Storage** gespeichert.

### Berechtigungen

- Die App fordert beim ersten Zugriff die Berechtigung zur Nutzung der Kamera an.
- Nach erteilter Zustimmung wird die Berechtigung vom Betriebssystem gespeichert.
- Bei weiteren Nutzungen wird keine erneute Abfrage angezeigt.


### Ergebnis

- Der geplante Sensor (Kamera) wurde vollständig umgesetzt.
- Die Funktionalität entspricht der ursprünglichen Planung.
- Die Mockups dienten als Konzeptgrundlage und wurden funktional eingehalten.


## Aufgabe 4: Mobile App – Mobile App publizieren

### Aufgabe 4a – Schritte zur Publikation der App

Die Mobile App wurde mit **React Native (Expo)** entwickelt und anschliessend mit **Expo Application Services (EAS)** für Android paketiert.

Durchgeführte Schritte:

- Installation von **Expo CLI** und **EAS CLI**
- Anmeldung bei **expo.dev** mit einem persönlichen Account
- Konfiguration des Projekts für Android Builds
- Start des Build-Prozesses über `eas build`
- Auswahl der Plattform **Android**
- Automatische Erstellung einer signierten **APK-Datei** durch EAS

Nach Abschluss des Build-Prozesses wurde eine installierbare APK-Datei bereitgestellt.

---

### Aufgabe 4b – Fertig paketierte App (APK)

Das Resultat ist eine vollständig paketierte **Android-APK**, welche zur Installation auf einem Android-Gerät geeignet ist.

- Die APK wurde über **EAS Build** erstellt
- Die App wurde auf einem echten Android-Gerät installiert und getestet
- Start, Navigation und Kernfunktionen funktionieren wie erwartet

Da mein eigenes Smartphone ein iPhone ist, erfolgte der Android-Test auf dem Gerät einer Drittperson.

---

### Rückmeldungen aus dem Praxistest

Beim Test auf dem Android-Gerät wurden folgende Rückmeldungen festgehalten:

- Die App lässt sich starten und bedienen
- Die Kernfunktionen (Login, Stories anzeigen, hinzufügen, bearbeiten, löschen) funktionieren stabil
- Auf Android wird die System-Navigationsleiste teilweise über Buttons angezeigt
  - Dieses Verhalten war in Expo Go nicht sichtbar
  - Eine mögliche Verbesserung wäre, die Buttons weiter nach oben zu platzieren

---

### Architektur-Feedback und Alternativen

Es wurde folgender Verbesserungsvorschlag diskutiert:

- Bilder hätten alternativ über eine relationale Struktur in **PostgreSQL** referenziert werden können
- Ebenso wäre ein zentrales **DELETE** denkbar gewesen, das automatisch alle abhängigen Daten entfernt

Ich habe mich bewusst für **Supabase Storage** entschieden, da ich damit bereits Erfahrung hatte und das Storage-System gut kenne.  
Für dieses Projekt war diese Lösung stabil, übersichtlich und ausreichend.

---

**Ergebnis:**  
Die App wurde erfolgreich paketiert, getestet und ist als Android-APK bereit zur Publikation.  
Aufgabe **4a** und **4b** wurden erfüllt.

---

## Aufgabe 5: Mobile App gemäss Testplan überprüfen

### a) Funktionale Tests

Die Mobile App wurde anhand eines definierten manuellen Testplans überprüft.  
Alle zentralen Funktionen (Authentifizierung, Stories List, Add Story, Edit Story, Delete Story, Navigation) wurden manuell getestet.

Die Tests wurden sowohl lokal (Expo Go) als auch auf einem echten Android-Gerät (APK via EAS Build) durchgeführt.  
Alle erforderlichen Korrekturen aus den Tests wurden umgesetzt.

Eine detaillierte Dokumentation der Testfälle, Schritte, erwarteten Ergebnisse und Resultate befindet sich in der Datei:

➡ **testing.md**

### b) Testergebnisse

- Alle definierten Testfälle wurden erfolgreich durchgeführt.
- Funktionale Anforderungen sind erfüllt.
- Kritische Fehler sind nicht vorhanden.
- Bekannte kleinere UI-Abweichungen (Android System-Navigation) wurden dokumentiert.

**Ergebnis:**  
Die App entspricht dem Testplan und ist funktional korrekt.


