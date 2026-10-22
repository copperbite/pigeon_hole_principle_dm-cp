// ============================================================================
// Module C2: Eulerian & Hamiltonian Hints
// ============================================================================

const c5_euler_hamilton = {
  _simulation: null,

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container);
    this._generate(container);
  },
  unmount() {
    if (this._simulation) { this._simulation.stop(); this._simulation = null; }
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier3">Tier 3</span>
    <h1 class="module-title">C2. Eulerian Circuits &amp; Hamiltonian Hints</h1>
    <p class="module-subtitle">Degree conditions derived from the Pigeonhole Principle determine when Eulerian circuits and Hamiltonian cycles must exist.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Connection:</strong> Euler's criterion uses the parity of degrees (from the handshaking lemma). Dirac's theorem uses the pigeonhole principle: if every vertex has $\\deg(v) \\ge n/2$, then any partial Hamiltonian path can always be extended (at least $n/2$ neighbors, guaranteeing enough room).
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Graph Builder</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Vertices: <strong id="nVal">6</strong></label>
          <input type="range" id="nSlider" min="3" max="10" value="6" class="slider">
        </div>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <button class="btn btn-secondary" id="eulerCircuit">Euler Circuit Graph</button>
          <button class="btn btn-secondary" id="eulerPath">Euler Path (no circuit)</button>
          <button class="btn btn-secondary" id="hamiltonDirac">Dirac's (Hamilton)</button>
          <button class="btn btn-secondary" id="randomBtn">Random Graph</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Degree Analysis</h3></div>
      <div class="card-body" id="degreeAnalysis"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Graph Visualization</h3>
      <small style="color:var(--text-muted)">Green = even degree (Euler) | Red = odd degree | Purple = high degree (Dirac)</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="eulerSvg" style="width:100%;height:360px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Euler Circuit &amp; Dirac's Theorem</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Euler's Theorem (1736) &amp; Dirac's Theorem (1952)</div>
        <div class="proof-body">
          <p><strong>Euler's Theorem:</strong> A connected graph $G$ has an Eulerian circuit (a closed walk visiting every edge exactly once) if and only if every vertex has even degree.</p>
          <p><em>Proof sketch:</em> Necessity: an Eulerian circuit enters and exits each vertex equally often, requiring even degree. Sufficiency: by induction on edges, combining closed walks. The parity condition is a direct consequence of the Handshaking Lemma (sum of degrees = 2|E|), which itself is a double-counting/pigeonhole argument.</p>
          <p><strong>Eulerian Path:</strong> A connected graph has an Eulerian path (open trail) iff exactly 0 or 2 vertices have odd degree.</p>
          <hr style="border-color:var(--border-color);margin:var(--space-3) 0">
          <p><strong>Dirac's Theorem (1952):</strong> If $G$ is a simple graph on $n \\ge 3$ vertices with $\\deg(v) \\ge n/2$ for all $v$, then $G$ has a Hamiltonian cycle.</p>
          <p><em>Proof sketch:</em> The high-degree condition (Pigeonhole: $n/2 \\ge n/2$ neighbors available) ensures that any maximal Hamiltonian path can be "rotated" into a cycle. No vertex is too isolated to continue.</p>
        </div>
      </div>
    </div>
  </div>

  <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
    <a href="#/module/c1_havel_hakimi" class="btn btn-outline">← Back: C1. Havel-Hakimi Algorithm</a>
    <a href="#/module/r1_real_world" class="btn btn-outline">Next: D1. Real-World Case Files →</a>
  </section>
</div>`;
  },

  _graph: { n: 6, edges: [] },

  _initControls(container) {
    const nSlider = container.querySelector('#nSlider');
    nSlider.addEventListener('input', e => container.querySelector('#nVal').textContent = e.target.value);

    container.querySelector('#eulerCircuit').addEventListener('click', () => {
      // All even degrees: C6
      const n=6; const edges=Array.from({length:n},(_,i)=>({u:i,v:(i+1)%n}));
      // Add another cycle: every vertex still even
      edges.push({u:0,v:2},{u:1,v:3},{u:2,v:4},{u:3,v:5});
      this._graph={n,edges}; this._analyze(container); this._renderGraph(container);
    });
    container.querySelector('#eulerPath').addEventListener('click', () => {
      // Exactly 2 odd-degree vertices: path graph
      const n=5; const edges=Array.from({length:n-1},(_,i)=>({u:i,v:i+1}));
      this._graph={n,edges}; this._analyze(container); this._renderGraph(container);
    });
    container.querySelector('#hamiltonDirac').addEventListener('click', () => {
      const n=parseInt(nSlider.value)||6;
      // Complete graph Kn — all degrees n-1 >= n/2
      const edges=[];
      for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) edges.push({u:i,v:j});
      this._graph={n,edges}; this._analyze(container); this._renderGraph(container);
    });
    container.querySelector('#randomBtn').addEventListener('click', () => this._generate(container));
  },

  _generate(container) {
    const n = parseInt(container.querySelector('#nSlider').value);
    const edges=[];
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(Math.random()<0.5) edges.push({u:i,v:j});
    if(!edges.length) edges.push({u:0,v:1});
    this._graph={n,edges}; this._analyze(container); this._renderGraph(container);
  },

  _analyze(container) {
    const {n, edges} = this._graph;
    const deg = Array(n).fill(0);
    edges.forEach(({u,v})=>{deg[u]++;deg[v]++;});
    const minDeg = Math.min(...deg);
    const oddDeg = deg.filter(d=>d%2!==0).length;
    const sumDeg = deg.reduce((s,d)=>s+d,0);

    const hasEulerCircuit = oddDeg === 0;
    const hasEulerPath = oddDeg === 0 || oddDeg === 2;
    const diracCondition = minDeg >= n/2;

    const el = container.querySelector('#degreeAnalysis');
    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);margin-bottom:var(--space-2)">
        <div class="stat-box"><div class="stat-label">∑deg = 2|E|</div><div class="stat-value">${sumDeg}</div></div>
        <div class="stat-box"><div class="stat-label">Odd-degree verts</div><div class="stat-value" style="color:${oddDeg===0?'var(--success)':'var(--error)'}">${oddDeg}</div></div>
        <div class="stat-box"><div class="stat-label">Min degree δ</div><div class="stat-value">${minDeg}</div></div>
        <div class="stat-box"><div class="stat-label">n/2 threshold</div><div class="stat-value">${n/2}</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-1)">
        <div class="callout callout-${hasEulerCircuit?'success':'warning'}" style="padding:var(--space-1) var(--space-2)">
          ${hasEulerCircuit?'✅':'❌'} Eulerian Circuit: ${hasEulerCircuit?'Yes (all degrees even)':'No ('+oddDeg+' odd vertices)'}
        </div>
        <div class="callout callout-${hasEulerPath?'success':'warning'}" style="padding:var(--space-1) var(--space-2)">
          ${hasEulerPath?'✅':'❌'} Eulerian Path: ${hasEulerPath?'Yes (0 or 2 odd vertices)':'No ('+oddDeg+' odd vertices)'}
        </div>
        <div class="callout callout-${diracCondition?'success':'idea'}" style="padding:var(--space-1) var(--space-2)">
          ${diracCondition?'✅':'ℹ️'} Dirac's (Hamilton): ${diracCondition?'Guaranteed (δ ≥ n/2)':'Not guaranteed by Dirac (δ='+minDeg+' < n/2='+n/2+')'}
        </div>
      </div>
      <div style="margin-top:var(--space-2);font-size:0.85rem">
        Degrees: [${deg.join(', ')}]
      </div>`;
  },

  _renderGraph(container) {
    const {n, edges} = this._graph;
    const deg = Array(n).fill(0);
    edges.forEach(({u,v})=>{deg[u]++;deg[v]++;});

    const svg = container.querySelector('#eulerSvg');
    svg.innerHTML = '';
    const W = svg.clientWidth||700, H=360;
    const d3svg = d3.select(svg).attr('viewBox',`0 0 ${W} ${H}`);

    const nodes = Array.from({length:n},(_,i)=>({id:i}));
    const links = edges.map(({u,v})=>({source:u,target:v}));

    if(this._simulation) this._simulation.stop();

    const link = d3svg.append('g').selectAll('line').data(links).enter().append('line')
      .attr('stroke','var(--border-color)').attr('stroke-width',2).attr('opacity',0.6);

    const nodeG = d3svg.append('g').selectAll('g').data(nodes).enter().append('g')
      .call(d3.drag()
        .on('start',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;})
        .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;})
        .on('end',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0);d.fx=null;d.fy=null;}));

    const nodeColor = i => {
      const d = deg[i];
      if (d >= n/2) return '#a855f7';  // Dirac condition
      if (d%2===0) return 'var(--success)';  // Even (Euler)
      return 'var(--error)';  // Odd
    };

    nodeG.append('circle').attr('r',18).attr('fill',d=>nodeColor(d.id)).attr('stroke','white').attr('stroke-width',2.5);
    nodeG.append('text').text(d=>`${d.id}(${deg[d.id]})`).attr('text-anchor','middle').attr('dy','0.35em')
      .attr('fill','white').attr('font-weight','bold').attr('font-size',10);
    nodeG.append('title').text(d=>`Vertex ${d.id}: degree ${deg[d.id]} (${deg[d.id]%2===0?'even':'odd'})`);

    this._simulation = d3.forceSimulation(nodes)
      .force('link',d3.forceLink(links).id(d=>d.id).distance(80))
      .force('charge',d3.forceManyBody().strength(-220))
      .force('center',d3.forceCenter(W/2,H/2))
      .on('tick',()=>{
        link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        nodeG.attr('transform',d=>`translate(${d.x},${d.y})`);
      });
  }
};

export default c5_euler_hamilton;
