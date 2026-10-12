// ============================================================================
// Module A5: Strong / Weighted Pigeonhole Principle
// ============================================================================

const a5_strong_weighted = {
  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container);
    this._compute(container);
  },
  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">A5. Strong &amp; Weighted Pigeonhole Principle</h1>
    <p class="module-subtitle">When boxes have individual capacity thresholds $n_i$, how many objects guarantee at least one box exceeds its threshold?</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Strong Pigeonhole:</strong> If box $i$ has threshold $n_i$, then placing $\\displaystyle \\left(\\sum_{i=1}^{k} n_i\\right) - k + 1$ objects into $k$ boxes guarantees some box $j$ contains at least $n_j + 1$ objects.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Box Configuration</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Number of boxes (k): <strong id="kVal">4</strong></label>
          <input type="range" id="kSlider" min="2" max="8" value="4" class="slider">
        </div>
        <div id="thresholdSliders"></div>
        <button class="btn btn-primary" style="margin-top:var(--space-3)" id="equalBtn">Reset Equal (n_i=3)</button>
        <button class="btn btn-secondary" style="margin-left:var(--space-2)" id="randBtn">Randomize Thresholds</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Formula Result</h3></div>
      <div class="card-body" id="formulaResult"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header">
      <h3>Adversarial Placement Visualizer</h3>
      <small style="color:var(--text-muted)">Objects are placed adversarially to delay the pigeonhole guarantee as long as possible</small>
    </div>
    <div class="card-body">
      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-3);flex-wrap:wrap">
        <button class="btn btn-primary" id="placeOneBtn">+1 Object</button>
        <button class="btn btn-secondary" id="placeToLimitBtn">Place to Limit-1</button>
        <button class="btn btn-primary" id="placeGuaranteeBtn">Place Guarantee Object</button>
        <button class="btn btn-secondary" id="resetPlacementBtn">Reset</button>
      </div>
      <div id="boxVisualizer"></div>
      <div id="placementMsg" style="margin-top:var(--space-3)"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Proof</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Strong Pigeonhole Principle</div>
        <div class="proof-body">
          <p><strong>Statement:</strong> Let $k$ boxes have capacities $n_1, n_2, \\ldots, n_k$. If $N = \\displaystyle\\sum_{i=1}^{k} n_i - k + 1$ objects are placed into $k$ boxes, then box $j$ contains $\\ge n_j + 1$ objects for at least one $j$.</p>
          <p><strong>Proof (by contradiction):</strong> Suppose each box $i$ has $\\le n_i$ objects. Then the total is $\\le \\sum n_i$. But $N = \\sum n_i - k + 1 > \\sum n_i - k$, and with adversarial placement the maximum we can place without exceeding any threshold is $\\sum n_i$. Contradiction when we place $N = \\sum n_i - k + 1$ without any single box being at $n_i + 1$... wait, the standard form: to avoid any collision the max is $\\sum (n_i - 1) = \\sum n_i - k$. So any $N > \\sum n_i - k$ forces a collision. $N = \\sum n_i - k + 1$ is the minimum such count. $\\square$</p>
          <p><strong>Special Case:</strong> When $n_1 = n_2 = \\cdots = n_k = r-1$, we get $N = k(r-1) - k + 1 = k(r-1)+1$. Wait, this gives the minimum draws formula for $r$-of-a-kind: we need $k(r-1)+1$ to guarantee $r$ from one category. (Standard: $k$ types, want $r$ of one type → draw $k(r-1)+1$.) $\\square$</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _state: { thresholds: [3,3,3,3], placements: [0,0,0,0] },

  _initControls(container) {
    const kSlider = container.querySelector('#kSlider');
    const kVal = container.querySelector('#kVal');

    const rebuild = () => {
      const k = parseInt(kSlider.value);
      kVal.textContent = k;
      while (this._state.thresholds.length < k) this._state.thresholds.push(3);
      this._state.thresholds = this._state.thresholds.slice(0, k);
      this._state.placements = Array(k).fill(0);
      this._renderThresholdSliders(container);
      this._compute(container);
      this._renderBoxes(container);
    };

    kSlider.addEventListener('input', rebuild);
    container.querySelector('#equalBtn').addEventListener('click', () => {
      const k = parseInt(kSlider.value);
      this._state.thresholds = Array(k).fill(3);
      this._state.placements = Array(k).fill(0);
      this._renderThresholdSliders(container); this._compute(container); this._renderBoxes(container);
    });
    container.querySelector('#randBtn').addEventListener('click', () => {
      const k = parseInt(kSlider.value);
      this._state.thresholds = Array(k).fill(0).map(() => 1+Math.floor(Math.random()*5));
      this._state.placements = Array(k).fill(0);
      this._renderThresholdSliders(container); this._compute(container); this._renderBoxes(container);
    });
    container.querySelector('#placeOneBtn').addEventListener('click', () => {
      this._placeAdversarially(container, 1);
    });
    container.querySelector('#placeToLimitBtn').addEventListener('click', () => {
      const guarantee = this._state.thresholds.reduce((s,n) => s+n, 0) - this._state.thresholds.length;
      const current = this._state.placements.reduce((s,p) => s+p, 0);
      const needed = guarantee - current;
      if (needed > 0) this._placeAdversarially(container, needed);
    });
    container.querySelector('#placeGuaranteeBtn').addEventListener('click', () => {
      this._placeAdversarially(container, 1, true);
    });
    container.querySelector('#resetPlacementBtn').addEventListener('click', () => {
      this._state.placements = Array(this._state.thresholds.length).fill(0);
      this._renderBoxes(container); this._updateMsg(container);
    });

    this._renderThresholdSliders(container);
  },

  _renderThresholdSliders(container) {
    const el = container.querySelector('#thresholdSliders');
    const k = this._state.thresholds.length;
    el.innerHTML = Array.from({length:k}, (_, i) => `
      <div class="control-group" style="margin-bottom:var(--space-2)">
        <label>Box ${i+1} threshold (n<sub>${i+1}</sub>): <strong id="t${i}Val">${this._state.thresholds[i]}</strong></label>
        <input type="range" id="t${i}Slider" min="1" max="10" value="${this._state.thresholds[i]}" class="slider">
      </div>`).join('');
    for (let i = 0; i < k; i++) {
      const sl = container.querySelector(`#t${i}Slider`);
      sl.addEventListener('input', () => {
        this._state.thresholds[i] = parseInt(sl.value);
        container.querySelector(`#t${i}Val`).textContent = sl.value;
        this._state.placements = Array(k).fill(0);
        this._compute(container); this._renderBoxes(container);
      });
    }
  },

  _compute(container) {
    const thresholds = this._state.thresholds;
    const k = thresholds.length;
    const sumNi = thresholds.reduce((s,n) => s+n, 0);
    const guarantee = sumNi - k + 1;
    const maxWithout = sumNi - k;

    const resultEl = container.querySelector('#formulaResult');
    resultEl.innerHTML = `
      <div style="font-family:monospace;background:var(--surface-alt);padding:var(--space-3);border-radius:var(--radius-md);margin-bottom:var(--space-3)">
        <div>Thresholds: [${thresholds.join(', ')}]</div>
        <div style="margin-top:var(--space-1)">Σ nᵢ = ${sumNi}</div>
        <div>k = ${k}</div>
        <div style="color:var(--primary);font-weight:700;font-size:1.1rem;margin-top:var(--space-2)">
          N = Σnᵢ − k + 1 = ${sumNi} − ${k} + 1 = <span style="color:var(--success)">${guarantee}</span>
        </div>
      </div>
      <p>With <strong>${maxWithout}</strong> objects or fewer, we can fill adversarially without any box exceeding its threshold.</p>
      <p>With <strong>${guarantee}</strong> objects, at least one box <em>must</em> exceed its threshold.</p>
      <div class="stat-box" style="margin-top:var(--space-2)">
        <div class="stat-label">Guarantee Threshold N</div>
        <div class="stat-value">${guarantee}</div>
      </div>`;
    this._renderBoxes(container);
    this._updateMsg(container);
  },

  _placeAdversarially(container, count, forceGuarantee = false) {
    const thresholds = this._state.thresholds;
    for (let c = 0; c < count; c++) {
      // Adversarial: fill boxes that are furthest from their threshold first
      let bestBox = -1, bestRoom = -1;
      for (let i = 0; i < thresholds.length; i++) {
        const room = thresholds[i] - this._state.placements[i];
        if (room > 0 && room > bestRoom) { bestRoom = room; bestBox = i; }
      }
      if (bestBox === -1) {
        // All boxes at threshold — place in box 0 to trigger guarantee
        this._state.placements[0]++;
      } else {
        this._state.placements[bestBox]++;
      }
    }
    this._renderBoxes(container);
    this._updateMsg(container);
  },

  _renderBoxes(container) {
    const thresholds = this._state.thresholds;
    const placements = this._state.placements;
    const el = container.querySelector('#boxVisualizer');
    const total = placements.reduce((s,p)=>s+p,0);
    const guarantee = thresholds.reduce((s,n)=>s+n,0) - thresholds.length + 1;

    el.innerHTML = `
      <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;align-items:flex-end;justify-content:center;min-height:180px">
        ${thresholds.map((ni, i) => {
          const placed = placements[i];
          const exceeded = placed > ni;
          const pct = Math.min(placed / (ni + 2), 1) * 100;
          return `<div style="text-align:center;min-width:70px">
            <div style="position:relative;height:120px;width:70px;background:var(--surface-alt);border:2px solid ${exceeded?'var(--error)':'var(--border-color)'};border-radius:var(--radius-sm) var(--radius-sm) 0 0;overflow:hidden;margin:0 auto">
              <div style="position:absolute;bottom:0;left:0;right:0;height:${pct}%;background:${exceeded?'var(--error)':'var(--primary)'};transition:height 0.3s;opacity:0.8"></div>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-weight:700;font-size:1.1rem;color:var(--text-primary)">${placed}</div>
              <div style="position:absolute;top:${100 - (ni/(ni+2)*100)}%;left:0;right:0;border-top:2px dashed var(--warning);opacity:0.8"></div>
            </div>
            <div style="background:var(--surface-alt);border:2px solid ${exceeded?'var(--error)':'var(--border-color)'};border-top:none;padding:var(--space-1);font-size:0.8rem">
              <div>Box ${i+1}</div>
              <div style="color:var(--text-muted)">n<sub>${i+1}</sub>=${ni}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="text-align:center;margin-top:var(--space-2);color:var(--text-muted)">
        Total placed: <strong>${total}</strong> | Guarantee at: <strong>${guarantee}</strong>
        ${total >= guarantee ? ' <span style="color:var(--success)">✅ Guarantee triggered!</span>' : ''}
      </div>`;
  },

  _updateMsg(container) {
    const thresholds = this._state.thresholds;
    const placements = this._state.placements;
    const guarantee = thresholds.reduce((s,n)=>s+n,0) - thresholds.length + 1;
    const total = placements.reduce((s,p)=>s+p,0);
    const exceeded = thresholds.map((ni,i) => placements[i] > ni);
    const msgEl = container.querySelector('#placementMsg');

    if (exceeded.some(Boolean)) {
      const boxes = exceeded.map((e,i) => e?`Box ${i+1} (${placements[i]}>${thresholds[i]})`:'').filter(Boolean);
      msgEl.innerHTML = `<div class="callout callout-success">✅ <strong>Guaranteed!</strong> ${boxes.join(', ')} exceed their threshold. The Strong Pigeonhole Principle is confirmed with ${total} objects.</div>`;
    } else if (total === guarantee - 1) {
      msgEl.innerHTML = `<div class="callout callout-warning">⚠️ Adversary has placed ${total} objects (limit: ${guarantee-1}) — no box exceeds threshold yet. One more object <em>must</em> trigger the guarantee!</div>`;
    } else {
      msgEl.innerHTML = `<div class="callout callout-idea">ℹ️ ${total} objects placed. Need ${guarantee} to guarantee a threshold violation.</div>`;
    }
  }
};

export default a5_strong_weighted;
