// ============================================================================
// Module A5: Infinite Pigeonhole Principle
// ============================================================================

const a7_infinite = {
  _animFrame: null,
  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container);
    this._render(container, 'modulo', 4);
  },
  unmount() {
    if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier3">Tier 3</span>
    <h1 class="module-title">A5. Infinite Pigeonhole Principle</h1>
    <p class="module-subtitle">If infinitely many objects are placed into finitely many boxes, at least one box must contain infinitely many objects.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Infinite Version:</strong> Let $f : \\mathbb{N} \\to \\{1, 2, \\ldots, k\\}$ be any function from the natural numbers to $k$ colors. Then at least one color class $f^{-1}(c)$ is infinite.
    <br><em>Proof:</em> If all $k$ color classes were finite, their union $\\mathbb{N}$ would be finite — contradiction.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Coloring Function</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Coloring type:</label>
          <select id="coloringType" class="form-select">
            <option value="modulo">Modulo k (residues)</option>
            <option value="parity">Parity (even/odd)</option>
            <option value="digit_sum">Digit sum mod k</option>
            <option value="prime">Prime vs Composite</option>
          </select>
        </div>
        <div class="control-group" id="kGroup">
          <label>Number of boxes (k): <strong id="kVal">4</strong></label>
          <input type="range" id="kSlider" min="2" max="6" value="4" class="slider">
        </div>
        <div class="control-group">
          <label>Show first N integers: <strong id="nVal">60</strong></label>
          <input type="range" id="nSlider" min="20" max="200" value="60" class="slider">
        </div>
        <button class="btn btn-primary" id="refreshBtn">🔄 Refresh Visualization</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Infinite Class Sizes</h3></div>
      <div class="card-body" id="classSummary"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Color Classes of ℕ (first N integers)</h3>
      <small style="color:var(--text-muted)">Each color = one "box". The natural numbers fill all boxes infinitely.</small>
    </div>
    <div class="card-body" style="padding:var(--space-3)">
      <div id="infiniteGrid" style="display:flex;flex-wrap:wrap;gap:4px;max-height:300px;overflow-y:auto;padding:var(--space-1)"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Class Size Growth Trend</h3>
      <small style="color:var(--text-muted)">All classes grow without bound — confirming the infinite version</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="growthChart" style="width:100%;height:200px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Formal Statement &amp; Applications</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Infinite Pigeonhole Principle</div>
        <div class="proof-body">
          <p><strong>Theorem:</strong> If a countably infinite set $S$ is partitioned into finitely many subsets $S_1, S_2, \\ldots, S_k$, then at least one $S_i$ is infinite.</p>
          <p><strong>Applications:</strong></p>
          <ul>
            <li><strong>Ramsey Theory:</strong> Any infinite red/blue 2-coloring of $\\mathbb{N}$ contains an infinite monochromatic arithmetic progression (van der Waerden's theorem).</li>
            <li><strong>Decimal Expansions:</strong> Any rational $p/q$ has a periodic decimal expansion — because only $q$ residues exist modulo $q$.</li>
            <li><strong>Sequences:</strong> Any bounded infinite sequence of reals has a convergent subsequence (Bolzano-Weierstrass) — partition the range into finitely many intervals; one contains infinitely many terms.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
    <a href="#/module/a5_strong_weighted" class="btn btn-outline">← Back: A4. Strong / Weighted</a>
    <a href="#/module/b10_core_table" class="btn btn-outline">Next: B1. The Pigeonhole Table →</a>
  </section>
</div>`;
  },

  _initControls(container) {
    const kSlider = container.querySelector('#kSlider');
    const kVal = container.querySelector('#kVal');
    const nSlider = container.querySelector('#nSlider');
    const nVal = container.querySelector('#nVal');
    const typeSelect = container.querySelector('#coloringType');

    const refresh = () => {
      const type = typeSelect.value;
      const k = parseInt(kSlider.value);
      const n = parseInt(nSlider.value);
      const kGroup = container.querySelector('#kGroup');
      kGroup.style.display = (type === 'parity' || type === 'prime') ? 'none' : '';
      kVal.textContent = k;
      nVal.textContent = n;
      this._render(container, type, k, n);
    };

    kSlider.addEventListener('input', refresh);
    nSlider.addEventListener('input', refresh);
    typeSelect.addEventListener('change', refresh);
    container.querySelector('#refreshBtn').addEventListener('click', refresh);
  },

  _colorize(n, type, k) {
    if (type === 'modulo') return n % k;
    if (type === 'parity') return n % 2;
    if (type === 'digit_sum') {
      let s = 0, m = n; while(m>0){s+=m%10;m=Math.floor(m/10);} return s % k;
    }
    if (type === 'prime') {
      if (n < 2) return 0;
      for (let i=2;i*i<=n;i++) if(n%i===0) return 1;
      return 0;
    }
    return n % k;
  },

  _render(container, type, k, N = 60) {
    const isParity = type === 'parity';
    const isPrime = type === 'prime';
    const numColors = isParity || isPrime ? 2 : k;
    const colors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4','#a855f7'];
    const labels = isParity ? ['Even','Odd'] : isPrime ? ['Composite/1','Prime'] : Array.from({length:k},(_,i)=>`mod ${i}`);

    const classCounts = Array(numColors).fill(0);
    const grid = container.querySelector('#infiniteGrid');
    grid.innerHTML = '';

    for (let n = 1; n <= N; n++) {
      const c = this._colorize(n, type, k);
      classCounts[c]++;
      const el = document.createElement('div');
      el.style.cssText = `width:36px;height:36px;background:${colors[c]};color:white;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:11px;font-weight:700;cursor:default;transition:transform 0.15s`;
      el.title = `${n} → ${labels[c]}`;
      el.textContent = n;
      el.addEventListener('mouseenter', () => el.style.transform = 'scale(1.2)');
      el.addEventListener('mouseleave', () => el.style.transform = '');
      grid.appendChild(el);
    }

    // Summary
    const summaryEl = container.querySelector('#classSummary');
    summaryEl.innerHTML = labels.map((lbl, i) => `
      <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">
        <div style="width:14px;height:14px;background:${colors[i]};border-radius:3px;flex-shrink:0"></div>
        <div><strong>${lbl}</strong>: ${classCounts[i]} shown (infinite in ℕ)</div>
      </div>`).join('');

    // Growth chart
    this._renderGrowthChart(container, type, k, numColors, colors, labels);
  },

  _renderGrowthChart(container, type, k, numColors, colors, labels) {
    const svg = container.querySelector('#growthChart');
    svg.innerHTML = '';
    const W = svg.clientWidth || 700, H = 200;
    const margin = {top:15,right:80,bottom:30,left:40};
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    const checkpoints = [10,20,30,40,60,80,100,150,200];
    const classSeries = Array.from({length:numColors}, () => []);

    checkpoints.forEach(N => {
      const counts = Array(numColors).fill(0);
      for (let n=1;n<=N;n++) counts[this._colorize(n,type,k)]++;
      classSeries.forEach((s,i) => s.push({n:N, count:counts[i]}));
    });

    const d3svg = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`);
    const g = d3svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0,200]).range([0,innerW]);
    const yScale = d3.scaleLinear().domain([0,200]).range([innerH,0]);

    classSeries.forEach((series, i) => {
      const line = d3.line().x(d=>xScale(d.n)).y(d=>yScale(d.count));
      g.append('path').datum(series).attr('fill','none').attr('stroke',colors[i]).attr('stroke-width',2).attr('d',line);
    });

    g.append('g').attr('transform',`translate(0,${innerH})`).call(d3.axisBottom(xScale).ticks(6));
    g.append('g').call(d3.axisLeft(yScale).ticks(4));

    // Legend
    const leg = d3svg.append('g').attr('transform',`translate(${W-margin.right+5},${margin.top})`);
    labels.forEach((lbl,i) => {
      leg.append('rect').attr('x',0).attr('y',i*16).attr('width',10).attr('height',10).attr('fill',colors[i]);
      leg.append('text').attr('x',14).attr('y',i*16+9).text(lbl).attr('fill','var(--text-muted)').attr('font-size',10);
    });
  }
};

export default a7_infinite;
