// ============================================================================
// Module G1: 5 Points in a Unit Square
// ============================================================================

const g1_points_square = {
  _dragState: null,
  _points: [],

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initCanvas(container, fetch, isOnline);
    this._randomize(container, fetch, isOnline);
  },

  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">G1. Five Points in a Unit Square</h1>
    <p class="module-subtitle">Any 5 points placed in a unit square must include two points within distance $\\sqrt{2}/2 \\approx 0.7071$ of each other.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Proof:</strong> Divide the unit square into 4 quadrants (the "boxes"). By the Pigeonhole Principle, placing 5 points into 4 boxes guarantees that at least 2 points land in the same quadrant. The diameter (maximum distance) of each quadrant is $\\sqrt{(1/2)^2+(1/2)^2} = \\frac{\\sqrt{2}}{2}$.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Interactive Canvas</h3>
        <small style="color:var(--text-muted)">Click to add | Drag to move | Right-click to remove</small>
      </div>
      <div class="card-body" style="padding:var(--space-2)">
        <canvas id="squareCanvas" width="380" height="380" style="border:2px solid var(--border-color);border-radius:var(--radius-md);cursor:crosshair;display:block;margin:0 auto;background:var(--surface-alt);touch-action:none"></canvas>
        <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);flex-wrap:wrap">
          <button class="btn btn-primary" id="randomBtn">🎲 5 Random Points</button>
          <button class="btn btn-secondary" id="clearBtn">🗑 Clear</button>
          <button class="btn btn-secondary" id="worstBtn">Near-Worst Case</button>
          <label style="display:flex;align-items:center;gap:var(--space-1)">
            <input type="checkbox" id="showQuadrants" checked> Show Quadrants
          </label>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Analysis</h3></div>
      <div class="card-body" id="analysisBox">
        <p style="color:var(--text-muted)">Place 5 points to see analysis.</p>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>All Pairwise Distances</h3></div>
    <div class="card-body" id="distanceTable"></div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Mathematical Proof</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Theorem: 5 Points in Unit Square</div>
        <div class="proof-body">
          <p><strong>Theorem:</strong> Given any 5 points in a unit square $[0,1]^2$, at least two of them are at distance $\\le \\frac{\\sqrt{2}}{2}$.</p>
          <p><strong>Proof:</strong></p>
          <ol>
            <li><strong>Divide:</strong> Split the unit square into 4 quadrants: $[0,\\tfrac{1}{2}]^2$, $[\\tfrac{1}{2},1]\\times[0,\\tfrac{1}{2}]$, $[0,\\tfrac{1}{2}]\\times[\\tfrac{1}{2},1]$, $[\\tfrac{1}{2},1]^2$.</li>
            <li><strong>Apply Pigeonhole:</strong> 5 points into 4 quadrants → at least 2 points share a quadrant.</li>
            <li><strong>Bound distance:</strong> The diameter of each $\\frac{1}{2} \\times \\frac{1}{2}$ quadrant is $\\sqrt{(\\frac{1}{2})^2 + (\\frac{1}{2})^2} = \\frac{\\sqrt{2}}{2} \\approx 0.7071$.</li>
          </ol>
          <p>Hence the two points in the same quadrant are at most $\\frac{\\sqrt{2}}{2}$ apart. $\\square$</p>
          <p><strong>Tightness:</strong> 4 points at the 4 corners are all at distance $\\ge \\frac{\\sqrt{2}}{2}$ from each other (corners are distance 1 or $\\sqrt{2}$ apart). A 5th point must enter some quadrant with a corner — distance $\\le \\frac{\\sqrt{2}}{2}$. The bound is tight.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _initCanvas(container, fetch, isOnline) {
    const canvas = container.querySelector('#squareCanvas');
    const ctx = canvas.getContext('2d');

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const findPoint = (pos) => {
      return this._points.findIndex(p => Math.hypot(p[0]-pos.x, p[1]-pos.y) < 20);
    };

    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const pos = getPos(e);
      if (e.button === 2) {
        const idx = findPoint(pos);
        if (idx !== -1) { this._points.splice(idx, 1); this._drawAll(container); return; }
      }
      const idx = findPoint(pos);
      if (idx !== -1) { this._dragState = idx; return; }
      if (this._points.length < 5) {
        this._points.push([pos.x, pos.y]);
        this._drawAll(container);
      }
    });
    canvas.addEventListener('mousemove', (e) => {
      if (this._dragState === null || this._dragState === undefined) return;
      const pos = getPos(e);
      this._points[this._dragState] = [pos.x, pos.y];
      this._drawAll(container);
    });
    canvas.addEventListener('mouseup', () => { this._dragState = null; });
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    container.querySelector('#randomBtn').addEventListener('click', () => this._randomize(container, fetch, isOnline));
    container.querySelector('#clearBtn').addEventListener('click', () => { this._points = []; this._drawAll(container); });
    container.querySelector('#worstBtn').addEventListener('click', () => {
      // Near-worst case: 4 corners + center
      const W = canvas.width;
      this._points = [[20,20],[W-20,20],[20,W-20],[W-20,W-20],[W/2,W/2]];
      this._drawAll(container);
    });
    container.querySelector('#showQuadrants').addEventListener('change', () => this._drawAll(container));
  },

  _randomize(container, fetch, isOnline) {
    const canvas = container.querySelector('#squareCanvas');
    const m = 30;
    this._points = Array.from({length:5}, () => [m+Math.random()*(canvas.width-2*m), m+Math.random()*(canvas.height-2*m)]);
    this._drawAll(container);
  },

  _drawAll(container) {
    const canvas = container.querySelector('#squareCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const showQ = container.querySelector('#showQuadrants').checked;
    const pts = this._points;
    const threshold = Math.sqrt(2)/2 * (W * 0.95);

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--surface-alt') || '#f8f8f8';
    ctx.fillRect(0,0,W,H);

    // Quadrants
    if (showQ) {
      const qColors = ['rgba(99,102,241,0.07)','rgba(34,197,94,0.07)','rgba(245,158,11,0.07)','rgba(239,68,68,0.07)'];
      [[0,0],[W/2,0],[0,H/2],[W/2,H/2]].forEach(([x,y],i) => {
        ctx.fillStyle = qColors[i];
        ctx.fillRect(x,y,W/2,H/2);
      });
      ctx.strokeStyle = 'rgba(99,102,241,0.4)';
      ctx.setLineDash([5,5]);
      ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Border
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth=2;
    ctx.strokeRect(1,1,W-2,H-2);

    // Find closest pair
    let minDist=Infinity, closestPair=[-1,-1];
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
      const d=Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1]);
      if(d<minDist){minDist=d;closestPair=[i,j];}
    }

    // Draw closest pair line
    if (closestPair[0]>=0 && pts.length>=2) {
      const [a,b]=closestPair;
      ctx.strokeStyle = minDist <= threshold ? '#22c55e' : '#f59e0b';
      ctx.lineWidth=2.5;
      ctx.setLineDash([6,3]);
      ctx.beginPath();
      ctx.moveTo(pts[a][0],pts[a][1]);
      ctx.lineTo(pts[b][0],pts[b][1]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw points
    const palette=['#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4'];
    pts.forEach((p,i) => {
      ctx.beginPath();
      ctx.arc(p[0],p[1],11,0,Math.PI*2);
      ctx.fillStyle=palette[i];
      ctx.fill();
      ctx.strokeStyle='white';
      ctx.lineWidth=2.5;
      ctx.stroke();
      ctx.fillStyle='white';
      ctx.font='bold 11px sans-serif';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(i+1,p[0],p[1]);
    });

    // Hint text
    if (pts.length < 5) {
      ctx.fillStyle='rgba(150,150,150,0.6)';
      ctx.font='14px sans-serif';
      ctx.textAlign='center';
      ctx.fillText(`Click to add point (${pts.length}/5)`, W/2, H-15);
    }

    // Update analysis
    this._analyze(container, pts, minDist, closestPair, W);
  },

  _analyze(container, pts, minDist, closestPair, W) {
    const threshold = Math.sqrt(2)/2 * (W * 0.95);
    const normThreshold = Math.sqrt(2)/2;
    const scale = W * 0.95;
    const normMinDist = minDist / scale;
    const analysisEl = container.querySelector('#analysisBox');

    if (pts.length < 2) {
      analysisEl.innerHTML = '<p style="color:var(--text-muted)">Add at least 2 points.</p>';
      container.querySelector('#distanceTable').innerHTML = '';
      return;
    }

    const n = pts.length;
    analysisEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2)">
        <div class="stat-box"><div class="stat-label">Points placed</div><div class="stat-value">${n}/5</div></div>
        <div class="stat-box"><div class="stat-label">√2/2 threshold</div><div class="stat-value">≈ 0.7071</div></div>
        <div class="stat-box"><div class="stat-label">Min distance</div><div class="stat-value" style="color:${normMinDist<=normThreshold?'var(--success)':'var(--warning)'}">${normMinDist.toFixed(4)}</div></div>
        <div class="stat-box"><div class="stat-label">Closest pair</div><div class="stat-value">${closestPair[0]>=0?`P${closestPair[0]+1}–P${closestPair[1]+1}`:'—'}</div></div>
      </div>
      ${n>=5?`<div class="callout callout-${normMinDist<=normThreshold?'success':'warning'}" style="margin-top:var(--space-2)">
        ${normMinDist<=normThreshold?'✅ Pigeonhole confirmed! Two points are within √2/2 of each other.':'⚠️ Distance > √2/2 — points may be on quadrant boundaries.'}
      </div>`:''}`;

    // Distance matrix
    const rows = [];
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) {
      const d = Math.hypot(pts[i][0]-pts[j][0],pts[i][1]-pts[j][1])/scale;
      const isClosest=i===closestPair[0]&&j===closestPair[1];
      rows.push(`<tr style="${isClosest?'background:var(--success-muted)':''}">
        <td>P${i+1} – P${j+1}</td>
        <td style="font-family:monospace">${d.toFixed(4)}</td>
        <td>${d<=normThreshold?'<span style="color:var(--success)">≤ √2/2 ✅</span>':'<span style="color:var(--text-muted)">≤ √2/2 ✗</span>'}</td>
        <td>${isClosest?'⭐ Minimum':''}</td>
      </tr>`);
    }
    container.querySelector('#distanceTable').innerHTML = rows.length ? `
      <table class="data-table"><thead><tr><th>Pair</th><th>Distance</th><th>≤ √2/2?</th><th></th></tr></thead>
      <tbody>${rows.join('')}</tbody></table>` : '';
  }
};

export default g1_points_square;
