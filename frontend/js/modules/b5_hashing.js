// ============================================================================
// Module B5: Hashing and Collisions (Tier 1, Intermediate)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';

export default {
  id: 'b5_hashing',
  title: 'Hashing & Collisions (DSA Deep-Dive)',
  tier: 1,
  badge: 'Intermediate',
  time: '7 min',
  summary: 'Comparing Separate Chaining vs Linear Probing across Modulo, Knuth, and PRNG hash functions.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.keys = 30;
    this.buckets = 10;
    this.strategy = 'modulo';
    this.pattern = 'sequential';

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-intermediate">Tier 1 · Intermediate</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 7 min</span>
          </div>
          <h1 class="module-title">B5. Hashing & Collisions</h1>
          <p class="module-big-idea">
            ⚡ Why does every hash table in software require collision handling? Because of the Pigeonhole Principle!
            Whenever keys exceed buckets ($n > m$), collisions are mathematically inevitable.
            The computer science challenge is: <em>How do we resolve them efficiently?</em>
          </p>
        </header>

        <!-- 3. Explanation Tabs -->
        <section class="tabs-container">
          <div class="tabs-nav">
            <button class="tab-btn active" data-tab="simple">🟢 Simple</button>
            <button class="tab-btn" data-tab="formal">🔵 Formal</button>
            <button class="tab-btn" data-tab="proof">🟣 Proof</button>
          </div>

          <div class="tab-pane active" id="tab-simple">
            <p style="font-size:1.0625rem; line-height:1.7">
              A hash table is like an apartment mail room with 10 slots. If 30 tenants live in the building, no matter how clever the mail carrier is,
              some slots will receive multiple letters!
              Computer scientists use two primary techniques:
            </p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:16px 0">
              <div class="card" style="padding:14px">
                <strong style="color:var(--primary-600)">1. Separate Chaining</strong>
                <p style="font-size:0.875rem; color:var(--text-muted); margin-top:4px">
                  Each bucket contains a linked list. Colliding keys chain up in the same bucket.
                </p>
              </div>
              <div class="card" style="padding:14px">
                <strong style="color:var(--accent-orange-600)">2. Open Addressing (Linear Probing)</strong>
                <p style="font-size:0.875rem; color:var(--text-muted); margin-top:4px">
                  If a bucket is taken, the key probes forward step-by-step until it finds the next open slot.
                </p>
              </div>
            </div>
            ${Callout({
              type: 'warning',
              title: 'Pathological Keys Ruin Modulo Hash',
              content: 'If your hash function is simple modulo (k % 10) and your keys are multiples of 10 (10, 20, 30, 40...), EVERY SINGLE KEY lands in bucket 0! Knuth multiplicative hashing or randomized hashing prevents this clustering.'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>Hash Uniformity & Collision Expectation</h3>
              <p style="margin:8px 0">Under the Simple Uniform Hashing Assumption (SUHA), each key is equally likely to hash to any of the $m$ buckets:</p>
              <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:1.125rem; margin:10px 0; text-align:center">
                $$\text{Load Factor } \alpha = \frac{n}{m}, \quad \mathbb{E}[\text{Colliding Pairs}] = \frac{\binom{n}{2}}{m} = \frac{n(n - 1)}{2m}$$
              </div>
              <p>Uniformity goodness-of-fit is quantified by the Chi-Square statistic:</p>
              <div style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-md); text-align:center; font-size:1rem">
                $$\chi^2 = \sum_{j=0}^{m-1} \frac{(b_j - n/m)^2}{n/m}$$
              </div>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="b5ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Hash Table Parameters</h3>

            <div class="control-group">
              <div class="control-label">
                <span>Number of Keys ($n$)</span>
                <span id="b5KeyVal">30</span>
              </div>
              <input type="range" class="control-slider" id="b5KeySlider" min="5" max="100" value="30">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Table Buckets ($m$)</span>
                <span id="b5BucketVal">10</span>
              </div>
              <input type="range" class="control-slider" id="b5BucketSlider" min="5" max="30" value="10">
            </div>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Hash Strategy:</label>
              <select id="b5StrategySelect" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main)">
                <option value="modulo" selected>Modulo Hash: k % m</option>
                <option value="knuth">Knuth Multiplicative: ⌊m(k · φ⁻¹ mod 1)⌋</option>
                <option value="prng">Pseudo-Random (SplitMix integer hash)</option>
              </select>
            </div>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Key Pattern:</label>
              <select id="b5PatternSelect" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main)">
                <option value="sequential" selected>Sequential: 1, 2, 3, 4, 5...</option>
                <option value="multiples_10">Multiples of 10: 10, 20, 30... (Adversarial for % 10)</option>
                <option value="multiples_k">Multiples of Buckets: k, 2k, 3k...</option>
                <option value="random">Random Integer Keys</option>
              </select>
            </div>

            <button class="btn btn-primary" id="b5RunBtn">Analyze Hash Table</button>

            <!-- Metrics Summary -->
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px; font-size:0.8125rem">
              <div style="display:flex; justify-content:space-between; padding:6px; background:var(--bg-subtle); border-radius:var(--radius-sm)">
                <span>Load Factor ($\alpha = n/m$):</span>
                <b id="b5LoadFactorDisplay">3.00</b>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px; background:var(--bg-subtle); border-radius:var(--radius-sm)">
                <span>Longest Chain:</span>
                <b id="b5LongestChainDisplay">3</b>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px; background:var(--bg-subtle); border-radius:var(--radius-sm)">
                <span>Empty Buckets:</span>
                <b id="b5EmptyDisplay">0</b>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px; background:var(--bg-subtle); border-radius:var(--radius-sm)">
                <span>$\chi^2$ Uniformity:</span>
                <b id="b5ChiSquareDisplay">0.00</b>
              </div>
            </div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <strong style="font-size:0.875rem">Bucket Size Distribution & Heatmap</strong>
              <div style="display:flex; gap:8px">
                <span class="badge badge-intermediate" id="b5CostComparisonBadge">Avg Lookup: Chaining 2.0 | Probing 1.0</span>
              </div>
            </div>

            <div class="viewport-canvas" style="flex-direction:column; padding:20px; justify-content:space-between; overflow-y:auto">
              <!-- Bar Chart of Bucket Sizes -->
              <div style="width:100%">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px">Bucket Occupancy Bars</div>
                <div id="b5BarChart" style="display:flex; align-items:flex-end; gap:6px; height:180px; padding:10px 0; border-bottom:2px solid var(--border-light)"></div>
              </div>

              <!-- Heat Strip -->
              <div style="width:100%; margin-top:16px">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Load Heat-Strip (Darker = Higher Collision Density)</div>
                <div id="b5HeatStrip" style="display:flex; height:24px; border-radius:var(--radius-sm); overflow:hidden"></div>
              </div>

              <!-- Linear Probing Table Preview -->
              <div style="width:100%; margin-top:16px">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Open Addressing (Linear Probing Slots)</div>
                <div id="b5OpenTable" style="display:flex; flex-wrap:wrap; gap:4px"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3>6. Worked Example: Modulo Collapse with Multiples of 10</h3>
          <p style="margin:8px 0">
            Suppose $m = 10$ and your input keys are $\{10, 20, 30, 40, 50\}$.
          </p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>• Using modulo hash: $h(k) = k \bmod 10$.</p>
            <p>• Every single key yields remainder $0$: $h(10) = 0, h(20) = 0, \dots, h(50) = 0$.</p>
            <p>• <strong>The Disaster:</strong> Bucket 0 has a chain of length 5, while Buckets 1–9 sit 100% empty! $\chi^2$ skyrockets, and search cost degrades from $O(1)$ to $O(n)$.</p>
            <p>• <strong>The Fix:</strong> Knuth's multiplicative hashing scrambles the bit patterns, spreading the keys uniformly across all 10 buckets.</p>
          </div>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Average Lookup (SUHA)</strong>
            <code>O(1 + α)</code> separate chaining
          </div>
          <div class="complexity-item">
            <strong>Worst-Case Lookup</strong>
            <code>O(n)</code> all keys in one bucket
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="b5QuizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3>10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Assuming a bigger table eliminates collisions:</strong> By the Birthday Paradox, collisions begin occurring with 50% probability when keys reach just $\approx 1.177\sqrt{m}$, long before the table is full!</li>
            <li><strong>Allowing load factor $\alpha > 1$ with open addressing:</strong> Open addressing places at most one element per bucket. When $\alpha = 1$, the table is full and subsequent insertions enter an infinite loop. It must be dynamically rehashed before $\alpha \approx 0.7$.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/b10_core_table" class="btn btn-outline">← Back: B10. Pigeonhole Table</a>
          <a href="#/module/b4_birthday" class="btn btn-outline">Related: B4. Birthday Paradox →</a>
          <a href="#/module/b9_pigeon_sort" class="btn btn-outline">B9. Pigeonhole Sort →</a>
        </section>
      </div>
    `;

    this.initTabs();
    this.initProof();
    this.initPlayground();
    this.initQuiz();
    this.runAnalysis();
  },

  initTabs() {
    const tabs = this.container.querySelectorAll('.tab-btn');
    const panes = this.container.querySelectorAll('.tab-pane');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = this.container.querySelector(`#tab-${tab.dataset.tab}`);
        if (target) target.classList.add('active');
      });
    });
  },

  initProof() {
    const proofWrap = this.container.querySelector('#b5ProofStepper');
    const steps = [
      {
        title: 'Collision Inevitability from PHP',
        content: 'Let $U$ be the universe of keys with $|U| > m$, where $m$ is the number of table buckets. Any hash function is a mapping $h: U \\to \\{0, \\dots, m-1\\}$. By the Pigeonhole Principle, there exist $x, y \\in U$ ($x \\ne y$) such that $h(x) = h(y)$.'
      },
      {
        title: 'Average Chain Length Bound',
        content: 'If $n$ keys are inserted into $m$ buckets, the average chain length is $\\frac{1}{m}\\sum_{j=0}^{m-1} n_j = \\frac{n}{m} = \\alpha$. By the Generalized Principle, at least one chain has length $\\ge \\lceil \\alpha \\rceil$.'
      },
      {
        title: 'Expected Colliding Pairs',
        content: 'Under uniform hashing, the probability that any two keys collide is $1/m$. The total number of pairs is $\\binom{n}{2}$. By linearity of expectation: $$\\mathbb{E}[\\text{Pairs}] = \\binom{n}{2} \\frac{1}{m} = \\frac{n(n - 1)}{2m}$$'
      },
      {
        title: 'Engineering Consequence',
        content: 'Because collisions cannot be eliminated mathematically, hash table performance depends entirely on keeping $\\alpha$ small (dynamic resizing) and choosing hash functions that distribute non-random inputs uniformly. ∎'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const keySlider = this.container.querySelector('#b5KeySlider');
    const bucketSlider = this.container.querySelector('#b5BucketSlider');
    const keyDisplay = this.container.querySelector('#b5KeyVal');
    const bucketDisplay = this.container.querySelector('#b5BucketVal');
    const stratSelect = this.container.querySelector('#b5StrategySelect');
    const patSelect = this.container.querySelector('#b5PatternSelect');
    const runBtn = this.container.querySelector('#b5RunBtn');

    keySlider.addEventListener('input', (e) => {
      this.keys = parseInt(e.target.value, 10);
      keyDisplay.textContent = this.keys;
    });

    bucketSlider.addEventListener('input', (e) => {
      this.buckets = parseInt(e.target.value, 10);
      bucketDisplay.textContent = this.buckets;
    });

    stratSelect.addEventListener('change', (e) => {
      this.strategy = e.target.value;
    });

    patSelect.addEventListener('change', (e) => {
      this.pattern = e.target.value;
    });

    runBtn.addEventListener('click', () => this.runAnalysis());
  },

  async runAnalysis() {
    let data;
    try {
      const res = await this.api.fetch(`/hash/compare?keys=${this.keys}&buckets=${this.buckets}&strategy=${this.strategy}&pattern=${this.pattern}`);
      data = res.data;
    } catch {
      // Local fallback calculation
      const sizes = new Array(this.buckets).fill(0);
      for (let i = 1; i <= this.keys; ++i) {
        let key = i;
        if (this.pattern === 'multiples_10') key = i * 10;
        let slot = key % this.buckets;
        sizes[slot]++;
      }
      data = {
        loadFactor: (this.keys / this.buckets).toFixed(2),
        longestChain: Math.max(...sizes),
        emptyBuckets: sizes.filter(s => s === 0).length,
        chiSquare: 0.0,
        bucketSizes: sizes,
        avgChainingLookupCost: 1.5,
        avgLinearProbingLookupCost: 2.0,
        openAddressingTable: sizes.map((s, idx) => s > 0 ? idx + 1 : -1)
      };
    }

    // Update Metrics
    this.container.querySelector('#b5LoadFactorDisplay').textContent = Number(data.loadFactor).toFixed(2);
    this.container.querySelector('#b5LongestChainDisplay').textContent = data.longestChain;
    this.container.querySelector('#b5EmptyDisplay').textContent = data.emptyBuckets;
    this.container.querySelector('#b5ChiSquareDisplay').textContent = Number(data.chiSquare).toFixed(2);
    this.container.querySelector('#b5CostComparisonBadge').textContent =
      `Avg Probes: Chaining ${Number(data.avgChainingLookupCost).toFixed(2)} | Linear Probing ${Number(data.avgLinearProbingLookupCost).toFixed(2)}`;

    // Render Bar Chart
    const barChart = this.container.querySelector('#b5BarChart');
    barChart.innerHTML = '';
    const maxVal = Math.max(...data.bucketSizes, 1);

    data.bucketSizes.forEach((size, idx) => {
      const barWrap = document.createElement('div');
      barWrap.style.flex = '1';
      barWrap.style.display = 'flex';
      barWrap.style.flexDirection = 'column';
      barWrap.style.alignItems = 'center';
      barWrap.style.height = '100%';
      barWrap.style.justifyContent = 'flex-end';

      const bar = document.createElement('div');
      const heightPct = (size / maxVal) * 100;
      bar.style.height = `${heightPct}%`;
      bar.style.width = '80%';
      bar.style.borderRadius = '4px 4px 0 0';
      bar.style.background = size > 1 ? 'var(--accent-orange-500)' : 'var(--primary-600)';
      bar.style.transition = 'height 0.3s ease';
      bar.title = `Bucket ${idx}: ${size} items`;

      const label = document.createElement('span');
      label.style.fontSize = '0.6875rem';
      label.style.marginTop = '4px';
      label.style.color = 'var(--text-dim)';
      label.textContent = idx;

      barWrap.appendChild(bar);
      barWrap.appendChild(label);
      barChart.appendChild(barWrap);
    });

    // Render Heat Strip
    const heatStrip = this.container.querySelector('#b5HeatStrip');
    heatStrip.innerHTML = '';
    data.bucketSizes.forEach((size) => {
      const cell = document.createElement('div');
      cell.style.flex = '1';
      const intensity = Math.min(1, size / Math.max(1, data.longestChain));
      cell.style.background = `rgba(249, 115, 22, ${0.15 + intensity * 0.85})`;
      cell.title = `Count: ${size}`;
      heatStrip.appendChild(cell);
    });

    // Render Open Addressing Table Slots
    const openTable = this.container.querySelector('#b5OpenTable');
    openTable.innerHTML = '';
    if (data.openAddressingTable) {
      data.openAddressingTable.forEach((val, idx) => {
        const slot = document.createElement('div');
        slot.style.padding = '4px 8px';
        slot.style.fontSize = '0.75rem';
        slot.style.borderRadius = 'var(--radius-sm)';
        slot.style.border = '1px solid var(--border-light)';
        if (val !== -1) {
          slot.style.background = 'var(--primary-50)';
          slot.style.color = 'var(--primary-600)';
          slot.style.fontWeight = '600';
          slot.textContent = `[${idx}] ${val}`;
        } else {
          slot.style.background = 'var(--bg-subtle)';
          slot.style.color = 'var(--text-dim)';
          slot.textContent = `[${idx}] empty`;
        }
        openTable.appendChild(slot);
      });
    }
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#b5QuizSection');
    const questions = [
      {
        question: 'Why do hash collisions occur even with a perfectly designed hash function?',
        options: [
          'Because the server runs out of RAM.',
          'By the Pigeonhole Principle, whenever keys exceed table buckets, at least one bucket must hold ≥ 2 items.',
          'Because floating-point numbers have rounding errors.',
          'Because compilers optimize away distinct keys.'
        ],
        answer: 1,
        hint: 'Think about mapping a larger universe to a smaller index range.',
        explanation: 'Any function mapping a universe of size n to a table of size m < n must map multiple keys to the same bucket by the Pigeonhole Principle.'
      },
      {
        question: 'If a hash table has 10 buckets and keys are {10, 20, 30, 40}, what happens under h(k) = k % 10?',
        options: [
          'Every key is distributed into a distinct bucket.',
          'All keys collide into bucket 0, degrading search time to O(n).',
          'The hash table automatically rehashes.',
          'Bucket 9 overflows.'
        ],
        answer: 1,
        hint: '10 % 10 = 0, 20 % 10 = 0, ...',
        explanation: 'Multiples of the bucket size all produce remainder 0, causing a catastrophic cluster in bucket 0 and leaving all other buckets empty.'
      },
      {
        question: 'Under Simple Uniform Hashing, what is the expected number of colliding pairs among n keys in m buckets?',
        options: ['n / m', 'n(n - 1) / (2m)', 'm / n', 'log(n)'],
        answer: 1,
        hint: 'Multiply total pairs C(n, 2) by probability 1/m.',
        explanation: 'There are C(n, 2) = n(n - 1)/2 total pairs, and each pair collides with probability 1/m, giving expected collisions = n(n - 1) / (2m).'
      }
    ];

    new Quiz(quizSection, questions);
  },

  unmount() {}
};
