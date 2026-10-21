// ============================================================================
// Module A1: Simple Pigeonhole Principle (Tier 1, Beginner)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';
import { ProofBox } from '../ui/ProofBox.js';
import { SceneS1 } from '../three/s1_falling_boxes.js';

export default {
  id: 'a1_simple',
  title: 'Simple Pigeonhole Principle',
  tier: 1,
  badge: 'Beginner',
  time: '5 min',
  summary: 'If n > k, placing n objects into k boxes guarantees at least one box contains 2 or more objects.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.objects = 8;
    this.boxes = 5;
    this.viewMode = '2D'; // '2D' or '3D'
    this.activeScene = null;
    this.manualPlacements = [];
    this.isManualMode = false;

    container.innerHTML = `
      <div class="module-view">
        <!-- 1. Header with Metadata -->
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-beginner">Tier 1 · Beginner</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 5 min</span>
          </div>
          <h1 class="module-title">A1. Simple Pigeonhole Principle</h1>
          <p class="module-big-idea">
            🕊️ If you put more pigeons than holes, at least one hole must contain two or more pigeons.
            This innocent-looking counting rule is one of discrete mathematics' most profound and versatile proof techniques.
          </p>
        </header>

        <!-- 3. Explanation Tabs: Simple / Formal / Proof -->
        <section class="tabs-container" aria-label="Explanations">
          <div class="tabs-nav">
            <button class="tab-btn active" data-tab="simple">🟢 Simple</button>
            <button class="tab-btn" data-tab="formal">🔵 Formal</button>
            <button class="tab-btn" data-tab="proof">🟣 Proof</button>
          </div>

          <!-- Simple Tab -->
          <div class="tab-pane active" id="tab-simple">
            <p style="font-size:1.0625rem; line-height:1.7">
              Imagine you have <strong>10 letters</strong> and only <strong>9 pigeonholes</strong> in a post office cabinet.
              Even if you spread them out as evenly as possible by giving the first 9 letters their own private pigeonholes,
              the 10th letter has nowhere left to go—it <em>must</em> share a slot with another letter!
            </p>
            ${Callout({
              type: 'idea',
              title: 'The Core Intuition',
              content: 'You cannot avoid a collision because there are simply not enough separate rooms. Every room cannot simultaneously be occupied by at most one person without exceeding total capacity.'
            })}
          </div>

          <!-- Formal Tab -->
          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3 style="margin-bottom:8px">Mathematical Formulation</h3>
              <p>Let $S$ and $T$ be finite sets. If $|S| > |T|$, then for any function $f: S \to T$:</p>
              <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:1.125rem; margin:12px 0; text-align:center">
                $$\exists y \in T \quad \text{such that} \quad |f^{-1}(y)| \ge 2$$
              </div>
              <p>Equivalently, no function from a larger finite set to a strictly smaller finite set can be <strong>injective</strong> (one-to-one).</p>
            </div>
          </div>

          <!-- Proof Tab -->
          <div class="tab-pane" id="tab-proof">
            <div id="proofStepperContainer"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container" aria-label="Interactive Playground">
          <div class="playground-controls">
            <h3>Simulation Controls</h3>

            <div class="control-group">
              <div class="control-label">
                <span>Objects (Pigeons, $n$)</span>
                <span id="objValDisplay">8</span>
              </div>
              <input type="range" class="control-slider" id="objSlider" min="1" max="30" value="8">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Boxes (Pigeonholes, $k$)</span>
                <span id="boxValDisplay">5</span>
              </div>
              <input type="range" class="control-slider" id="boxSlider" min="1" max="12" value="5">
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px">
              <button class="btn btn-primary" id="dropBtn">Drop Pigeons</button>
              <button class="btn btn-outline" id="manualModeBtn">Manual Placement Mode</button>
              <button class="btn btn-verify" id="verifyBtn">✓ Verify Principle</button>
            </div>

            <div class="verify-result-banner" id="verifyBanner" style="display:none"></div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <span style="font-size:0.875rem; font-weight:600; color:var(--text-muted)" id="viewportStatus">
                Ready to distribute
              </span>
              <div style="display:flex; gap:8px">
                <button class="btn btn-outline btn-sm" id="toggle3dBtn">View in 3D 🧊</button>
                <button class="btn btn-outline btn-sm" id="resetCamBtn" style="display:none">Reset Camera</button>
              </div>
            </div>

            <div class="viewport-canvas" id="viewportCanvas">
              <!-- 2D View -->
              <div id="view2dWrap" style="width:100%; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between">
                <div>
                  <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px">Pigeons Waiting</div>
                  <div id="pigeonsWaiting" style="display:flex; flex-wrap:wrap; gap:6px; min-height:40px"></div>
                </div>
                <div style="text-align:center; color:var(--text-dim); font-size:1.25rem">↓</div>
                <div>
                  <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px">Pigeonholes</div>
                  <div id="boxesGrid" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center"></div>
                </div>
              </div>

              <!-- 3D Canvas Container -->
              <div id="view3dWrap" class="three-canvas-container" style="display:none">
                <div class="three-caption">3D Falling Pigeons Simulation · OrbitControls enabled (Rotate: Drag, Zoom: Scroll)</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3 style="margin-bottom:12px">6. Worked Example: Birthdays in a Week</h3>
          <p style="margin-bottom:8px">
            <strong>Problem:</strong> Suppose there are 8 people in a room. Can everyone have their birthday on a distinct day of the week?
          </p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>1. Identify pigeons ($n$): The $8$ people.</p>
            <p>2. Identify pigeonholes ($k$): The $7$ days of the week (Mon, Tue, Wed, Thu, Fri, Sat, Sun).</p>
            <p>3. Compare: $n = 8 > 7 = k$.</p>
            <p>4. <strong>Conclusion:</strong> By the Pigeonhole Principle, at least $\lceil 8/7 \rceil = 2$ people must share the exact same birthday weekday!</p>
          </div>
        </section>

        <!-- 7. Real-Life Application -->
        <section style="margin:24px 0">
          ${Callout({
            type: 'reallife',
            title: '7. Real-Life Application: Hairs on Heads',
            content: `In a metropolis like London (population ~9 million), human scalps have at most 150,000 hairs. 
              Since $9,000,000 > 150,000$, there are guaranteed to be dozens of people with the exact same count of hairs on their head!
              <a href="#/module/r1_real_world" style="margin-left:6px; font-weight:600; color:var(--primary-600)">Explore Real-World Gallery →</a>`
          })}
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Time Complexity</strong>
            <code>O(n)</code> distribution simulation
          </div>
          <div class="complexity-item">
            <strong>Space Complexity</strong>
            <code>O(k)</code> bucket allocation table
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="quizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3 style="margin-bottom:8px">10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Forgetting the strict inequality:</strong> If $n = k$, there is no guaranteed collision (every pigeon can occupy its own unique hole). A collision is guaranteed if and only if $n > k$.</li>
            <li><strong>Assuming identical distribution:</strong> The principle does not say *which* box will have the collision, nor does it guarantee that objects are spread evenly. It guarantees existence, not location.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/a2_generalized" class="btn btn-outline">Next: A2. Generalized Principle →</a>
          <a href="#/module/a4_socks_draws" class="btn btn-outline">A4. Minimum Draws / Socks →</a>
          <a href="#/module/b10_core_table" class="btn btn-outline">B10. The Pigeonhole Table →</a>
        </section>
      </div>
    `;

    this.initTabs();
    this.initProofStepper();
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

  initProofStepper() {
    const proofWrap = this.container.querySelector('#proofStepperContainer');
    const steps = [
      {
        title: 'State the Hypothesis & Assume the Negation',
        content: 'Assume for the sake of contradiction that $n$ objects are placed into $k$ boxes with $n > k$, but <em>no box contains 2 or more objects</em>.'
      },
      {
        title: 'Bound the Occupancy of Each Box',
        content: 'Since no box contains $\\ge 2$ objects, every single box $i \\in \\{1, \\dots, k\\}$ holds at most 1 object ($c_i \\le 1$).'
      },
      {
        title: 'Sum Over All Boxes',
        content: 'The total number of objects placed is $N = \\sum_{i=1}^k c_i \\le \\sum_{i=1}^k 1 = k$.'
      },
      {
        title: 'Establish the Contradiction',
        content: 'However, by the initial premise, we placed $n$ objects where $n > k$. Thus $n \\le k$, which is a direct mathematical contradiction ($n > k$ and $n \\le k$).'
      },
      {
        title: 'Conclusion',
        content: 'Therefore, our initial negation must be false. At least one box must contain 2 or more objects. ∎'
      }
    ];

    new Stepper(proofWrap, steps, (stepIdx) => {
      // Highlight boxes or elements if needed
    });
  },

  initPlayground() {
    const objSlider = this.container.querySelector('#objSlider');
    const boxSlider = this.container.querySelector('#boxSlider');
    const objDisplay = this.container.querySelector('#objValDisplay');
    const boxDisplay = this.container.querySelector('#boxValDisplay');
    const dropBtn = this.container.querySelector('#dropBtn');
    const verifyBtn = this.container.querySelector('#verifyBtn');
    const toggle3dBtn = this.container.querySelector('#toggle3dBtn');
    const resetCamBtn = this.container.querySelector('#resetCamBtn');
    const manualBtn = this.container.querySelector('#manualModeBtn');

    objSlider.addEventListener('input', (e) => {
      this.objects = parseInt(e.target.value, 10);
      objDisplay.textContent = this.objects;
      this.resetSimulation();
    });

    boxSlider.addEventListener('input', (e) => {
      this.boxes = parseInt(e.target.value, 10);
      boxDisplay.textContent = this.boxes;
      this.resetSimulation();
    });

    dropBtn.addEventListener('click', () => this.runDropAnimation());
    verifyBtn.addEventListener('click', () => this.runVerification());

    toggle3dBtn.addEventListener('click', () => {
      if (this.viewMode === '2D') {
        this.viewMode = '3D';
        toggle3dBtn.textContent = 'View in 2D 📄';
        resetCamBtn.style.display = 'inline-flex';
        this.container.querySelector('#view2dWrap').style.display = 'none';
        this.container.querySelector('#view3dWrap').style.display = 'block';
        this.init3dScene();
      } else {
        this.viewMode = '2D';
        toggle3dBtn.textContent = 'View in 3D 🧊';
        resetCamBtn.style.display = 'none';
        this.container.querySelector('#view2dWrap').style.display = 'flex';
        this.container.querySelector('#view3dWrap').style.display = 'none';
        if (this.activeScene) {
          this.activeScene.unmount();
          this.activeScene = null;
        }
      }
    });

    resetCamBtn.addEventListener('click', () => {
      if (this.activeScene) this.activeScene.resetCamera();
    });

    manualBtn.addEventListener('click', () => {
      this.isManualMode = !this.isManualMode;
      manualBtn.textContent = this.isManualMode ? 'Exit Manual Mode' : 'Manual Placement Mode';
      this.resetSimulation();
    });
  },

  resetSimulation() {
    this.manualPlacements = [];
    const banner = this.container.querySelector('#verifyBanner');
    banner.style.display = 'none';
    this.render2d();
    if (this.viewMode === '3D') {
      this.init3dScene();
    }
  },

  render2d() {
    const pigeonsWaiting = this.container.querySelector('#pigeonsWaiting');
    const boxesGrid = this.container.querySelector('#boxesGrid');
    pigeonsWaiting.innerHTML = '';
    boxesGrid.innerHTML = '';

    for (let i = 1; i <= this.objects; ++i) {
      const p = document.createElement('div');
      p.className = 'pigeon-token';
      p.id = `a1-pigeon-${i}`;
      p.textContent = `P${i}`;
      p.draggable = this.isManualMode;
      if (this.isManualMode) {
        p.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', i);
        });
      }
      pigeonsWaiting.appendChild(p);
    }

    for (let j = 0; j < this.boxes; ++j) {
      const b = document.createElement('div');
      b.className = 'hole-box';
      b.id = `a1-box-${j}`;
      b.innerHTML = `
        <span class="hole-box-label">Box ${j + 1}</span>
        <span class="hole-box-count">0 items</span>
        <div class="hole-occupants" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px; justify-content:center"></div>
      `;

      if (this.isManualMode) {
        b.addEventListener('dragover', (e) => e.preventDefault());
        b.addEventListener('drop', (e) => {
          e.preventDefault();
          const pId = e.dataTransfer.getData('text/plain');
          this.handleManualDrop(pId, j);
        });
      }

      boxesGrid.appendChild(b);
    }

    this.container.querySelector('#viewportStatus').textContent = this.isManualMode
      ? 'Drag pigeons into boxes. The app will warn you when a collision becomes unavoidable!'
      : `Ready: ${this.objects} objects into ${this.boxes} boxes.`;
  },

  handleManualDrop(pigeonId, boxIdx) {
    const token = document.getElementById(`a1-pigeon-${pigeonId}`);
    if (!token || token.parentElement.classList.contains('hole-occupants')) return;

    const box = document.getElementById(`a1-box-${boxIdx}`);
    const occupants = box.querySelector('.hole-occupants');
    occupants.appendChild(token);

    const countEl = box.querySelector('.hole-box-count');
    const currentCount = occupants.children.length;
    countEl.textContent = `${currentCount} items`;

    if (currentCount > 1) {
      box.classList.add('has-collision');
      token.classList.add('collision-glow');
      this.container.querySelector('#viewportStatus').innerHTML =
        `<strong style="color:var(--accent-orange-600)">Collision Detected!</strong> Box ${boxIdx + 1} now contains ${currentCount} pigeons!`;
    } else {
      const totalPlaced = this.container.querySelectorAll('.hole-occupants .pigeon-token').length;
      if (totalPlaced >= this.boxes && totalPlaced < this.objects) {
        this.container.querySelector('#viewportStatus').innerHTML =
          `<span style="color:var(--accent-orange-600)">⚠️ Warning:</span> Every box is now occupied! The very next pigeon is GUARANTEED to cause a collision!`;
      }
    }
  },

  async runDropAnimation() {
    const dropBtn = this.container.querySelector('#dropBtn');
    dropBtn.disabled = true;

    let assignments = [];
    try {
      const res = await this.api.fetch(`/core/simulate?objects=${this.objects}&boxes=${this.boxes}&strategy=round-robin`);
      assignments = res.data.assignments;
    } catch {
      // Local fallback
      assignments = Array.from({ length: this.objects }, (_, i) => i % this.boxes);
    }

    if (this.viewMode === '3D') {
      this.init3dScene(assignments);
      dropBtn.disabled = false;
      return;
    }

    this.render2d();
    const boxCounts = new Array(this.boxes).fill(0);

    assignments.forEach((boxIdx, i) => {
      setTimeout(() => {
        const pigeon = document.getElementById(`a1-pigeon-${i + 1}`);
        const box = document.getElementById(`a1-box-${boxIdx}`);
        if (!pigeon || !box) return;

        pigeon.style.opacity = '0.3';
        boxCounts[boxIdx]++;
        box.querySelector('.hole-box-count').textContent = `${boxCounts[boxIdx]} items`;

        const occupantToken = document.createElement('div');
        occupantToken.className = 'pigeon-token';
        occupantToken.textContent = `P${i + 1}`;
        box.querySelector('.hole-occupants').appendChild(occupantToken);

        if (boxCounts[boxIdx] > 1) {
          box.classList.add('has-collision');
          occupantToken.classList.add('collision-glow');
        }

        if (i === assignments.length - 1) {
          dropBtn.disabled = false;
          const hasCollision = this.objects > this.boxes;
          this.container.querySelector('#viewportStatus').innerHTML = hasCollision
            ? `<span style="color:var(--accent-orange-600)">✓ Distribution Complete:</span> ${this.objects} > ${this.boxes} $\\implies$ At least one box contains 2+ items!`
            : `Distribution Complete: Every item occupies a separate box.`;
        }
      }, (i + 1) * 200);
    });
  },

  async runVerification() {
    const banner = this.container.querySelector('#verifyBanner');
    banner.style.display = 'flex';

    if (this.objects > this.boxes) {
      banner.className = 'verify-result-banner collision';
      banner.innerHTML = `
        <span>✓ Theorem Verified:</span>
        Since $n = ${this.objects} > ${this.boxes} = k$, at least one box MUST contain $\\ge 2$ objects.
        Maximum occupancy guaranteed: $\\lceil ${this.objects} / ${this.boxes} \\rceil = ${Math.ceil(this.objects / this.boxes)}$.
      `;
    } else {
      banner.className = 'verify-result-banner verified';
      banner.innerHTML = `
        <span>ℹ️ No Collision Guaranteed:</span>
        Since $n = ${this.objects} \\le ${this.boxes} = k$, it is possible to assign each pigeon to a unique hole without any collision.
      `;
    }
  },

  init3dScene(customAssignments = null) {
    const wrap = this.container.querySelector('#view3dWrap');
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
    const quizSection = this.container.querySelector('#quizSection');
    const questions = [
      {
        question: 'If you place 13 pigeons into 12 pigeonholes, what is guaranteed?',
        options: [
          'Every pigeonhole has at least one pigeon.',
          'At least one pigeonhole has at least 2 pigeons.',
          'Exactly one pigeonhole has 2 pigeons.',
          'All pigeonholes have the same number of pigeons.'
        ],
        answer: 1,
        hint: 'Compare n = 13 and k = 12. Does n > k?',
        explanation: 'Because 13 > 12, by the Simple Pigeonhole Principle, at least one hole must contain at least 2 pigeons.'
      },
      {
        question: 'What is the minimum number of socks you must pull from a drawer with red and black socks to guarantee a matching pair?',
        options: ['2 socks', '3 socks', '4 socks', '5 socks'],
        answer: 1,
        hint: 'There are k = 2 colors (holes). How many draws (pigeons) guarantee a collision?',
        explanation: 'With k = 2 colors, drawing n = 3 socks guarantees at least 2 socks share the same color (3 > 2).'
      },
      {
        question: 'Under what condition does the Pigeonhole Principle guarantee a collision?',
        options: ['n < k', 'n = k', 'n > k', 'n is even'],
        answer: 2,
        hint: 'When do you have strictly more objects than containers?',
        explanation: 'A collision is guaranteed if and only if the number of objects strictly exceeds the number of boxes (n > k).'
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
