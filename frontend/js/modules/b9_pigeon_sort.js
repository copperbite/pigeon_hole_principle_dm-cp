// ============================================================================
// Module B9: Pigeonhole Sort
// ============================================================================

const b9_pigeon_sort = {
  _animFrame: null,
  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container, fetch, isOnline);
    this._generateAndSort(container, fetch, isOnline);
  },
  unmount() {
    if (this._animFrame) { cancelAnimationFrame(this._animFrame); this._animFrame = null; }
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">B9. Pigeonhole Sort</h1>
    <p class="module-subtitle">A $O(n + \\text{range})$ stable sorting algorithm that uses the Pigeonhole Principle directly: each value has its "box" (bucket), and elements drop into their designated bucket.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Direct Application:</strong> Values from $\\{\\min, \\ldots, \\max\\}$ are the "pigeons." Buckets indexed by value are the "holes." Each pigeon goes directly to its hole — no comparison needed. The result is naturally sorted.
  </div>

  <div class="two-col-grid" style="gap:var(--space-5);align-items:start">
    <div class="card">
      <div class="card-header"><h3>Configuration</h3></div>
      <div class="card-body">
        <div class="control-group">
          <label>Number of elements (n): <strong id="nVal">15</strong></label>
          <input type="range" id="nSlider" min="5" max="40" value="15" class="slider">
        </div>
        <div class="control-group">
          <label>Value range [0, max]: <strong id="rangeVal">20</strong></label>
          <input type="range" id="rangeSlider" min="5" max="100" value="20" class="slider">
        </div>
        <div class="control-group">
          <label>Input pattern:</label>
          <select id="patternSelect" class="form-select">
            <option value="random">Random</option>
            <option value="reversed">Reversed sorted</option>
            <option value="nearly">Nearly sorted</option>
            <option value="duplicates">Many duplicates</option>
          </select>
        </div>
        <button class="btn btn-primary" id="generateBtn">🔄 New Array</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Complexity Analysis</h3></div>
      <div class="card-body" id="complexityBox"></div>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>Pigeonhole Sort — Step by Step</h3>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-1)">
        <button class="btn btn-primary btn-sm" id="prevBtn">◀ Prev</button>
        <span id="stepLabel" style="align-self:center;font-size:0.9rem;color:var(--text-muted)">Step 0</span>
        <button class="btn btn-primary btn-sm" id="nextBtn">Next ▶</button>
        <button class="btn btn-secondary btn-sm" id="autoBtn">▶ Auto-Play</button>
        <button class="btn btn-secondary btn-sm" id="resetBtn">Reset</button>
      </div>
    </div>
    <div class="card-body" id="sortViz"></div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📊 Benchmark: Pigeonhole Sort vs std::sort</h3>
      <small style="color:var(--text-muted)">Relative operation counts (simulated)</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="benchChart" style="width:100%;height:200px;display:block"></svg>
    </div>
  </div>

  <div class="card" style="margin-top:var(--space-4)">
    <div class="card-header"><h3>📖 Algorithm &amp; Complexity</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Pigeonhole Sort Algorithm</div>
        <div class="proof-body">
          <pre style="background:var(--surface-alt);padding:var(--space-2);border-radius:var(--radius-sm);overflow-x:auto;font-size:0.85rem">function pigeonholeSort(arr):
    min = min(arr), max = max(arr)
    range = max - min + 1
    holes = array of empty lists, size = range
    
    // Phase 1: Distribute (O(n))
    for x in arr:
        holes[x - min].append(x)
    
    // Phase 2: Collect (O(n + range))
    result = []
    for i in 0..range-1:
        result.extend(holes[i])
    return result</pre>
          <p><strong>Time Complexity:</strong> $O(n + \\text{range})$ — linear in both input size and value range</p>
          <p><strong>Space Complexity:</strong> $O(n + \\text{range})$</p>
          <p><strong>Stable:</strong> Yes — elements in each bucket preserve original relative order</p>
          <p><strong>Best Use Case:</strong> When range is small relative to $n$ (e.g., $\\text{range} = O(n)$)</p>
          <p><strong>Pitfall:</strong> When range $\\gg n$ (sparse integers), wastes memory and time — prefer radix sort</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _arr: [],
  _steps: [],
  _stepIdx: 0,
  _autoTimer: null,

  _initControls(container, fetch, isOnline) {
    container.querySelector('#nSlider').addEventListener('input', e => container.querySelector('#nVal').textContent = e.target.value);
    container.querySelector('#rangeSlider').addEventListener('input', e => container.querySelector('#rangeVal').textContent = e.target.value);
    container.querySelector('#generateBtn').addEventListener('click', () => this._generateAndSort(container, fetch, isOnline));
    container.querySelector('#prevBtn').addEventListener('click', () => { this._stepIdx = Math.max(0, this._stepIdx - 1); this._renderStep(container); });
    container.querySelector('#nextBtn').addEventListener('click', () => { this._stepIdx = Math.min(this._steps.length-1, this._stepIdx+1); this._renderStep(container); });
    container.querySelector('#autoBtn').addEventListener('click', () => this._autoPlay(container));
    container.querySelector('#resetBtn').addEventListener('click', () => { this._stepIdx = 0; this._renderStep(container); });
  },

  _generateArray(n, range, pattern) {
    let arr = Array.from({length:n}, () => Math.floor(Math.random() * (range+1)));
    if (pattern === 'reversed') arr = arr.sort((a,b)=>b-a);
    else if (pattern === 'nearly') { arr.sort((a,b)=>a-b); for(let i=0;i<Math.floor(n/5);i++){const j=Math.floor(Math.random()*n),k=Math.floor(Math.random()*n);[arr[j],arr[k]]=[arr[k],arr[j]];} }
    else if (pattern === 'duplicates') arr = Array.from({length:n}, () => Math.floor(Math.random()*5));
    return arr;
  },

  _buildSteps(arr) {
    const steps = [];
    const min = Math.min(...arr), max = Math.max(...arr);
    const range = max - min + 1;
    const holes = Array.from({length:range}, () => []);
    const sorted = [];

    steps.push({ phase:'initial', arr:[...arr], holes:holes.map(h=>[...h]), highlight:-1, label:'Initial unsorted array' });

    // Phase 1: distribute
    for (let i=0;i<arr.length;i++) {
      holes[arr[i]-min].push(arr[i]);
      steps.push({ phase:'distribute', arr:[...arr], holes:holes.map(h=>[...h]), highlight:i, label:`Place arr[${i}]=${arr[i]} into bucket ${arr[i]-min}` });
    }

    // Phase 2: collect
    for (let b=0;b<range;b++) {
      for (let v of holes[b]) {
        sorted.push(v);
        steps.push({ phase:'collect', arr:[...sorted,...Array(arr.length-sorted.length).fill(null)], holes:holes.map(h=>[...h]), highlight:sorted.length-1, label:`Collect bucket ${b} (value ${v}) → position ${sorted.length-1}` });
      }
      holes[b] = [];
    }

    steps.push({ phase:'done', arr:[...sorted], holes:holes.map(h=>[...h]), highlight:-1, label:'Sorting complete! ✅' });
    return { steps, min, max, range };
  },

  async _generateAndSort(container, fetch, isOnline) {
    const n = parseInt(container.querySelector('#nSlider').value);
    const range = parseInt(container.querySelector('#rangeSlider').value);
    const pattern = container.querySelector('#patternSelect').value;
    this._arr = this._generateArray(n, range, pattern);
    const { steps, min, max, range: r } = this._buildSteps(this._arr);
    this._steps = steps;
    this._stepIdx = 0;

    // Complexity
    container.querySelector('#complexityBox').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2)">
        <div class="stat-box"><div class="stat-label">n (elements)</div><div class="stat-value">${n}</div></div>
        <div class="stat-box"><div class="stat-label">range</div><div class="stat-value">${r}</div></div>
        <div class="stat-box"><div class="stat-label">O(n+range)</div><div class="stat-value">${n+r}</div></div>
        <div class="stat-box"><div class="stat-label">vs O(n log n)</div><div class="stat-value">${Math.round(n*Math.log2(n+1))}</div></div>
      </div>
      <div class="callout callout-${n+r < n*Math.log2(n+1)?'success':'warning'}" style="margin-top:var(--space-2);padding:var(--space-2)">
        ${n+r < n*Math.log2(n+1) ? '✅ Pigeonhole sort is faster here!' : '⚠️ Range is large — std::sort may be more efficient'}
      </div>`;

    this._renderStep(container);
    this._renderBenchChart(container, n, r);
  },

  _renderStep(container) {
    if (!this._steps.length) return;
    const step = this._steps[this._stepIdx];
    container.querySelector('#stepLabel').textContent = `Step ${this._stepIdx+1} / ${this._steps.length}: ${step.label}`;

    const viz = container.querySelector('#sortViz');
    const maxVal = Math.max(...this._arr);
    const barMaxH = 80;

    const arrBars = step.arr.map((v, i) => {
      const h = v === null ? 0 : Math.max(4, (v/maxVal)*barMaxH);
      const isHighlight = i === step.highlight && (step.phase === 'initial' || step.phase === 'distribute');
      const isCollect = i === step.highlight && step.phase === 'collect';
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;min-width:22px">
        <div style="height:${barMaxH}px;display:flex;align-items:flex-end">
          <div style="width:18px;height:${h}px;background:${isHighlight?'var(--warning)':isCollect?'var(--success)':'var(--primary)'};border-radius:3px 3px 0 0;transition:all 0.3s"></div>
        </div>
        <div style="font-size:9px;color:${isHighlight||isCollect?'var(--warning)':'var(--text-muted)'}">
          ${v !== null ? v : ''}
        </div>
      </div>`;
    }).join('');

    const bucketHtml = step.holes.map((h, i) => `
      <div style="min-width:28px;text-align:center">
        <div style="background:${h.length?'var(--primary-muted)':'var(--surface-alt)'};border:1px solid var(--border-color);border-radius:4px;padding:2px;min-height:30px;font-size:10px">
          ${h.map(v=>`<span style="display:block">${v}</span>`).join('')}
        </div>
        <div style="font-size:9px;color:var(--text-muted)">${i}</div>
      </div>`).join('');

    viz.innerHTML = `
      <div style="margin-bottom:var(--space-2)">
        <strong>Array (${step.phase === 'collect' || step.phase === 'done' ? 'being collected' : 'input'}):</strong>
        <div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:var(--space-1);align-items:flex-end">${arrBars}</div>
      </div>
      <div style="margin-top:var(--space-3)">
        <strong>Buckets:</strong>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:var(--space-1)">${bucketHtml}</div>
      </div>`;
  },

  _autoPlay(container) {
    if (this._autoTimer) { clearInterval(this._autoTimer); this._autoTimer = null; return; }
    this._autoTimer = setInterval(() => {
      if (this._stepIdx < this._steps.length - 1) {
        this._stepIdx++;
        this._renderStep(container);
      } else {
        clearInterval(this._autoTimer); this._autoTimer = null;
      }
    }, 400);
  },

  _renderBenchChart(container, n, range) {
    const ns = [10, 20, 50, 100, 200, 500];
    const data = ns.map(ni => ({
      n: ni,
      pigeonhole: ni + range,
      stdSort: Math.round(ni * Math.log2(ni+1))
    }));

    const svg = d3.select(container.querySelector('#benchChart')).attr('viewBox','0 0 700 200');
    svg.selectAll('*').remove();
    const W=700,H=200,m={top:15,right:80,bottom:30,left:50};
    const iW=W-m.left-m.right, iH=H-m.top-m.bottom;
    const g = svg.append('g').attr('transform',`translate(${m.left},${m.top})`);

    const x = d3.scaleLinear().domain([0,500]).range([0,iW]);
    const y = d3.scaleLinear().domain([0,Math.max(...data.map(d=>Math.max(d.pigeonhole,d.stdSort)))*1.1]).range([iH,0]);

    ['pigeonhole','stdSort'].forEach((key,i) => {
      const color = i===0?'var(--primary)':'var(--error)';
      const line = d3.line().x(d=>x(d.n)).y(d=>y(d[key]));
      g.append('path').datum(data).attr('fill','none').attr('stroke',color).attr('stroke-width',2).attr('d',line);
    });

    g.append('g').attr('transform',`translate(0,${iH})`).call(d3.axisBottom(x).ticks(6));
    g.append('g').call(d3.axisLeft(y).ticks(4));

    const leg = svg.append('g').attr('transform',`translate(${W-m.right+5},${m.top})`);
    [['Pigeonhole','var(--primary)'],['std::sort','var(--error)']].forEach(([lbl,c],i) => {
      leg.append('rect').attr('x',0).attr('y',i*16).attr('width',10).attr('height',10).attr('fill',c);
      leg.append('text').attr('x',14).attr('y',i*16+9).text(lbl).attr('fill','var(--text-muted)').attr('font-size',10);
    });
  }
};

export default b9_pigeon_sort;
