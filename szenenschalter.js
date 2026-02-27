class SceneDimmerCard extends HTMLElement {
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error("entities ist erforderlich und muss ein Array sein.");
    }
    this._config = config;
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

// Metadata für Home Assistant Card-Picker (Custom Card)
window.customCards = window.customCards || [];
window.customCards.push({
  type: "scene-dimmer-card",
  name: "Szenenschalter",
  description: "Szenen-Schalter mit Dimmer-Slider für verknüpfte Leuchte"
});

