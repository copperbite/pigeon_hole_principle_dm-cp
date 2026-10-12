// ============================================================================
// Module C2: Hall's Marriage Theorem
// ============================================================================

const c2_hall_marriage = {
  _simulation: null,

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container, fetch, isOnline);
    this._runDefault(container, fetch, isOnline);
  },

  unmount() {
    if (this._simulation) { this._simulation.stop(); this._simulation = null; }
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">C2. Hall's Marriage Theorem</h1>
    <p class="module-subtitle">When does a bipartite graph have a perfect matching? Hall's condition gives a precise answer via Kuhn's augmenting path algorithm.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Connection:</strong> Hall's condition is itself a pigeonhole argument: every subset $S$ of "boys" must have enough "girls" available ($|N(S)| \\ge |S|$). A violation means $|S|$ boys are competing for $< |S|$ girls — classic pigeonhole failure.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Bipartite Graph Builder</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Left vertices (|X|): <strong id="leftVal">4</strong></label>
          <input type="range" id="leftSlider" min="2" max="7" value="4" class="slider">
        </div>
        <div class="control-group">
          <label>Right vertices (|Y|): <strong id="rightVal">4</strong></label>
          <input type="range" id="rightSlider" min="2" max="7" value="4" class="slider">
        </div>
        <div class="control-group">
          <label>Edge density: <strong id="densityVal">0.60</strong></label>
          <input type="range" id="densitySlider" min="10" max="100" value="60" class="slider">
        </div>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <button class="btn btn-primary" id="generateBtn">🔄 Generate Random</button>
          <button class="btn btn-secondary" id="perfectBtn">Perfect Match Example</button>
          <button class="btn btn-secondary" id="violatorBtn">Hall Violator Example</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Matching Result</h3></div>
      <div class="card-body" id="matchResult">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Bipartite Graph Visualization</h3>
      <small style="color:var(--text-muted)">Green edges = matching | Red = Hall violator subset</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="bipartiteSvg" style="width:100%;height:380px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Hall's Condition Checker</h3></div>
    <div class="card-body" id="hallChecker"></div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Hall's Marriage Theorem</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Theorem (Hall, 1935)</div>
        <div class="proof-body">
          <p>A bipartite graph $G = (X \\cup Y, E)$ has a matching that saturates all of $X$ if and only if for every $S \\subseteq X$: $|N(S)| \\ge |S|$, where $N(S)$ is the neighborhood of $S$ in $Y$.</p>
          <p><strong>Algorithm (Kuhn's):</strong> For each unmatched $x \\in X$, try to find an augmenting path via DFS. If an augmenting path exists, flip its matched/unmatched edges. Repeat until no augmenting path is found.</p>
          <p><strong>Complexity:</strong> $O(|V| \\cdot |E|)$</p>
          <p><strong>Hall Violator:</strong> If no perfect matching exists, find $S \\subseteq X$ with $|N(S)| < |S|$ — this subset "proves" why the matching fails.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _graph: { left: 4, right: 4, edges: [] },

  _initControls(container, fetch, isOnline) {
    const leftSlider = container.querySelector('#leftSlider');
    const rightSlider = container.querySelector('#rightSlider');
    const densitySlider = container.querySelector('#densitySlider');

    leftSlider.addEventListener('input', e => container.querySelector('#leftVal').textContent = e.target.value);
    rightSlider.addEventListener('input', e => container.querySelector('#rightVal').textContent = e.target.value);
    densitySlider.addEventListener('input', e => container.querySelector('#densityVal').textContent = (e.target.value/100).toFixed(2));

    container.querySelector('#generateBtn').addEventListener('click', () => {
      const l = parseInt(leftSlider.value), r = parseInt(rightSlider.value), d = densitySlider.value/100;
      this._graph = this._generateRandom(l, r, d);
      this._process(container);
    });
    container.querySelector('#perfectBtn').addEventListener('click', () => {
      this._graph = { left:4, right:4, edges:[[0,0],[0,1],[1,1],[1,2],[2,2],[3,3],[3,2]] };
      this._process(container);
    });
    container.querySelector('#violatorBtn').addEventListener('click', () => {
      this._graph = { left:4, right:4, edges:[[0,0],[1,0],[2,0],[3,1]] };
      this._process(container);
    });
  },

  _generateRandom(l, r, density) {
    const edges = [];
    for (let i=0;i<l;i++) for(let j=0;j<r;j++) if(Math.random()<density) edges.push([i,j]);
    // Ensure each left vertex has at least one edge
    for (let i=0;i<l;i++) {
      if (!edges.some(e=>e[0]===i)) edges.push([i, Math.floor(Math.random()*r)]);
    }
    return { left:l, right:r, edges };
  },

  _runDefault(container, fetch, isOnline) {
    this._graph = { left:4, right:4, edges:[[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3]] };
    this._process(container);
  },

  _process(container) {
    const { left, right, edges } = this._graph;
    const { matching, size } = this._kuhn(left, right, edges);
    const isPerfect = size === left;
    const hallViolator = isPerfect ? null : this._findHallViolator(left, right, edges);

    // Render result
    const resultEl = container.querySelector('#matchResult');
    resultEl.innerHTML = `
      <div class="verdict-display ${isPerfect ? 'verdict-pass' : 'verdict-fail'}">
        <div style="font-size:2rem">${isPerfect ? '✅' : '❌'}</div>
        <div style="font-weight:700">${isPerfect ? 'PERFECT MATCHING EXISTS' : 'NO PERFECT MATCHING'}</div>
        <div style="color:var(--text-muted)">Matched: ${size} / ${left} left vertices</div>
      </div>
      ${hallViolator ? `<div class="callout callout-warning" style="margin-top:var(--space-2)">
        Hall Violator: $S = \\{${hallViolator.S.map(i=>`x_${i}`).join(',')}\\}$, $|N(S)| = ${hallViolator.NS} < |S| = ${hallViolator.S.length}$
      </div>` : ''}`;

    // Render graph
    this._renderBipartite(container, left, right, edges, matching, hallViolator);

    // Hall's condition table
    this._renderHallChecker(container, left, right, edges);
  },

  _kuhn(left, right, edges) {
    const adj = Array.from({length:left}, () => []);
    edges.forEach(([l,r]) => adj[l].push(r));

    const matchL = Array(left).fill(-1);
    const matchR = Array(right).fill(-1);

    const dfs = (v, visited) => {
      for (const u of adj[v]) {
        if (!visited[u]) {
          visited[u] = true;
          if (matchR[u] === -1 || dfs(matchR[u], visited)) {
            matchL[v] = u; matchR[u] = v;
            return true;
          }
        }
      }
      return false;
    };

    let size = 0;
    for (let v=0; v<left; v++) {
      const visited = Array(right).fill(false);
      if (dfs(v, visited)) size++;
    }

    return { matching: matchL, size };
  },

  _findHallViolator(left, right, edges) {
    const adj = Array.from({length:left}, () => new Set());
    edges.forEach(([l,r]) => adj[l].add(r));

    // Try all non-empty subsets
    for (let mask=1; mask<(1<<left); mask++) {
      const S = [];
      for (let i=0;i<left;i++) if((mask>>i)&1) S.push(i);
      const NS = new Set();
      S.forEach(i => adj[i].forEach(j => NS.add(j)));
      if (NS.size < S.length) return { S, NS: NS.size };
    }
    return null;
  },

  _renderBipartite(container, left, right, edges, matching, hallViolator) {
    const svg = container.querySelector('#bipartiteSvg');
    svg.innerHTML = '';
    const W = svg.clientWidth || 700, H = 380;
    const d3svg = d3.select(svg).attr('viewBox', `0 0 ${W} ${H}`);

    const leftX = W * 0.25, rightX = W * 0.75;
    const lSpacing = H / (left + 1), rSpacing = H / (right + 1);
    const lPos = Array.from({length:left}, (_,i) => [leftX, (i+1)*lSpacing]);
    const rPos = Array.from({length:right}, (_,i) => [rightX, (i+1)*rSpacing]);

    const violatorLeft = hallViolator ? new Set(hallViolator.S) : new Set();

    // Draw edges
    edges.forEach(([l,r]) => {
      const isMatched = matching[l] === r;
      d3svg.append('line')
        .attr('x1', lPos[l][0]).attr('y1', lPos[l][1])
        .attr('x2', rPos[r][0]).attr('y2', rPos[r][1])
        .attr('stroke', isMatched ? 'var(--success)' : 'var(--border-color)')
        .attr('stroke-width', isMatched ? 3 : 1.2)
        .attr('opacity', isMatched ? 1 : 0.5);
    });

    // Left nodes
    lPos.forEach(([x,y], i) => {
      const isViolator = violatorLeft.has(i);
      const isMatched = matching[i] !== -1;
      d3svg.append('circle').attr('cx',x).attr('cy',y).attr('r',18)
        .attr('fill', isViolator ? 'var(--error)' : isMatched ? 'var(--success)' : 'var(--primary)')
        .attr('stroke','white').attr('stroke-width',2);
      d3svg.append('text').attr('x',x).attr('y',y).attr('dy','0.35em').attr('text-anchor','middle')
        .text(`x${i}`).attr('fill','white').attr('font-size',12).attr('font-weight','bold');
    });

    // Right nodes
    rPos.forEach(([x,y], j) => {
      const isMatched = edges.some(([l,r]) => r===j && matching[l]===j);
      d3svg.append('circle').attr('cx',x).attr('cy',y).attr('r',18)
        .attr('fill', isMatched ? 'var(--success)' : 'var(--secondary)').attr('stroke','white').attr('stroke-width',2);
      d3svg.append('text').attr('x',x).attr('y',y).attr('dy','0.35em').attr('text-anchor','middle')
        .text(`y${j}`).attr('fill','white').attr('font-size',12).attr('font-weight','bold');
    });

    // Labels
    d3svg.append('text').attr('x',leftX).attr('y',20).attr('text-anchor','middle')
      .text('Left (X)').attr('fill','var(--text-muted)').attr('font-size',13);
    d3svg.append('text').attr('x',rightX).attr('y',20).attr('text-anchor','middle')
      .text('Right (Y)').attr('fill','var(--text-muted)').attr('font-size',13);
  },

  _renderHallChecker(container, left, right, edges) {
    const adj = Array.from({length:left}, () => new Set());
    edges.forEach(([l,r]) => adj[l].add(r));

    const el = container.querySelector('#hallChecker');
    const rows = [];
    // Only check subsets up to size 4
    for (let mask=1; mask<Math.min(1<<left, 16); mask++) {
      const S = [];
      for (let i=0;i<left;i++) if((mask>>i)&1) S.push(i);
      const NS = new Set();
      S.forEach(i => adj[i].forEach(j => NS.add(j)));
      const holds = NS.size >= S.length;
      rows.push(`<tr>
        <td>{${S.map(i=>`x${i}`).join(',')}}</td>
        <td>${S.length}</td>
        <td>{${[...NS].map(j=>`y${j}`).join(',')}}</td>
        <td>${NS.size}</td>
        <td style="color:${holds?'var(--success)':'var(--error)'}">${holds?'✅ Holds':'❌ VIOLATED'}</td>
      </tr>`);
    }

    el.innerHTML = `<div style="overflow-x:auto"><table class="data-table">
      <thead><tr><th>Subset S⊆X</th><th>|S|</th><th>N(S)⊆Y</th><th>|N(S)|</th><th>Hall's Condition</th></tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table></div>${left > 4 ? '<p style="color:var(--text-muted);font-size:0.85rem">Showing first 15 subsets (n>4)</p>' : ''}`;
  }
};

export default c2_hall_marriage;
