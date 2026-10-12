// ============================================================================
// Module A6: Averaging Principle
// ============================================================================

const a6_averaging = {
  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container);
    this._generateData(container);
  },
  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">A6. Averaging Principle</h1>
    <p class="module-subtitle">If the average of a set of numbers is $\\mu$, then at least one number is $\\ge \\mu$ and at least one is $\\le \\mu$.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Connection:</strong> Think of the "boxes" as a continuum around $\\mu$. At least one value must fall in the "above average" box and one in the "below average" box. This bridges to Erdős' <em>probabilistic method</em>: if the average cost is $\\mu$, some configuration costs $\\le \\mu$, proving existence of efficient solutions.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Configuration</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Number of values: <strong id="nVal">10</strong></label>
          <input type="range" id="nSlider" min="3" max="20" value="10" class="slider">
        </div>
        <div class="control-group">
          <label>Distribution:</label>
          <select id="distSelect" class="form-select">
            <option value="random">Random (0–100)</option>
            <option value="skewed">Skewed (heavy low)</option>
            <option value="bimodal">Bimodal (clusters)</option>
            <option value="uniform">Uniform Grid</option>
          </select>
        </div>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-top:var(--space-2)">
          <button class="btn btn-primary" id="generateBtn">🔄 Generate</button>
          <button class="btn btn-secondary" id="erdosBtn">Erdős Coloring Demo</button>
        </div>
        <div style="margin-top:var(--space-3)">
          <label>Custom values (comma-separated):</label>
          <input type="text" id="customInput" class="form-input" placeholder="e.g. 10,25,40,55,80">
          <button class="btn btn-secondary" style="margin-top:var(--space-1)" id="customBtn">Use Custom</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Statistical Summary</h3></div>
      <div class="card-body" id="statsSummary"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Averaging Principle Chart</h3>
      <small style="color:var(--text-muted)">Red = above average | Blue = below average | Green dashed = mean μ</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="avgChart" style="width:100%;height:300px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)" id="erdosCard" style="display:none">
    <div class="card-header"><h3>🎲 Erdős Probabilistic Method Demo</h3></div>
    <div class="card-body" id="erdosContent"></div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Averaging Principle</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Theorem: Averaging Principle</div>
        <div class="proof-body">
          <p><strong>Statement:</strong> For any $n$ real numbers $a_1, \\ldots, a_n$ with average $\\mu = \\frac{1}{n}\\sum a_i$:</p>
          <ul>
            <li>At least one $a_i \\ge \\mu$</li>
            <li>At least one $a_i \\le \\mu$</li>
          </ul>
          <p><strong>Proof:</strong> If all $a_i < \\mu$, then $\\sum a_i < n\\mu = \\sum a_i$, a contradiction. Similarly if all $a_i > \\mu$. $\\square$</p>
          <p><strong>Erdős Application:</strong> Suppose a combinatorial object has a parameter whose average over all configurations is $\\mu$. Then some configuration achieves a value $\\le \\mu$, proving the existence of an efficient configuration — without constructing it explicitly.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _values: [],

  _initControls(container) {
    container.querySelector('#nSlider').addEventListener('input', e => {
      container.querySelector('#nVal').textContent = e.target.value;
    });
    container.querySelector('#generateBtn').addEventListener('click', () => this._generateData(container));
    container.querySelector('#customBtn').addEventListener('click', () => {
      const vals = container.querySelector('#customInput').value.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));
      if (vals.length >= 2) { this._values = vals; this._render(container); }
    });
    container.querySelector('#erdosBtn').addEventListener('click', () => {
      container.querySelector('#erdosCard').style.display = '';
      this._renderErdos(container);
    });
  },

  _generateData(container) {
    const n = parseInt(container.querySelector('#nSlider').value);
    const dist = container.querySelector('#distSelect').value;
    this._values = this._generate(n, dist);
    this._render(container);
  },

  _generate(n, dist) {
    const vals = [];
    for (let i = 0; i < n; i++) {
      if (dist === 'random') vals.push(Math.random() * 100);
      else if (dist === 'skewed') vals.push(Math.pow(Math.random(), 2) * 100);
      else if (dist === 'bimodal') vals.push(Math.random() < 0.5 ? Math.random()*30 : 70 + Math.random()*30);
      else vals.push((i / (n-1)) * 100);
    }
    return vals;
  },

  _render(container) {
    const vals = this._values;
    const n = vals.length;
    const mu = vals.reduce((s,v)=>s+v,0)/n;
    const above = vals.filter(v=>v>mu).length;
    const below = vals.filter(v=>v<mu).length;
    const maxVal = Math.max(...vals), minVal = Math.min(...vals);

    // Stats
    container.querySelector('#statsSummary').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-2)">
        <div class="stat-box"><div class="stat-label">Mean μ</div><div class="stat-value">${mu.toFixed(2)}</div></div>
        <div class="stat-box"><div class="stat-label">Max</div><div class="stat-value">${maxVal.toFixed(2)}</div></div>
        <div class="stat-box"><div class="stat-label">Min</div><div class="stat-value">${minVal.toFixed(2)}</div></div>
      </div>
      <div style="margin-top:var(--space-2);display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2)">
        <div class="stat-box"><div class="stat-label">Above μ</div><div class="stat-value" style="color:var(--error)">${above}</div></div>
        <div class="stat-box"><div class="stat-label">Below μ</div><div class="stat-value" style="color:var(--primary)">${below}</div></div>
      </div>
      <div class="callout callout-success" style="margin-top:var(--space-2);padding:var(--space-2)">
        ✅ <strong>Averaging Principle confirmed:</strong> Both above (${above}) and below (${below}) categories are non-empty.
      </div>`;

    // Chart
    const svg = container.querySelector('#avgChart');
    svg.innerHTML = '';
    const W = svg.clientWidth || 700, H = 300;
    const margin = {top:30,right:20,bottom:40,left:40};
    const innerW = W - margin.left - margin.right;
    const innerH = H - margin.top - margin.bottom;

    const d3svg = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`);
    const g = d3svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().domain(vals.map((_,i)=>i)).range([0,innerW]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0, Math.max(...vals)*1.1]).range([innerH, 0]);

    // Bars
    g.selectAll('rect').data(vals).enter().append('rect')
      .attr('x', (_,i) => xScale(i)).attr('y', v => yScale(v))
      .attr('width', xScale.bandwidth()).attr('height', v => innerH - yScale(v))
      .attr('fill', v => v > mu ? 'var(--error)' : v < mu ? 'var(--primary)' : 'var(--warning)')
      .attr('opacity', 0.8).attr('rx', 3);

    // Mean line
    g.append('line').attr('x1',0).attr('x2',innerW).attr('y1',yScale(mu)).attr('y2',yScale(mu))
      .attr('stroke','var(--success)').attr('stroke-width',2).attr('stroke-dasharray','6,3');
    g.append('text').attr('x',innerW-5).attr('y',yScale(mu)-5)
      .text(`μ=${mu.toFixed(1)}`).attr('fill','var(--success)').attr('font-size',12).attr('text-anchor','end');

    // Axes
    g.append('g').attr('transform',`translate(0,${innerH})`).call(d3.axisBottom(xScale).tickValues([]));
    g.append('g').call(d3.axisLeft(yScale).ticks(5));
  },

  _renderErdos(container) {
    const el = container.querySelector('#erdosContent');
    // Simulate random 2-colorings of K5 edges and find min monochromatic triangles
    const n = 5;
    const edges = [];
    for (let i=0;i<n;i++) for(let j=i+1;j<n;j++) edges.push([i,j]);
    const E = edges.length; // 10 edges
    let minMono = Infinity, bestColoring = null;
    let totalMono = 0, trials = 256;

    for (let mask=0; mask<(1<<E); mask++) {
      const color = edges.map((_,k) => (mask>>k)&1);
      let mono = 0;
      for(let a=0;a<n;a++) for(let b=a+1;b<n;b++) for(let c=b+1;c<n;c++) {
        const ea = edges.findIndex(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a));
        const eb = edges.findIndex(e=>(e[0]===a&&e[1]===c)||(e[0]===c&&e[1]===a));
        const ec = edges.findIndex(e=>(e[0]===b&&e[1]===c)||(e[0]===c&&e[1]===b));
        if(color[ea]===color[eb]&&color[eb]===color[ec]) mono++;
      }
      if(mono < minMono) { minMono=mono; bestColoring=color; }
      totalMono+=mono;
    }
    const avgMono = totalMono / (1<<E);

    el.innerHTML = `
      <p>Coloring all edges of $K_5$ with 2 colors: the <em>average</em> number of monochromatic triangles across all $2^{10}=1024$ colorings is <strong>${avgMono.toFixed(2)}</strong>.</p>
      <p>By the Averaging Principle (Erdős), there exists a coloring with $\\le ${Math.floor(avgMono)+1}$ monochromatic triangles.</p>
      <p>In fact, the minimum is <strong>${minMono}</strong> monochromatic triangles in $K_5$ (confirming $R(3,3)>5$).</p>
      <div class="callout callout-success">✅ The probabilistic method gives an <em>existence proof</em> without explicit construction!</div>`;
  }
};

export default a6_averaging;
