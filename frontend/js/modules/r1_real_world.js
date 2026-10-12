// ============================================================================
// Module R1: Real-World Case Files Gallery (15 Cases)
// ============================================================================

const r1_real_world = {
  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initInteractive(container, fetch, isOnline);
  },
  unmount() {},

  _cases() {
    return [
      {
        id: 1, emoji: '💇', title: 'Same Number of Hairs',
        pigeons: '~8 billion people on Earth', holes: '~150,000 max hair follicles per head',
        formula: '⌈8×10⁹ / 150,000⌉ ≥ 53,333',
        insight: 'At least 53,333 people share the exact same number of hairs on their head.',
        calc: (pop=8e9, maxHair=150000) => `⌈${pop.toExponential(1)} / ${maxHair.toLocaleString()}⌉ = ⌈${(pop/maxHair).toFixed(0)}⌉ = at least ${Math.ceil(pop/maxHair).toLocaleString()} people share a hair count`,
        inputs: [{id:'pop',label:'Population',default:8e9,min:1e6,max:1e10,step:1e8},{id:'hair',label:'Max Hairs',default:150000,min:10000,max:300000,step:10000}]
      },
      {
        id: 2, emoji: '🔑', title: 'Hash Collisions in Software',
        pigeons: 'n keys inserted into hash table', holes: 'k buckets',
        formula: '⌈n/k⌉ = guaranteed max chain length',
        insight: 'A hash table with n > k entries must have at least one bucket with ≥ ⌈n/k⌉ keys.',
        calc: (n=100,k=37) => `n=${n} keys, k=${k} buckets → max chain ≥ ⌈${n}/${k}⌉ = ${Math.ceil(n/k)}`,
        inputs: [{id:'n',label:'Keys (n)',default:100,min:10,max:1000,step:10},{id:'k',label:'Buckets (k)',default:37,min:5,max:500,step:5}]
      },
      {
        id: 3, emoji: '🔀', title: 'Git Short Hashes',
        pigeons: 'Number of commits in repository', holes: '2²⁸ = 268,435,456 (7-hex-digit hashes)',
        formula: '50% collision at ≈√(2×2²⁸×ln 2) ≈ 19,268',
        insight: 'With 7-digit hex hashes (~268M possibilities), you get a 50% collision chance around 19,000 commits.',
        calc: (bits=28) => {
          const space=Math.pow(2,bits);
          const half=Math.round(Math.sqrt(2*space*Math.log(2)));
          return `Hash space: 2^${bits} = ${space.toLocaleString()} | 50% collision at: ${half.toLocaleString()} commits`;
        },
        inputs: [{id:'bits',label:'Hash bits',default:28,min:8,max:40,step:4}]
      },
      {
        id: 4, emoji: '🔐', title: 'Cryptographic Birthday Attack',
        pigeons: 'Hash outputs tried', holes: '2^b possible hash values',
        formula: '50% collision at ≈ 2^(b/2) attempts',
        insight: 'A b-bit hash requires ~2^(b/2) attempts for a birthday collision — this is why SHA-256 (256 bits) needs 2^128 attempts to break.',
        calc: (b=256) => {
          const attempts = Math.pow(2, b/2);
          return `b=${b} bits → 2^(b/2) = 2^${b/2} ≈ 10^${Math.floor(b/2*Math.log10(2)).toFixed(0)} attempts to find collision`;
        },
        inputs: [{id:'b',label:'Hash bits (b)',default:256,min:32,max:512,step:32}]
      },
      {
        id: 5, emoji: '🌐', title: 'UUID Collision Probability',
        pigeons: 'Generated UUIDs', holes: '2^122 ≈ 5.3×10^36 (version 4 UUID space)',
        formula: 'P(collision after n) ≈ 1 - e^(-n²/(2×2^122))',
        insight: 'Version 4 UUIDs have 122 random bits. You need to generate ~2.71×10^18 UUIDs for a 1-in-a-billion collision chance.',
        calc: (n=1e9) => {
          const space = Math.pow(2,122);
          const prob = 1 - Math.exp(-n*n/(2*space));
          return `After ${n.toExponential(1)} UUIDs: P(collision) ≈ ${prob.toExponential(3)} (≈ ${(prob*1e15).toFixed(3)} in a quadrillion)`;
        },
        inputs: [{id:'n',label:'UUIDs generated',default:1e9,min:1e6,max:1e12,step:1e9}]
      },
      {
        id: 6, emoji: '📦', title: 'Lossless Compression Limits',
        pigeons: '2^n binary strings of length n', holes: '2^n - 1 shorter strings',
        formula: '2^n inputs into 2^n-1 outputs → pigeonhole forces expansion',
        insight: 'By the Pigeonhole Principle, any lossless compressor must expand at least one input — universal compression is mathematically impossible.',
        calc: (n=8) => `2^${n} = ${Math.pow(2,n)} inputs, only ${Math.pow(2,n)-1} shorter outputs → at least 1 must expand`,
        inputs: [{id:'n',label:'String length (n)',default:8,min:3,max:16,step:1}]
      },
      {
        id: 7, emoji: '⚖️', title: 'Load Balancing & Sharding',
        pigeons: 'n requests routed to k servers', holes: 'k servers',
        formula: 'Max load ≥ ⌈n/k⌉ (guaranteed minimum max)',
        insight: 'No matter how clever the routing, pigeonhole guarantees at least one server handles ≥ ⌈n/k⌉ requests.',
        calc: (n=1000,k=7) => `${n.toLocaleString()} requests, ${k} servers → max load ≥ ⌈${n}/${k}⌉ = ${Math.ceil(n/k).toLocaleString()}`,
        inputs: [{id:'n',label:'Requests (n)',default:1000,min:100,max:10000,step:100},{id:'k',label:'Servers (k)',default:7,min:2,max:50,step:1}]
      },
      {
        id: 8, emoji: '🌸', title: 'Bloom Filters',
        pigeons: 'n items hashed into m-bit array', holes: 'm bit positions',
        formula: 'False positive rate ≈ (1 - e^(-hn/m))^h',
        insight: 'A Bloom filter with m bits, n items, and h hash functions has a calculable false positive rate — pigeonhole governs bit collisions.',
        calc: (m=1024,n=100,h=7) => {
          const fpr = Math.pow(1-Math.exp(-h*n/m), h);
          return `m=${m} bits, n=${n} items, h=${h} hashes → FPR ≈ ${(fpr*100).toFixed(3)}%`;
        },
        inputs: [{id:'m',label:'Bit array size (m)',default:1024,min:64,max:4096,step:64},{id:'n',label:'Items (n)',default:100,min:10,max:1000,step:10},{id:'h',label:'Hash functions (h)',default:7,min:1,max:15,step:1}]
      },
      {
        id: 9, emoji: '🌍', title: 'IPv4 & NAT Limits',
        pigeons: '~8 billion internet-connected devices worldwide', holes: '2^32 ≈ 4.29 billion IPv4 addresses',
        formula: '8×10⁹ > 4.29×10⁹ → pigeonhole requires address sharing (NAT)',
        insight: 'With more devices than IPv4 addresses, NAT (Network Address Translation) is mathematically necessary — this is why IPv6 was created with 2^128 addresses.',
        calc: (devices=8e9) => {
          const ipv4 = Math.pow(2,32);
          const ratio = devices/ipv4;
          return `${devices.toExponential(1)} devices / ${ipv4.toExponential(2)} IPv4 addresses = ${ratio.toFixed(2)} devices per IP on average`;
        },
        inputs: [{id:'devices',label:'Connected devices',default:8e9,min:1e9,max:20e9,step:1e9}]
      },
      {
        id: 10, emoji: '📅', title: 'Exam Timetabling (Graph Coloring)',
        pigeons: 'Exams', holes: 'Time slots (colors)',
        formula: 'χ(conflict graph) ≤ Δ + 1 time slots needed',
        insight: 'Model exams as vertices and shared-student conflicts as edges. Coloring gives a schedule with no conflicts — pigeonhole bounds the colors needed.',
        calc: (exams=10,delta=4) => `${exams} exams, max ${delta} conflicts per exam → at most Δ+1 = ${delta+1} time slots guaranteed (Brooks' bound)`,
        inputs: [{id:'exams',label:'Exams',default:10,min:3,max:30,step:1},{id:'delta',label:'Max conflicts Δ',default:4,min:1,max:15,step:1}]
      },
      {
        id: 11, emoji: '💾', title: 'Direct-Mapped Cache Conflicts',
        pigeons: 'Memory addresses accessed', holes: 'Cache lines (modulo cache size)',
        formula: 'Address → cache line = address mod (cache lines)',
        insight: 'Direct-mapped caches use modulo mapping — two addresses that differ by a multiple of the cache size always collide, causing conflict misses.',
        calc: (addr=65536,lines=256) => {
          const conflicts = Math.floor(addr/lines);
          return `${addr.toLocaleString()} address space, ${lines} cache lines → stride=${lines} causes ${conflicts}×+ conflict misses per sweep`;
        },
        inputs: [{id:'addr',label:'Address space',default:65536,min:1024,max:1048576,step:1024},{id:'lines',label:'Cache lines',default:256,min:32,max:1024,step:32}]
      },
      {
        id: 12, emoji: '🧬', title: 'DNA & Barcode Uniqueness',
        pigeons: 'Number of samples to identify', holes: 's^k possible barcodes (s symbols, k positions)',
        formula: 'n unique IDs need k ≥ log_s(n) barcode length',
        insight: 'A 12-position DNA barcode with 4 bases has 4^12 ≈ 16.8 million unique codes. By pigeonhole, you need ⌈log_4(n)⌉ positions to identify n samples.',
        calc: (s=4,k=12) => {
          const space = Math.pow(s,k);
          return `s=${s} symbols, k=${k} positions → ${s}^${k} = ${space.toLocaleString()} unique barcodes`;
        },
        inputs: [{id:'s',label:'Alphabet size (s)',default:4,min:2,max:10,step:1},{id:'k',label:'Barcode length (k)',default:12,min:4,max:20,step:1}]
      },
      {
        id: 13, emoji: '🏆', title: 'Sports Tournament Parity',
        pigeons: 'n teams in round-robin tournament', holes: 'n-1 possible win counts (0 to n-1)',
        formula: 'But 0 wins and n-1 wins cannot coexist → at most n-1 distinct win counts for n teams',
        insight: 'In any round-robin tournament, two teams must have the same number of wins — identical to the equal degrees theorem on complete graphs.',
        calc: (n=8) => `${n} teams, win counts in {0,...,${n-1}} but 0 and ${n-1} can't coexist → at most ${n-1} valid counts for ${n} teams → guaranteed tie`,
        inputs: [{id:'n',label:'Teams (n)',default:8,min:3,max:20,step:1}]
      },
      {
        id: 14, emoji: '🗓️', title: 'Calendar Anomalies',
        pigeons: 'People in a group', holes: '12 months / 7 weekdays',
        formula: '13 → same month | 8 → same weekday',
        insight: '13 people → 2 share a birth month (12 months). 8 people → 2 share a birthday weekday (7 days). These are direct Pigeonhole applications.',
        calc: (people=13,slots=12) => `${people} people, ${slots} slots → ⌈${people}/${slots}⌉ = ${Math.ceil(people/slots)} share a slot. Need ${slots+1} people to guarantee sharing.`,
        inputs: [{id:'people',label:'People',default:13,min:2,max:30,step:1},{id:'slots',label:'Slots (months/days)',default:12,min:2,max:30,step:1}]
      },
      {
        id: 15, emoji: '🔭', title: 'Rational Gear Ratios & Leap Years',
        pigeons: 'Years tracked', holes: 'Integer calendar days',
        formula: 'Dirichlet: |365.2422×q - p| < 1/q for some q ≤ N',
        insight: 'The solar year is 365.2422 days. Dirichlet\'s theorem (itself a Pigeonhole result) guarantees a rational approximation p/q ≈ 365.2422 with |error| < 1/q. The Gregorian leap-year rule (365 + 97/400) achieves |error| < 0.001 days/year.',
        calc: (N=400) => {
          const alpha = 365.2422;
          let best = 1, bestErr = Infinity;
          for(let q=1;q<=N;q++){const p=Math.round(alpha*q);const err=Math.abs(alpha*q-p);if(err<bestErr){bestErr=err;best=q;}}
          const bestP=Math.round(alpha*best);
          return `Best approximation in [1,${N}]: ${bestP}/${best} = ${(bestP/best).toFixed(6)} (error: ${(Math.abs(alpha-bestP/best)*365.25).toFixed(4)} sec/year)`;
        },
        inputs: [{id:'N',label:'Search limit N',default:400,min:10,max:10000,step:10}]
      }
    ];
  },

  _html() {
    const cases = this._cases();
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier1">Tier 1</span>
    <h1 class="module-title">R1. Real-World Case Files</h1>
    <p class="module-subtitle">15 real-world phenomena explained and quantified through the Pigeonhole Principle — from cryptography to biology.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🌍 Why it matters:</strong> The Pigeonhole Principle isn't just an abstract theorem — it silently governs everything from why your hash table slows down to why compression software has limits.
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-4);margin-top:var(--space-4)">
    ${cases.map(c => `
    <div class="card case-card" id="case${c.id}">
      <div class="card-header" style="cursor:pointer" data-toggle="case${c.id}body">
        <div style="display:flex;align-items:center;gap:var(--space-2)">
          <span style="font-size:1.8rem">${c.emoji}</span>
          <div>
            <div style="font-weight:700">Case ${c.id}: ${c.title}</div>
            <div style="font-size:0.8rem;color:var(--text-muted)">Click to expand</div>
          </div>
        </div>
      </div>
      <div class="card-body" id="case${c.id}body" style="display:none;animation:fadeIn 0.3s">
        <div class="callout callout-idea" style="padding:var(--space-2) var(--space-3);margin-bottom:var(--space-2)">
          <strong>Pigeons:</strong> ${c.pigeons}<br>
          <strong>Holes:</strong> ${c.holes}
        </div>
        <div style="background:var(--surface-alt);padding:var(--space-2);border-radius:var(--radius-md);font-family:monospace;font-size:0.85rem;margin-bottom:var(--space-2)">
          ${c.formula}
        </div>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:var(--space-2)">${c.insight}</p>
        <div id="calc${c.id}" style="margin-bottom:var(--space-2)">
          ${c.inputs.map(inp => `
            <div class="control-group" style="margin-bottom:var(--space-1)">
              <label style="font-size:0.85rem">${inp.label}: <strong id="v${c.id}_${inp.id}">${inp.default.toLocaleString()}</strong></label>
              <input type="range" id="s${c.id}_${inp.id}" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${inp.default}" class="slider">
            </div>`).join('')}
          <div id="result${c.id}" class="callout callout-success" style="font-size:0.85rem;margin-top:var(--space-1);padding:var(--space-1) var(--space-2)"></div>
        </div>
      </div>
    </div>`).join('')}
  </div>
</div>`;
  },

  _initInteractive(container, fetch, isOnline) {
    const cases = this._cases();
    cases.forEach(c => {
      const header = container.querySelector(`[data-toggle="case${c.id}body"]`);
      const body = container.querySelector(`#case${c.id}body`);
      header.addEventListener('click', () => {
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) this._computeCase(container, c);
      });

      // Init sliders
      c.inputs.forEach(inp => {
        const slider = container.querySelector(`#s${c.id}_${inp.id}`);
        const valEl = container.querySelector(`#v${c.id}_${inp.id}`);
        slider.addEventListener('input', () => {
          valEl.textContent = parseFloat(slider.value).toLocaleString();
          this._computeCase(container, c);
        });
      });
    });

    // Open first case by default
    const firstBody = container.querySelector('#case1body');
    if (firstBody) { firstBody.style.display='block'; this._computeCase(container, cases[0]); }
  },

  _computeCase(container, c) {
    const vals = c.inputs.map(inp => {
      const slider = container.querySelector(`#s${c.id}_${inp.id}`);
      return parseFloat(slider.value);
    });
    const resultEl = container.querySelector(`#result${c.id}`);
    try {
      const text = c.calc(...vals);
      resultEl.textContent = text;
    } catch(e) { resultEl.textContent = 'Computing...'; }
  }
};

export default r1_real_world;
