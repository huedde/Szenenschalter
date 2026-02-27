class SceneDimmerCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("scene-dimmer-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Szenenschalter",
      entities: [],
    };
  }

  setConfig(config) {
    this._config = config || {};
    if (!Array.isArray(this._config.entities)) {
      this._config.entities = [];
    }
    this._selectedIndex = 0;
    this.innerHTML = "";
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    this._render();
  }

  getCardSize() {
    return 2;
  }

  _render() {
    if (!this._hass || !this._config) return;

    const root = this;
    root.innerHTML = "";

    const card = document.createElement("ha-card");
    card.header = this._config.title || "Szenen";

    const container = document.createElement("div");
    container.style.padding = "16px";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "16px";

    const selectLabel = document.createElement("label");
    selectLabel.style.fontSize = "0.9rem";
    selectLabel.textContent = "Szene auswählen";

    const select = document.createElement("select");
    select.style.width = "100%";
    select.style.padding = "8px";
    select.style.borderRadius = "4px";
    select.style.border = "1px solid var(--divider-color)";
    select.style.background = "var(--primary-background-color)";
    select.style.color = "var(--primary-text-color)";

    this._config.entities.forEach((item, index) => {
      const opt = document.createElement("option");
      opt.value = String(index);
      opt.textContent = item.name || item.scene;
      if (index === this._selectedIndex) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      const index = parseInt(e.target.value, 10);
      this._selectedIndex = index;
      const cfg = this._config.entities[index];
      if (cfg && cfg.scene) {
        this._hass.callService("scene", "turn_on", {
          entity_id: cfg.scene,
        });
      }
      this._updateSliderValue(slider);
    });

    const sliderLabel = document.createElement("label");
    sliderLabel.style.fontSize = "0.9rem";
    sliderLabel.textContent = "Helligkeit";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "100";
    slider.step = "1";
    slider.style.width = "100%";

    this._updateSliderValue(slider);

    slider.addEventListener("input", (e) => {
      const value = parseInt(e.target.value, 10);
      const cfg = this._config.entities[this._selectedIndex];
      if (!cfg || !cfg.light) return;

      this._hass.callService("light", "turn_on", {
        entity_id: cfg.light,
        brightness_pct: value,
      });
    });

    container.appendChild(selectLabel);
    container.appendChild(select);
    container.appendChild(sliderLabel);
    container.appendChild(slider);
    card.appendChild(container);
    root.appendChild(card);
  }

  _updateSliderValue(slider) {
    const cfg = this._config.entities[this._selectedIndex];
    if (!cfg || !cfg.light || !this._hass) {
      slider.value = 0;
      return;
    }
    const stateObj = this._hass.states[cfg.light];
    if (!stateObj || stateObj.attributes.brightness === undefined) {
      slider.value = 0;
      return;
    }
    const pct = Math.round((stateObj.attributes.brightness / 255) * 100);
    slider.value = pct;
  }
}

customElements.define("scene-dimmer-card", SceneDimmerCard);

// Einfache Konfigurationsoberfläche für den visuellen Editor
class SceneDimmerCardEditor extends HTMLElement {
  setConfig(config) {
    const base = config || {};
    this._config = {
      ...base,
      entities: Array.isArray(base.entities)
        ? base.entities.map((e) => ({ ...e }))
        : [],
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this.isConnected) this._render();
  }

  _render() {
    this.innerHTML = "";

    const root = document.createElement("div");
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.gap = "12px";

    // Titel
    const titleRow = document.createElement("div");
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Kartentitel";
    titleLabel.style.display = "block";
    titleLabel.style.marginBottom = "4px";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = this._config.title || "";
    titleInput.style.width = "100%";
    titleInput.addEventListener("change", (e) => {
      const cfg = this._cloneConfig();
      cfg.title = e.target.value;
      this._config = cfg;
      this._fireConfigChanged();
    });
    titleRow.appendChild(titleLabel);
    titleRow.appendChild(titleInput);

    // Kurze Erklärung
    const info = document.createElement("p");
    info.textContent =
      "Füge unten Zeilen hinzu und wähle für jede Zeile eine Szene und eine Leuchte aus.";
    info.style.fontSize = "0.85rem";
    info.style.opacity = "0.8";

    // Tabellenkopf
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Name", "Szene (entity_id)", "Leuchte (entity_id)", ""].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      th.style.textAlign = "left";
      th.style.padding = "4px 8px";
      th.style.borderBottom = "1px solid var(--divider-color)";
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    // Alle Scene- und Light-Entities aus hass sammeln (für Dropdowns)
    const sceneOptions = this._hass
      ? Object.keys(this._hass.states).filter((id) => id.startsWith("scene."))
      : [];
    const lightOptions = this._hass
      ? Object.keys(this._hass.states).filter((id) => id.startsWith("light."))
      : [];

    this._config.entities.forEach((item, index) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = item.name || "";
      nameInput.style.width = "100%";
      nameInput.addEventListener("change", (e) => {
        const cfg = this._cloneConfig();
        cfg.entities[index].name = e.target.value;
        this._config = cfg;
        this._fireConfigChanged();
      });
      nameCell.style.padding = "4px 8px";
      nameCell.appendChild(nameInput);

      const sceneCell = document.createElement("td");
      const sceneSelect = document.createElement("select");
      sceneSelect.style.width = "100%";
      sceneSelect.style.padding = "4px 8px";
      sceneSelect.style.borderRadius = "4px";
      sceneSelect.style.border = "1px solid var(--divider-color)";

      const emptySceneOpt = document.createElement("option");
      emptySceneOpt.value = "";
      emptySceneOpt.textContent = "Szene auswählen...";
      sceneSelect.appendChild(emptySceneOpt);

      sceneOptions.forEach((id) => {
        const opt = document.createElement("option");
        opt.value = id;
        const friendly =
          this._hass.states[id].attributes.friendly_name || id;
        opt.textContent = friendly;
        if (item.scene === id) opt.selected = true;
        sceneSelect.appendChild(opt);
      });

      sceneSelect.addEventListener("change", (e) => {
        const value = e.target.value || "";
        const cfg = this._cloneConfig();
        cfg.entities[index].scene = value;
        if (!cfg.entities[index].name && value && this._hass) {
          const st = this._hass.states[value];
          if (st) {
            cfg.entities[index].name = st.attributes.friendly_name || value;
          }
        }
        this._config = cfg;
        this._fireConfigChanged();
      });

      sceneCell.style.padding = "4px 8px";
      sceneCell.appendChild(sceneSelect);

      const lightCell = document.createElement("td");
      const lightSelect = document.createElement("select");
      lightSelect.style.width = "100%";
      lightSelect.style.padding = "4px 8px";
      lightSelect.style.borderRadius = "4px";
      lightSelect.style.border = "1px solid var(--divider-color)";

      const emptyLightOpt = document.createElement("option");
      emptyLightOpt.value = "";
      emptyLightOpt.textContent = "Leuchte auswählen...";
      lightSelect.appendChild(emptyLightOpt);

      lightOptions.forEach((id) => {
        const opt = document.createElement("option");
        opt.value = id;
        const friendly =
          this._hass.states[id].attributes.friendly_name || id;
        opt.textContent = friendly;
        if (item.light === id) opt.selected = true;
        lightSelect.appendChild(opt);
      });

      lightSelect.addEventListener("change", (e) => {
        const value = e.target.value || "";
        const cfg = this._cloneConfig();
        cfg.entities[index].light = value;
        this._config = cfg;
        this._fireConfigChanged();
      });

      lightCell.style.padding = "4px 8px";
      lightCell.appendChild(lightSelect);

      const actionsCell = document.createElement("td");
      actionsCell.style.padding = "4px 8px";
      const deleteBtn = document.createElement("mwc-icon-button");
      deleteBtn.icon = "mdi:delete";
      deleteBtn.title = "Zeile löschen";
      deleteBtn.addEventListener("click", () => {
        const cfg = this._cloneConfig();
        cfg.entities.splice(index, 1);
        this._config = cfg;
        this._fireConfigChanged();
      });
      actionsCell.appendChild(deleteBtn);

      row.appendChild(nameCell);
      row.appendChild(sceneCell);
      row.appendChild(lightCell);
      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Button zum Hinzufügen (normales HTML-Button-Element, damit es in jedem Setup sicher sichtbar ist)
    const addBtn = document.createElement("button");
    addBtn.textContent = "Szene hinzufügen";
    addBtn.style.marginTop = "8px";
    addBtn.style.alignSelf = "flex-start";
    addBtn.style.padding = "6px 12px";
    addBtn.style.borderRadius = "4px";
    addBtn.style.border = "1px solid var(--primary-color)";
    addBtn.style.background = "var(--primary-color)";
    addBtn.style.color = "var(--text-primary-color, #fff)";
    addBtn.style.cursor = "pointer";
    addBtn.addEventListener("click", () => {
      const cfg = this._cloneConfig();
      cfg.entities.push({
        name: "",
        scene: "",
        light: "",
      });
      this._config = cfg;
      this._fireConfigChanged();
    });

    root.appendChild(titleRow);
    root.appendChild(info);
    root.appendChild(table);
    root.appendChild(addBtn);
    this.appendChild(root);
  }

  _cloneConfig() {
    const base = this._config || {};
    return {
      ...base,
      entities: Array.isArray(base.entities)
        ? base.entities.map((e) => ({ ...e }))
        : [],
    };
  }

  _fireConfigChanged() {
    const cfg = this._cloneConfig();
    const event = new CustomEvent("config-changed", {
      detail: { config: cfg },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define("scene-dimmer-card-editor", SceneDimmerCardEditor);

// Metadata für Home Assistant Card-Picker (Custom Card)
window.customCards = window.customCards || [];
window.customCards.push({
  type: "scene-dimmer-card",
  name: "Szenenschalter",
  description: "Szenen-Schalter mit Dimmer-Slider für verknüpfte Leuchte"
});

