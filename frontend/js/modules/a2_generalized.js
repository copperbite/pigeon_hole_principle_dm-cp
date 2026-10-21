// ============================================================================
// Module A2: Generalized Pigeonhole Principle (Tier 1, Beginner)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';
import { SceneS1 } from '../three/s1_falling_boxes.js';

export default {
  id: 'a2_generalized',
  title: 'Generalized Pigeonhole Principle',
  tier: 1,
  badge: 'Beginner',
  time: '5 min',
  summary: 'Placing n objects into k boxes guarantees at least one box contains ⌈n/k⌉ or more objects.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.objects = 14;
    this.boxes = 4;
    this.strategy = 'adversarial';
    this.viewMode = '2D';
    this.activeScene = null;

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-beginner">Tier 1 · Beginner</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 5 min</span>
          </div>
          <h1 class="module-title">A2. Generalized Pigeonhole Principle</h1>
          <p class="module-big-idea">
            📊 When you pack many objects into a few containers, the simple principle is not enough.
            The Generalized Principle guarantees that at least one container must hold at least <strong>⌈n / k⌉</strong> items,
            and no distribution strategy—not even an intelligent adversary—can beat this ceiling bound.
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
              If you have <strong>25 students</strong> and <strong>12 birth months</strong>, can every month have at most 2 birthdays?
              If that were true, the total number of students would be at most $12 \times 2 = 24$.
              Where does the 25th student go? Some month <em>must</em> contain at least <strong>3 birthdays</strong> ($\lceil 25/12 \rceil = 3$).
            </p>
            ${Callout({
              type: 'idea',
              title: 'Tightness of the Bound',
              content: 'The bound ⌈n/k⌉ is mathematically tight: by distributing items as evenly as possible (adversarial strategy), the maximum occupancy equals exactly ⌈n/k⌉.'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>Formal Mathematical Statement</h3>
              <p style="margin:8px 0">If $n$ objects are distributed among $k$ boxes, then at least one box contains at least:</p>
              <div style="padding:14px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:1.25rem; margin:12px 0; text-align:center">
                $$\left\lceil \frac{n}{k} \right\rceil = \left\lfloor \frac{n + k - 1}{k} \right\rfloor \quad \text{objects}$$
              </div>
              <p>Furthermore, at least one box contains at most $\lfloor n / k \rfloor$ objects.</p>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="a2ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Distribution Strategies</h3>

            <div class="control-group">
              <div class="control-label">
                <span>Objects ($n$)</span>
                <span id="a2ObjVal">14</span>
              </div>
              <input type="range" class="control-slider" id="a2ObjSlider" min="1" max="30" value="14">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Boxes ($k$)</span>
                <span id="a2BoxVal">4</span>
              </div>
              <input type="range" class="control-slider" id="a2BoxSlider" min="1" max="12" value="4">
            </div>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Distribution Strategy:</label>
              <select id="a2StrategySelect" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main)">
                <option value="adversarial" selected>Adversarial (Spread as evenly as possible)</option>
                <option value="round-robin">Round-Robin (Modulo sequence)</option>
                <option value="random">Random Distribution (Stochastic)</option>
              </select>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px">
              <button class="btn btn-primary" id="a2DistributeBtn">Distribute Objects</button>
              <button class="btn btn-verify" id="a2VerifyBtn">✓ Verify Bound</button>
            </div>

            <div class="verify-result-banner" id="a2VerifyBanner" style="display:none"></div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <span id="a2ViewportStatus" style="font-size:0.875rem; font-weight:600; color:var(--text-muted)">
                Guaranteed Bound: ⌈14/4⌉ = 4
              </span>
              <div style="display:flex; gap:8px">
                <button class="btn btn-outline btn-sm" id="a2Toggle3dBtn">View in 3D 🧊</button>
                <button class="btn btn-outline btn-sm" id="a2ResetCamBtn" style="display:none">Reset Camera</button>
              </div>
            </div>

            <div class="viewport-canvas">
              <div id="a2View2dWrap" style="width:100%; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between">
                <div>
                  <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px">Objects Waiting</div>
                  <div id="a2PigeonsWaiting" style="display:flex; flex-wrap:wrap; gap:6px; min-height:40px"></div>
                </div>
                <div style="text-align:center; color:var(--text-dim); font-size:1.25rem">↓</div>
                <div>
                  <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px">Buckets</div>
                  <div id="a2BoxesGrid" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center"></div>
                </div>
              </div>

              <div id="a2View3dWrap" class="three-canvas-container" style="display:none">
                <div class="three-caption">3D Generalized Pigeonhole Visualization · OrbitControls Active</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3>6. Worked Example: 100 Cards Across 7 Piles</h3>
          <p style="margin:8px 0">
            <strong>Problem:</strong> If you place 100 distinct cards into 7 piles, what is the guaranteed minimum count of the largest pile?
          </p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>• Objects $n = 100$, Boxes $k = 7$.</p>
            <p>• Compute ceiling: $\lceil 100 / 7 \rceil = \lceil 14.2857 \dots \rceil = 15$.</p>
            <p>• <strong>Conclusion:</strong> At least one pile MUST have at least <strong>15 cards</strong>! If all piles had $\le 14$ cards, the total would be at most $7 \times 14 = 98 < 100$, leaving 2 cards unaccounted for.</p>
          </div>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Time Complexity</strong>
            <code>O(n)</code> (Adversarial min-heap/scan)
          </div>
          <div class="complexity-item">
            <strong>Space Complexity</strong>
            <code>O(k)</code> box counts
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="a2QuizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3>10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Using floor instead of ceiling:</strong> The principle guarantees $\lceil n/k \rceil$, NOT $\lfloor n/k \rfloor$. If $n = 5$ and $k = 2$, $\lfloor 5/2 \rfloor = 2$, but the guarantee is $\lceil 5/2 \rceil = 3$.</li>
            <li><strong>Integer division truncating:</strong> In programming (C++ / JS), integer <code>n / k</code> truncates. The correct integer arithmetic formula is <code>(n + k - 1) / k</code>.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/a1_simple" class="btn btn-outline">← Back: A1. Simple Principle</a>
          <a href="#/module/a4_socks_draws" class="btn btn-outline">Next: A4. Minimum Draws / Socks →</a>
          <a href="#/module/a5_strong_weighted" class="btn btn-outline">A5. Strong / Weighted →</a>
        </section>
      </div>
    `;

    this.initTabs();
    this.initProof();
    this.initPlayground();
    this.initQuiz();
    this.render2d();
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
    const proofWrap = this.container.querySelector('#a2ProofStepper');
    const steps = [
      {
        title: 'Assume Negation for Contradiction',
        content: 'Assume that $n$ objects are distributed into $k$ boxes, but <em>every box contains strictly fewer than $\\lceil n/k \\rceil$ objects</em>.'
      },
      {
        title: 'Integer Upper Bound on Each Box',
        content: 'Since the number of objects in each box must be an integer, if a box has $< \\lceil n/k \\rceil$ objects, it has at most $\\lceil n/k \\rceil - 1$ objects.'
      },
      {
        title: 'Sum Over All Boxes',
        content: 'Summing over all $k$ boxes, the total number of objects $N$ satisfies: $$N \\le k \\left(\\left\\lceil \\frac{n}{k} \\right\\rceil - 1\\right)$$'
      },
      {
        title: 'Apply Ceiling Inequality',
        content: 'By the fundamental definition of the ceiling function, $\\lceil x \\rceil < x + 1$, which means $\\lceil n/k \\rceil - 1 < n/k$. Multiplying by $k$ yields: $$k \\left(\\left\\lceil \\frac{n}{k} \\right\\rceil - 1\\right) < k \\left(\\frac{n}{k}\\right) = n$$'
      },
      {
        title: 'Contradiction Established',
        content: 'This implies that total objects $N < n$. But we placed exactly $n$ objects! This contradiction proves that at least one box must contain at least $\\lceil n/k \\rceil$ objects. ∎'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const objSlider = this.container.querySelector('#a2ObjSlider');
    const boxSlider = this.container.querySelector('#a2BoxSlider');
    const objDisplay = this.container.querySelector('#a2ObjVal');
    const boxDisplay = this.container.querySelector('#a2BoxVal');
    const stratSelect = this.container.querySelector('#a2StrategySelect');
    const distBtn = this.container.querySelector('#a2DistributeBtn');
    const verifyBtn = this.container.querySelector('#a2VerifyBtn');
    const toggle3dBtn = this.container.querySelector('#a2Toggle3dBtn');
    const resetCamBtn = this.container.querySelector('#a2ResetCamBtn');

    objSlider.addEventListener('input', (e) => {
      this.objects = parseInt(e.target.value, 10);
      objDisplay.textContent = this.objects;
      this.render2d();
    });

    boxSlider.addEventListener('input', (e) => {
      this.boxes = parseInt(e.target.value, 10);
      boxDisplay.textContent = this.boxes;
      this.render2d();
    });

    stratSelect.addEventListener('change', (e) => {
      this.strategy = e.target.value;
      this.render2d();
    });

    distBtn.addEventListener('click', () => this.runDistribution());
    verifyBtn.addEventListener('click', () => this.runVerification());

    toggle3dBtn.addEventListener('click', () => {
      if (this.viewMode === '2D') {
        this.viewMode = '3D';
        toggle3dBtn.textContent = 'View in 2D 📄';
        resetCamBtn.style.display = 'inline-flex';
        this.container.querySelector('#a2View2dWrap').style.display = 'none';
        this.container.querySelector('#a2View3dWrap').style.display = 'block';
        this.init3dScene();
      } else {
        this.viewMode = '2D';
        toggle3dBtn.textContent = 'View in 3D 🧊';
        resetCamBtn.style.display = 'none';
        this.container.querySelector('#a2View2dWrap').style.display = 'flex';
        this.container.querySelector('#a2View3dWrap').style.display = 'none';
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

  render2d() {
    const pigeonsWaiting = this.container.querySelector('#a2PigeonsWaiting');
    const boxesGrid = this.container.querySelector('#a2BoxesGrid');
    pigeonsWaiting.innerHTML = '';
    boxesGrid.innerHTML = '';

    const guarantee = Math.ceil(this.objects / this.boxes);
    this.container.querySelector('#a2ViewportStatus').innerHTML =
      `Guaranteed Bound: $\\lceil ${this.objects} / ${this.boxes} \\rceil = ${guarantee}$ objects`;

    for (let i = 1; i <= this.objects; ++i) {
      const p = document.createElement('div');
      p.className = 'pigeon-token';
      p.id = `a2-pigeon-${i}`;
      p.textContent = `P${i}`;
      pigeonsWaiting.appendChild(p);
    }

    for (let j = 0; j < this.boxes; ++j) {
      const b = document.createElement('div');
      b.className = 'hole-box';
      b.id = `a2-box-${j}`;
      b.innerHTML = `
        <span class="hole-box-label">Box ${j + 1}</span>
        <span class="hole-box-count">0 items</span>
        <div class="hole-occupants" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px; justify-content:center"></div>
      `;
      boxesGrid.appendChild(b);
    }
  },

  async runDistribution() {
    const distBtn = this.container.querySelector('#a2DistributeBtn');
    distBtn.disabled = true;

    let assignments = [];
    try {
      const res = await this.api.fetch(`/core/simulate?objects=${this.objects}&boxes=${this.boxes}&strategy=${this.strategy}`);
      assignments = res.data.assignments;
    } catch {
      // Local fallback
      if (this.strategy === 'adversarial') {
        const counts = new Array(this.boxes).fill(0);
        assignments = [];
        for (let i = 0; i < this.objects; ++i) {
          let minB = 0;
          for (let b = 1; b < this.boxes; ++b) {
            if (counts[b] < counts[minB]) minB = b;
          }
          counts[minB]++;
          assignments.push(minB);
        }
      } else {
        assignments = Array.from({ length: this.objects }, (_, i) => i % this.boxes);
      }
    }

    if (this.viewMode === '3D') {
      this.init3dScene(assignments);
      distBtn.disabled = false;
      return;
    }

    this.render2d();
    const boxCounts = new Array(this.boxes).fill(0);
    const guarantee = Math.ceil(this.objects / this.boxes);

    assignments.forEach((boxIdx, i) => {
      setTimeout(() => {
        const pigeon = document.getElementById(`a2-pigeon-${i + 1}`);
        const box = document.getElementById(`a2-box-${boxIdx}`);
        if (!pigeon || !box) return;

        pigeon.style.opacity = '0.3';
        boxCounts[boxIdx]++;
        box.querySelector('.hole-box-count').textContent = `${boxCounts[boxIdx]} items`;

        const token = document.createElement('div');
        token.className = 'pigeon-token';
        token.textContent = `P${i + 1}`;
        box.querySelector('.hole-occupants').appendChild(token);

        if (boxCounts[boxIdx] >= guarantee) {
          box.classList.add('has-collision');
          token.classList.add('collision-glow');
        }

        if (i === assignments.length - 1) {
          distBtn.disabled = false;
          const maxOcc = Math.max(...boxCounts);
          this.container.querySelector('#a2ViewportStatus').innerHTML =
            `<span style="color:var(--accent-orange-600)">Max Occupancy Found: ${maxOcc}</span> (Guaranteed $\\ge ${guarantee}$). Strategy "${this.strategy}" ${maxOcc === guarantee ? 'proves bound is TIGHT!' : 'exceeds minimum bound.'}`;
        }
      }, (i + 1) * 150);
    });
  },

  runVerification() {
    const banner = this.container.querySelector('#a2VerifyBanner');
    banner.style.display = 'flex';
    const guarantee = Math.ceil(this.objects / this.boxes);

    banner.className = 'verify-result-banner verified';
    banner.innerHTML = `
      <span>✓ Bound Verified:</span>
      For $n = ${this.objects}$ and $k = ${this.boxes}$, the theoretical guarantee is $\\lceil ${this.objects} / ${this.boxes} \\rceil = ${guarantee}$.
      Every possible distribution MUST have at least one box with $\\ge ${guarantee}$ items.
    `;
  },

  init3dScene(customAssignments = null) {
    const wrap = this.container.querySelector('#a2View3dWrap');
    if (this.activeScene) {
      this.activeScene.unmount();
      this.activeScene = null;
    }
    const assignments = customAssignments || Array.from({ length: this.objects }, (_, i) => i % this.boxes);
    this.activeScene = new SceneS1(wrap, {
      objects: this.objects,
      boxes: this.boxes,
      assignments
    });
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#a2QuizSection');
    const questions = [
      {
        question: 'If 31 items are placed into 5 boxes, what is the guaranteed minimum occupancy of the fullest box?',
        options: ['6 items', '7 items', '8 items', '5 items'],
        answer: 1,
        hint: 'Calculate ceil(31 / 5).',
        explanation: '31 / 5 = 6.2. The ceiling ceil(6.2) is 7. Thus at least one box contains at least 7 items.'
      },
      {
        question: 'Which distribution strategy spreads objects as evenly as possible to minimize maximum occupancy?',
        options: ['Random distribution', 'Adversarial distribution', 'First-fit allocation', 'Poisson distribution'],
        answer: 1,
        hint: 'Think about who acts to oppose high occupancy.',
        explanation: 'The adversarial strategy spreads objects into the currently least-occupied boxes, achieving exactly ceil(n/k) and demonstrating that the bound is tight.'
      },
      {
        question: 'In integer arithmetic, how is ceil(n / k) computed correctly?',
        options: ['(n + k) / k', '(n + k - 1) / k', 'n / k + 1', '(n - 1) / k'],
        answer: 1,
        hint: 'Test n = 4, k = 2 and n = 5, k = 2.',
        explanation: '(n + k - 1) / k gives floor integer arithmetic matching ceil(n / k) for all positive integers.'
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
