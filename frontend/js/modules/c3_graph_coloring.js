// ============================================================================
// Module C3: Graph Coloring & Pigeonhole
// ============================================================================

const c3_graph_coloring = {
  _simulation: null,

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container, fetch, isOnline);
    this._generate(container, fetch, isOnline);
  },

  unmount() {
    if (this._simulation) { this._simulation.stop(); this._simulation = null; }
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">C3. Graph Coloring &amp; Pigeonhole</h1>
    <p class="module-subtitle">Assign colors to vertices so no two adjacent vertices share a color. The chromatic number $\\chi(G)$ measures the minimum colors needed.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Bounds:</strong> Since each color class must be an independent set, we need at least $\\lceil n / \\alpha(G) \\rceil$ colors where $\\alpha(G)$ is the independence number. Each additional color is a new "box" receiving $\\le \\alpha(G)$ vertices (pigeons).
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Graph Builder</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Vertices: <strong id="nVal">7</strong></label>
          <input type="range" id="nSlider" min="3" max="12" value="7" class="slider">
        </div>
        <div class="control-group">
          <label>Edge density: <strong id="dVal">0.40</strong></label>
          <input type="range" id="dSlider" min="0" max="100" value="40" class="slider">
        </div>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <button class="btn btn-primary" id="generateBtn">🔄 Random Graph</button>
          <button class="btn btn-secondary" id="cycleBtn">Odd Cycle C₅</button>
          <button class="btn btn-secondary" id="petersen">Petersen-like</button>
          <button class="btn btn-secondary" id="bipartite">Bipartite</button>
          <button class="btn btn-secondary" id="completeBtn">Complete K₅</button>
        </div>
        <div style="margin-top:var(--space-3)">
          <label>Algorithm:</label>
          <select id="algoSelect" class="form-select">
            <option value="greedy">Greedy (Welsh-Powell)</option>
            <option value="dsatur">DSatur (degree saturation)</option>
          </select>
          <button class="btn btn-primary" style="margin-top:var(--space-2)" id="colorBtn">🎨 Color Graph</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Coloring Result</h3></div>
      <div class="card-body" id="colorResult">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Graph Visualization</h3>
      <small style="color:var(--text-muted)">Node colors = color classes | Click a node to see its color class</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="colorSvg" style="width:100%;height:380px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Color Class Table (Pigeonhole Boxes)</h3></div>
    <div class="card-body" id="colorClassTable"></div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Graph Coloring &amp; Bounds</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Chromatic Number Bounds</div>
        <div class="proof-body">
          <p><strong>Lower bound:</strong> $\\chi(G) \\ge \\lceil n / \\alpha(G) \\rceil$ — since each color class is an independent set of size $\\le \\alpha(G)$, and by Pigeonhole we need at least $\\lceil n/\\alpha(G) \\rceil$ such classes to cover all $n$ vertices.</p>
          <p><strong>Lower bound 2:</strong> $\\chi(G) \\ge \\omega(G)$ — a clique of size $\\omega$ requires $\\omega$ distinct colors.</p>
          <p><strong>Upper bound:</strong> $\\chi(G) \\le \\Delta(G) + 1$ (Brooks' theorem: $\\chi(G) \\le \\Delta(G)$ unless $G$ is complete or an odd cycle).</p>
          <p><strong>Greedy Coloring:</strong> Process vertices in decreasing degree order (Welsh-Powell). Each vertex gets the lowest available color not used by its neighbors. This gives a valid $\\Delta+1$ coloring but may not achieve $\\chi(G)$.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _graph: { n: 7, edges: [] },
  _coloring: [],

  _initControls(container, fetch, isOnline) {
    container.querySelector('#nSlider').addEventListener('input', e => container.querySelector('#nVal').textContent = e.target.value);
    container.querySelector('#dSlider').addEventListener('input', e => container.querySelector('#dVal').textContent = (e.target.value/100).toFixed(2));

    container.querySelector('#generateBtn').addEventListener('click', () => this._generate(container, fetch, isOnline));
    container.querySelector('#cycleBtn').addEventListener('click', () => {
      const n=5; const edges=Array.from({length:n},(_,i)=>({u:i,v:(i+1)%n}));
      this._graph={n,edges}; this._applyColoring(container); this._renderGraph(container);
    });
    container.querySelector('#petersen').addEventListener('click', () => {
      const outer=[[0,1],[1,2],[2,3],[3,4],[4,0]], inner=[[5,7],[6,8],[7,9],[8,5],[9,6]], spoke=[[0,5],[1,6],[2,7],[3,8],[4,9]];
      this._graph={n:10, edges:[...outer,...inner,...spoke].map(([u,v])=>({u,v}))}; this._applyColoring(container); this._renderGraph(container);
    });
    container.querySelector('#bipartite').addEventListener('click', () => {
      const n=6; const edges=[];
      for(let i=0;i<3;i++) for(let j=3;j<6;j++) if(Math.random()<0.7) edges.push({u:i,v:j});
      if(!edges.length) edges.push({u:0,v:3});
      this._graph={n,edges}; this._applyColoring(container); this._renderGraph(container);
    });
    container.querySelector('#completeBtn').addEventListener('click', () => {
      const n=5; const edges=[];
      for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) edges.push({u:i,v:j});
      this._graph={n,edges}; this._applyColoring(container); this._renderGraph(container);
    });
    container.querySelector('#colorBtn').addEventListener('click', () => { this._applyColoring(container); this._renderGraph(container); });
  },

  _generate(container, fetch, isOnline) {
    const n = parseInt(container.querySelector('#nSlider').value);
    const d = container.querySelector('#dSlider').value / 100;
    const edges = [];
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(Math.random()<d) edges.push({u:i,v:j});
    if(!edges.length) edges.push({u:0,v:1});
    this._graph = {n, edges};
    this._applyColoring(container);
    this._renderGraph(container);
  },

  _applyColoring(container) {
    const { n, edges } = this._graph;
    const algo = container.querySelector('#algoSelect').value;
    const adj = Array.from({length:n}, () => []);
    edges.forEach(({u,v}) => { adj[u].push(v); adj[v].push(u); });

    const degrees = adj.map(a => a.length);
    let order = Array.from({length:n},(_,i)=>i);

    if (algo === 'greedy' || algo === 'dsatur') {
      order.sort((a,b) => degrees[b]-degrees[a]);
    }

    const colors = Array(n).fill(-1);

    if (algo === 'dsatur') {
      const saturation = Array(n).fill(0);
      const colored = new Set();
      for (let step=0;step<n;step++) {
        // Pick uncolored vertex with highest saturation (ties broken by degree)
        let best = -1;
        for(let v=0;v<n;v++) {
          if(colored.has(v)) continue;
          if(best===-1||saturation[v]>saturation[best]||(saturation[v]===saturation[best]&&degrees[v]>degrees[best])) best=v;
        }
        // Assign lowest available color
        const neighborColors = new Set(adj[best].map(u=>colors[u]).filter(c=>c>=0));
        let c=0; while(neighborColors.has(c)) c++;
        colors[best]=c;
        colored.add(best);
        // Update saturation
        adj[best].forEach(u => {
          if(!colored.has(u)){
            const nc=new Set(adj[u].map(w=>colors[w]).filter(x=>x>=0));
            saturation[u]=nc.size;
          }
        });
      }
    } else {
      // Welsh-Powell greedy
      for(const v of order) {
        const neighborColors = new Set(adj[v].map(u=>colors[u]).filter(c=>c>=0));
        let c=0; while(neighborColors.has(c)) c++;
        colors[v]=c;
      }
    }

    this._coloring = colors;
    const chi = Math.max(...colors)+1;
    const delta = Math.max(...degrees);
    const alpha = this._indepNumber(n, edges, colors);

    const resultEl = container.querySelector('#colorResult');
    resultEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-2)">
        <div class="stat-box"><div class="stat-label">χ(G) found</div><div class="stat-value" style="color:var(--success)">${chi}</div></div>
        <div class="stat-box"><div class="stat-label">Δ(G) max deg</div><div class="stat-value">${delta}</div></div>
        <div class="stat-box"><div class="stat-label">α(G) ind. set</div><div class="stat-value">${alpha}</div></div>
      </div>
      <div style="margin-top:var(--space-2);background:var(--surface-alt);padding:var(--space-2);border-radius:var(--radius-md);font-size:0.85rem">
        <div>Lower bound: ⌈n/α⌉ = ⌈${n}/${alpha}⌉ = <strong>${Math.ceil(n/alpha)}</strong></div>
        <div>Upper bound: Δ+1 = <strong>${delta+1}</strong></div>
        <div>Achieved: χ = <strong>${chi}</strong> colors ${chi===Math.ceil(n/alpha)?'(optimal!)':''}</div>
      </div>`;

    // Color class table
    const classMap = {};
    colors.forEach((c,v) => { if(!classMap[c]) classMap[c]=[];  classMap[c].push(v); });
    container.querySelector('#colorClassTable').innerHTML = Object.entries(classMap).map(([c,verts]) => `
      <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1)">
        <div style="width:16px;height:16px;background:${this._colorPalette[+c]};border-radius:3px;flex-shrink:0"></div>
        <strong>Color ${c}:</strong>
        <span>Vertices {${verts.join(', ')}}</span>
        <span style="color:var(--text-muted)">(|class|=${verts.length} ≤ α=${alpha})</span>
      </div>`).join('');
  },

  _colorPalette: ['#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4','#a855f7','#f97316','#14b8a6','#ec4899','#84cc16'],

  _indepNumber(n, edges, colors) {
    const classSizes = {};
    colors.forEach(c => { classSizes[c] = (classSizes[c]||0)+1; });
    return Math.max(...Object.values(classSizes));
  },

  _renderGraph(container) {
    const { n, edges } = this._graph;
    const colors = this._coloring;
    const svg = container.querySelector('#colorSvg');
    svg.innerHTML = '';
    const W = svg.clientWidth || 700, H = 380;
    const d3svg = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`);

    const nodes = Array.from({length:n},(_,i)=>({id:i}));
    const links = edges.map(({u,v})=>({source:u,target:v}));

    if (this._simulation) this._simulation.stop();

    const link = d3svg.append('g').selectAll('line').data(links).enter().append('line')
      .attr('stroke','var(--border-color)').attr('stroke-width',2).attr('opacity',0.6);

    const node = d3svg.append('g').selectAll('g').data(nodes).enter().append('g')
      .call(d3.drag()
        .on('start',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;})
        .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;})
        .on('end',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0);d.fx=null;d.fy=null;}));

    node.append('circle').attr('r',18).attr('fill',d=>this._colorPalette[colors[d.id]||0]).attr('stroke','white').attr('stroke-width',2.5);
    node.append('text').text(d=>d.id).attr('text-anchor','middle').attr('dy','0.35em')
      .attr('fill','white').attr('font-weight','bold').attr('font-size',12);
    node.append('title').text(d=>`Vertex ${d.id}: Color ${colors[d.id]}`);

    this._simulation = d3.forceSimulation(nodes)
      .force('link',d3.forceLink(links).id(d=>d.id).distance(80))
      .force('charge',d3.forceManyBody().strength(-220))
      .force('center',d3.forceCenter(W/2,H/2))
      .on('tick',()=>{
        link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        node.attr('transform',d=>`translate(${d.x},${d.y})`);
      });
  }
};

export default c3_graph_coloring;
