// ============================================================================
// Module G2: Happy Ending Problem
// ============================================================================

const g2_happy_ending = {
  _points: [],

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initCanvas(container);
    this._randomize(container);
  },
  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier3">Tier 3</span>
    <h1 class="module-title">G2. The Happy Ending Problem</h1>
    <p class="module-subtitle">Any 5 points in general position in the plane contain the vertices of a convex quadrilateral.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Erdős-Szekeres Connection:</strong> This is the first result of Erdős and Szekeres (1935), proven by Esther Klein. It uses the Pigeonhole Principle: partition 5 points by their convex hull structure to guarantee a convex 4-subset.
  </div>

  <div class="callout callout-fun" style="margin-top:0">
    <strong>📖 History:</strong> Klein announced this result to Erdős and Szekeres in 1935 — and shortly after, Szekeres and Klein married, hence the "Happy Ending" nickname coined by Erdős.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Interactive Canvas</h3>
        <small style="color:var(--text-muted)">Click to place points | Drag to move | Right-click to remove</small>
      </div>
      <div class="card-body" style="padding:var(--space-2)">
        <canvas id="happyCanvas" width="380" height="380" style="border:2px solid var(--border-color);border-radius:var(--radius-md);cursor:crosshair;display:block;margin:0 auto;background:var(--surface-alt);touch-action:none"></canvas>
        <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);flex-wrap:wrap">
          <button class="btn btn-primary" id="random5">🎲 5 Random Points</button>
          <button class="btn btn-secondary" id="clearBtn">🗑 Clear</button>
          <button class="btn btn-secondary" id="collinearBtn">Near-Collinear (test)</button>
        </div>
        <div style="margin-top:var(--space-1);font-size:0.85rem;color:var(--text-muted)">
          <label><input type="checkbox" id="showHull" checked> Show convex hull</label>
          <label style="margin-left:var(--space-3)"><input type="checkbox" id="showQuad" checked> Show convex quadrilateral</label>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Analysis</h3></div>
      <div class="card-body" id="happyAnalysis">
        <p style="color:var(--text-muted)">Place 5 points to see the convex quadrilateral.</p>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Proof Sketch</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Happy Ending Theorem (Klein, 1935)</div>
        <div class="proof-body">
          <p><strong>Theorem:</strong> Any 5 points in the plane in general position (no 3 collinear) contain 4 that form a convex quadrilateral.</p>
          <p><strong>Proof (by cases):</strong> Let $P$ be a set of 5 points. Consider their convex hull $\text{Conv}(P)$:</p>
          <ul>
            <li><strong>Case 1:</strong> Hull has 5 vertices (all 5 form a convex polygon). Any 4 form a convex quadrilateral.</li>
            <li><strong>Case 2:</strong> Hull has 4 vertices. The 4 hull vertices form a convex quadrilateral directly.</li>
            <li><strong>Case 3:</strong> Hull has 3 vertices (triangle $ABC$ contains 2 interior points $D, E$). The line $DE$ divides the triangle $ABC$ into two parts. Each part contains at least one vertex of $\\{A,B,C\\}$. By Pigeonhole, one side contains $\\ge 2$ points of $\\{A,B,C\\}$. These 2 together with $D$ and $E$ form a convex quadrilateral.</li>
          </ul>
          <p>In all cases, a convex quadrilateral exists. $\\square$</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _dragIdx: null,

  _initCanvas(container) {
    const canvas = container.querySelector('#happyCanvas');

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return [(cx-rect.left)*scaleX, (cy-rect.top)*scaleY];
    };

    const findNear = (pos) => this._points.findIndex(p => Math.hypot(p[0]-pos[0],p[1]-pos[1])<20);

    canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      const pos = getPos(e);
      if (e.button===2) { const i=findNear(pos); if(i>=0){this._points.splice(i,1);this._draw(container);} return; }
      const i = findNear(pos);
      if (i>=0) { this._dragIdx=i; return; }
      if (this._points.length<5) { this._points.push(pos); this._draw(container); }
    });
    canvas.addEventListener('mousemove', e => {
      if (this._dragIdx===null) return;
      this._points[this._dragIdx] = getPos(e);
      this._draw(container);
    });
    canvas.addEventListener('mouseup', () => this._dragIdx = null);
    canvas.addEventListener('contextmenu', e=>e.preventDefault());

    container.querySelector('#random5').addEventListener('click', () => this._randomize(container));
    container.querySelector('#clearBtn').addEventListener('click', () => { this._points=[]; this._draw(container); });
    container.querySelector('#collinearBtn').addEventListener('click', () => {
      const W=canvas.width;
      this._points=[[50,190],[130,190],[200,190],[290,190],[200,290]];
      this._draw(container);
    });
    container.querySelector('#showHull').addEventListener('change',()=>this._draw(container));
    container.querySelector('#showQuad').addEventListener('change',()=>this._draw(container));
  },

  _randomize(container) {
    const canvas = container.querySelector('#happyCanvas');
    const W=canvas.width, m=40;
    this._points = Array.from({length:5},()=>[m+Math.random()*(W-2*m), m+Math.random()*(W-2*m)]);
    this._draw(container);
  },

  _convexHull(pts) {
    const p = pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const cross=(O,A,B)=>(A[0]-O[0])*(B[1]-O[1])-(A[1]-O[1])*(B[0]-O[0]);
    const lower=[],upper=[];
    for(const pt of p){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],pt)<=0)lower.pop();lower.push(pt);}
    for(const pt of [...p].reverse()){while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],pt)<=0)upper.pop();upper.push(pt);}
    lower.pop(); upper.pop();
    return [...lower,...upper];
  },

  _findConvexQuad(pts) {
    // Try all C(5,4) = 5 subsets of 4 points and return first convex one
    for(let skip=0;skip<5;skip++) {
      const sub = pts.filter((_,i)=>i!==skip);
      const hull = this._convexHull(sub);
      if(hull.length===4) return {quad:hull, skipped:skip};
    }
    // If 5-point hull, take first 4
    const hull5 = this._convexHull(pts);
    if(hull5.length>=4) return {quad:hull5.slice(0,4), skipped:-1};
    return null;
  },

  _draw(container) {
    const canvas = container.querySelector('#happyCanvas');
    const ctx = canvas.getContext('2d');
    const W=canvas.width, H=canvas.height;
    const pts = this._points;
    const showHull = container.querySelector('#showHull').checked;
    const showQuad = container.querySelector('#showQuad').checked;

    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--surface-alt')||'#f8f9fa';
    ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='var(--border-color)'; ctx.lineWidth=2; ctx.strokeRect(1,1,W-2,H-2);

    if(pts.length>=3&&showHull){
      const hull=this._convexHull(pts);
      if(hull.length>=3){
        ctx.beginPath(); ctx.moveTo(hull[0][0],hull[0][1]);
        hull.slice(1).forEach(p=>ctx.lineTo(p[0],p[1])); ctx.closePath();
        ctx.fillStyle='rgba(99,102,241,0.08)'; ctx.fill();
        ctx.strokeStyle='rgba(99,102,241,0.4)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    const result = pts.length>=5 ? this._findConvexQuad(pts) : null;

    if(result&&showQuad){
      const {quad}=result;
      ctx.beginPath(); ctx.moveTo(quad[0][0],quad[0][1]);
      quad.slice(1).forEach(p=>ctx.lineTo(p[0],p[1])); ctx.closePath();
      ctx.fillStyle='rgba(34,197,94,0.15)'; ctx.fill();
      ctx.strokeStyle='var(--success)'; ctx.lineWidth=2.5; ctx.stroke();
    }

    const palette=['#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4'];
    pts.forEach((p,i)=>{
      ctx.beginPath(); ctx.arc(p[0],p[1],11,0,Math.PI*2);
      ctx.fillStyle=palette[i]; ctx.fill();
      ctx.strokeStyle='white'; ctx.lineWidth=2.5; ctx.stroke();
      ctx.fillStyle='white'; ctx.font='bold 11px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(i+1,p[0],p[1]);
    });

    if(pts.length<5){
      ctx.fillStyle='rgba(150,150,150,0.5)'; ctx.font='14px sans-serif'; ctx.textAlign='center';
      ctx.fillText(`Click to add point (${pts.length}/5)`,W/2,H-15);
    }

    // Analyze
    this._analyze(container, pts, result);
  },

  _analyze(container, pts, result) {
    const el = container.querySelector('#happyAnalysis');
    if(pts.length<5){
      el.innerHTML=`<p style="color:var(--text-muted)">Add ${5-pts.length} more point(s).</p>`;
      return;
    }
    const hull=this._convexHull(pts);
    const hullSize=hull.length;

    let caseText='';
    if(hullSize===5) caseText='Case 1: All 5 points are on the convex hull → any 4 form a convex quadrilateral.';
    else if(hullSize===4) caseText='Case 2: 4 hull vertices + 1 interior → hull vertices form a convex quadrilateral.';
    else if(hullSize===3) caseText='Case 3: Triangle hull with 2 interior points → pigeonhole finds convex quad.';
    else caseText='Degenerate case (collinear points — general position violated).';

    el.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2)">
        <div class="stat-box"><div class="stat-label">Hull size</div><div class="stat-value">${hullSize}</div></div>
        <div class="stat-box"><div class="stat-label">Interior pts</div><div class="stat-value">${5-hullSize}</div></div>
      </div>
      <div class="callout callout-idea" style="margin-top:var(--space-2)">📐 ${caseText}</div>
      ${result?`<div class="callout callout-success" style="margin-top:var(--space-2)">✅ Convex quadrilateral found! The Happy Ending theorem is confirmed.</div>`
      :`<div class="callout callout-warning" style="margin-top:var(--space-2)">⚠️ Points may be collinear — move them for a general position configuration.</div>`}`;
  }
};

export default g2_happy_ending;
