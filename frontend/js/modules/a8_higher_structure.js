// ============================================================================
// Module A8: Pigeonhole in Higher Structure
// ============================================================================

const a8_higher_structure = {
  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initInteractive(container);
  },
  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier3">Tier 3</span>
    <h1 class="module-title">A8. Pigeonhole in Higher Structure</h1>
    <p class="module-subtitle">Double counting, parity, and structural coloring arguments powered by the Pigeonhole Principle.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Structural Power:</strong> The Pigeonhole Principle extends beyond simple counting — it underlies parity arguments, sum invariants, and combinatorial identities through "double counting" (counting the same thing two ways to derive a constraint).
  </div>

  <!-- Card 1: Parity Argument -->
  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header"><h3>🔢 Gallery Card 1: Parity — Sum of n+1 Integers</h3></div>
    <div class="card-body">
      <div class="callout callout-idea">From any $n+1$ integers chosen from $\\{1, 2, \\ldots, 2n\\}$, two must sum to $2n+1$.</div>
      <div class="control-group">
        <label>n: <strong id="parN">5</strong></label>
        <input type="range" id="parSlider" min="2" max="10" value="5" class="slider">
      </div>
      <div id="parityViz" style="margin-top:var(--space-3)"></div>
      <button class="btn btn-primary" id="parPickBtn" style="margin-top:var(--space-2)">Pick n+1 Random Integers</button>
      <div id="parityResult" style="margin-top:var(--space-2)"></div>
      <div class="proof-box" style="margin-top:var(--space-3)">
        <div class="proof-title">Proof</div>
        <div class="proof-body">Pair the integers $\\{1, 2n\\}, \\{2, 2n-1\\}, \\ldots, \\{n, n+1\\}$ — exactly $n$ pairs, each summing to $2n+1$. Choosing $n+1$ integers from $2n$ numbers must hit both elements of at least one pair (Pigeonhole: $n+1$ items into $n$ pairs). $\\square$</div>
      </div>
    </div>
  </div>

  <!-- Card 2: 5 Points in Square Teaser -->
  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header"><h3>📐 Gallery Card 2: 5 Points in Unit Square</h3></div>
    <div class="card-body">
      <div class="callout callout-idea">Among any 5 points in a unit square, two are within distance $\\sqrt{2}/2 \\approx 0.707$ of each other.</div>
      <div id="squareViz" style="margin-top:var(--space-2)"></div>
      <button class="btn btn-primary" id="squareBtn">Place 5 Random Points</button>
      <div id="squareResult" style="margin-top:var(--space-2)"></div>
      <div class="proof-box" style="margin-top:var(--space-3)">
        <div class="proof-title">Proof</div>
        <div class="proof-body">Divide the unit square into 4 quadrants (the 4 "boxes"). 5 points must have 2 in the same quadrant (Pigeonhole). The maximum distance within a quadrant of side $\\frac{1}{2}$ is its diagonal $= \\sqrt{(1/2)^2+(1/2)^2} = \\frac{\\sqrt{2}}{2}$. $\\square$</div>
      </div>
    </div>
  </div>

  <!-- Card 3: Coprime subset -->
  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header"><h3>🔗 Gallery Card 3: Coprime Pairs in {1..2n}</h3></div>
    <div class="card-body">
      <div class="callout callout-idea">Among any $n+1$ integers chosen from $\\{1, 2, \\ldots, 2n\\}$, at least two are coprime (share no common factor $> 1$).</div>
      <div class="control-group">
        <label>n: <strong id="coprN">6</strong></label>
        <input type="range" id="coprSlider" min="2" max="10" value="6" class="slider">
      </div>
      <button class="btn btn-primary" id="coprBtn" style="margin-top:var(--space-2)">Find Coprime Pair</button>
      <div id="coprResult" style="margin-top:var(--space-2)"></div>
      <div class="proof-box" style="margin-top:var(--space-3)">
        <div class="proof-title">Proof</div>
        <div class="proof-body">Group $\\{1..2n\\}$ into $n$ pairs $\\{1,2\\},\\{3,4\\},\\ldots,\\{2n-1,2n\\}$ of consecutive integers. Each pair contains consecutive integers, which are always coprime. Choosing $n+1$ integers must hit two from one pair — those two are coprime. $\\square$</div>
      </div>
    </div>
  </div>

  <!-- Card 4: Double Counting -->
  <div class="card">
    <div class="card-header"><h3>✖️×2 Gallery Card 4: Double Counting — Handshake Identity</h3></div>
    <div class="card-body">
      <div class="callout callout-idea">The number of (vertex, edge) incidence pairs in a graph equals both $\\sum \\deg(v)$ (from vertices) and $2|E|$ (from edges). Equating these gives the Handshaking Lemma.</div>
      <div id="doubleCountViz"></div>
      <div class="proof-box" style="margin-top:var(--space-3)">
        <div class="proof-title">Double Counting Argument</div>
        <div class="proof-body">
          <p>Count pairs $(v, e)$ where vertex $v$ is an endpoint of edge $e$.</p>
          <ul>
            <li><strong>Count by vertex:</strong> Each $v$ contributes $\\deg(v)$ pairs → total = $\\sum_v \\deg(v)$</li>
            <li><strong>Count by edge:</strong> Each edge $e$ contributes 2 pairs → total = $2|E|$</li>
          </ul>
          <p>Therefore $\\displaystyle \\sum_v \\deg(v) = 2|E|$. This implies the sum of degrees is always even, so the number of odd-degree vertices is always even. $\\square$</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _initInteractive(container) {
    // Parity Card
    const parSlider = container.querySelector('#parSlider');
    const parN = container.querySelector('#parN');
    parSlider.addEventListener('input', () => { parN.textContent = parSlider.value; this._renderParityPairs(container); });
    container.querySelector('#parPickBtn').addEventListener('click', () => this._parPickRandom(container));
    this._renderParityPairs(container);

    // Square Card
    container.querySelector('#squareBtn').addEventListener('click', () => this._renderSquare(container));
    this._renderSquare(container);

    // Coprime Card
    const coprSlider = container.querySelector('#coprSlider');
    container.querySelector('#coprN').textContent = coprSlider.value;
    coprSlider.addEventListener('input', () => { container.querySelector('#coprN').textContent = coprSlider.value; });
    container.querySelector('#coprBtn').addEventListener('click', () => this._findCoprime(container));

    // Double Counting
    this._renderDoubleCount(container);
  },

  _renderParityPairs(container) {
    const n = parseInt(container.querySelector('#parSlider').value);
    const viz = container.querySelector('#parityViz');
    viz.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:4px">
      ${Array.from({length:n}, (_,i) => `
        <div style="display:flex;gap:2px">
          <div class="badge-tag" style="background:var(--primary-muted)">${i+1}</div>
          <div class="badge-tag" style="background:var(--secondary-muted)">${2*n-i}</div>
        </div>`).join('')}
    </div>
    <div style="margin-top:var(--space-1);color:var(--text-muted);font-size:0.85rem">${n} complementary pairs from \\{1..${2*n}\\}, each summing to ${2*n+1}</div>`;
  },

  _parPickRandom(container) {
    const n = parseInt(container.querySelector('#parSlider').value);
    const pool = Array.from({length:2*n},(_,i)=>i+1);
    const chosen = pool.sort(()=>Math.random()-0.5).slice(0,n+1).sort((a,b)=>a-b);
    // Find pair summing to 2n+1
    const pairs = [];
    for (let i=0;i<chosen.length;i++) for(let j=i+1;j<chosen.length;j++) {
      if (chosen[i]+chosen[j]===2*n+1) pairs.push([chosen[i],chosen[j]]);
    }
    const resultEl = container.querySelector('#parityResult');
    resultEl.innerHTML = `<div class="callout callout-success">
      Chosen: [${chosen.join(', ')}]<br>
      Pair(s) summing to ${2*n+1}: <strong>${pairs.map(p=>p.join('+')+'='+2*n+1).join(', ')}</strong>
    </div>`;
  },

  _renderSquare(container) {
    const pts = Array.from({length:5}, () => [Math.random(), Math.random()]);
    const W = 280, H = 280;
    const svg = container.querySelector('#squareViz');
    svg.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:${W}px;height:${H}px;border:2px solid var(--border-color);border-radius:var(--radius-sm);background:var(--surface-alt);display:block;margin:0 auto">
      ${['#6366f1','#22c55e','#f59e0b','#ef4444'].map((c,i) => {
        const x=i%2, y=Math.floor(i/2);
        return `<rect x="${x*W/2}" y="${y*H/2}" width="${W/2}" height="${H/2}" fill="${c}" opacity="0.1" stroke="${c}" stroke-width="1"/>`;
      }).join('')}
      ${pts.map(([px,py]) => `<circle cx="${px*W}" cy="${py*H}" r="8" fill="var(--primary)" stroke="white" stroke-width="2"/>`).join('')}
    </svg>`;
    // Find closest pair
    let minDist=Infinity, closest=[0,1];
    for(let i=0;i<5;i++) for(let j=i+1;j<5;j++) {
      const d=Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1]);
      if(d<minDist){minDist=d;closest=[i,j];}
    }
    const threshold = Math.sqrt(2)/2;
    container.querySelector('#squareResult').innerHTML = `<div class="callout callout-${minDist<threshold?'success':'warning'}">
      Closest pair: points ${closest[0]+1} &amp; ${closest[1]+1}, distance = <strong>${minDist.toFixed(4)}</strong>
      ${minDist < threshold ? ` ≤ √2/2 ≈ 0.707 ✅ Pigeonhole confirmed!` : ` > 0.707 (try again — rare case near boundary)`}
    </div>`;
  },

  _findCoprime(container) {
    const n = parseInt(container.querySelector('#coprSlider').value);
    const pool = Array.from({length:2*n},(_,i)=>i+1);
    const chosen = pool.sort(()=>Math.random()-0.5).slice(0,n+1).sort((a,b)=>a-b);
    const gcd = (a,b) => b===0?a:gcd(b,a%b);
    let found = null;
    for(let i=0;i<chosen.length&&!found;i++) for(let j=i+1;j<chosen.length&&!found;j++) {
      if(gcd(chosen[i],chosen[j])===1) found=[chosen[i],chosen[j]];
    }
    container.querySelector('#coprResult').innerHTML = `<div class="callout callout-success">
      Chosen: [${chosen.join(', ')}]<br>
      Coprime pair: <strong>${found ? found.join(' and ') : 'checking...'}</strong> (gcd = 1) ✅
    </div>`;
  },

  _renderDoubleCount(container) {
    const el = container.querySelector('#doubleCountViz');
    el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-top:var(--space-2)">
      <div style="background:var(--surface-alt);border-radius:var(--radius-md);padding:var(--space-3)">
        <strong>Count by Vertex:</strong>
        <ul style="margin:var(--space-2) 0;font-family:monospace;font-size:0.9rem">
          <li>$v_1$: deg = 2 → 2 pairs</li>
          <li>$v_2$: deg = 3 → 3 pairs</li>
          <li>$v_3$: deg = 1 → 1 pair</li>
        </ul>
        <div>Total = <strong>6 pairs</strong></div>
      </div>
      <div style="background:var(--surface-alt);border-radius:var(--radius-md);padding:var(--space-3)">
        <strong>Count by Edge:</strong>
        <ul style="margin:var(--space-2) 0;font-family:monospace;font-size:0.9rem">
          <li>$e_1$: 2 endpoints → 2 pairs</li>
          <li>$e_2$: 2 endpoints → 2 pairs</li>
          <li>$e_3$: 2 endpoints → 2 pairs</li>
        </ul>
        <div>Total = 3 × 2 = <strong>6 pairs</strong></div>
      </div>
    </div>
    <div class="callout callout-success" style="margin-top:var(--space-2)">∑deg(v) = 2+3+1 = 6 = 2×3 = 2|E| ✅</div>`;
  }
};

export default a8_higher_structure;
