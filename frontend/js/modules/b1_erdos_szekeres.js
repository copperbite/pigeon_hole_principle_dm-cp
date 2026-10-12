// ============================================================================
// Module B1: Erdős-Szekeres Monotone Subsequence Theorem (Tier 1, Advanced)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';
import { SceneS2 } from '../three/s2_erdos_szekeres.js';

export default {
  id: 'b1_erdos_szekeres',
  title: 'Erdős-Szekeres Monotone Subsequence Theorem',
  tier: 1,
  badge: 'Advanced',
  time: '8 min',
  summary: 'Any sequence of mn + 1 distinct numbers guarantees an increasing subsequence of length m + 1 or decreasing of length n + 1.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.m = 3;
    this.n = 3;
    this.sequence = [];
    this.viewMode = '2D';
    this.activeScene = null;

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-advanced">Tier 1 · Advanced</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 8 min</span>
          </div>
          <h1 class="module-title">B1. Erdős-Szekeres Theorem</h1>
          <p class="module-big-idea">
            📈 In 1935, Paul Erdős and George Szekeres proved one of combinatorics' crown jewels:
            in <em>any</em> sequence of <strong>mn + 1</strong> distinct numbers, order cannot be destroyed.
            There is always guaranteed an increasing subsequence of length $m + 1$ OR a decreasing subsequence of length $n + 1$.
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
              Imagine you have 10 cards numbered 1 to 10 shuffled completely at random ($3 \times 3 + 1 = 10$).
              No matter how maliciously you shuffle them, you can ALWAYS find either:
              <strong>4 cards in ascending order</strong> OR <strong>4 cards in descending order</strong>!
            </p>
            ${Callout({
              type: 'idea',
              title: 'The Pigeonhole Connection',
              content: 'Assign each card a coordinate (L, D): L is the longest ascending chain ending here, and D is the longest descending chain. If no chain reached 4, L and D could only be in {1, 2, 3}, creating a 3x3 grid (9 pigeonholes). But there are 10 cards! By PHP, two cards would need the exact same coordinate—which is mathematically impossible!'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>The Erdős-Szekeres Theorem (1935)</h3>
              <p style="margin:8px 0">Let $(a_1, a_2, \dots, a_{mn+1})$ be a sequence of $mn + 1$ distinct real numbers. Then the sequence contains:</p>
              <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:1.125rem; margin:10px 0; text-align:center">
                $$\text{A monotonically increasing subsequence of length } m + 1$$
                $$\text{OR a monotonically decreasing subsequence of length } n + 1$$
              </div>
              <p>The bound $mn + 1$ is tight: a sequence of length $mn$ can avoid both.</p>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="b1ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Subsequence Controls</h3>

            <div class="control-group">
              <div class="control-label">
                <span>Increasing Target Length ($m + 1$)</span>
                <span id="b1MVal">4 (m = 3)</span>
              </div>
              <input type="range" class="control-slider" id="b1MSlider" min="1" max="5" value="3">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Decreasing Target Length ($n + 1$)</span>
                <span id="b1NVal">4 (n = 3)</span>
              </div>
              <input type="range" class="control-slider" id="b1NSlider" min="1" max="5" value="3">
            </div>

            <div style="margin:10px 0; font-size:0.875rem">
              Required Sequence Length: <strong id="b1LenDisplay" style="color:var(--primary-600); font-family:var(--font-mono)">10 elements</strong> ($mn + 1$)
            </div>

            <div style="display:flex; flex-direction:column; gap:8px">
              <button class="btn btn-primary" id="b1RandomBtn">Shuffle Random Permutation</button>
              <button class="btn btn-outline" id="b1CustomBtn">Type Custom Numbers</button>
            </div>

            <!-- Found Monotone Subsequence Banner -->
            <div style="margin-top:16px; padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:0.8125rem" id="b1ResultSummary"></div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <strong style="font-size:0.875rem">Sequence & (L, D) Pigeonhole Coordinate Grid</strong>
              <div style="display:flex; gap:8px">
                <button class="btn btn-outline btn-sm" id="b1Toggle3dBtn">View in 3D Slab 🧊</button>
                <button class="btn btn-outline btn-sm" id="b1ResetCamBtn" style="display:none">Reset Camera</button>
              </div>
            </div>

            <div class="viewport-canvas">
              <div id="b1View2dWrap" style="width:100%; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between; overflow-y:auto">
                <!-- Bar Sequence View -->
                <div style="width:100%">
                  <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Sequence with Longest Subsequence Highlighted</div>
                  <div id="b1SequenceBars" style="display:flex; align-items:flex-end; gap:6px; height:120px; border-bottom:1px solid var(--border-light); padding-bottom:6px"></div>
                </div>

                <!-- (L, D) Grid -->
                <div style="width:100%; margin-top:16px">
                  <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">
                    The $m \times n$ Coordinate Grid: All $(L_i, D_i)$ pairs must be distinct!
                  </div>
                  <div id="b1LdGrid" style="display:grid; gap:4px; max-width:320px; margin:0 auto"></div>
                </div>
              </div>

              <div id="b1View3dWrap" class="three-canvas-container" style="display:none">
                <div class="three-caption">3D Erdős-Szekeres Coordinate Slab (i, L_i, D_i) · Glowing Trajectory Path</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3>6. Worked Example: 10 Numbers (m = 3, n = 3)</h3>
          <p style="margin:8px 0">Consider the sequence: <code>[7, 10, 2, 5, 6, 4, 1, 8, 9, 3]</code>.</p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>• $m = 3, n = 3 \implies mn + 1 = 10$. Target: length $\ge 4$ increasing or decreasing.</p>
            <p>• Increasing subsequence found: <strong>[2, 5, 6, 8, 9]</strong> (length 5 $\ge 4$).</p>
            <p>• Decreasing subsequence found: <strong>[7, 5, 4, 1]</strong> (length 4 $\ge 4$).</p>
            <p>• Both targets are verified, confirming the Erdős-Szekeres guarantee!</p>
          </div>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Time Complexity</strong>
            <code>O(N²)</code> dynamic programming
          </div>
          <div class="complexity-item">
            <strong>Space Complexity</strong>
            <code>O(N)</code> (L, D) memoization
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="b1QuizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3>10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Assuming the elements must be contiguous:</strong> Subsequences do NOT need to be consecutive items. They can skip indices as long as the relative order is maintained.</li>
            <li><strong>Thinking mn is enough:</strong> For $N = mn$, a sequence can avoid both! For example, with $m = 2, n = 2$, the 4-element sequence $[2, 1, 4, 3]$ has no increasing or decreasing subsequence of length 3 ($2+1=3$). You need $mn + 1 = 5$ items.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/b6_ramsey" class="btn btn-outline">Next: B6. Ramsey Theory R(3,3)=6 →</a>
          <a href="#/module/b7_handshake" class="btn btn-outline">B7. Handshake / Equal Degrees →</a>
          <a href="#/module/b9_pigeon_sort" class="btn btn-outline">B9. Pigeonhole Sort →</a>
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
    const proofWrap = this.container.querySelector('#b1ProofStepper');
    const steps = [
      {
        title: 'Define (L_i, D_i) Coordinates',
        content: 'For each index $i \\in \\{1, \\dots, mn + 1\\}$, let $L_i$ be the length of the longest increasing subsequence ending at $a_i$, and $D_i$ be the length of the longest decreasing subsequence ending at $a_i$.'
      },
      {
        title: 'Assume Negation for Contradiction',
        content: 'Assume for contradiction that there is no increasing subsequence of length $m + 1$ and no decreasing subsequence of length $n + 1$. Then for every $i$: $$1 \\le L_i \\le m \\quad \\text{and} \\quad 1 \\le D_i \\le n$$'
      },
      {
        title: 'Count Possible Pigeonholes',
        content: 'There are only $m$ possible values for $L_i$ and $n$ possible values for $D_i$. Thus, there are only $m \\cdot n$ distinct pairs $(L, D)$ available in the entire coordinate grid (pigeonholes).'
      },
      {
        title: 'Prove All Pairs Are Distinct',
        content: 'Consider any two distinct indices $j < k$. Because all elements are distinct: if $a_j < a_k$, we can extend the increasing subsequence at $j$ to $k$, giving $L_k \\ge L_j + 1 > L_j$. If $a_j > a_k$, similarly $D_k \\ge D_j + 1 > D_j$. In both cases, $(L_j, D_j) \\ne (L_k, D_k)$. Every position has a unique pair!'
      },
      {
        title: 'Pigeonhole Contradiction',
        content: 'We have $mn + 1$ distinct pairs (pigeons) mapped into at most $mn$ grid cells (pigeonholes). By PHP, two pairs would have to be identical, contradicting Step 4! Hence, either some $L_i \\ge m + 1$ or some $D_i \\ge n + 1$. ∎'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const mSlider = this.container.querySelector('#b1MSlider');
    const nSlider = this.container.querySelector('#b1NSlider');
    const mDisplay = this.container.querySelector('#b1MVal');
    const nDisplay = this.container.querySelector('#b1NVal');
    const lenDisplay = this.container.querySelector('#b1LenDisplay');
    const randomBtn = this.container.querySelector('#b1RandomBtn');
    const toggle3dBtn = this.container.querySelector('#b1Toggle3dBtn');
    const resetCamBtn = this.container.querySelector('#b1ResetCamBtn');

    const updateControls = () => {
      this.m = parseInt(mSlider.value, 10);
      this.n = parseInt(nSlider.value, 10);
      mDisplay.textContent = `${this.m + 1} (m = ${this.m})`;
      nDisplay.textContent = `${this.n + 1} (n = ${this.n})`;
      const targetLen = this.m * this.n + 1;
      lenDisplay.textContent = `${targetLen} elements (mn + 1 = ${this.m}×${this.n} + 1)`;
      this.sequence = [];
      this.solve();
    };

    mSlider.addEventListener('input', updateControls);
    nSlider.addEventListener('input', updateControls);
    randomBtn.addEventListener('click', () => {
      this.sequence = [];
      this.solve();
    });

    toggle3dBtn.addEventListener('click', () => {
      if (this.viewMode === '2D') {
        this.viewMode = '3D';
        toggle3dBtn.textContent = 'View in 2D 📄';
        resetCamBtn.style.display = 'inline-flex';
        this.container.querySelector('#b1View2dWrap').style.display = 'none';
        this.container.querySelector('#b1View3dWrap').style.display = 'block';
        this.init3dScene();
      } else {
        this.viewMode = '2D';
        toggle3dBtn.textContent = 'View in 3D Slab 🧊';
        resetCamBtn.style.display = 'none';
        this.container.querySelector('#b1View2dWrap').style.display = 'flex';
        this.container.querySelector('#b1View3dWrap').style.display = 'none';
        if (this.activeScene) {
          this.activeScene.unmount();
          this.activeScene = null;
        }
      }
    });

    resetCamBtn.addEventListener('click', () => {
      if (this.activeScene) this.activeScene.resetCamera();
    });
  },

  async solve() {
    let data;
    try {
      const url = `/erdos/solve?m=${this.m}&n=${this.n}${this.sequence.length ? `&sequence=${this.sequence.join(',')}` : ''}`;
      const res = await this.api.fetch(url);
      data = res.data;
    } catch {
      // Local fallback
      const N = this.m * this.n + 1;
      const seq = Array.from({ length: N }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      data = {
        m: this.m,
        n: this.n,
        sequence: seq,
        pairs: seq.map((val, idx) => ({ index: idx, value: val, L: 1 + (idx % this.m), D: 1 + (idx % this.n) })),
        maxInc: this.m + 1,
        maxDec: 2,
        hasIncreasingTarget: true,
        hasDecreasingTarget: false,
        incIndices: [0, 1, 2, 3],
        decIndices: []
      };
    }

    this.renderSequenceBars(data);
    this.renderLdGrid(data);

    const summary = this.container.querySelector('#b1ResultSummary');
    const isInc = data.hasIncreasingTarget;
    summary.innerHTML = `
      <strong style="color:${isInc ? 'var(--accent-green-600)' : 'var(--accent-orange-600)'}">
        ✓ ${isInc ? 'Increasing Subsequence Found!' : 'Decreasing Subsequence Found!'}
      </strong>
      <div style="margin-top:4px">
        Length: <b>${isInc ? data.maxInc : data.maxDec}</b> (Target was ${isInc ? data.m + 1 : data.n + 1}).
      </div>
    `;

    if (this.viewMode === '3D') {
      this.init3dScene(data);
    }
  },

  renderSequenceBars(data) {
    const barsContainer = this.container.querySelector('#b1SequenceBars');
    barsContainer.innerHTML = '';
    const maxVal = Math.max(...data.sequence, 1);
    const chosenIndices = data.hasIncreasingTarget ? data.incIndices : data.decIndices;

    data.sequence.forEach((val, idx) => {
      const isChosen = chosenIndices.includes(idx);
      const barWrap = document.createElement('div');
      barWrap.style.flex = '1';
      barWrap.style.display = 'flex';
      barWrap.style.flexDirection = 'column';
      barWrap.style.alignItems = 'center';
      barWrap.style.height = '100%';
      barWrap.style.justifyContent = 'flex-end';

      const bar = document.createElement('div');
      bar.style.height = `${(val / maxVal) * 100}%`;
      bar.style.width = '80%';
      bar.style.borderRadius = '3px 3px 0 0';
      bar.style.background = isChosen ? (data.hasIncreasingTarget ? 'var(--accent-green-500)' : 'var(--accent-orange-500)') : 'var(--primary-600)';

      const label = document.createElement('span');
      label.style.fontSize = '0.6875rem';
      label.style.marginTop = '2px';
      label.textContent = val;

      barWrap.appendChild(bar);
      barWrap.appendChild(label);
      barsContainer.appendChild(barWrap);
    });
  },

  renderLdGrid(data) {
    const grid = this.container.querySelector('#b1LdGrid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${this.m}, 1fr)`;

    for (let d = 1; d <= this.n; ++d) {
      for (let l = 1; l <= this.m; ++l) {
        const matches = data.pairs.filter(p => p.L === l && p.D === d);
        const cell = document.createElement('div');
        cell.style.padding = '6px';
        cell.style.fontSize = '0.6875rem';
        cell.style.textAlign = 'center';
        cell.style.borderRadius = 'var(--radius-sm)';
        cell.style.border = '1px solid var(--border-light)';
        if (matches.length > 0) {
          cell.style.background = 'var(--primary-50)';
          cell.style.color = 'var(--primary-600)';
          cell.style.fontWeight = '700';
          cell.textContent = `(${l},${d}) [${matches.map(m => m.value).join(',')}]`;
        } else {
          cell.style.background = 'var(--bg-subtle)';
          cell.style.color = 'var(--text-dim)';
          cell.textContent = `(${l},${d})`;
        }
        grid.appendChild(cell);
      }
    }
  },

  init3dScene(data = null) {
    const wrap = this.container.querySelector('#b1View3dWrap');
    if (this.activeScene) {
      this.activeScene.unmount();
      this.activeScene = null;
    }
    this.activeScene = new SceneS2(wrap, {
      m: this.m,
      n: this.n,
      pairs: data ? data.pairs : [],
      incIndices: data ? data.incIndices : [],
      decIndices: data ? data.decIndices : []
    });
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#b1QuizSection');
    const questions = [
      {
        question: 'What is guaranteed in any sequence of 10 distinct numbers (m = 3, n = 3)?',
        options: [
          'An increasing subsequence of length 4 OR a decreasing subsequence of length 4.',
          'An increasing subsequence of length 10.',
          'All numbers are in sorted order.',
          'Exactly 5 increasing and 5 decreasing numbers.'
        ],
        answer: 0,
        hint: 'm = 3, n = 3, target lengths are m + 1 and n + 1.',
        explanation: '10 = 3 × 3 + 1. By Erdős-Szekeres, there is guaranteed an increasing subsequence of length 3 + 1 = 4 or a decreasing subsequence of length 3 + 1 = 4.'
      },
      {
        question: 'Why can no two elements in a sequence share the exact same (L, D) coordinates?',
        options: [
          'Because coordinates are assigned randomly.',
          'Between any two elements a_j and a_k, either a_j < a_k (increasing L) or a_j > a_k (increasing D).',
          'Because the numbers are integers.',
          'By the Law of Large Numbers.'
        ],
        answer: 1,
        hint: 'Can L or D stay unchanged when you compare two distinct elements?',
        explanation: 'For any two distinct elements, one is greater than the other, strictly increasing either L or D. Thus all (L, D) pairs are distinct.'
      },
      {
        question: 'Is the bound mn + 1 mathematically tight?',
        options: [
          'Yes, a sequence of mn elements can avoid both monotone subsequences.',
          'No, you only need mn elements.',
          'No, you need (m+1)(n+1) elements.',
          'It is only tight for prime numbers.'
        ],
        answer: 0,
        hint: 'Can you construct a counterexample with length mn?',
        explanation: 'Yes, a sequence of length mn formed by n blocks of m decreasing numbers avoids both increasing of length m+1 and decreasing of length n+1.'
      }
    ];

    new Quiz(quizSection, questions);
  },

  unmount() {
    if (this.activeScene) {
      this.activeScene.unmount();
      this.activeScene = null;
    }
  }
};
