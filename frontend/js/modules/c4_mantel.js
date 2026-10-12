// ============================================================================
// Module C4: Mantel's Theorem / Turán Bound
// ============================================================================

const c4_mantel = {
  _simulation: null,

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container);
    this._compute(container, 6);
  },
  unmount() {
    if (this._simulation) { this._simulation.stop(); this._simulation = null; }
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier3">Tier 3</span>
    <h1 class="module-title">C4. Mantel's Theorem &amp; Turán Bound</h1>
    <p class="module-subtitle">A triangle-free graph on $n$ vertices has at most $\\lfloor n^2/4 \\rfloor$ edges, achieved uniquely by the complete bipartite graph $K_{\\lfloor n/2\\rfloor, \\lceil n/2\\rceil}$.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Proof:</strong> For each edge $\\{u,v\\}$ in a triangle-free graph, $N(u)$ and $N(v)$ are disjoint (else a triangle exists). So $\\deg(u)+\\deg(v) \\le n$ for every edge. Summing over all edges and applying the handshaking lemma gives the bound.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Parameters</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Vertices (n): <strong id="nVal">6</strong></label>
          <input type="range" id="nSlider" min="3" max="14" value="6" class="slider">
        </div>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-top:var(--space-2)">
          <button class="btn btn-primary" id="turanBtn">Show Turán Graph</button>
          <button class="btn btn-secondary" id="triangleBtn">Show Triangle Graph</button>
          <button class="btn btn-secondary" id="randomBtn">Random Triangle-Free</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Mantel's Bound</h3></div>
      <div class="card-body" id="mantelResult"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Graph Visualization</h3></div>
    <div class="card-body" style="padding:0">
      <svg id="mantelSvg" style="width:100%;height:360px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Turán Number Table</h3></div>
    <div class="card-body" id="turanTable"></div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Proof of Mantel's Theorem</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Theorem (Mantel, 1907)</div>
        <div class="proof-body">
          <p>Let $G$ be a triangle-free graph on $n$ vertices. Then $|E(G)| \\le \\lfloor n^2/4 \\rfloor$.</p>
          <p><strong>Proof:</strong> For each edge $\\{u,v\\}$, since $G$ is triangle-free, $N(u) \\cap N(v) = \\emptyset$. Thus $\\deg(u) + \\deg(v) \\le n$.</p>
          <p>Summing over all edges: $\\sum_{\\{u,v\\}\\in E} (\\deg(u)+\\deg(v)) \\le n|E|$.</p>
          <p>By the handshaking lemma, the left side equals $\\sum_v \\deg(v)^2$. By Cauchy-Schwarz: $\\sum_v \\deg(v)^2 \\ge \\frac{(\\sum_v \\deg(v))^2}{n} = \\frac{(2|E|)^2}{n} = \\frac{4|E|^2}{n}$.</p>
          <p>Therefore $\\frac{4|E|^2}{n} \\le n|E|$, giving $|E| \\le \\frac{n^2}{4}$. Since $|E|$ is an integer, $|E| \\le \\lfloor n^2/4 \\rfloor$. $\\square$</p>
          <p><strong>Extremal:</strong> $K_{\\lfloor n/2\\rfloor,\\lceil n/2\\rceil}$ achieves exactly $\\lfloor n/2\\rfloor \\cdot \\lceil n/2\\rceil = \\lfloor n^2/4 \\rfloor$ edges and is triangle-free.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _graph: { nodes: [], edges: [] },
  _hasTriangle: false,

  _initControls(container) {
    const nSlider = container.querySelector('#nSlider');
    nSlider.addEventListener('input', e => { container.querySelector('#nVal').textContent = e.target.value; });
    container.querySelector('#turanBtn').addEventListener('click', () => this._compute(container, parseInt(nSlider.value), 'turan'));
    container.querySelector('#triangleBtn').addEventListener('click', () => this._compute(container, parseInt(nSlider.value), 'triangle'));
    container.querySelector('#randomBtn').addEventListener('click', () => this._compute(container, parseInt(nSlider.value), 'random'));
  },

  _compute(container, n, mode = 'turan') {
    const bound = Math.floor(n*n/4);
    let edges = [];

    if (mode === 'turan') {
      // Complete bipartite K_{floor(n/2), ceil(n/2)}
      const left = Math.floor(n/2), right = Math.ceil(n/2);
      for(let i=0;i<left;i++) for(let j=left;j<n;j++) edges.push({u:i,v:j});
    } else if (mode === 'triangle') {
      // Random graph with some triangles allowed
      for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(Math.random()<0.5) edges.push({u:i,v:j});
    } else {
      // Random triangle-free: bipartite random subgraph
      const left = Math.floor(n/2), right = Math.ceil(n/2);
      for(let i=0;i<left;i++) for(let j=left;j<n;j++) if(Math.random()<0.6) edges.push({u:i,v:j});
    }

    // Check for triangles
    const adj = Array.from({length:n},()=>new Set());
    edges.forEach(({u,v})=>{adj[u].add(v);adj[v].add(u);});
    let triangles = [];
    for(let a=0;a<n;a++) for(let b of adj[a]) for(let c of adj[a]) {
      if(b<c&&adj[b].has(c)) triangles.push([a,b,c]);
    }
    const hasTri = triangles.length > 0;

    const resultEl = container.querySelector('#mantelResult');
    resultEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2)">
        <div class="stat-box"><div class="stat-label">n (vertices)</div><div class="stat-value">${n}</div></div>
        <div class="stat-box"><div class="stat-label">⌊n²/4⌋ bound</div><div class="stat-value" style="color:var(--primary)">${bound}</div></div>
        <div class="stat-box"><div class="stat-label">|E| actual</div><div class="stat-value" style="color:${edges.length<=bound?'var(--success)':'var(--error)'}">${edges.length}</div></div>
        <div class="stat-box"><div class="stat-label">Triangles</div><div class="stat-value" style="color:${hasTri?'var(--error)':'var(--success)'}">${triangles.length}</div></div>
      </div>
      <div class="callout callout-${hasTri?'warning':'success'}" style="margin-top:var(--space-2)">
        ${hasTri ? `⚠️ Graph has ${triangles.length} triangle(s) — not triangle-free. Edges can exceed bound.`
        : edges.length===bound ? `✅ Achieves Mantel's bound exactly (${edges.length} = ⌊${n}²/4⌋)!` 
        : `✅ Triangle-free: ${edges.length} ≤ ${bound} = ⌊n²/4⌋`}
      </div>`;

    this._renderGraph(container, n, edges, triangles);
    this._renderTable(container);
  },

  _renderGraph(container, n, edges, triangles) {
    const svg = container.querySelector('#mantelSvg');
    svg.innerHTML = '';
    const W = svg.clientWidth || 700, H = 360;
    const d3svg = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`);

    const nodes = Array.from({length:n}, (_,i) => ({id:i}));
    const links = edges.map(({u,v}) => ({source:u,target:v}));
    const triEdges = new Set(triangles.flatMap(t => [`${t[0]}-${t[1]}`,`${t[0]}-${t[2]}`,`${t[1]}-${t[2]}`]));

    if (this._simulation) this._simulation.stop();

    const link = d3svg.append('g').selectAll('line').data(links).enter().append('line')
      .attr('stroke', d => {
        const key1=`${Math.min(d.source.id||d.source,d.target.id||d.target)}-${Math.max(d.source.id||d.source,d.target.id||d.target)}`;
        return triEdges.has(key1) ? 'var(--error)' : 'var(--primary)';
      }).attr('stroke-width', 2).attr('opacity', 0.7);

    const nodeG = d3svg.append('g').selectAll('g').data(nodes).enter().append('g')
      .call(d3.drag()
        .on('start',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;})
        .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;})
        .on('end',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0);d.fx=null;d.fy=null;}));

    nodeG.append('circle').attr('r',16).attr('fill',d=>d.id<Math.floor(n/2)?'var(--primary)':'var(--secondary)')
      .attr('stroke','white').attr('stroke-width',2);
    nodeG.append('text').text(d=>d.id).attr('text-anchor','middle').attr('dy','0.35em')
      .attr('fill','white').attr('font-weight','bold').attr('font-size',11);

    this._simulation = d3.forceSimulation(nodes)
      .force('link',d3.forceLink(links).id(d=>d.id).distance(70))
      .force('charge',d3.forceManyBody().strength(-200))
      .force('center',d3.forceCenter(W/2,H/2))
      .on('tick',()=>{
        link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeG.attr('transform',d=>`translate(${d.x},${d.y})`);
      });
  },

  _renderTable(container) {
    const rows = Array.from({length:10}, (_,i) => {
      const n = i+3;
      const bound = Math.floor(n*n/4);
      return `<tr><td>${n}</td><td>${Math.floor(n/2)}</td><td>${Math.ceil(n/2)}</td><td>${Math.floor(n/2)*Math.ceil(n/2)}</td><td>${bound}</td></tr>`;
    });
    container.querySelector('#turanTable').innerHTML = `
      <table class="data-table">
        <thead><tr><th>n</th><th>⌊n/2⌋</th><th>⌈n/2⌉</th><th>|E(Turán)|</th><th>⌊n²/4⌋</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>`;
  }
};

export default c4_mantel;
