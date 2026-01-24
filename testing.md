# Manuelle Tests

## 0. Bekannte Probleme (noch nicht gelöst)

✔ Keyboard überdeckt Textfelder auf Add Story Screen
✔ Cancel und Save Buttons sind nicht sichtbar, wenn viele optionale Felder aktiv sind
✔ Allgemeine Styling Verbesserungen nötig

---

## 1. Registrierung (Sign up)

**Test:** Benutzer registrieren  
**Schritte:**
1. App öffnen
2. Nickname eingeben
3. Passwort eingeben
4. Sign up drücken  
   **Erwartet:** Benutzer wird erstellt und Stories List wird geöffnet.  
   **Result:** PASS   
   **Notiz:**

---

## 2. Anmeldung (Sign in)

**Test:** Benutzer anmelden  
**Schritte:**
1. App öffnen
2. Nickname eingeben
3. Passwort eingeben
4. Sign in drücken  
   **Erwartet:** Login erfolgreich, Stories List sichtbar.  
   **Result:** PASS   
   **Notiz:**

---

## 3. Abmelden (Logout - geplant)

**Test:** Benutzer abmelden  
**Schritte:**
1. Eingeloggt sein
2. Logout Button drücken  
   **Erwartet:** App geht zurück zum Login Screen.  
   **Result:** PASS  
   **Notiz:** ✔ Noch nicht implementiert.

---

## 4. Stories List

**Test:** Stories List anzeigen  
**Schritte:**
1. Einloggen
2. Stories List ansehen  
   **Erwartet:** Grid mit Bildern und Titel wird angezeigt.  
   **Result:** PASS   
   **Notiz:**

---

## 5. Home Button (im Layout,um einfacher zu testen , Nachher wird es entfernt)

**Test:** Home Button Navigation  
**Schritte:**
1. Auf einer anderen Seite sein
2. Home Button drücken  
   **Erwartet:** Navigation zu Stories List.  
   **Result:** PASS   
   **Notiz:** ✔ Button ist nur für Test, wird später entfernt.

---

## 6. +NEW Button

**Test:** Add Story Screen öffnen  
**Schritte:**
1. Stories List öffnen
2. +NEW Button drücken  
   **Erwartet:** Add Story Screen wird geöffnet.  
   **Result:** PASS   
   **Notiz:**

---

## 7. Add Story

**Test:** Neue Story speichern  
**Schritte:**
1. Foto aufnehmen
2. Title eingeben
3. Save drücken  
   **Erwartet:** Story wird gespeichert und erscheint in Stories List mit Bild.  
   **Result:** PASS   
   **Notiz:**

---

### 7.1 Cancel Button

**Test:** Add Story abbrechen  
**Schritte:**
1. Add Story Screen öffnen
2. Cancel drücken  
   **Erwartet:** Zurück zur Stories List, keine Story gespeichert.  
   **Result:** PASS   
   **Notiz:**

---

## 8. Optionale Felder

**Test:** Optionale Felder ein- und ausblenden  
**Schritte:**
1. +Color drücken
2. - drücken
3. Gleich für Size und Location  
   **Erwartet:** Felder erscheinen und verschwinden korrekt.  
   **Result:** PASS   
   **Notiz:** ✔ Layout Probleme mit Keyboard beachten.

---

## 9. Story Detail

**Test:** Story Detail öffnen  
**Schritte:**
1. Story in der Stories List antippen  
   **Erwartet:** Detail Seite wird geöffnet.  
   **Result:** PASS   
   **Notiz:** 

---

## 10. Story löschen (Delete)

**Test:** Story löschen  
**Schritte:**
1. Story Detail öffnen
2. Delete Button drücken  
   **Erwartet:** Story wird gelöscht und ist nicht mehr in der Liste.  
   **Result:** PASS  
   **Notiz:** 

---

## 11. Story bearbeiten (Edit)

**Test:** Story bearbeiten  
**Schritte:**
1. Story Detail öffnen
2. Edit Button drücken
3. Title oder Text ändern + auch Bild ändern
4. Save drücken  
   **Erwartet:** Änderungen werden gespeichert und angezeigt.  
   **Result:** PASS  
   **Notiz:** ✔ Keyboard steht über dem Story-input
