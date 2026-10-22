// ============================================================================
// Module R1: Real-World Case Files Gallery (Curated High-Impact Cases)
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
        id: 1, emoji: '💇', title: 'Same Number of Hairs', category: 'Classic Population',
        pigeons: '~8 billion people on Earth', holes: '~150,000 max hair follicles per human head',
        formula: '⌈8×10⁹ / 150,000⌉ ≥ 53,333',
        insight: 'At least 53,333 people share the exact same number of hairs on their head. In any major city (e.g. London with 9M residents), at least 60 people have the exact same count.',
        calc: (pop=8e9, maxHair=150000) => `⌈${pop.toExponential(1)} / ${maxHair.toLocaleString()}⌉ = ⌈${(pop/maxHair).toFixed(0)}⌉ → at least ${Math.ceil(pop/maxHair).toLocaleString()} people share the exact same hair count!`,
        inputs: [{id:'pop',label:'Population',default:8e9,min:1e6,max:1e10,step:1e8},{id:'hair',label:'Max Hairs per Head',default:150000,min:10000,max:300000,step:10000}]
      },
      {
        id: 2, emoji: '🗓️', title: 'Birthdays & Calendar Invariants', category: 'Everyday Probability',
        pigeons: 'People in a group', holes: '12 months / 7 weekdays / 366 days',
        formula: '13 people → same month | 8 people → same weekday | 367 people → same calendar date',
        insight: 'In any group of 13 people, at least 2 share a birth month. In any group of 8 people, at least 2 were born on the same day of the week.',
        calc: (people=13,slots=12) => `${people} people into ${slots} calendar slots → at least ⌈${people}/${slots}⌉ = ${Math.ceil(people/slots)} share a slot. You need ${slots+1} people to 100% guarantee a shared slot.`,
        inputs: [{id:'people',label:'Group Size (People)',default:13,min:2,max:50,step:1},{id:'slots',label:'Calendar Slots (e.g. 12 months, 7 days)',default:12,min:2,max:31,step:1}]
      },
      {
        id: 3, emoji: '🔑', title: 'Hash Table Collisions in Software', category: 'Data Structures',
        pigeons: 'n keys inserted into hash table', holes: 'k buckets',
        formula: '⌈n/k⌉ = guaranteed minimum max bucket chain length',
        insight: 'Whenever elements n exceed bucket capacity k, collisions are mathematically unavoidable. Separate chaining or open addressing is mandatory.',
        calc: (n=120,k=40) => `n=${n} keys, k=${k} buckets → at least one bucket must hold ≥ ⌈${n}/${k}⌉ = ${Math.ceil(n/k)} keys.`,
        inputs: [{id:'n',label:'Keys Inserted (n)',default:120,min:10,max:1000,step:10},{id:'k',label:'Hash Buckets (k)',default:40,min:5,max:200,step:5}]
      },
      {
        id: 4, emoji: '🔀', title: 'Git Short Hashes (7 Hex Digits)', category: 'Software Engineering',
        pigeons: 'Number of commits in repository', holes: '16⁷ = 2²⁸ = 268,435,456 possible short hashes',
        formula: '50% collision threshold at ≈ √(2 × 2²⁸ × ln 2) ≈ 19,268 commits',
        insight: 'While PHP guarantees 100% collision at 268,435,457 commits, the Birthday Paradox forces a 50% collision chance at only ~19,268 commits.',
        calc: (commits=20000) => {
          const space = Math.pow(16, 7);
          const prob = 1 - Math.exp(-commits * commits / (2 * space));
          return `${commits.toLocaleString()} commits against 268.4M space → P(collision) ≈ ${(prob * 100).toFixed(2)}%`;
        },
        inputs: [{id:'commits',label:'Commits in Repo',default:20000,min:1000,max:100000,step:1000}]
      },
      {
        id: 5, emoji: '🔐', title: 'Cryptographic Birthday Attack', category: 'Cybersecurity',
        pigeons: 'Hash trials executed', holes: '2^b possible cryptographic output values',
        formula: '50% collision chance at ≈ 2^(b/2) trials',
        insight: 'To find a collision in a b-bit cryptographic hash, an attacker needs only 2^(b/2) evaluations instead of 2^b. This is why SHA-256 uses 256 bits (requiring 2^128 operations).',
        calc: (b=64) => {
          const exponent = b / 2;
          const approx = Math.pow(2, exponent);
          return `For b=${b} bits: birthday bound is 2^${exponent} ≈ ${approx > 1e12 ? approx.toExponential(2) : approx.toLocaleString()} trials to find collision`;
        },
        inputs: [{id:'b',label:'Hash Output Size (bits)',default:64,min:16,max:128,step:16}]
      },
      {
        id: 6, emoji: '🌐', title: 'UUIDv4 Collision Probability', category: 'Distributed Systems',
        pigeons: 'Generated UUIDs in distributed databases', holes: '2¹²² ≈ 5.3 × 10³⁶ possible version 4 UUIDs',
        formula: 'P(collision) ≈ 1 - exp(-n² / (2 × 2¹²²))',
        insight: 'Version 4 UUIDs have 122 random bits. Even after generating 1 billion UUIDs per second for 100 years, the collision risk remains negligible.',
        calc: (n=1e9) => {
          const space = Math.pow(2, 122);
          const prob = 1 - Math.exp(-n * n / (2 * space));
          return `After generating ${n.toExponential(1)} UUIDs: Collision Probability ≈ ${prob.toExponential(3)} (virtually zero)`;
        },
        inputs: [{id:'n',label:'UUIDs Generated',default:1e9,min:1e6,max:1e12,step:1e9}]
      },
      {
        id: 7, emoji: '🌍', title: 'IPv4 Address Space & NAT Gateway Sharing', category: 'Networking',
        pigeons: '~15 billion active devices globally', holes: '2³² ≈ 4.29 billion total IPv4 addresses',
        formula: '1.5×10¹⁰ devices > 4.29×10⁹ addresses → sharing is mathematically required',
        insight: 'With more connected devices than IPv4 addresses, Network Address Translation (NAT) and IPv6 (2¹²⁸ addresses) became an absolute mathematical necessity.',
        calc: (devices=15e9) => {
          const ipv4 = Math.pow(2, 32);
          return `${devices.toExponential(1)} devices / ${ipv4.toExponential(2)} IPv4 addresses = ${(devices / ipv4).toFixed(2)} devices per public IPv4 on average`;
        },
        inputs: [{id:'devices',label:'Connected Devices',default:15e9,min:5e9,max:30e9,step:1e9}]
      },
      {
        id: 8, emoji: '⚖️', title: 'Server Load Balancing & Cloud Sharding', category: 'Distributed Systems',
        pigeons: 'n incoming user requests', holes: 'k backend worker servers',
        formula: 'Max server load ≥ ⌈n/k⌉ requests',
        insight: 'Even with perfect uniform round-robin distribution, the busiest server must process at least ⌈n/k⌉ requests. If servers have heterogeneous capacities, weighted PHP applies.',
        calc: (n=5000,k=8) => `${n.toLocaleString()} requests across ${k} servers → busiest server must handle ≥ ⌈${n}/${k}⌉ = ${Math.ceil(n/k).toLocaleString()} requests`,
        inputs: [{id:'n',label:'Requests (n)',default:5000,min:500,max:50000,step:500},{id:'k',label:'Servers (k)',default:8,min:2,max:64,step:2}]
      },
      {
        id: 9, emoji: '🌸', title: 'Bloom Filters & Probabilistic Membership', category: 'Data Structures',
        pigeons: 'n elements hashed into m bit positions', holes: 'm bit array slots',
        formula: 'False Positive Rate ≈ (1 - e^(-h·n / m))^h',
        insight: 'A Bloom filter uses h hash functions to map n items into an m-bit array. Pigeonhole saturation of bit slots creates false positive matches.',
        calc: (m=1024,n=100,h=7) => {
          const fpr = Math.pow(1 - Math.exp(-h * n / m), h);
          return `m=${m} bits, n=${n} items, h=${h} hashes → False Positive Rate ≈ ${(fpr * 100).toFixed(2)}%`;
        },
        inputs: [{id:'m',label:'Bit Array Size (m)',default:1024,min:128,max:4096,step:128},{id:'n',label:'Items Inserted (n)',default:100,min:10,max:500,step:10},{id:'h',label:'Hash Count (h)',default:7,min:1,max:12,step:1}]
      },
      {
        id: 10, emoji: '🏆', title: 'Sports Tournament Parity & Inevitable Ties', category: 'Combinatorics',
        pigeons: 'n teams in a round-robin tournament', holes: 'Possible win totals {0, 1, ..., n-1}',
        formula: '0 wins and (n-1) wins cannot coexist → at most n-1 valid win counts for n teams',
        insight: 'If one team wins all n-1 games, no team can have 0 wins (everyone lost at least once). Thus, n teams share at most n-1 possible win records → two teams MUST tie in win count!',
        calc: (n=8) => `${n} teams play round-robin → win counts {0..${n-1}} has at most ${n-1} realizable values → by PHP, at least 2 teams share the same number of wins!`,
        inputs: [{id:'n',label:'Teams (n)',default:8,min:3,max:24,step:1}]
      },
      {
        id: 11, emoji: '📅', title: 'Exam Timetabling & Conflict-Free Scheduling', category: 'Graph Coloring',
        pigeons: 'Courses/exams to schedule', holes: 'Available exam time slots',
        formula: 'χ(Conflict Graph) ≤ Δ + 1 time slots needed',
        insight: 'Construct a graph where vertices represent exams and edges connect courses with shared students. Any proper coloring ensures conflict-free examination schedules.',
        calc: (exams=12,delta=4) => `${exams} exams with maximum degree Δ=${delta} conflicts → guaranteed solvable in at most Δ+1 = ${delta+1} distinct time slots (Brooks\' theorem bound)`,
        inputs: [{id:'exams',label:'Exams to Schedule',default:12,min:4,max:30,step:1},{id:'delta',label:'Max Student Conflicts per Exam (Δ)',default:4,min:1,max:10,step:1}]
      }
    ];
  },

  _html() {
    const cases = this._cases();
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier1">Tier 1</span>
    <h1 class="module-title">D1. Real-World Case Files</h1>
    <p class="module-subtitle">11 high-impact real-world phenomena explained and quantified through the Pigeonhole Principle — from software systems to network routing.</p>
  </div>

  <div class="callout callout-idea">
    <strong>🌍 Why it matters:</strong> The Pigeonhole Principle isn't just an abstract theoretical concept — it strictly governs data structures, security algorithms, network architectures, and everyday invariants.
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-4);margin-top:var(--space-4)">
    ${cases.map(c => `
    <div class="card case-card" id="case${c.id}">
      <div class="card-header" style="cursor:pointer; user-select:none" data-toggle="case${c.id}body">
        <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
          <div style="display:flex;align-items:center;gap:var(--space-2)">
            <span style="font-size:1.8rem">${c.emoji}</span>
            <div>
              <div style="font-weight:700">Case ${c.id}: ${c.title}</div>
              <div style="font-size:0.75rem;color:var(--text-muted);display:flex;gap:var(--space-1);align-items:center;margin-top:2px">
                <span class="badge" style="background:var(--bg-card);border:1px solid var(--border-light);font-size:0.7rem">${c.category}</span>
                <span>• Click to inspect</span>
              </div>
            </div>
          </div>
          <span class="chevron" id="chev${c.id}" style="color:var(--text-muted);transition:transform 0.2s">▼</span>
        </div>
      </div>
      <div class="card-body" id="case${c.id}body" style="display:none;animation:fadeIn 0.25s">
        <div class="callout callout-idea" style="padding:var(--space-2) var(--space-3);margin-bottom:var(--space-2)">
          <div><strong>🕊️ Pigeons:</strong> ${c.pigeons}</div>
          <div style="margin-top:4px"><strong>🕳️ Holes:</strong> ${c.holes}</div>
        </div>
        <div style="background:var(--bg-canvas);padding:var(--space-2);border-radius:var(--radius-md);font-family:monospace;font-size:0.85rem;margin-bottom:var(--space-2);border:1px solid var(--border-light)">
          ${c.formula}
        </div>
        <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:var(--space-3);line-height:1.5">${c.insight}</p>
        <div id="calc${c.id}" style="background:var(--bg-surface);padding:var(--space-3);border-radius:var(--radius-md);border:1px solid var(--border-light)">
          <div style="font-weight:600;font-size:0.8rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--space-2)">Interactive Parameter Sliders</div>
          ${c.inputs.map(inp => `
            <div class="control-group" style="margin-bottom:var(--space-2)">
              <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:4px">
                <span>${inp.label}</span>
                <strong id="v${c.id}_${inp.id}">${inp.default.toLocaleString()}</strong>
              </div>
              <input type="range" id="s${c.id}_${inp.id}" min="${inp.min}" max="${inp.max}" step="${inp.step}" value="${inp.default}" class="slider" style="width:100%">
            </div>`).join('')}
          <div id="result${c.id}" class="callout callout-success" style="font-size:0.88rem;margin-top:var(--space-2);padding:var(--space-2) var(--space-3);font-weight:600"></div>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
    <a href="#/module/c5_euler_hamilton" class="btn btn-outline">← Back: C2. Euler &amp; Hamilton</a>
    <a href="#/" class="btn btn-outline">🏠 Home &amp; Dashboard</a>
  </section>
</div>`;
  },

  _initInteractive(container, fetch, isOnline) {
    const cases = this._cases();
    cases.forEach(c => {
      const header = container.querySelector(`[data-toggle="case${c.id}body"]`);
      const body = container.querySelector(`#case${c.id}body`);
      const chev = container.querySelector(`#chev${c.id}`);
      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        if (chev) chev.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        if (!isOpen) this._computeCase(container, c);
      });

      // Init sliders
      c.inputs.forEach(inp => {
        const slider = container.querySelector(`#s${c.id}_${inp.id}`);
        const valEl = container.querySelector(`#v${c.id}_${inp.id}`);
        if (slider && valEl) {
          slider.addEventListener('input', () => {
            valEl.textContent = parseFloat(slider.value).toLocaleString();
            this._computeCase(container, c);
          });
        }
      });
    });

    // Open first case by default
    const firstBody = container.querySelector('#case1body');
    const firstChev = container.querySelector('#chev1');
    if (firstBody) {
      firstBody.style.display = 'block';
      if (firstChev) firstChev.style.transform = 'rotate(180deg)';
      this._computeCase(container, cases[0]);
    }
  },

  _computeCase(container, c) {
    const vals = c.inputs.map(inp => {
      const slider = container.querySelector(`#s${c.id}_${inp.id}`);
      return slider ? parseFloat(slider.value) : inp.default;
    });
    const resultEl = container.querySelector(`#result${c.id}`);
    if (!resultEl) return;
    try {
      const text = c.calc(...vals);
      resultEl.textContent = text;
    } catch(e) {
      resultEl.textContent = 'Computing...';
    }
  }
};

export default r1_real_world;
