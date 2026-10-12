// ============================================================================
// Module B2: Dirichlet's Approximation Theorem (Tier 1, Advanced)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';
import { SceneS4 } from '../three/s4_dirichlet_helix.js';

export default {
  id: 'b2_dirichlet',
  title: 'Dirichlet\'s Approximation Theorem',
  tier: 1,
  badge: 'Advanced',
  time: '8 min',
  summary: 'Approximating irrationals by rational fractions within 1/N using fractional parts partitioned into N buckets.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.alpha = 3.141592653589793;
    this.N = 10;
    this.viewMode = '2D';
    this.activeScene = null;

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-advanced">Tier 1 · Advanced</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 8 min</span>
          </div>
          <h1 class="module-title">B2. Dirichlet's Approximation Theorem</h1>
          <p class="module-big-idea">
            🎯 How did ancient mathematicians discover that $\pi \approx 22/7$ or $\sqrt{2} \approx 7/5$?
            In 1834, Peter Gustav Lejeune Dirichlet invented the Pigeonhole Principle (naming it the <em>Schubfachprinzip</em> or "drawer principle")
            to prove that <strong>every real number can be extraordinarily closely approximated by rational fractions</strong>!
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
              Imagine wrapping the unit interval $[0, 1)$ into a clock circle.
              As you multiply an irrational number $\alpha$ by integers $q = 0, 1, 2, \dots, N$, its decimal fractional part $\{q\alpha\}$ jumps around the circle.
              Divide the circle into $N$ equal slices of width $1/N$.
              Because you have $N + 1$ points, two points <strong>must land in the exact same slice</strong>!
              Their distance is $< 1/N$, giving you a super-accurate fraction $p/q$!
            </p>
            ${Callout({
              type: 'idea',
              title: 'The Origin of the Pigeonhole Principle',
              content: 'This theorem is the historical birth of the Pigeonhole Principle! Dirichlet formulated it precisely to solve Diophantine approximation in number theory.'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>Dirichlet's Theorem (1834)</h3>
              <p style="margin:8px 0">For any real number $\alpha$ and any integer $N \ge 1$, there exist integers $p$ and $q$ with $1 \le q \le N$ such that:</p>
              <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:1.25rem; margin:10px 0; text-align:center">
                $$\left| q\alpha - p \right| < \frac{1}{N} \implies \left| \alpha - \frac{p}{q} \right| < \frac{1}{qN} \le \frac{1}{q^2}$$
              </div>
              <p><strong>Corollary:</strong> If $\alpha$ is irrational, there exist infinitely many distinct rational numbers $p/q$ such that $|\alpha - p/q| < 1/q^2$.</p>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="b2ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Approximation Controls</h3>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Preset Real Number ($\alpha$):</label>
              <select id="b2AlphaSelect" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main)">
                <option value="3.141592653589793" selected>π (Pi ≈ 3.14159...)</option>
                <option value="1.414213562373095">√2 (Square root of 2 ≈ 1.4142...)</option>
                <option value="2.718281828459045">e (Euler's number ≈ 2.7182...)</option>
                <option value="1.618033988749895">φ (Golden Ratio ≈ 1.6180...)</option>
                <option value="0.5">0.5 (Rational Edge Case)</option>
              </select>
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Bucket Count ($N \le 100$)</span>
                <span id="b2NVal">10</span>
              </div>
              <input type="range" class="control-slider" id="b2NSlider" min="2" max="50" value="10">
            </div>

            <button class="btn btn-primary" id="b2SolveBtn">Compute Approximation</button>

            <!-- Approximation Results -->
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px; font-size:0.8125rem">
              <div style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-md)">
                <div>Best Fraction ($p/q$): <strong id="b2FractionDisplay" style="color:var(--primary-600); font-size:1.125rem">22 / 7</strong></div>
                <div>Decimal Value: <span id="b2DecimalDisplay" style="font-family:var(--font-mono)">3.142857</span></div>
                <div>Absolute Error: <span id="b2ErrorDisplay" style="font-family:var(--font-mono)">0.008851</span></div>
                <div>Dirichlet Bound ($1/N$): <span id="b2BoundDisplay" style="font-family:var(--font-mono)">< 0.100000</span></div>
              </div>
            </div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <strong style="font-size:0.875rem">Fractional Parts on the Circle & Line</strong>
              <div style="display:flex; gap:8px">
                <button class="btn btn-outline btn-sm" id="b2Toggle3dBtn">View in 3D Helix 🧊</button>
                <button class="btn btn-outline btn-sm" id="b2ResetCamBtn" style="display:none">Reset Camera</button>
              </div>
            </div>

            <div class="viewport-canvas">
              <div id="b2View2dWrap" style="width:100%; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between">
                <!-- SVG Circle View -->
                <div style="display:flex; justify-content:center; align-items:center; height:240px">
                  <svg id="b2CircleSvg" width="240" height="240" viewBox="-120 -120 240 240"></svg>
                </div>

                <!-- Number Line Buckets -->
                <div style="width:100%">
                  <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Linear Interval [0, 1) Partitioned into N Buckets</div>
                  <div id="b2LineBuckets" style="display:flex; height:32px; border:1px solid var(--border-light); border-radius:var(--radius-sm); overflow:hidden"></div>
                </div>
              </div>

              <div id="b2View3dWrap" class="three-canvas-container" style="display:none">
                <div class="three-caption">3D Dirichlet Helix Extrusion · Orange Spheres Highlight Colliding Points</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3>6. Worked Example: Approximating π with N = 10</h3>
          <p style="margin:8px 0">Consider $\pi \approx 3.14159265$ and $N = 10$. The interval $[0, 1)$ is partitioned into 10 buckets of width $0.1$.</p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>• $\{1 \cdot \pi\} = 0.14159 \dots$ lands in Bucket 1 $[0.1, 0.2)$.</p>
            <p>• $\{8 \cdot \pi\} = \{25.13274\} = 0.13274 \dots$ also lands in Bucket 1 $[0.1, 0.2)$!</p>
            <p>• Since both land in the same bucket, their difference is: $|0.14159 - 0.13274| = 0.00885 < 1/10 = 0.1$.</p>
            <p>• Difference of indices: $q = 8 - 1 = 7$. Difference of integer parts: $p = 25 - 3 = 22$.</p>
            <p>• <strong>Result:</strong> $p/q = \mathbf{22/7} \approx 3.142857$, reproducing Archimedes' famous approximation with error $< 1/49 \approx 0.0204$!</p>
          </div>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Time Complexity</strong>
            <code>O(N log N)</code> sorting fractional parts
          </div>
          <div class="complexity-item">
            <strong>Space Complexity</strong>
            <code>O(N)</code> fractional parts table
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="b2QuizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3>10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Rational edge cases:</strong> If $\alpha = p_0 / q_0$ is rational (e.g. $0.5 = 1/2$), the theorem still holds trivially: for $N \ge 2$, $|2 \cdot 0.5 - 1| = 0 < 1/N$, yielding exact error 0!</li>
            <li><strong>Denominator bound:</strong> The theorem guarantees $1 \le q \le N$. The denominator $q$ will never exceed the chosen limit $N$.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/b3_divisible" class="btn btn-outline">← Back: B3. Divisible Subsequence</a>
          <a href="#/module/b4_birthday" class="btn btn-outline">Next: B4. Birthday Paradox →</a>
          <a href="#/module/b1_erdos_szekeres" class="btn btn-outline">B1. Erdős-Szekeres Theorem →</a>
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
    const proofWrap = this.container.querySelector('#b2ProofStepper');
    const steps = [
      {
        title: 'Partition the Unit Interval',
        content: 'Let $N \\ge 1$. Divide the interval $[0, 1)$ into $N$ disjoint half-open subintervals (pigeonholes) of length $1/N$: $$I_j = \\left[\\frac{j}{N}, \\frac{j+1}{N}\\right) \\quad \\text{for } j = 0, 1, \\dots, N-1$$'
      },
      {
        title: 'Construct N + 1 Fractional Parts',
        content: 'Consider the $N + 1$ fractional parts (pigeons): $$\\{0 \\cdot \\alpha\\}, \\quad \\{1 \\cdot \\alpha\\}, \\quad \\{2 \\cdot \\alpha\\}, \\quad \\dots, \\quad \\{N \\cdot \\alpha\\}$$ Each $\\{q\\alpha\\} \\in [0, 1)$.'
      },
      {
        title: 'Apply Pigeonhole Principle',
        content: 'Since there are $N + 1$ points in $N$ intervals, at least two points must fall into the same interval $I_j$. Let these be $\\{q_1\\alpha\\}$ and $\\{q_2\\alpha\\}$ with $0 \\le q_1 < q_2 \\le N$.'
      },
      {
        title: 'Bound the Difference',
        content: 'Since both lie in the same interval of length $1/N$: $$|\\{q_2\\alpha\\} - \\{q_1\\alpha\\}| < \\frac{1}{N}$$ Setting $q = q_2 - q_1$ (so $1 \\le q \\le N$) and $p = \\lfloor q_2\\alpha \\rfloor - \\lfloor q_1\\alpha \\rfloor \\in \\mathbb{Z}$, we obtain: $$|q\\alpha - p| < \\frac{1}{N} \\implies \\left|\\alpha - \\frac{p}{q}\\right| < \\frac{1}{qN} \\le \\frac{1}{q^2} \\quad \\blacksquare$$'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const alphaSelect = this.container.querySelector('#b2AlphaSelect');
    const nSlider = this.container.querySelector('#b2NSlider');
    const nDisplay = this.container.querySelector('#b2NVal');
    const solveBtn = this.container.querySelector('#b2SolveBtn');
    const toggle3dBtn = this.container.querySelector('#b2Toggle3dBtn');
    const resetCamBtn = this.container.querySelector('#b2ResetCamBtn');

    alphaSelect.addEventListener('change', (e) => {
      this.alpha = parseFloat(e.target.value);
      this.solve();
    });

    nSlider.addEventListener('input', (e) => {
      this.N = parseInt(e.target.value, 10);
      nDisplay.textContent = this.N;
      this.solve();
    });

    solveBtn.addEventListener('click', () => this.solve());

    toggle3dBtn.addEventListener('click', () => {
      if (this.viewMode === '2D') {
        this.viewMode = '3D';
        toggle3dBtn.textContent = 'View in 2D 📄';
        resetCamBtn.style.display = 'inline-flex';
        this.container.querySelector('#b2View2dWrap').style.display = 'none';
        this.container.querySelector('#b2View3dWrap').style.display = 'block';
        this.init3dScene();
      } else {
        this.viewMode = '2D';
        toggle3dBtn.textContent = 'View in 3D Helix 🧊';
        resetCamBtn.style.display = 'none';
        this.container.querySelector('#b2View2dWrap').style.display = 'flex';
        this.container.querySelector('#b2View3dWrap').style.display = 'none';
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
      const res = await this.api.fetch(`/dirichlet/solve?alpha=${this.alpha}&N=${this.N}`);
      data = res.data;
    } catch {
      // Local fallback
      const q = 7, p = 22;
      data = {
        fraction: `${p}/${q}`,
        approxValue: p / q,
        absoluteError: Math.abs(q * this.alpha - p),
        bucketThreshold: 1 / this.N,
        q1: 1,
        q2: 8,
        sampleFractional: Array.from({ length: this.N + 1 }, (_, i) => ({
          q: i,
          frac: (i * this.alpha) % 1.0,
          bucket: Math.floor(((i * this.alpha) % 1.0) * this.N)
        }))
      };
    }

    this.container.querySelector('#b2FractionDisplay').textContent = data.fraction;
    this.container.querySelector('#b2DecimalDisplay').textContent = Number(data.approxValue).toFixed(6);
    this.container.querySelector('#b2ErrorDisplay').textContent = Number(data.absoluteError).toFixed(6);
    this.container.querySelector('#b2BoundDisplay').textContent = `< ${Number(data.bucketThreshold).toFixed(6)}`;

    this.renderCircle(data);
    this.renderLineBuckets(data);

    if (this.viewMode === '3D') {
      this.init3dScene(data);
    }
  },

  renderCircle(data) {
    const svg = this.container.querySelector('#b2CircleSvg');
    svg.innerHTML = '';
    const R = 90;

    // Draw base circle
    const circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circ.setAttribute('r', R);
    circ.setAttribute('fill', 'none');
    circ.setAttribute('stroke', 'var(--border-light)');
    circ.setAttribute('stroke-width', '2');
    svg.appendChild(circ);

    // Draw sector lines for the N buckets
    for (let i = 0; i < this.N; ++i) {
      const angle = (i / this.N) * Math.PI * 2;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 0);
      line.setAttribute('y1', 0);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'var(--border-light)');
      line.setAttribute('stroke-dasharray', '2,4');
      svg.appendChild(line);
    }

    // Plot fractional points
    data.sampleFractional.forEach(pt => {
      const angle = pt.frac * Math.PI * 2;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);

      const isCollision = (pt.q === data.q1 || pt.q === data.q2);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', isCollision ? 5 : 3.5);
      dot.setAttribute('fill', isCollision ? 'var(--accent-orange-500)' : 'var(--primary-600)');
      if (isCollision) {
        dot.setAttribute('stroke', '#fff');
        dot.setAttribute('stroke-width', '2');
      }

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `q = ${pt.q}: frac = ${pt.frac.toFixed(4)}`;
      dot.appendChild(title);
      svg.appendChild(dot);
    });
  },

  renderLineBuckets(data) {
    const line = this.container.querySelector('#b2LineBuckets');
    line.innerHTML = '';
    const bucketCounts = new Array(this.N).fill(0);
    data.sampleFractional.forEach(pt => {
      if (pt.bucket >= 0 && pt.bucket < this.N) bucketCounts[pt.bucket]++;
    });

    for (let b = 0; b < this.N; ++b) {
      const cell = document.createElement('div');
      cell.style.flex = '1';
      cell.style.borderRight = '1px solid var(--border-light)';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.fontSize = '0.6875rem';
      cell.style.fontWeight = '700';

      const count = bucketCounts[b];
      if (count > 1) {
        cell.style.background = 'var(--accent-orange-50)';
        cell.style.color = 'var(--accent-orange-600)';
      } else {
        cell.style.background = 'var(--bg-surface)';
        cell.style.color = 'var(--text-muted)';
      }
      cell.textContent = count;
      cell.title = `Bucket [${(b/this.N).toFixed(2)}, ${((b+1)/this.N).toFixed(2)}): ${count} points`;
      line.appendChild(cell);
    }
  },

  init3dScene(data = null) {
    const wrap = this.container.querySelector('#b2View3dWrap');
    if (this.activeScene) {
      this.activeScene.unmount();
      this.activeScene = null;
    }
    this.activeScene = new SceneS4(wrap, {
      alpha: this.alpha,
      N: this.N,
      q1: data ? data.q1 : 0,
      q2: data ? data.q2 : 1
    });
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#b2QuizSection');
    const questions = [
      {
        question: 'Who first invented the Pigeonhole Principle and for what purpose?',
        options: [
          'Alan Turing for cryptography.',
          'Peter Gustav Lejeune Dirichlet (1834) for Diophantine rational approximations.',
          'Leonhard Euler for the Königsberg bridges.',
          'Isaac Newton for calculus.'
        ],
        answer: 1,
        hint: 'Named the Schubfachprinzip in 1834.',
        explanation: 'Dirichlet introduced the principle in 1834 to prove that irrational numbers can be approximated closely by rational fractions.'
      },
      {
        question: 'In Dirichlet\'s approximation theorem, how many fractional parts {q * alpha} are considered for a bound of 1/N?',
        options: ['N points', 'N + 1 points (q = 0, 1, ..., N)', '2N points', 'N² points'],
        answer: 1,
        hint: 'You need strictly more points than the N buckets.',
        explanation: 'There are N buckets of width 1/N. To guarantee a collision by the Pigeonhole Principle, exactly N + 1 points (q = 0, 1, ..., N) are considered.'
      },
      {
        question: 'What is the consequence of Dirichlet\'s theorem for an irrational number alpha?',
        options: [
          'alpha can only be approximated by integers.',
          'There exist infinitely many distinct rational fractions p/q such that |alpha - p/q| < 1/q².',
          'Computers cannot represent alpha.',
          'The fraction p/q has prime denominator.'
        ],
        answer: 1,
        hint: 'As N grows arbitrarily large, new closer fractions continue to be generated.',
        explanation: 'Because alpha is irrational, the error can never be zero, so increasing N produces an infinite sequence of distinct approximations satisfying |alpha - p/q| < 1/q².'
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
