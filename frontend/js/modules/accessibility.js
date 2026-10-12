// ============================================================================
// Module: Accessibility - UI Display, Contrast, Text Size & Motion Controls
// ============================================================================

const accessibility = {
  _state: { contrast: 'normal', fontScale: 1, reduceMotion: false },

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container);
  },
  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge" style="background:var(--primary);color:#fff">System</span>
    <h1 class="module-title">♿ Accessibility & Display Preferences</h1>
    <p class="module-big-idea">Customize visual display, contrast, animations, and typography for comfortable reading and presentation.</p>
  </div>

  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header">
      <h3 style="margin:0">👁️ Contrast & Themes</h3>
    </div>
    <div class="card-body" style="display:flex;flex-direction:column;gap:var(--space-3)">
      <div>
        <label for="contrastSelect" style="font-weight:600;display:block;margin-bottom:var(--space-1)">Display Contrast Mode:</label>
        <select id="contrastSelect" style="padding:var(--space-2);border:1px solid var(--border-light);border-radius:var(--radius-md);background:var(--bg-surface);color:var(--text-main);min-width:240px">
          <option value="normal">Standard Contrast (Default)</option>
          <option value="high">High Contrast (Maximum Legibility)</option>
        </select>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-top:var(--space-1)">Increases borders, text weights, and element distinctions to meet WCAG AAA standards.</p>
      </div>

      <div style="border-top:1px solid var(--border-light);padding-top:var(--space-3)">
        <label style="font-weight:600;display:block;margin-bottom:var(--space-1)">Color Theme Mode:</label>
        <div style="display:flex;gap:var(--space-2)">
          <button class="btn btn-secondary" id="themeLightBtn">☀️ Light Theme</button>
          <button class="btn btn-secondary" id="themeDarkBtn">🌙 Dark Theme</button>
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header">
      <h3 style="margin:0">🔍 Font Size & Scaling</h3>
    </div>
    <div class="card-body">
      <label for="fontScale" style="font-weight:600;display:block;margin-bottom:var(--space-1)">Base Text Scale:</label>
      <div style="display:flex;align-items:center;gap:var(--space-3)">
        <input id="fontScale" type="range" min="0.85" max="1.5" step="0.05" value="1" style="flex:1" />
        <span id="fontScaleValue" style="font-weight:700;min-width:60px;text-align:right">1.00×</span>
      </div>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2)">
        <button class="btn btn-secondary" id="resetFontBtn" style="font-size:0.85rem">Reset to Default (1.00×)</button>
      </div>
    </div>
  </div>

  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header">
      <h3 style="margin:0">🎬 Motion & Performance</h3>
    </div>
    <div class="card-body">
      <label style="display:flex;align-items:center;gap:var(--space-2);cursor:pointer">
        <input type="checkbox" id="reduceMotionCheck" style="width:18px;height:18px" />
        <span style="font-weight:600">Reduce Motion & Animations</span>
      </label>
      <p style="font-size:0.85rem;color:var(--text-muted);margin-top:var(--space-1)">Disables particle drops, auto-rotation in 3D scenes, and transition effects for users sensitive to motion.</p>
    </div>
  </div>

  <div class="callout callout-idea">
    <strong>Keyboard Navigation Shortcuts:</strong> Use <kbd>Tab</kbd> to cycle interactive inputs, <kbd>Enter</kbd> to activate buttons, and <kbd>Arrow Keys</kbd> to navigate range sliders.
  </div>
</div>`;
  },

  _initControls(container) {
    const contrastSelect = container.querySelector('#contrastSelect');
    const fontSlider = container.querySelector('#fontScale');
    const fontValue = container.querySelector('#fontScaleValue');
    const motionCheck = container.querySelector('#reduceMotionCheck');
    const resetFontBtn = container.querySelector('#resetFontBtn');

    const savedContrast = localStorage.getItem('phl_contrast') || 'normal';
    const savedScale = parseFloat(localStorage.getItem('phl_fontScale')) || 1.0;
    const savedMotion = localStorage.getItem('phl_reduce_motion') === 'true';

    contrastSelect.value = savedContrast;
    fontSlider.value = savedScale;
    fontValue.textContent = `${savedScale.toFixed(2)}×`;
    motionCheck.checked = savedMotion;

    const applyContrast = (mode) => {
      document.documentElement.setAttribute('data-contrast', mode);
      localStorage.setItem('phl_contrast', mode);
    };

    const applyScale = (scale) => {
      document.documentElement.style.fontSize = `${scale * 100}%`;
      fontValue.textContent = `${scale.toFixed(2)}×`;
      localStorage.setItem('phl_fontScale', scale);
    };

    const applyMotion = (reduce) => {
      document.documentElement.setAttribute('data-reduce-motion', reduce ? 'true' : 'false');
      localStorage.setItem('phl_reduce_motion', reduce ? 'true' : 'false');
    };

    contrastSelect.addEventListener('change', () => applyContrast(contrastSelect.value));
    fontSlider.addEventListener('input', () => applyScale(parseFloat(fontSlider.value)));
    resetFontBtn.addEventListener('click', () => {
      fontSlider.value = 1.0;
      applyScale(1.0);
    });

    motionCheck.addEventListener('change', () => applyMotion(motionCheck.checked));

    container.querySelector('#themeLightBtn').addEventListener('click', () => {
      if (window.phlApp) window.phlApp.applyTheme('light');
    });

    container.querySelector('#themeDarkBtn').addEventListener('click', () => {
      if (window.phlApp) window.phlApp.applyTheme('dark');
    });
  }
};

export default accessibility;
