// ============================================================================
// Module B8: Lossless Compression Impossibility
// ============================================================================

const b8_compression = {
  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initControls(container);
    this._renderTable(container, 4);
    this._runRLE(container, 'aaabbbccdddddd');
  },
  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier2">Tier 2</span>
    <h1 class="module-title">B8. Lossless Compression Impossibility</h1>
    <p class="module-subtitle">No lossless compression algorithm can compress every possible input — the Pigeonhole Principle makes this a mathematical certainty.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🕊️ Pigeonhole Proof:</strong> There are $2^n$ binary strings of length $n$. Any "shorter" compressed output has length $< n$, so there are $< 2^n$ possible compressed outputs. By Pigeonhole, two distinct inputs must map to the same output — compression must fail on at least one input.
  </div>

  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header"><h3>Counting Argument: Bit Strings of Length n</h3></div>
    <div class="card-body">
      <div class="control-group">
        <label>String length n: <strong id="nVal">4</strong></label>
        <input type="range" id="nSlider" min="1" max="8" value="4" class="slider">
      </div>
      <div id="countTable" style="overflow-x:auto;margin-top:var(--space-2)"></div>
    </div>
  </div>

  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header"><h3>Run-Length Encoding (RLE) Live Demo</h3>
      <small style="color:var(--text-muted)">See how RLE compresses structured data but expands random data</small>
    </div>
    <div class="card-body">
      <div class="control-group">
        <label>Input string:</label>
        <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
          <input type="text" id="rleInput" class="form-input" value="aaabbbccdddddd" placeholder="Type any string" style="flex:1">
          <button class="btn btn-primary" id="rleRunBtn">Compress</button>
        </div>
      </div>
      <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-2)">
        <button class="btn btn-secondary" id="rleStructured">Structured (runs)</button>
        <button class="btn btn-secondary" id="rleRandom">Random (no runs)</button>
        <button class="btn btn-secondary" id="rleMixed">Mixed</button>
        <button class="btn btn-secondary" id="rleWorstCase">Worst Case (expand)</button>
      </div>
      <div id="rleResult" style="margin-top:var(--space-2)"></div>
    </div>
  </div>

  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-header"><h3>Compression Ratio Explorer</h3>
      <small style="color:var(--text-muted)">How does RLE perform across input types?</small>
    </div>
    <div class="card-body" style="padding:0">
      <svg id="ratioChart" style="width:100%;height:200px;display:block"></svg>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><h3>📖 Formal Proof</h3></div>
    <div class="card-body">
      <div class="proof-box">
        <div class="proof-title">Theorem: No Universal Lossless Compressor</div>
        <div class="proof-body">
          <p><strong>Theorem:</strong> For any deterministic lossless compression function $C : \\{0,1\\}^n \\to \\{0,1\\}^*$, there exists an input $x \\in \\{0,1\\}^n$ such that $|C(x)| \\ge n$.</p>
          <p><strong>Proof:</strong> Lossless means $C$ is injective. The set of binary strings of length $< n$ has $\\sum_{k=0}^{n-1} 2^k = 2^n - 1$ elements. Since $|\\{0,1\\}^n| = 2^n > 2^n - 1$, by the Pigeonhole Principle, $C$ cannot be injective into strings of length $< n$. At least one input must have $|C(x)| \\ge n$. $\\square$</p>
          <p><strong>Corollary:</strong> Most binary strings of length $n$ are incompressible (Kolmogorov complexity $\\ge n - O(\\log n)$). Random data cannot be compressed.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
  },

  _initControls(container) {
    const nSlider = container.querySelector('#nSlider');
    const nVal = container.querySelector('#nVal');
    nSlider.addEventListener('input', () => { nVal.textContent = nSlider.value; this._renderTable(container, parseInt(nSlider.value)); });

    const rleInput = container.querySelector('#rleInput');
    container.querySelector('#rleRunBtn').addEventListener('click', () => this._runRLE(container, rleInput.value));
    container.querySelector('#rleStructured').addEventListener('click', () => { rleInput.value='aaaaaaabbbbbbcccddddddeeee'; this._runRLE(container, rleInput.value); });
    container.querySelector('#rleRandom').addEventListener('click', () => {
      const chars='abcdefghij';
      rleInput.value=Array.from({length:30},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
      this._runRLE(container, rleInput.value);
    });
    container.querySelector('#rleMixed').addEventListener('click', () => { rleInput.value='aabbbaacddddxyxyxy'; this._runRLE(container, rleInput.value); });
    container.querySelector('#rleWorstCase').addEventListener('click', () => { rleInput.value='abababababababab'; this._runRLE(container, rleInput.value); });

    this._renderRatioChart(container);
  },

  _renderTable(container, n) {
    const total = Math.pow(2, n);
    const shorter = total - 1;
    const pigeonhole = total - shorter; // = 1

    const rows = [];
    for (let bits = 0; bits <= n; bits++) {
      const count = bits === n ? total : Math.pow(2, bits);
      rows.push(`<tr>
        <td style="text-align:center">${bits}</td>
        <td style="text-align:center">${count.toLocaleString()}</td>
        <td>${bits === n ? `<strong>All ${total} inputs</strong>` : `${count} short outputs`}</td>
        <td style="text-align:center">${bits < n ? `<span style="color:var(--error)">Too few!</span>` : `<span style="color:var(--success)">Exact match</span>`}</td>
      </tr>`);
    }

    container.querySelector('#countTable').innerHTML = `
      <table class="data-table">
        <thead><tr><th>String Length</th><th>Count</th><th>Description</th><th>Sufficient?</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
      <div class="callout callout-warning" style="margin-top:var(--space-2)">
        ⚠️ Total inputs: $2^{${n}} = ${total}$. Shorter outputs available: $2^{${n}}-1 = ${shorter}$. 
        By Pigeonhole, at least <strong>${pigeonhole}</strong> input must map to a longer or equal output — compression cannot work universally!
      </div>`;
  },

  _rleEncode(str) {
    if (!str) return '';
    let result = '', i = 0;
    while (i < str.length) {
      let c = str[i], count = 1;
      while (i + count < str.length && str[i+count] === c) count++;
      result += count > 1 ? `${count}${c}` : c;
      i += count;
    }
    return result;
  },

  _runRLE(container, input) {
    const encoded = this._rleEncode(input);
    const ratio = encoded.length / input.length;
    const saved = input.length - encoded.length;
    const isExpanded = encoded.length > input.length;

    const resultEl = container.querySelector('#rleResult');
    resultEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-2)">
        <div style="background:var(--surface-alt);padding:var(--space-2);border-radius:var(--radius-md)">
          <strong>Original:</strong><br>
          <code style="word-break:break-all;color:var(--primary)">${input}</code><br>
          <small>Length: ${input.length}</small>
        </div>
        <div style="background:var(--surface-alt);padding:var(--space-2);border-radius:var(--radius-md)">
          <strong>RLE Encoded:</strong><br>
          <code style="word-break:break-all;color:${isExpanded?'var(--error)':'var(--success)'}">${encoded}</code><br>
          <small>Length: ${encoded.length}</small>
        </div>
      </div>
      <div class="callout callout-${isExpanded?'warning':'success'}">
        ${isExpanded ? `❌ <strong>EXPANSION!</strong> ${encoded.length - input.length} chars added (ratio: ${ratio.toFixed(2)}x). Pigeonhole in action — this input gets larger!` 
        : `✅ <strong>Compressed!</strong> Saved ${saved} chars (${(100-ratio*100).toFixed(1)}% smaller, ratio: ${ratio.toFixed(2)}x). Structured/repetitive data compresses well.`}
      </div>`;
  },

  _renderRatioChart(container) {
    const testCases = [
      { label:'All same (aaaa...)', text: 'a'.repeat(20) },
      { label:'2 chars alt (ababab)', text: 'ababababababab' },
      { label:'Long runs (aaabbb)', text: 'aaaaaabbbbbcccdd' },
      { label:'Short runs (aab)', text: 'aabbbccddeff' },
      { label:'No runs (abcde)', text: 'abcdefghijklmnop' },
      { label:'Random', text: 'adgbfhejckilmnop' },
    ];

    const data = testCases.map(tc => ({
      label: tc.label,
      ratio: this._rleEncode(tc.text).length / tc.text.length
    }));

    const svg = d3.select(container.querySelector('#ratioChart')).attr('viewBox', `0 0 700 200`);
    const W=700, H=200, margin={top:15,right:15,bottom:60,left:60};
    const innerW=W-margin.left-margin.right, innerH=H-margin.top-margin.bottom;
    const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().domain(data.map((_,i)=>i)).range([0,innerW]).padding(0.2);
    const y = d3.scaleLinear().domain([0, Math.max(2, ...data.map(d=>d.ratio))*1.1]).range([innerH,0]);

    // 1.0 line
    g.append('line').attr('x1',0).attr('x2',innerW).attr('y1',y(1)).attr('y2',y(1))
      .attr('stroke','var(--warning)').attr('stroke-width',1.5).attr('stroke-dasharray','4,4');
    g.append('text').attr('x',innerW+2).attr('y',y(1)+4).text('1.0').attr('fill','var(--warning)').attr('font-size',10);

    g.selectAll('rect').data(data).enter().append('rect')
      .attr('x',(_,i)=>x(i)).attr('y',d=>y(d.ratio)).attr('width',x.bandwidth())
      .attr('height',d=>innerH-y(d.ratio))
      .attr('fill',d=>d.ratio>1?'var(--error)':'var(--success)').attr('opacity',0.8).attr('rx',3);

    g.selectAll('.ratioLabel').data(data).enter().append('text').attr('class','ratioLabel')
      .attr('x',(_,i)=>x(i)+x.bandwidth()/2).attr('y',d=>y(d.ratio)-3).text(d=>d.ratio.toFixed(2))
      .attr('text-anchor','middle').attr('fill','var(--text-primary)').attr('font-size',10).attr('font-weight','bold');

    g.append('g').attr('transform',`translate(0,${innerH})`).call(d3.axisBottom(x).tickFormat((_,i)=>data[i].label))
      .selectAll('text').attr('transform','rotate(-20)').attr('text-anchor','end').attr('font-size',9);
    g.append('g').call(d3.axisLeft(y).ticks(4));
  }
};

export default b8_compression;
