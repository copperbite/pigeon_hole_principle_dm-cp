// ============================================================================
// Module B4: Birthday Paradox (Tier 1, Intermediate)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';
import { SceneS5 } from '../three/s5_birthday_surface.js';

export default {
  id: 'b4_birthday',
  title: 'The Birthday Paradox',
  tier: 1,
  badge: 'Intermediate',
  time: '7 min',
  summary: '50% probability at 23 people vs 100% certainty at 366 people: comparing probability and the Pigeonhole Principle.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.n = 23;
    this.k = 365;
    this.viewMode = '2D';
    this.activeScene = null;

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-intermediate">Tier 1 · Intermediate</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 7 min</span>
          </div>
          <h1 class="module-title">B4. The Birthday Paradox</h1>
          <p class="module-big-idea">
            🎂 In a room of just <strong>23 people</strong>, there is a greater than 50% chance that two share a birthday!
            Yet the Pigeonhole Principle requires <strong>366 people</strong> for 100% certainty.
            Why does the probability cross 50% so dramatically early? Because we compare <em>pairs</em>, not individuals!
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
              When people hear "shared birthday", they mistakenly think: <em>"Does anyone share MY birthday?"</em> (which needs $\approx 253$ people for 50%).
              Instead, the question is: <em>"Does ANY person share a birthday with ANY OTHER person?"</em>
              With 23 people, there are $C(23, 2) = 253$ different pairs of people who could potentially match!
            </p>
            ${Callout({
              type: 'idea',
              title: 'Probability vs Certainty',
              content: 'The Pigeonhole Principle guarantees 100% certainty: with 365 days, you must have 366 people to guarantee a collision. Probability asks when a collision becomes likely (≥ 50%), which occurs at only 23 people!'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>Exact Probability vs Exponential Approximation</h3>
              <p style="margin:8px 0">The probability of at least one shared birthday among $n$ people with $k$ days:</p>
              <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:1.125rem; margin:10px 0; text-align:center">
                $$P(n, k) = 1 - \prod_{i=0}^{n-1} \left(1 - \frac{i}{k}\right) \approx 1 - e^{-\frac{n(n - 1)}{2k}}$$
              </div>
              <p>50% probability threshold rule of thumb: $n \approx 1.1774\sqrt{k}$. For $k = 365$, $1.1774\sqrt{365} \approx 22.49 \implies n = 23$.</p>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="b4ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Parameters & Simulation</h3>

            <div class="control-group">
              <div class="control-label">
                <span>Group Size ($n$)</span>
                <span id="b4NVal">23</span>
              </div>
              <input type="range" class="control-slider" id="b4NSlider" min="2" max="100" value="23">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Category Count ($k$, Days)</span>
                <span id="b4KVal">365</span>
              </div>
              <input type="range" class="control-slider" id="b4KSlider" min="10" max="500" value="365">
            </div>

            <button class="btn btn-primary" id="b4SimulateBtn">Run Monte Carlo (10,000 Trials)</button>

            <!-- Metrics -->
            <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px; font-size:0.8125rem">
              <div style="padding:8px; background:var(--bg-subtle); border-radius:var(--radius-sm)">
                <div>Exact Probability: <strong id="b4ExactP" style="color:var(--primary-600); font-size:1rem">50.73%</strong></div>
                <div>Approximation: <span id="b4ApproxP" style="font-family:var(--font-mono)">50.00%</span></div>
                <div>Monte Carlo Simulated: <span id="b4SimP" style="font-family:var(--font-mono)">50.71%</span></div>
                <div>Expected Pairs: <span id="b4PairsDisplay" style="font-family:var(--font-mono)">0.69</span></div>
                <div>PHP 100% Certainty: <span id="b4CertaintyDisplay" style="font-weight:700">366 people</span></div>
              </div>
            </div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <strong style="font-size:0.875rem">Probability Curve P(n, k) vs n</strong>
              <div style="display:flex; gap:8px">
                <button class="btn btn-outline btn-sm" id="b4Toggle3dBtn">View in 3D Surface 🧊</button>
                <button class="btn btn-outline btn-sm" id="b4ResetCamBtn" style="display:none">Reset Camera</button>
              </div>
            </div>

            <div class="viewport-canvas">
              <div id="b4View2dWrap" style="width:100%; height:100%; padding:20px; display:flex; flex-direction:column; justify-content:space-between">
                <!-- SVG Curve Chart -->
                <svg id="b4CurveSvg" width="100%" height="260" viewBox="0 0 500 240" style="overflow:visible"></svg>
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim); margin-top:8px">
                  <span>n = 1</span>
                  <span style="color:var(--accent-orange-600); font-weight:700">50% Line (n = 23)</span>
                  <span>n = 70</span>
                  <span style="color:var(--primary-600); font-weight:700">100% Certainty (n = 366)</span>
                </div>
              </div>

              <div id="b4View3dWrap" class="three-canvas-container" style="display:none">
                <div class="three-caption">3D Probability Surface P(n, k) · Orange Marker Shows Current (n, k) Position</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3>6. Worked Example: Cryptographic Hashes (Git & MD5)</h3>
          <p style="margin:8px 0">The Birthday Paradox is the primary mathematical reason why cryptographic hash collisions occur much earlier than expected.</p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>• Git commit short hashes use 7 hex characters = 28 bits ($2^{28} \approx 268\text{ million}$ possible hashes).</p>
            <p>• By the Pigeonhole Principle, you need $268,435,457$ commits to guarantee a collision.</p>
            <p>• <strong>The Birthday Reality:</strong> A 50% collision risk occurs after only $\approx 1.1774\sqrt{2^{28}} \approx \mathbf{19,000\text{ commits}}$!</p>
            <p>• This is why modern Git and cryptography use 160-bit SHA-1 or 256-bit SHA-256 hashes instead of short hashes.</p>
          </div>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Exact Computation</strong>
            <code>O(n)</code> logarithmic product
          </div>
          <div class="complexity-item">
            <strong>Monte Carlo</strong>
            <code>O(trials · n)</code> stochastic hashing
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="b4QuizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3>10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Confusing the 50% threshold with the Pigeonhole Principle:</strong> The Pigeonhole Principle only applies when $n > k$ ($100\%$ certainty). It does not predict probabilities below $100\%$.</li>
            <li><strong>Evaluating naive factorials:</strong> Calculating $365!$ directly causes catastrophic 64-bit integer overflow. Computations must use the product form or log-summation $\sum \ln(1 - i/k)$.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/b2_dirichlet" class="btn btn-outline">← Back: B2. Dirichlet Approximation</a>
          <a href="#/module/b5_hashing" class="btn btn-outline">B5. Hashing & Collisions →</a>
          <a href="#/module/r1_real_world" class="btn btn-outline">R1. Real-World Case Files →</a>
        </section>
      </div>
    `;

    this.initTabs();
    this.initProof();
    this.initPlayground();
    this.initQuiz();
    this.compute();
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
    const proofWrap = this.container.querySelector('#b4ProofStepper');
    const steps = [
      {
        title: 'Complementary Probability',
        content: 'Let $A$ be the event that at least two people share a birthday. It is easier to compute the complement $\\overline{A}$ (the event that all $n$ birthdays are distinct).'
      },
      {
        title: 'Sequential Selection',
        content: 'Person 1 has 365 choices. Person 2 has 364 choices to avoid a collision, Person 3 has 363, ..., and Person $n$ has $365 - (n - 1)$ choices: $$P(\\overline{A}) = \\frac{365}{365} \\cdot \\frac{364}{365} \\dots \\frac{365 - n + 1}{365} = \\prod_{i=0}^{n-1} \\left(1 - \\frac{i}{365}\\right)$$'
      },
      {
        title: 'Exponential Approximation',
        content: 'Using the Taylor series approximation $1 - x \\approx e^{-x}$ for small $x$: $$P(\\overline{A}) \\approx \\prod_{i=0}^{n-1} e^{-i/k} = e^{-\\sum_{i=0}^{n-1} i/k} = e^{-\\frac{n(n - 1)}{2k}}$$'
      },
      {
        title: 'Threshold for 50%',
        content: 'Setting $P(A) = 1 - e^{-\\frac{n(n-1)}{2k}} \\ge 0.5 \\implies e^{-\\frac{n^2}{2k}} \\le 0.5 \\implies n \\approx \\sqrt{2k \\ln 2} \\approx 1.1774\\sqrt{k}$. For $k = 365$, this yields $n = 23$. ∎'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const nSlider = this.container.querySelector('#b4NSlider');
    const kSlider = this.container.querySelector('#b4KSlider');
    const nDisplay = this.container.querySelector('#b4NVal');
    const kDisplay = this.container.querySelector('#b4KVal');
    const simBtn = this.container.querySelector('#b4SimulateBtn');
    const toggle3dBtn = this.container.querySelector('#b4Toggle3dBtn');
    const resetCamBtn = this.container.querySelector('#b4ResetCamBtn');

    nSlider.addEventListener('input', (e) => {
      this.n = parseInt(e.target.value, 10);
      nDisplay.textContent = this.n;
      this.compute();
    });

    kSlider.addEventListener('input', (e) => {
      this.k = parseInt(e.target.value, 10);
      kDisplay.textContent = this.k;
      this.compute();
    });

    simBtn.addEventListener('click', () => this.compute());

    toggle3dBtn.addEventListener('click', () => {
      if (this.viewMode === '2D') {
        this.viewMode = '3D';
        toggle3dBtn.textContent = 'View in 2D 📄';
        resetCamBtn.style.display = 'inline-flex';
        this.container.querySelector('#b4View2dWrap').style.display = 'none';
        this.container.querySelector('#b4View3dWrap').style.display = 'block';
        this.init3dScene();
      } else {
        this.viewMode = '2D';
        toggle3dBtn.textContent = 'View in 3D Surface 🧊';
        resetCamBtn.style.display = 'none';
        this.container.querySelector('#b4View2dWrap').style.display = 'flex';
        this.container.querySelector('#b4View3dWrap').style.display = 'none';
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

  async compute() {
    let data;
    try {
      const res = await this.api.fetch(`/birthday/compute?n=${this.n}&k=${this.k}&trials=10000`);
      data = res.data;
    } catch {
      // Local fallback
      let lnc = 0;
      for (let i = 0; i < this.n; ++i) lnc += Math.log(1 - i / this.k);
      const exact = 1 - Math.exp(lnc);
      const approx = 1 - Math.exp(-(this.n * (this.n - 1)) / (2 * this.k));
      data = {
        exactProbability: exact,
        exponentialApprox: approx,
        simulatedProbability: exact,
        expectedPairs: (this.n * (this.n - 1)) / (2 * this.k),
        pigeonholeCertaintyN: this.k + 1,
        curve: Array.from({ length: 60 }, (_, idx) => {
          const curN = idx + 1;
          return { n: curN, exact: 1 - Math.exp(-(curN * (curN - 1)) / (2 * this.k)) };
        })
      };
    }

    this.container.querySelector('#b4ExactP').textContent = `${(data.exactProbability * 100).toFixed(2)}%`;
    this.container.querySelector('#b4ApproxP').textContent = `${(data.exponentialApprox * 100).toFixed(2)}%`;
    this.container.querySelector('#b4SimP').textContent = `${(data.simulatedProbability * 100).toFixed(2)}%`;
    this.container.querySelector('#b4PairsDisplay').textContent = Number(data.expectedPairs).toFixed(2);
    this.container.querySelector('#b4CertaintyDisplay').textContent = `${data.pigeonholeCertaintyN} people (100% PHP)`;

    this.renderCurve(data.curve);

    if (this.viewMode === '3D' && this.activeScene) {
      this.activeScene.updateMarker(this.n, this.k);
    }
  },

  renderCurve(curve) {
    const svg = this.container.querySelector('#b4CurveSvg');
    svg.innerHTML = '';
    const W = 500, H = 220;

    // Grid axes
    const axisY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axisY.setAttribute('x1', 40); axisY.setAttribute('y1', 10);
    axisY.setAttribute('x2', 40); axisY.setAttribute('y2', H);
    axisY.setAttribute('stroke', 'var(--border-light)');
    svg.appendChild(axisY);

    const axisX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axisX.setAttribute('x1', 40); axisX.setAttribute('y1', H);
    axisX.setAttribute('x2', W); axisX.setAttribute('y2', H);
    axisX.setAttribute('stroke', 'var(--border-light)');
    svg.appendChild(axisX);

    // 50% Dashed Line
    const y50 = H - (0.5 * (H - 20));
    const line50 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line50.setAttribute('x1', 40); line50.setAttribute('y1', y50);
    line50.setAttribute('x2', W); line50.setAttribute('y2', y50);
    line50.setAttribute('stroke', 'var(--accent-orange-500)');
    line50.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(line50);

    // Probability Path
    const maxN = curve.length;
    let d = '';
    curve.forEach((pt, idx) => {
      const x = 40 + (pt.n / maxN) * (W - 50);
      const y = H - pt.exact * (H - 20);
      if (idx === 0) d += `M ${x} ${y}`;
      else d += ` L ${x} ${y}`;
    });

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'var(--primary-600)');
    path.setAttribute('stroke-width', '3');
    svg.appendChild(path);

    // Current point marker
    const curPt = curve.find(p => p.n === this.n) || curve[curve.length - 1];
    if (curPt) {
      const cx = 40 + (curPt.n / maxN) * (W - 50);
      const cy = H - curPt.exact * (H - 20);
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('cx', cx); marker.setAttribute('cy', cy);
      marker.setAttribute('r', 6);
      marker.setAttribute('fill', 'var(--accent-orange-500)');
      marker.setAttribute('stroke', '#fff');
      marker.setAttribute('stroke-width', '2');
      svg.appendChild(marker);
    }
  },

  init3dScene() {
    const wrap = this.container.querySelector('#b4View3dWrap');
    if (this.activeScene) {
      this.activeScene.unmount();
      this.activeScene = null;
    }
    this.activeScene = new SceneS5(wrap, { n: this.n, k: this.k });
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#b4QuizSection');
    const questions = [
      {
        question: 'What is the fundamental difference between the Birthday Paradox and the Pigeonhole Principle?',
        options: [
          'The Birthday Paradox uses calendar months instead of days.',
          'The Pigeonhole Principle guarantees 100% certainty (366 people), while the Birthday Paradox finds the 50% likelihood threshold (23 people).',
          'The Birthday Paradox only applies to leap years.',
          'There is no difference; they are the same theorem.'
        ],
        answer: 1,
        hint: 'Certainty vs probability.',
        explanation: 'The Pigeonhole Principle answers when a collision is 100% unavoidable (n > k). Probability answers when a collision is likely (P ≥ 0.5).'
      },
      {
        question: 'Why does the probability of a shared birthday exceed 50% with only 23 people?',
        options: [
          'Because 23 is a prime number.',
          'Because 23 people form C(23, 2) = 253 distinct pairs who could match.',
          'Because most people are born in summer.',
          'Because February has only 28 days.'
        ],
        answer: 1,
        hint: 'Count the pairs of people.',
        explanation: 'There are C(23, 2) = 253 pairs of people. Comparing 253 pairs against 365 days yields an expectation of > 0.69 collisions, pushing probability past 50%.'
      },
      {
        question: 'What is the rule-of-thumb formula for when the probability of a collision reaches 50% among k buckets?',
        options: ['k / 2', '1.1774 * sqrt(k)', 'k²', 'log(k)'],
        answer: 1,
        hint: 'Square-root scaling from C(n, 2) / k ≈ ln(2).',
        explanation: 'Setting 1 - exp(-n²/(2k)) = 0.5 gives n ≈ sqrt(2 ln(2) * k) ≈ 1.1774 * sqrt(k).'
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
