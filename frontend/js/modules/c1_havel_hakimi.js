// ============================================================================
// Module C1: Havel-Hakimi Degree Sequence Theorem
// ============================================================================

const c1_havel_hakimi = {
  _animFrame: null,
  _simulation: null,

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container, fetch, isOnline);
    this._runDefault(container, fetch, isOnline);
  },

  unmount() {
    if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
    if (this._simulation) { this._simulation.stop(); this._simulation = null; }
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">C1. Havel-Hakimi Algorithm</h1>
    <p class="module-subtitle">Given a sequence of non-negative integers, determine whether it is the degree sequence of a simple graph — and if so, construct one.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Link:</strong> The algorithm works by recursively assigning the highest degree vertex its required edges, using the Pigeonhole Principle at each step: the maximum degree is bounded by $n-1$, so in a valid sequence, at least two values must exist for any consistent assignment.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Input Degree Sequence</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Enter comma-separated integers:</label>
          <input type="text" id="sequenceInput" class="form-input" value="3,3,2,2,2" placeholder="e.g. 3,3,2,2,2">
        </div>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <button class="btn btn-primary" id="runBtn">▶ Run Havel-Hakimi</button>
          <button class="btn btn-secondary" id="presetGraphic">Graphic: 3,3,2,2,2</button>
          <button class="btn btn-secondary" id="presetNon">Non-Graphic: 3,3,3,1</button>
          <button class="btn btn-secondary" id="presetCycle">Cycle: 2,2,2,2,2</button>
          <button class="btn btn-secondary" id="presetComplete">K4: 3,3,3,3</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Verdict</h3></div>
      <div class="card-body" id="verdictBox">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Step-by-Step Algorithm Trace</h3></div>
    <div class="card-body" id="stepsBox">Run the algorithm to see steps here.</div>
  </div>

  <div class="card" style="margin-top:var(--space-4)" id="graphCard" style="display:none">
    <div class="card-header"><h3>Constructed Graph</h3></div>
    <div class="card-body" style="padding:0">
      <svg id="graphSvg" style="width:100%;height:360px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Havel-Hakimi Theorem</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Theorem (Havel 1955, Hakimi 1962)</div>
        <div class="proof-body">
          <p>A sequence of non-negative integers $d_1 \\ge d_2 \\ge \\cdots \\ge d_n$ is graphical (realizable as the degree sequence of a simple graph) if and only if the sequence $d_2-1, d_3-1, \\ldots, d_{d_1+1}-1, d_{d_1+2}, \\ldots, d_n$ is also graphical.</p>
          <p><strong>Algorithm:</strong></p>
          <ol>
            <li>Sort the sequence in non-increasing order.</li>
            <li>Remove the first element $d_1$.</li>
            <li>Subtract 1 from the next $d_1$ elements.</li>
            <li>If any element becomes negative, the sequence is non-graphical (STOP).</li>
            <li>Repeat until all elements are 0 (graphical) or a negative appears (non-graphical).</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _initControls(container, fetch, isOnline) {
    const input = container.querySelector('#sequenceInput');
    container.querySelector('#runBtn').addEventListener('click', () => this._runHavelHakimi(container, input.value.trim(), fetch, isOnline));
    container.querySelector('#presetGraphic').addEventListener('click', () => { input.value = '3,3,2,2,2'; this._runHavelHakimi(container, input.value, fetch, isOnline); });
    container.querySelector('#presetNon').addEventListener('click', () => { input.value = '3,3,3,1'; this._runHavelHakimi(container, input.value, fetch, isOnline); });
    container.querySelector('#presetCycle').addEventListener('click', () => { input.value = '2,2,2,2,2'; this._runHavelHakimi(container, input.value, fetch, isOnline); });
    container.querySelector('#presetComplete').addEventListener('click', () => { input.value = '3,3,3,3'; this._runHavelHakimi(container, input.value, fetch, isOnline); });
  },

  _runDefault(container, fetch, isOnline) {
    this._runHavelHakimi(container, '3,3,2,2,2', fetch, isOnline);
  },

  async _runHavelHakimi(container, inputStr, fetch, isOnline) {
    const sequence = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (sequence.length === 0) return;

    const verdictEl = container.querySelector('#verdictBox');
    const stepsEl = container.querySelector('#stepsBox');
    verdictEl.innerHTML = '<div class="loading-spinner"></div>';
    stepsEl.innerHTML = 'Computing...';

    let data = null;
    if (isOnline()) {
      try {
        const resp = await fetch('/degree/havelhakimi', { sequence: sequence.join(',') });
        data = resp.data;
      } catch(e) { console.warn('Fallback'); }
    }

    if (!data) {
      data = this._localHavelHakimi(sequence);
    }

    // Verdict
    const isGraphic = data.isGraphic;
    verdictEl.innerHTML = `
      <div class="verdict-display ${isGraphic ? 'verdict-pass' : 'verdict-fail'}">
        <div style="font-size:2.5rem">${isGraphic ? '✅' : '❌'}</div>
        <div style="font-size:1.2rem;font-weight:700;margin-top:var(--space-1)">${isGraphic ? 'GRAPHICAL' : 'NON-GRAPHICAL'}</div>
        <div style="color:var(--text-muted);font-size:0.9rem">${isGraphic ? 'A simple graph exists with this degree sequence.' : 'No simple graph can have this degree sequence.'}</div>
      </div>`;

    // Steps
    const stepsHtml = data.steps.map((step, i) => `
      <div class="step-item ${step.isValid ? '' : 'step-invalid'}">
        <div class="step-number">Step ${i+1}</div>
        <div class="step-content">
          <div>Sequence: <span class="seq-display">[${step.sequence.join(', ')}]</span></div>
          ${step.action ? `<div style="color:var(--text-muted);font-size:0.85rem">→ ${step.action}</div>` : ''}
        </div>
      </div>`).join('');
    stepsEl.innerHTML = stepsHtml || '<p>No steps available.</p>';

    // Graph
    if (isGraphic && data.edges) {
      const graphCard = container.querySelector('#graphCard');
      graphCard.style.display = '';
      this._renderConstructedGraph(container, data.nodes || sequence.length, data.edges);
    }
  },

  _localHavelHakimi(original) {
    const steps = [];
    let seq = original.slice().sort((a,b) => b-a);
    const allEdges = [];
    const nodeLabels = seq.map((d,i) => ({id:i, deg:d}));

    // We track original node assignments
    const n = seq.length;
    let sorted = seq.map((d,i) => ({orig:i, deg:d}));

    steps.push({ sequence: sorted.map(x=>x.deg), action: 'Initial sequence (sorted descending)', isValid: true });

    while (true) {
      sorted = sorted.sort((a,b) => b.deg - a.deg);
      if (sorted[0].deg === 0) {
        steps.push({ sequence: sorted.map(x=>x.deg), action: 'All degrees are 0 — sequence is graphical!', isValid: true });
        break;
      }
      const first = sorted.shift();
      const d = first.deg;
      if (d >= sorted.length + 1 || d < 0) {
        steps.push({ sequence: [first.deg, ...sorted.map(x=>x.deg)], action: `Degree ${d} exceeds remaining vertices — NON-GRAPHICAL`, isValid: false });
        return { isGraphic: false, steps, edges: [], nodes: n };
      }
      const action = `Remove first (deg=${d}), subtract 1 from next ${d} vertices`;
      for (let i = 0; i < d; i++) {
        allEdges.push({ source: first.orig, target: sorted[i].orig });
        sorted[i].deg--;
        if (sorted[i].deg < 0) {
          steps.push({ sequence: sorted.map(x=>x.deg), action: 'Negative degree encountered — NON-GRAPHICAL', isValid: false });
          return { isGraphic: false, steps, edges: [], nodes: n };
        }
      }
      steps.push({ sequence: sorted.map(x=>x.deg), action, isValid: true });
    }

    return { isGraphic: true, steps, edges: allEdges, nodes: n };
  },

  _renderConstructedGraph(container, nodeCount, edges) {
    const svg = container.querySelector('#graphSvg');
    svg.innerHTML = '';
    const W = svg.clientWidth || 700, H = 360;
    const d3svg = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`);

    const n = typeof nodeCount === 'number' ? nodeCount : nodeCount;
    const nodes = Array.from({length:n}, (_,i) => ({id:i}));
    const edgesCopy = edges.map(e => ({source:e.source, target:e.target}));

    if (this._simulation) this._simulation.stop();

    const link = d3svg.append('g').selectAll('line').data(edgesCopy).enter().append('line')
      .attr('stroke', 'var(--primary)').attr('stroke-width', 2).attr('opacity', 0.6);

    const node = d3svg.append('g').selectAll('g').data(nodes).enter().append('g')
      .call(d3.drag()
        .on('start', (e,d) => { if(!e.active) this._simulation.alphaTarget(0.3).restart(); d.fx=d.x;d.fy=d.y; })
        .on('drag', (e,d) => { d.fx=e.x;d.fy=e.y; })
        .on('end', (e,d) => { if(!e.active) this._simulation.alphaTarget(0); d.fx=null;d.fy=null; }));

    node.append('circle').attr('r', 18).attr('fill', 'var(--primary)').attr('stroke','white').attr('stroke-width',2);
    node.append('text').text(d=>d.id).attr('text-anchor','middle').attr('dy','0.35em')
      .attr('fill','white').attr('font-weight','bold').attr('font-size',12);

    this._simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edgesCopy).id(d=>d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(W/2, H/2))
      .on('tick', () => {
        link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        node.attr('transform',d=>`translate(${d.x},${d.y})`);
      });
  }
};

export default c1_havel_hakimi;
