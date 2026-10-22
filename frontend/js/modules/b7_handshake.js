// ============================================================================
// Module B5: Handshake Lemma / Equal Degrees
// ============================================================================

const b7_handshake = {
  _animFrame: null,
  _simulation: null,

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container, fetch, isOnline);
    this._generateGraph(container, fetch, isOnline);
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
    <h1 class="module-title">B5. Handshake Lemma &amp; Equal Degrees</h1>
    <p class="module-subtitle">In any graph on $n \\ge 2$ vertices, at least two vertices share the same degree — and the sum of all degrees equals twice the number of edges.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Insight:</strong> Each vertex in an $n$-vertex graph has degree in $\\{0, 1, \\ldots, n{-}1\\}$ — that is $n$ possible values but not all can coexist (a vertex of degree 0 means no vertex has degree $n{-}1$). So the $n$ vertices fit into at most $n{-}1$ "boxes" of distinct degrees, guaranteeing a repeat by the Pigeonhole Principle.
  </div>

  <div class="two-col-grid" style="gap:var(--space-6);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Graph Generator</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Vertices: <strong id="nVal">8</strong></label>
          <input type="range" id="nSlider" min="3" max="16" value="8" class="slider">
        </div>
        <div class="control-group">
          <label>Edge Probability: <strong id="pVal">0.50</strong></label>
          <input type="range" id="pSlider" min="0" max="100" value="50" class="slider">
        </div>
        <div class="control-group" style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <button class="btn btn-primary" id="generateBtn">🔄 Generate New Graph</button>
          <button class="btn btn-secondary" id="completeBtn">Complete $K_n$</button>
          <button class="btn btn-secondary" id="pathBtn">Path Graph</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Handshaking Lemma Result</h3></div>
      <div class="card-body" id="lemmaResult">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header">
      <h3>Force-Directed Graph Visualization</h3>
      <small style="color:var(--text-muted)">Node colors group equal-degree vertices (same pigeonhole box)</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="graphSvg" style="width:100%;height:420px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Degree Distribution</h3></div>
    <div class="card-body">
      <div id="degreeBarChart" style="width:100%;height:160px"></div>
      <div id="degreeCollision" style="margin-top:var(--space-3)"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Mathematical Proof</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Theorem: Handshaking Lemma</div>
        <div class="proof-body">
          <p><strong>Statement:</strong> For any graph $G = (V, E)$, $\\displaystyle \\sum_{v \\in V} \\deg(v) = 2|E|$</p>
          <p><strong>Proof:</strong> Each edge $\\{u,v\\} \\in E$ contributes exactly 1 to $\\deg(u)$ and 1 to $\\deg(v)$, so it contributes exactly 2 to the total degree sum. Since every edge is counted exactly twice, $\\sum_{v} \\deg(v) = 2|E|$. $\\square$</p>
          <hr style="border-color:var(--border-color);margin:var(--space-3) 0">
          <p><strong>Corollary (Equal Degrees):</strong> In any graph $G$ on $n \\ge 2$ vertices, at least two vertices have equal degree.</p>
          <p><strong>Proof:</strong> Degrees lie in $\\{0, 1, \\ldots, n{-}1\\}$. But if degree 0 exists (isolated vertex), no vertex can have degree $n{-}1$ (connected to all). So there are at most $n{-}1$ valid distinct degrees for $n$ vertices. By the Pigeonhole Principle, at least two vertices share a degree. $\\square$</p>
        </div>
      </div>
    </div>
  </div>

  <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
    <a href="#/module/b4_birthday" class="btn btn-outline">← Back: B4. Birthday Paradox</a>
    <a href="#/module/c1_havel_hakimi" class="btn btn-outline">Next: C1. Havel-Hakimi Algorithm →</a>
  </section>
</div>`;
  },

  _initControls(container, fetch, isOnline) {
    const nSlider = container.querySelector('#nSlider');
    const pSlider = container.querySelector('#pSlider');
    const nVal = container.querySelector('#nVal');
    const pVal = container.querySelector('#pVal');

    nSlider.addEventListener('input', () => { nVal.textContent = nSlider.value; });
    pSlider.addEventListener('input', () => { pVal.textContent = (pSlider.value / 100).toFixed(2); });

    container.querySelector('#generateBtn').addEventListener('click', () => {
      this._generateGraph(container, fetch, isOnline);
    });
    container.querySelector('#completeBtn').addEventListener('click', () => {
      pSlider.value = 100; pVal.textContent = '1.00';
      this._generateGraph(container, fetch, isOnline);
    });
    container.querySelector('#pathBtn').addEventListener('click', () => {
      pSlider.value = 0; pVal.textContent = '0.00';
      // Generate path graph manually
      const n = parseInt(nSlider.value);
      const nodes = Array.from({length:n}, (_,i) => ({id:i, degree:0}));
      const edges = [];
      for (let i = 0; i < n - 1; i++) {
        edges.push({source:i, target:i+1});
        nodes[i].degree++; nodes[i+1].degree++;
      }
      this._renderGraph(container, nodes, edges);
    });
  },

  async _generateGraph(container, fetch, isOnline) {
    const n = parseInt(container.querySelector('#nSlider').value);
    const p = parseInt(container.querySelector('#pSlider').value) / 100;
    const seed = Math.floor(Math.random() * 100000);

    const resultEl = container.querySelector('#lemmaResult');
    resultEl.innerHTML = '<div class="loading-spinner"></div>';

    let data = null;
    if (isOnline()) {
      try {
        const resp = await fetch('/degree/random', { n, p, seed });
        data = resp.data;
      } catch (e) { console.warn('Using fallback graph'); }
    }

    if (!data) {
      data = this._fallbackGraph(n, p, seed);
    }

    this._renderLemmaResult(container, data);
    this._renderGraph(container, data.nodes, data.edges);
    this._renderDegreeBar(container, data.nodes);
  },

  _fallbackGraph(n, p, seed) {
    // Seeded PRNG
    let s = seed;
    const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };

    const nodes = Array.from({length: n}, (_, i) => ({ id: i, degree: 0 }));
    const edges = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (rand() < p) {
          edges.push({ source: i, target: j });
          nodes[i].degree++;
          nodes[j].degree++;
        }
      }
    }
    const sumDegrees = nodes.reduce((s, v) => s + v.degree, 0);
    const degreeCounts = {};
    nodes.forEach(v => { degreeCounts[v.degree] = (degreeCounts[v.degree] || 0) + 1; });
    const collisions = Object.entries(degreeCounts).filter(([,c]) => c > 1);
    return { nodes, edges, edgeCount: edges.length, sumDegrees, degreeCounts, collisions, handshakingHolds: sumDegrees === 2 * edges.length };
  },

  _renderLemmaResult(container, data) {
    const resultEl = container.querySelector('#lemmaResult');
    const collisionPairs = data.collisions || Object.entries(data.degreeCounts || {}).filter(([,c]) => c > 1);
    resultEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
        <div class="stat-box">
          <div class="stat-label">Vertices (n)</div>
          <div class="stat-value">${data.nodes.length}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Edges (|E|)</div>
          <div class="stat-value">${data.edgeCount}</div>
        </div>
        <div class="stat-box" style="grid-column:span 2">
          <div class="stat-label">∑ deg(v) = 2|E|</div>
          <div class="stat-value" style="font-size:1.1rem">${data.sumDegrees} = 2×${data.edgeCount} = ${2*data.edgeCount} <span style="color:${data.handshakingHolds ? 'var(--success)' : 'var(--error)'}">${data.handshakingHolds ? '✓' : '✗'}</span></div>
        </div>
      </div>
      <div style="margin-top:var(--space-3);padding:var(--space-3);background:var(--surface-alt);border-radius:var(--radius-md)">
        <strong>Equal Degree Pairs (Pigeonhole Guarantee):</strong>
        ${collisionPairs.length > 0 
          ? collisionPairs.map(([deg, cnt]) => `<span class="badge-tag" style="margin:2px">degree ${deg}: ${cnt} vertices</span>`).join('')
          : '<em>No collision (impossible for n≥2 — check fallback)</em>'}
      </div>`;
  },

  _renderGraph(container, nodes, edges) {
    const svg = container.querySelector('#graphSvg');
    svg.innerHTML = '';
    const W = svg.clientWidth || 700, H = 420;
    const d3svg = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`);

    // Color by degree
    const degrees = [...new Set(nodes.map(n => n.degree))].sort((a,b) => a-b);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(degrees);

    if (this._simulation) this._simulation.stop();
    
    const nodesCopy = nodes.map(n => ({...n}));
    const edgesCopy = edges.map(e => ({
      source: typeof e.source === 'object' ? e.source.id : e.source,
      target: typeof e.target === 'object' ? e.target.id : e.target
    }));

    const link = d3svg.append('g').selectAll('line')
      .data(edgesCopy).enter().append('line')
      .attr('stroke', 'var(--border-color)').attr('stroke-width', 1.5).attr('opacity', 0.7);

    const node = d3svg.append('g').selectAll('g').data(nodesCopy).enter().append('g')
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) this._simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => { if (!event.active) this._simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

    node.append('circle').attr('r', 16).attr('fill', d => colorScale(d.degree))
      .attr('stroke', 'white').attr('stroke-width', 2);
    node.append('text').text(d => d.id).attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('fill', 'white').attr('font-size', 11).attr('font-weight', 'bold');
    node.append('title').text(d => `Vertex ${d.id}: degree = ${d.degree}`);

    this._simulation = d3.forceSimulation(nodesCopy)
      .force('link', d3.forceLink(edgesCopy).id(d => d.id).distance(70))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        node.attr('transform', d => `translate(${d.x},${d.y})`);
      });

    // Legend
    const legend = d3svg.append('g').attr('transform', 'translate(10,10)');
    degrees.forEach((deg, i) => {
      legend.append('circle').attr('cx', 8).attr('cy', i*20+8).attr('r', 7).attr('fill', colorScale(deg));
      legend.append('text').attr('x', 20).attr('y', i*20+12).text(`deg=${deg}`)
        .attr('fill', 'var(--text-primary)').attr('font-size', 11);
    });
  },

  _renderDegreeBar(container, nodes) {
    const barEl = container.querySelector('#degreeBarChart');
    const collisionEl = container.querySelector('#degreeCollision');
    barEl.innerHTML = '';

    const counts = {};
    nodes.forEach(v => { counts[v.degree] = (counts[v.degree] || 0) + 1; });
    const entries = Object.entries(counts).sort((a,b) => +a[0]-+b[0]);
    const maxCount = Math.max(...entries.map(([,c]) => c));

    const svg = d3.select(barEl).append('svg').attr('width', '100%').attr('height', 160)
      .attr('viewBox', `0 0 ${entries.length * 60 + 40} 160`);
    const barW = 50, gap = 10;

    entries.forEach(([deg, cnt], i) => {
      const barH = (cnt / maxCount) * 100;
      const hasCollision = cnt > 1;
      svg.append('rect')
        .attr('x', i * (barW + gap) + 20).attr('y', 120 - barH).attr('width', barW).attr('height', barH)
        .attr('fill', hasCollision ? 'var(--error)' : 'var(--primary)').attr('rx', 4).attr('opacity', 0.85);
      svg.append('text').attr('x', i * (barW + gap) + 20 + barW/2).attr('y', 115 - barH)
        .text(cnt).attr('text-anchor', 'middle').attr('fill', 'var(--text-primary)').attr('font-size', 12);
      svg.append('text').attr('x', i * (barW + gap) + 20 + barW/2).attr('y', 135)
        .text(`d=${deg}`).attr('text-anchor', 'middle').attr('fill', 'var(--text-muted)').attr('font-size', 11);
    });

    const collisions = entries.filter(([,c]) => c > 1);
    collisionEl.innerHTML = collisions.length > 0
      ? `<div class="callout callout-success" style="padding:var(--space-2) var(--space-3)">✅ <strong>Pigeonhole confirmed:</strong> ${collisions.map(([d,c]) => `${c} vertices share degree ${d}`).join(', ')}.</div>`
      : `<div class="callout callout-idea" style="padding:var(--space-2) var(--space-3)">All degrees appear unique — try generating with more vertices or higher edge probability.</div>`;
  }
};

export default b7_handshake;
