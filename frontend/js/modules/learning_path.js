// ============================================================================
// Module: Learning Path Interactive Graph
// ============================================================================

const learning_path = {
  _simulation: null,

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initGraph(container);
    this._loadProgress(container);
  },
  unmount() {
    if (this._simulation) { this._simulation.stop(); this._simulation = null; }
  },

  _nodes() {
    return [
      { id:'a1', label:'A1\nSimple', group:'core', tier:1, desc:'Simple Pigeonhole Principle: n>k → collision', url:'#/module/a1_simple' },
      { id:'a2', label:'A2\nGeneral', group:'core', tier:1, desc:'Generalized: ⌈n/k⌉ guarantee', url:'#/module/a2_generalized' },
      { id:'a4', label:'A3\nSocks', group:'core', tier:1, desc:'Minimum draws k(r−1)+1', url:'#/module/a4_socks_draws' },
      { id:'a5', label:'A4\nStrong', group:'core', tier:2, desc:'Strong/Weighted Pigeonhole', url:'#/module/a5_strong_weighted' },
      { id:'a7', label:'A5\nInfinite', group:'core', tier:3, desc:'Infinite Pigeonhole Principle', url:'#/module/a7_infinite' },
      { id:'b10', label:'B1\nTable', group:'dsa', tier:1, desc:'The Pigeonhole Table DSA Demo', url:'#/module/b10_core_table' },
      { id:'b5', label:'B2\nHashing', group:'dsa', tier:1, desc:'Hash collisions & load factors', url:'#/module/b5_hashing' },
      { id:'b3', label:'B3\nDivisible', group:'number', tier:1, desc:'Prefix sum residues mod n', url:'#/module/b3_divisible' },
      { id:'b4', label:'B4\nBirthday', group:'number', tier:1, desc:'Birthday Paradox exact/approx', url:'#/module/b4_birthday' },
      { id:'b7', label:'B5\nHandshake', group:'graph', tier:2, desc:'Handshake Lemma & Equal Degrees', url:'#/module/b7_handshake' },
      { id:'c1', label:'C1\nHavel-H', group:'graph', tier:2, desc:'Havel-Hakimi Graphic Sequences', url:'#/module/c1_havel_hakimi' },
      { id:'c5', label:'C2\nEuler', group:'graph', tier:3, desc:'Eulerian Paths & Hamiltonian Cycles', url:'#/module/c5_euler_hamilton' },
      { id:'r1', label:'D1\nReal World', group:'app', tier:1, desc:'11 Real-World Case Files', url:'#/module/r1_real_world' },
    ];
  },

  _links() {
    return [
      ['a1','a2'],['a2','a4'],['a2','a5'],['a5','a7'],
      ['a2','b3'],['a2','b4'],['a2','b5'],['b5','b10'],
      ['a2','b7'],['b7','c1'],['c1','c5'],
      ['a1','r1'],['b4','r1'],['b5','r1'],
    ];
  },

  _html() {
    const groupColors = { core:'#6366f1', number:'#22c55e', dsa:'#f59e0b', seq:'#06b6d4', graph:'#a855f7', geo:'#f97316', app:'#ef4444' };
    const groupLabels = { core:'Core Forms', number:'Number Theory', dsa:'DSA Applications', seq:'Sequences', graph:'Graph Theory', geo:'Geometry', app:'Applications' };

    return `
<div class="module-container">
  <div class="module-header">
    <h1 class="module-title">🗺️ Learning Path</h1>
    <p class="module-subtitle">Navigate the concept dependency graph. Click any node to visit its module. Track your progress as you complete each topic.</p>
  </div>

  <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-3)">
    ${Object.entries(groupLabels).map(([k,v])=>`
      <div style="display:flex;align-items:center;gap:var(--space-1)">
        <div style="width:12px;height:12px;background:${groupColors[k]};border-radius:3px"></div>
        <span style="font-size:0.85rem">${v}</span>
      </div>`).join('')}
  </div>

  <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-3);flex-wrap:wrap">
    <button class="btn btn-secondary" id="resetProgressBtn">🗑 Reset Progress</button>
    <span id="progressSummary" style="align-self:center;font-size:0.9rem;color:var(--text-muted)"></span>
  </div>

  <div class="card" style="padding:0;overflow:hidden">
    <svg id="pathSvg" style="width:100%;height:550px;display:block;cursor:grab"></svg>
  </div>

  <div class="card" style="margin-top:var(--space-4)" id="selectedNodeCard" style="display:none">
    <div class="card-header"><h3 id="selectedNodeTitle">Select a node</h3></div>
    <div class="card-body" id="selectedNodeBody"></div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Historical Timeline</h3></div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:auto 1fr;gap:var(--space-2) var(--space-4);align-items:start">
        <div class="badge-tag" style="background:var(--primary-muted)">1834</div><div><strong>Dirichlet</strong> publishes <em>Schubfachprinzip</em> (Drawer Principle), first formal statement of the Pigeonhole Principle.</div>
        <div class="badge-tag" style="background:var(--primary-muted)">1900</div><div><strong>Mantel</strong> proves the triangle-free edge count bound $\\lfloor n^2/4 \\rfloor$.</div>
        <div class="badge-tag" style="background:var(--primary-muted)">1930</div><div><strong>Ramsey</strong> establishes Ramsey theory, proving $R(3,3)=6$ — the party problem.</div>
        <div class="badge-tag" style="background:var(--primary-muted)">1935</div><div><strong>Klein, Erdős, Szekeres</strong>: Happy Ending Problem and Erdős-Szekeres monotone subsequence theorem.</div>
        <div class="badge-tag" style="background:var(--primary-muted)">1935</div><div><strong>Hall</strong> proves the Marriage Theorem characterizing bipartite matchings.</div>
        <div class="badge-tag" style="background:var(--primary-muted)">1952</div><div><strong>Dirac</strong> proves the degree condition for Hamiltonian cycles.</div>
        <div class="badge-tag" style="background:var(--primary-muted)">1955</div><div><strong>Havel</strong> (and later <strong>Hakimi</strong> in 1962) gives the graphical sequence criterion.</div>
      </div>
    </div>
  </div>
</div>`;
  },

  _loadProgress(container) {
    const nodes = this._nodes();
    const progress = JSON.parse(localStorage.getItem('phl_progress') || '{}');
    const done = nodes.filter(n => progress[n.id]).length;
    const pct = Math.round(done/nodes.length*100);
    const el = container.querySelector('#progressSummary');
    if (el) el.textContent = `${done}/${nodes.length} modules completed (${pct}%)`;
  },

  _saveProgress(id) {
    const progress = JSON.parse(localStorage.getItem('phl_progress') || '{}');
    progress[id] = true;
    localStorage.setItem('phl_progress', JSON.stringify(progress));
  },

  _initGraph(container) {
    const nodes = this._nodes();
    const linkDefs = this._links();
    const groupColors = { core:'#6366f1', number:'#22c55e', dsa:'#f59e0b', seq:'#06b6d4', graph:'#a855f7', geo:'#f97316', app:'#ef4444' };

    const svg = d3.select(container.querySelector('#pathSvg'));
    const W = 900, H = 550;
    svg.attr('viewBox', `0 0 ${W} ${H}`);

    const progress = JSON.parse(localStorage.getItem('phl_progress') || '{}');

    const nodeData = nodes.map(n => ({...n}));
    const linkData = linkDefs.map(([s,t]) => ({
      source: nodeData.find(n=>n.id===s),
      target: nodeData.find(n=>n.id===t)
    })).filter(l=>l.source&&l.target);

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id','arrowPath').attr('viewBox','0 -5 10 10').attr('refX',28).attr('refY',0)
      .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
      .append('path').attr('d','M0,-5L10,0L0,5').attr('fill','var(--border-color)');

    const g = svg.append('g');

    svg.call(d3.zoom().scaleExtent([0.4,2.5]).on('zoom', e => g.attr('transform', e.transform)));

    const link = g.append('g').selectAll('line').data(linkData).enter().append('line')
      .attr('stroke','var(--border-color)').attr('stroke-width',1.5).attr('opacity',0.5)
      .attr('marker-end','url(#arrowPath)');

    const node = g.append('g').selectAll('g').data(nodeData).enter().append('g')
      .attr('cursor','pointer')
      .call(d3.drag()
        .on('start',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;})
        .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;})
        .on('end',(e,d)=>{if(!e.active)this._simulation.alphaTarget(0);d.fx=null;d.fy=null;}));

    node.append('circle').attr('r',26)
      .attr('fill',d=>groupColors[d.group])
      .attr('stroke',d=>progress[d.id]?'#22c55e':'white')
      .attr('stroke-width',d=>progress[d.id]?3:2).attr('opacity',0.9);

    node.append('text').selectAll('tspan').data(d=>d.label.split('\n')).enter().append('tspan')
      .attr('x',0).attr('dy',(_,i,arr)=>i===0?`-${(arr.length-1)*0.4}em`:'1.1em').attr('text-anchor','middle')
      .text(t=>t).attr('fill','white').attr('font-size',9).attr('font-weight','bold');

    // Completed checkmark
    node.filter(d=>progress[d.id]).append('text').text('✓').attr('x',18).attr('y',-18)
      .attr('fill','#22c55e').attr('font-size',14).attr('font-weight','bold');

    // Click to navigate
    node.on('click', (e, d) => {
      e.stopPropagation();
      const card = container.querySelector('#selectedNodeCard');
      card.style.display = '';
      container.querySelector('#selectedNodeTitle').textContent = d.desc;
      container.querySelector('#selectedNodeBody').innerHTML = `
        <p><strong>Module:</strong> ${d.id.toUpperCase()} | <strong>Group:</strong> ${d.group} | <strong>Tier:</strong> ${d.tier}</p>
        <p>${d.desc}</p>
        <div style="display:flex;gap:var(--space-2)">
          <a href="${d.url}" class="btn btn-primary">🚀 Open Module</a>
          <button class="btn btn-secondary" id="markDone">✅ Mark Complete</button>
        </div>`;
      container.querySelector('#markDone').addEventListener('click', () => {
        this._saveProgress(d.id);
        this._initGraph(container);
        this._loadProgress(container);
      });
      card.scrollIntoView({behavior:'smooth',block:'nearest'});
    });

    if (this._simulation) this._simulation.stop();
    this._simulation = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d=>d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(W/2, H/2))
      .force('collision', d3.forceCollide(35))
      .on('tick', () => {
        link.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
        node.attr('transform',d=>`translate(${d.x},${d.y})`);
      });

    container.querySelector('#resetProgressBtn').addEventListener('click', () => {
      localStorage.removeItem('phl_progress');
      this._initGraph(container);
      this._loadProgress(container);
    });
  }
};

export default learning_path;
