## Scene Dimmer Card „Szenenschalter“ für Home Assistant

Custom Lovelace‑Karte für Home Assistant, um **Szenen per Dropdown auszuwählen** und darunter einen **Dimmer‑Slider** für eine verknüpfte Leuchte zu haben (z. B. KNX‑Leuchte).

## Dateien in diesem Repository

- `szenenschalter.js` – Haupt‑JavaScript‑Datei für HACS (Dateiname = Reponame)
- `scene-dimmer-card.js` – gleicher Inhalt, falls du die Datei manuell einbinden möchtest
- `hacs.json` – Metadaten für HACS
- `README.md` – diese Anleitung

## Verwendung mit HACS

1. Repository `https://github.com/huedde/Szenenschalter` in HACS als **Benutzerdefiniertes Repository** mit Typ **Dashboard** hinzufügen.
2. Nach dem Reload taucht „Szenenschalter“ unter **HACS → Dashboard** auf.
3. Von dort aus kannst du das Plugin installieren/aktualisieren.

HACS nutzt die Datei `szenenschalter.js` im Root des Repos entsprechend der Angaben in `hacs.json`.

## Manuelle Installation in Home Assistant (ohne HACS)

1. Kopiere die Datei `scene-dimmer-card.js` (oder `szenenschalter.js`) in deinen Home‑Assistant‑`www`‑Ordner, z. B.:
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

