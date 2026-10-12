// ============================================================================
// Module B3: Divisible Subsequence (Prefix-Sum Residues) (Tier 1, Intermediate)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';

export default {
  id: 'b3_divisible',
  title: 'Divisible Subsequence (Prefix-Sum Residues)',
  tier: 1,
  badge: 'Intermediate',
  time: '6 min',
  summary: 'Among any n integers, there is guaranteed a contiguous block whose sum is divisible by n.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.numbers = [4, 7, 2, 9, 3];

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-intermediate">Tier 1 · Intermediate</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 6 min</span>
          </div>
          <h1 class="module-title">B3. Divisible Subsequence</h1>
          <p class="module-big-idea">
            🔢 Write down <em>any</em> sequence of $n$ numbers you want—positive, negative, or random.
            Without fail, there will <strong>always</strong> exist a contiguous slice whose sum is divisible by $n$.
            Why? Because the $n + 1$ prefix sums must collide modulo $n$!
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
              Take any 5 numbers, say $[4, 7, 2, 9, 3]$.
              Calculate running totals starting with 0:
              $S_0 = 0, S_1 = 4, S_2 = 11, S_3 = 13, S_4 = 22, S_5 = 25$.
              Now look at their remainders when divided by 5:
              $0, 4, 1, 3, 2, 0$.
              Notice that $S_0$ and $S_5$ both have remainder <strong>0</strong>!
              The slice from index 1 to 5 sums to $25 - 0 = 25$, which is divisible by 5!
            </p>
            ${Callout({
              type: 'idea',
              title: 'The Prefix Sum Trick',
              content: 'By including S_0 = 0, we create exactly n + 1 running sums. But division by n only has n possible remainders {0, 1, ..., n - 1}. By the Pigeonhole Principle, two sums MUST share the same remainder!'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>Formal Theorem</h3>
              <p style="margin:8px 0">Let $a_1, a_2, \dots, a_n \in \mathbb{Z}$. Define the prefix sums:</p>
              <div style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-md); text-align:center; font-size:1.125rem">
                $$S_0 = 0, \quad S_i = \sum_{j=1}^i a_j \quad (1 \le i \le n)$$
              </div>
              <p style="margin-top:8px">Since there are $n + 1$ values in $\{S_0, \dots, S_n\}$ and only $n$ residue classes modulo $n$, there exist $0 \le u < v \le n$ such that:</p>
              <div style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-md); text-align:center; font-size:1.125rem; margin-top:8px">
                $$S_v \equiv S_u \pmod n \implies \sum_{j=u+1}^v a_j = S_v - S_u \equiv 0 \pmod n$$
              </div>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="b3ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Custom Sequence Input</h3>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Input Numbers (comma separated):</label>
              <input type="text" id="b3InputArray" value="4, 7, 2, 9, 3" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main); font-family:var(--font-mono)">
            </div>

            <div style="display:flex; gap:8px; margin-top:8px">
              <button class="btn btn-primary" id="b3SolveBtn" style="flex:1">Find Divisible Block</button>
              <button class="btn btn-outline" id="b3RandomBtn">Generate Random</button>
            </div>

            <div class="verify-result-banner" id="b3Banner" style="display:none; margin-top:16px"></div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <strong style="font-size:0.875rem">Prefix Sums & Residue Buckets</strong>
              <span id="b3Status" style="font-size:0.8125rem; color:var(--text-muted)">Ready</span>
            </div>

            <div class="viewport-canvas" style="flex-direction:column; padding:20px; justify-content:space-between; overflow-y:auto">
              <!-- Original Sequence Highlight -->
              <div style="width:100%">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Input Sequence with Divisible Block Highlighted</div>
                <div id="b3NumberList" style="display:flex; flex-wrap:wrap; gap:8px"></div>
              </div>

              <!-- Prefix Sums Modulo Table -->
              <div style="width:100%; margin-top:14px">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Prefix Sums $S_i$ and Residues Mod $n$</div>
                <div id="b3PrefixTable" style="display:flex; flex-wrap:wrap; gap:8px"></div>
              </div>

              <!-- Residue Buckets Grid -->
              <div style="width:100%; margin-top:14px">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Residue Buckets $\{0, 1, \dots, n-1\}$</div>
                <div id="b3ResidueBuckets" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3>6. Famous Puzzle: Consecutive Block Divisible by 10</h3>
          <p style="margin:8px 0">
            <strong>Puzzle:</strong> Show that among any 10 positive integers, some non-empty consecutive block sums to a multiple of 10.
          </p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>1. Given 10 integers $a_1, \dots, a_{10}$.</p>
            <p>2. Form the 11 prefix sums: $S_0 = 0, S_1 = a_1, \dots, S_{10} = a_1 + \dots + a_{10}$.</p>
            <p>3. Pigeons = 11 prefix sums. Pigeonholes = 10 possible remainders mod 10 ($\{0, 1, 2, \dots, 9\}$).</p>
            <p>4. By PHP ($11 > 10$), two prefix sums share the same remainder: $S_u \equiv S_v \pmod{10}$.</p>
            <p>5. The block $a_{u+1} + \dots + a_v = S_v - S_u$ is divisible by 10. Guaranteed!</p>
          </div>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Time Complexity</strong>
            <code>O(n)</code> single prefix sum pass
          </div>
          <div class="complexity-item">
            <strong>Space Complexity</strong>
            <code>O(n)</code> residue lookup table
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="b3QuizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3>10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Forgetting S₀ = 0:</strong> If you only check $S_1, \dots, S_n$, you only have $n$ prefix sums in $n$ residue classes. You need $S_0 = 0$ to get $n + 1$ values, guaranteeing a collision!</li>
            <li><strong>Assuming non-consecutive elements:</strong> The proof guarantees a <em>contiguous</em> subsegment $[a_{u+1}, \dots, a_v]$, not just a random subset.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/b2_dirichlet" class="btn btn-outline">Next: B2. Dirichlet Approximation →</a>
          <a href="#/module/b4_birthday" class="btn btn-outline">B4. Birthday Paradox →</a>
          <a href="#/module/g3_number_theory" class="btn btn-outline">G3. Number Theory Gallery →</a>
        </section>
      </div>
    `;

    this.initTabs();
    this.initProof();
    this.initPlayground();
    this.initQuiz();
    this.solve();
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
    const proofWrap = this.container.querySelector('#b3ProofStepper');
    const steps = [
      {
        title: 'Define the Prefix Sums',
        content: 'Let the given numbers be $a_1, a_2, \\dots, a_n$. Consider the $n + 1$ prefix sums: $$S_0 = 0, \\quad S_1 = a_1, \\quad S_2 = a_1 + a_2, \\quad \\dots, \\quad S_n = \\sum_{i=1}^n a_i$$'
      },
      {
        title: 'Map into Residue Classes',
        content: 'Map each $S_i$ to its remainder modulo $n$: $r_i = S_i \\bmod n \\in \\{0, 1, \\dots, n - 1\\}$. We have $n + 1$ prefix sums (pigeons) and $n$ possible remainders (holes).'
      },
      {
        title: 'Apply the Pigeonhole Principle',
        content: 'Since $n + 1 > n$, by the Pigeonhole Principle there must exist indices $u < v$ such that $S_u \\equiv S_v \\pmod n$.'
      },
      {
        title: 'Evaluate the Difference',
        content: 'Subtracting the two prefix sums gives: $$S_v - S_u = \\sum_{j=u+1}^v a_j \\equiv 0 \\pmod n$$ Since $u < v$, the block $a_{u+1}, \\dots, a_v$ is non-empty, and its sum is divisible by $n$. ∎'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const solveBtn = this.container.querySelector('#b3SolveBtn');
    const randomBtn = this.container.querySelector('#b3RandomBtn');
    const inputField = this.container.querySelector('#b3InputArray');

    solveBtn.addEventListener('click', () => {
      const parsed = inputField.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      if (parsed.length > 0) {
        this.numbers = parsed;
        this.solve();
      }
    });

    randomBtn.addEventListener('click', () => {
      const len = 5 + Math.floor(Math.random() * 4);
      this.numbers = Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1);
      inputField.value = this.numbers.join(', ');
      this.solve();
    });
  },

  async solve() {
    const banner = this.container.querySelector('#b3Banner');
    const numList = this.container.querySelector('#b3NumberList');
    const prefixTable = this.container.querySelector('#b3PrefixTable');
    const residueBuckets = this.container.querySelector('#b3ResidueBuckets');

    let data;
    try {
      const res = await this.api.fetch(`/divisible/solve?numbers=${this.numbers.join(',')}`);
      data = res.data;
    } catch {
      // Local fallback
      const n = this.numbers.length;
      const pref = [0];
      const resids = [0];
      for (let i = 0; i < n; ++i) {
        pref.push(pref[i] + this.numbers[i]);
        resids.push(pref[i + 1] % n);
      }
      let u = 0, v = 1;
      const seen = { 0: 0 };
      for (let i = 1; i <= n; ++i) {
        if (seen[resids[i]] !== undefined) {
          u = seen[resids[i]];
          v = i;
          break;
        }
        seen[resids[i]] = i;
      }
      data = {
        n,
        numbers: this.numbers,
        prefixSums: pref,
        residues: resids,
        startPrefixIndex: u,
        endPrefixIndex: v,
        startIndex: u,
        endIndex: v - 1,
        block: this.numbers.slice(u, v),
        blockSum: pref[v] - pref[u],
        isDivisible: true
      };
    }

    // Render Input Sequence Highlight
    numList.innerHTML = data.numbers.map((num, idx) => {
      const isInside = idx >= data.startIndex && idx <= data.endIndex;
      return `
        <div style="padding:6px 12px; border-radius:var(--radius-sm); border:2px solid ${isInside ? 'var(--accent-orange-500)' : 'var(--border-light)'}; background:${isInside ? 'var(--accent-orange-50)' : 'var(--bg-surface)'}; font-weight:700">
          <span style="font-size:0.6875rem; color:var(--text-dim); display:block">#${idx + 1}</span>
          ${num}
        </div>
      `;
    }).join('');

    // Render Prefix Sums
    prefixTable.innerHTML = data.prefixSums.map((sum, idx) => {
      const isColliding = idx === data.startPrefixIndex || idx === data.endPrefixIndex;
      return `
        <div style="padding:6px 10px; border-radius:var(--radius-sm); background:${isColliding ? 'var(--primary-50)' : 'var(--bg-subtle)'}; border:1px solid ${isColliding ? 'var(--primary-500)' : 'var(--border-light)'}; font-size:0.8125rem">
          <div><b>S_${idx}</b> = ${sum}</div>
          <div style="color:var(--primary-600); font-weight:700">mod ${data.n} = ${data.residues[idx]}</div>
        </div>
      `;
    }).join('');

    // Render Residue Buckets
    const bucketsMap = Array.from({ length: data.n }, () => []);
    data.residues.forEach((r, idx) => bucketsMap[r].push(idx));

    residueBuckets.innerHTML = bucketsMap.map((indices, r) => {
      const hasCollision = indices.length > 1;
      return `
        <div class="hole-box ${hasCollision ? 'has-collision' : ''}" style="min-width:70px">
          <span class="hole-box-label">mod = ${r}</span>
          <span class="hole-box-count">${indices.length} items</span>
          <div style="display:flex; gap:4px; margin-top:4px">
            ${indices.map(i => `<span class="pigeon-token ${hasCollision ? 'collision-glow' : ''}" style="width:24px; height:24px; font-size:0.6875rem">S${i}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');

    banner.style.display = 'flex';
    banner.className = 'verify-result-banner verified';
    banner.innerHTML = `
      <span>✓ Found Divisible Subarray:</span>
      [${data.block.join(', ')}] with Sum = <b>${data.blockSum}</b> (S_${data.endPrefixIndex} - S_${data.startPrefixIndex}).
      ${data.blockSum} ÷ ${data.n} = ${data.blockSum / data.n} (Remainder 0)!
    `;
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#b3QuizSection');
    const questions = [
      {
        question: 'Why do we consider n + 1 prefix sums {S₀, S₁, ..., Sₙ} instead of just n?',
        options: [
          'Because computers are 0-indexed.',
          'To guarantee strictly more pigeons (n + 1) than residue holes (n).',
          'Because the sum can be negative.',
          'To speed up memory caching.'
        ],
        answer: 1,
        hint: 'How many objects do you need to guarantee a collision among n holes?',
        explanation: 'There are n possible remainders mod n. To guarantee a collision by the Pigeonhole Principle, you need at least n + 1 values. Including S₀ = 0 provides the required n + 1st pigeon.'
      },
      {
        question: 'If S_v mod n = S_u mod n (with u < v), what is the sum of the block from a_{u+1} to a_v?',
        options: ['Always 0', 'A multiple of n', 'n + 1', 'Prime'],
        answer: 1,
        hint: 'S_v - S_u mod n = 0.',
        explanation: 'S_v - S_u = a_{u+1} + ... + a_v. Since S_v and S_u have the same remainder mod n, their difference is divisible by n.'
      },
      {
        question: 'Does the divisible subsequence theorem require all input numbers to be positive?',
        options: [
          'Yes, negative numbers break modular arithmetic.',
          'No, the proof holds for any integers positive, negative, or zero.',
          'Only if n is prime.',
          'Only if the array is sorted.'
        ],
        answer: 1,
        hint: 'Does modular arithmetic apply to all integers Z?',
        explanation: 'The theorem holds for any integers in Z because the residue class partition applies to all integers regardless of sign.'
      }
    ];

    new Quiz(quizSection, questions);
  },

  unmount() {}
};
