# Scene Dimmer Card für Home Assistant

Custom Lovelace‑Karte für Home Assistant, um **Szenen per Dropdown auszuwählen** und darunter einen **Dimmer‑Slider** für eine verknüpfte Leuchte zu haben (z. B. KNX‑Leuchte).

## Dateien in diesem Repository

- `scene-dimmer-card.js` – die eigentliche Custom Card
- `README.md` – diese Anleitung

## Installation in Home Assistant

1. Kopiere die Datei `scene-dimmer-card.js` in deinen Home‑Assistant‑`www`‑Ordner, z. B.:
   - `/config/www/scene-dimmer-card.js`
2. In Home Assistant:
   - Einstellungen → Dashboards → oben rechts „Drei Punkte“ → **Ressourcen**
   - **Ressource hinzufügen**
     - URL: `/local/scene-dimmer-card.js`
     - Typ: `JavaScript Module`
3. Home Assistant neu laden (oder Browser‑Cache leeren).

## Karte im Dashboard verwenden

Beispiel‑Konfiguration im YAML‑Editor:

```yaml
type: custom:scene-dimmer-card
title: 441 EG BU.08
entities:
  - name: Szene Buffet
    scene: scene.441_eg_bu_08_szene_buffet
    light: light.441_eg_bu_08_wand
  - name: Szene Bunt
    scene: scene.441_eg_bu_08_szene_bunt
    light: light.441_eg_bu_08_wand
  - name: Szene Kaltweiss
    scene: scene.441_eg_bu_08_szene_kaltweiss
    light: light.441_eg_bu_08_wand
  - name: Szene Warmweiss
    scene: scene.441_eg_bu_08_szene_warmweiss
    light: light.441_eg_bu_08_wand
  - name: Szene aus
    scene: scene.441_eg_bu_08_szene_aus
    light: light.441_eg_bu_08_wand
```

- **`scene`**: Home‑Assistant‑Szenen‑Entität.
- **`light`**: zugehörige Leuchten‑Entität, deren Helligkeit der Slider steuert.

## GitHub: Repository initialisieren und pushen

Im PowerShell‑Terminal in diesem Ordner (`Szenenschalter`):

```powershell
cd "c:\Users\h.oezel\OneDrive - RTO GmbH\Desktop\Szenenschalter"

git init
git add .
git commit -m "Add scene dimmer custom card"

# Falls du 'main' als Standard‑Branch möchtest
git branch -M main

# <USER> und <REPO> unten anpassen
git remote add origin "https://github.com/<USER>/<REPO>.git"
git push -u origin main
```

Danach ist das Projekt auf GitHub verfügbar und kann von dort aus verwendet oder erweitert werden.

