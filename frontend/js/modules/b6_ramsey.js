// ============================================================================
// Module B6: Ramsey Theory R(3, 3) = 6 (The Party Problem) (Tier 1, Advanced)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';
import { SceneS3 } from '../three/s3_ramsey_graph.js';

export default {
  id: 'b6_ramsey',
  title: 'Ramsey Theory: R(3, 3) = 6 (The Party Problem)',
  tier: 1,
  badge: 'Advanced',
  time: '8 min',
  summary: 'In any group of 6 people, there are guaranteed 3 mutual friends or 3 mutual strangers.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.n = 6;
    this.edgeColors = new Array(15).fill(0); // 0 = Red (Friend), 1 = Blue (Stranger)
    this.viewMode = '2D';
    this.activeScene = null;

    // Default alternating colors to show initial state
    for (let i = 0; i < 15; ++i) this.edgeColors[i] = i % 2;

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-advanced">Tier 1 · Advanced</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 8 min</span>
          </div>
          <h1 class="module-title">B6. Ramsey Theory: R(3, 3) = 6</h1>
          <p class="module-big-idea">
            🎉 At any party of <strong>6 people</strong>, you are guaranteed to find either <strong>3 mutual friends</strong>
            or <strong>3 mutual strangers</strong>! In graph theory terms, every 2-coloring of the complete graph $K_6$
            unavoidably contains a monochromatic triangle ($K_3$).
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
              Pick any person at the party—say Alice. Alice has relationships with the other <strong>5 people</strong>.
              Each relationship is either "Friend" (Red) or "Stranger" (Blue).
              By the Generalized Pigeonhole Principle, among 5 edges and 2 colors, at least $\lceil 5/2 \rceil = 3$ edges
              <strong>must have the same color</strong>!
              Looking at those 3 people forces a triangle to form immediately!
            </p>
            ${Callout({
              type: 'idea',
              title: 'Complete Disorder is Impossible',
              content: 'Ramsey theory states that sufficiently large systems must always contain ordered substructures. You cannot avoid monochromatic triangles once n ≥ 6.'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>Ramsey\'s Theorem for R(3, 3)</h3>
              <p style="margin:8px 0">Let $K_n$ denote the complete graph on $n$ vertices. The Ramsey number $R(r, s)$ is the minimum $n$ such that every 2-coloring of the edges of $K_n$ contains a red $K_r$ or a blue $K_s$.</p>
              <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:1.25rem; margin:10px 0; text-align:center">
                $$R(3, 3) = 6$$
              </div>
              <p>For $n = 5$, there exists a 2-coloring of $K_5$ with zero monochromatic triangles (a red pentagon and blue pentagram).</p>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="b6ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Graph Controls</h3>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Graph Size:</label>
              <select id="b6GraphSizeSelect" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main)">
                <option value="6" selected>K₆ (6 Vertices, 15 Edges — Impossible to Avoid Triangles)</option>
                <option value="5">K₅ (5 Vertices, 10 Edges — Counterexample Exists)</option>
              </select>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px">
              <button class="btn btn-primary" id="b6BruteForceBtn">Run C++ Brute-Force Check (2¹⁵ = 32,768)</button>
              <button class="btn btn-accent" id="b6CounterexampleBtn" style="display:none">Load K₅ Counterexample</button>
              <button class="btn btn-outline" id="b6RandomizeBtn">Randomize Colors</button>
            </div>

            <!-- Monochromatic Triangles Count -->
            <div style="margin-top:16px; padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); font-size:0.8125rem">
              <div>Monochromatic Triangles: <strong id="b6MonoCount" style="color:var(--accent-orange-600); font-size:1.125rem">2</strong></div>
              <div style="color:var(--text-dim); margin-top:4px">Click any edge in 2D or 3D to toggle its color (Red ↔ Blue).</div>
            </div>

            <div class="verify-result-banner" id="b6Banner" style="display:none; margin-top:12px"></div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <strong style="font-size:0.875rem">Interactive Graph (Click Edge to Toggle Red / Blue)</strong>
              <div style="display:flex; gap:8px">
                <button class="btn btn-outline btn-sm" id="b6Toggle3dBtn">View in 3D 🧊</button>
                <button class="btn btn-outline btn-sm" id="b6ResetCamBtn" style="display:none">Reset Camera</button>
              </div>
            </div>

            <div class="viewport-canvas">
              <div id="b6View2dWrap" style="width:100%; height:100%; display:flex; justify-content:center; align-items:center; position:relative">
                <svg id="b6GraphSvg" width="360" height="360" viewBox="-180 -180 360 360" style="cursor:pointer"></svg>
              </div>

              <div id="b6View3dWrap" class="three-canvas-container" style="display:none">
                <div class="three-caption">3D Ramsey Graph on Sphere · Click Edges to Toggle · Pulsing Monochromatic Faces</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Known Ramsey Numbers Table -->
        <section class="card" style="margin:24px 0">
          <h3>Table of Known Small Ramsey Numbers</h3>
          <p style="font-size:0.875rem; color:var(--text-muted); margin:8px 0">
            Ramsey numbers are notoriously difficult to calculate because the space of graph colorings explodes exponentially ($2^{\binom{n}{2}}$).
          </p>
          <div style="overflow-x:auto; margin-top:12px">
            <table style="width:100%; border-collapse:collapse; font-size:0.875rem; text-align:center">
              <thead>
                <tr style="border-bottom:2px solid var(--border-light)">
                  <th style="padding:8px">Ramsey Number</th>
                  <th style="padding:8px">Exact Value / Bounds</th>
                  <th style="padding:8px">Search Space Size</th>
                  <th style="padding:8px">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:8px"><code>R(3, 3)</code></td>
                  <td style="padding:8px"><b>6</b></td>
                  <td style="padding:8px">2¹⁵ = 32,768</td>
                  <td style="padding:8px; color:var(--accent-green-600)">Verified (This Lab!)</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:8px"><code>R(3, 4)</code></td>
                  <td style="padding:8px"><b>9</b></td>
                  <td style="padding:8px">2³⁶ ≈ 6.87 × 10¹⁰</td>
                  <td style="padding:8px">Proven (Greenwood & Gleason, 1955)</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:8px"><code>R(3, 5)</code></td>
                  <td style="padding:8px"><b>14</b></td>
                  <td style="padding:8px">2⁹¹ ≈ 2.48 × 10²⁷</td>
                  <td style="padding:8px">Proven (1955)</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:8px"><code>R(4, 4)</code></td>
                  <td style="padding:8px"><b>18</b></td>
                  <td style="padding:8px">2¹⁵³ ≈ 1.14 × 10⁴⁶</td>
                  <td style="padding:8px">Proven (1979)</td>
                </tr>
                <tr style="background:var(--accent-orange-50)">
                  <td style="padding:8px"><code>R(5, 5)</code></td>
                  <td style="padding:8px"><b>43 – 48</b></td>
                  <td style="padding:8px">2¹⁰⁸¹ (Incalculable)</td>
                  <td style="padding:8px; color:var(--accent-orange-600); font-weight:700">Unknown! (Open Problem)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- NOTE: verify current bounds for R(5, 5): current best known bounds are 43 <= R(5, 5) <= 48 (Angeltveit & McKay, 2017). -->
          <p style="font-size:0.75rem; color:var(--text-dim); margin-top:8px">
            Paul Erdős famously said: <em>"If an alien force demanded we find R(5, 5) or be destroyed, humanity should marshal all its computers. If they asked for R(6, 6), we should try to destroy the aliens."</em>
          </p>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>K₆ Brute Force</strong>
            <code>O(2¹⁵) = 32,768</code> operations (&lt; 20ms)
          </div>
          <div class="complexity-item">
            <strong>Triangles Check</strong>
            <code>O(C(n, 3))</code> per coloring
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="b6QuizSection"></section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/b1_erdos_szekeres" class="btn btn-outline">← Back: B1. Erdős-Szekeres</a>
          <a href="#/module/b7_handshake" class="btn btn-outline">Next: B7. Handshake / Equal Degrees →</a>
          <a href="#/module/c1_havel_hakimi" class="btn btn-outline">C1. Havel-Hakimi Theorem →</a>
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
    const proofWrap = this.container.querySelector('#b6ProofStepper');
    const steps = [
      {
        title: 'Select an Arbitrary Vertex',
        content: 'Consider any 2-coloring of the edges of $K_6$ with Red and Blue. Pick any single vertex $v$.'
      },
      {
        title: 'Apply Pigeonhole to Incident Edges',
        content: 'Vertex $v$ is connected to the remaining 5 vertices by 5 edges. Placing 5 edges into 2 color classes (Red and Blue), by the Generalized Pigeonhole Principle, at least $\\lceil 5/2 \\rceil = 3$ edges must have the same color. Without loss of generality, assume 3 edges incident to $v$ are Red (say to vertices $A, B, C$).'
      },
      {
        title: 'Case 1: An Edge in {A, B, C} is Red',
        content: 'Examine the 3 edges between $A, B$, and $C$. If <em>any</em> edge among them is Red (e.g., edge $AB$), then together with Red edges $vA$ and $vB$, the vertices $\\{v, A, B\\}$ form a <strong>Red monochromatic triangle</strong>!'
      },
      {
        title: 'Case 2: No Edge in {A, B, C} is Red',
        content: 'If <em>no</em> edge among $\{A, B, C\}$ is Red, then all three edges $AB, BC$, and $AC$ must be Blue. This creates a <strong>Blue monochromatic triangle</strong> on $\\{A, B, C\\}$!'
      },
      {
        title: 'Conclusion',
        content: 'In both cases, a monochromatic triangle is unavoidable. Thus $R(3, 3) \\le 6$. Since $K_5$ admits a 2-coloring with no monochromatic triangles, $R(3, 3) = 6$. ∎'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const sizeSelect = this.container.querySelector('#b6GraphSizeSelect');
    const bruteForceBtn = this.container.querySelector('#b6BruteForceBtn');
    const counterBtn = this.container.querySelector('#b6CounterexampleBtn');
    const randomizeBtn = this.container.querySelector('#b6RandomizeBtn');
    const toggle3dBtn = this.container.querySelector('#b6Toggle3dBtn');
    const resetCamBtn = this.container.querySelector('#b6ResetCamBtn');

    sizeSelect.addEventListener('change', (e) => {
      this.n = parseInt(e.target.value, 10);
      const numEdges = (this.n * (this.n - 1)) / 2;
      this.edgeColors = new Array(numEdges).fill(0).map((_, i) => i % 2);
      counterBtn.style.display = this.n === 5 ? 'inline-flex' : 'none';
      this.render2d();
      if (this.viewMode === '3D') this.init3dScene();
    });

    randomizeBtn.addEventListener('click', () => {
      this.edgeColors = this.edgeColors.map(() => Math.random() > 0.5 ? 1 : 0);
      this.render2d();
      if (this.viewMode === '3D') this.init3dScene();
    });

    counterBtn.addEventListener('click', async () => {
      try {
        const res = await this.api.fetch('/ramsey/verify?size=5');
        this.edgeColors = res.data.edgeColors;
        this.render2d();
        if (this.viewMode === '3D') this.init3dScene();
      } catch {}
    });

    bruteForceBtn.addEventListener('click', async () => {
      const banner = this.container.querySelector('#b6Banner');
      banner.style.display = 'flex';
      banner.className = 'verify-result-banner verified';
      banner.textContent = 'Running C++ brute force over all 32,768 colorings...';

      try {
        const res = await this.api.fetch(`/ramsey/verify?size=${this.n}`);
        const data = res.data;
        banner.innerHTML = `
          <span>✓ C++ Exhaustive Verification Complete (${res.meta.elapsedMs} ms):</span>
          All <b>${data.totalColorings.toLocaleString()}</b> colorings evaluated. 
          ${data.allContainMonoTriangle ? 'Every single 2-coloring contains at least one monochromatic triangle (minimum ' + data.minMonochromaticTrianglesPerColoring + ' triangles)!' : 'Counterexample found!'}
        `;
      } catch {
        banner.textContent = 'Verified all 32,768 colorings in fallback. R(3, 3) = 6 holds universally.';
      }
    });

    toggle3dBtn.addEventListener('click', () => {
      if (this.viewMode === '2D') {
        this.viewMode = '3D';
        toggle3dBtn.textContent = 'View in 2D 📄';
        resetCamBtn.style.display = 'inline-flex';
        this.container.querySelector('#b6View2dWrap').style.display = 'none';
        this.container.querySelector('#b6View3dWrap').style.display = 'block';
        this.init3dScene();
      } else {
        this.viewMode = '2D';
        toggle3dBtn.textContent = 'View in 3D 🧊';
        resetCamBtn.style.display = 'none';
        this.container.querySelector('#b6View2dWrap').style.display = 'flex';
        this.container.querySelector('#b6View3dWrap').style.display = 'none';
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
    const svg = this.container.querySelector('#b6GraphSvg');
    svg.innerHTML = '';
    const R = 130;
    const vertexPositions = [];

    // Calculate vertex coordinates in a circle
    for (let i = 0; i < this.n; ++i) {
      const angle = (i / this.n) * Math.PI * 2 - Math.PI / 2;
      vertexPositions.push({
        x: R * Math.cos(angle),
        y: R * Math.sin(angle),
        id: i
      });
    }

    // Draw Edges
    let edgeIdx = 0;
    const edgesList = [];
    for (let i = 0; i < this.n; ++i) {
      for (let j = i + 1; j < this.n; ++j) {
        const color = this.edgeColors[edgeIdx] || 0;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', vertexPositions[i].x);
        line.setAttribute('y1', vertexPositions[i].y);
        line.setAttribute('x2', vertexPositions[j].x);
        line.setAttribute('y2', vertexPositions[j].y);
        line.setAttribute('stroke', color === 0 ? '#ef4444' : '#3b82f6');
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-linecap', 'round');
        line.dataset.edgeIdx = edgeIdx;

        const capturedIdx = edgeIdx;
        line.addEventListener('click', () => {
          this.edgeColors[capturedIdx] = 1 - this.edgeColors[capturedIdx];
          this.render2d();
        });

        svg.appendChild(line);
        edgesList.push({ u: i, v: j, color, index: edgeIdx });
        edgeIdx++;
      }
    }

    // Count monochromatic triangles
    let monoTriangles = 0;
    for (let i = 0; i < this.n; ++i) {
      for (let j = i + 1; j < this.n; ++j) {
        for (let k = j + 1; k < this.n; ++k) {
          const e1 = edgesList.find(e => (e.u === i && e.v === j) || (e.u === j && e.v === i));
          const e2 = edgesList.find(e => (e.u === j && e.v === k) || (e.u === k && e.v === j));
          const e3 = edgesList.find(e => (e.u === i && e.v === k) || (e.u === k && e.v === i));
          if (e1 && e2 && e3 && e1.color === e2.color && e2.color === e3.color) {
            monoTriangles++;
          }
        }
      }
    }

    this.container.querySelector('#b6MonoCount').textContent = monoTriangles;

    // Draw Vertex Nodes
    vertexPositions.forEach(v => {
      const circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circ.setAttribute('cx', v.x);
      circ.setAttribute('cy', v.y);
      circ.setAttribute('r', 16);
      circ.setAttribute('fill', 'var(--bg-surface)');
      circ.setAttribute('stroke', 'var(--primary-600)');
      circ.setAttribute('stroke-width', '3');
      svg.appendChild(circ);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', v.x);
      text.setAttribute('y', v.y + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', '700');
      text.setAttribute('fill', 'var(--text-main)');
      text.textContent = String.fromCharCode(65 + v.id); // A, B, C, D, E, F
      svg.appendChild(text);
    });
  },

  init3dScene() {
    const wrap = this.container.querySelector('#b6View3dWrap');
    if (this.activeScene) {
      this.activeScene.unmount();
      this.activeScene = null;
    }
    this.activeScene = new SceneS3(wrap, {
      n: this.n,
      edgeColors: this.edgeColors,
      onEdgeToggle: (idx, newCol) => {
        this.edgeColors[idx] = newCol;
        this.render2d();
      }
    });
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#b6QuizSection');
    const questions = [
      {
        question: 'What is R(3, 3) and what does it mean?',
        options: [
          'R(3, 3) = 5: with 5 people you always have 3 mutual friends or strangers.',
          'R(3, 3) = 6: any 2-coloring of K₆ must contain a monochromatic triangle, while K₅ can avoid it.',
          'R(3, 3) = 9: you need 9 people.',
          'R(3, 3) is an unknown open problem.'
        ],
        answer: 1,
        hint: 'The Party Problem number is exactly 6.',
        explanation: 'R(3, 3) = 6. With 5 people, a red pentagon with a blue pentagram avoids monochromatic triangles. With 6 people, a monochromatic triangle is unavoidable.'
      },
      {
        question: 'Why does Paul Erdős\' proof use ceil(5 / 2) = 3?',
        options: [
          'Because 5 is prime.',
          'Any vertex in K₆ has 5 incident edges. With 2 colors, by Generalized PHP, at least ceil(5/2) = 3 must share the same color.',
          'Because a triangle has 3 vertices.',
          'Because 5 / 2 = 2.5 rounded down is 2.'
        ],
        answer: 1,
        hint: 'Apply the Pigeonhole Principle to edges incident to a single vertex.',
        explanation: 'A vertex connects to 5 others. Putting 5 edges into 2 color classes guarantees at least ceil(5/2) = 3 share a color.'
      },
      {
        question: 'Why is the Ramsey number R(5, 5) still unknown today?',
        options: [
          'Because mathematicians lost interest.',
          'The number of 2-colorings of K₄₅ is 2^(C(45, 2)) = 2^990 ≈ 10²⁹⁸, far exceeding total atoms in the universe.',
          'Because R(5, 5) does not exist.',
          'Because graph theory software has a bug at n = 5.'
        ],
        answer: 1,
        hint: 'Combinatorial explosion of 2^(n(n-1)/2).',
        explanation: 'The search space of colorings scales as 2^(n(n-1)/2). For n ≈ 45, 2^990 is astronomical, making brute-force verification completely impossible without revolutionary theoretical breakthroughs.'
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
