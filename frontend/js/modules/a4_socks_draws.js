// ============================================================================
// Module A4: Minimum Draws / Socks Problem (Tier 1, Beginner)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';
import { Stepper } from '../ui/Stepper.js';

export default {
  id: 'a4_socks_draws',
  title: 'Minimum Draws / Socks Problem',
  tier: 1,
  badge: 'Beginner',
  time: '5 min',
  summary: 'To guarantee r items of the same type among k types, you must draw k(r - 1) + 1 items.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.k = 3; // number of types / colors
    this.r = 2; // target duplicates
    this.drawnItems = [];
    this.variant = 'socks';

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-beginner">Tier 1 · Beginner</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 5 min</span>
          </div>
          <h1 class="module-title">A4. Minimum Draws (The Socks Problem)</h1>
          <p class="module-big-idea">
            🧦 You reach into a dark drawer containing socks of $k$ different colors. How many must you pull out to guarantee at least $r$ socks of the same color?
            The worst-case adversary delays your success as long as possible, but at exactly <strong>k(r - 1) + 1</strong> draws, success is mathematically guaranteed.
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
              Suppose you have socks of <strong>3 colors</strong> (Red, Blue, Green) and want <strong>2 of the same color</strong> ($r = 2$).
              In the worst conceivable bad luck, your first 3 draws give you: 1 Red, 1 Blue, and 1 Green.
              No pair yet! But your drawer has no 4th color. Your <strong>4th draw</strong> must match one of the colors you already hold!
            </p>
            ${Callout({
              type: 'idea',
              title: 'The Adversary Argument',
              content: 'Imagine an opponent who maliciously picks items for you. The worst they can do is give you r - 1 items of every single type (a total of k(r - 1) items). The very next item (+1) guarantees you achieve r items of some type.'
            })}
          </div>

          <div class="tab-pane" id="tab-formal">
            <div class="card">
              <h3>Formal Theorem</h3>
              <p style="margin:8px 0">Let there be $k$ categories (pigeonholes). To guarantee at least one category contains at least $r$ items, the minimum number of draws $N$ required is:</p>
              <div style="padding:14px; background:var(--bg-subtle); border-radius:var(--radius-md); text-align:center; font-size:1.25rem; margin:10px 0">
                $$N = k(r - 1) + 1$$
              </div>
              <p>Drawing $k(r - 1)$ items is insufficient because the distribution could be $(r - 1, r - 1, \dots, r - 1)$.</p>
            </div>
          </div>

          <div class="tab-pane" id="tab-proof">
            <div id="a4ProofStepper"></div>
          </div>
        </section>

        <!-- 4. Interactive Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Drawer Parameters</h3>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Scenario Variant:</label>
              <select id="a4VariantSelect" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main)">
                <option value="socks">Colored Socks (k colors, want pair r = 2)</option>
                <option value="cards">Standard Deck (4 suits, want r cards of a suit)</option>
                <option value="birthdays">Birth Months (12 months, want r shared months)</option>
              </select>
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Types / Categories ($k$)</span>
                <span id="a4KVal">3</span>
              </div>
              <input type="range" class="control-slider" id="a4KSlider" min="2" max="12" value="3">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Target Duplicates ($r$)</span>
                <span id="a4RVal">2</span>
              </div>
              <input type="range" class="control-slider" id="a4RSlider" min="2" max="6" value="2">
            </div>

            <div style="margin:12px 0; font-size:0.875rem">
              Formula Guarantee: <strong id="a4FormulaDisplay" style="color:var(--primary-600); font-family:var(--font-mono)">4 draws</strong>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px">
              <button class="btn btn-primary" id="a4DrawOneBtn">Draw 1 Random Item</button>
              <button class="btn btn-accent" id="a4WorstCaseBtn">Show Adversary Sequence</button>
              <button class="btn btn-outline" id="a4ResetBtn">Reset Drawer</button>
            </div>

            <div class="verify-result-banner" id="a4Banner" style="display:none"></div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <strong style="font-size:0.875rem">Your Drawn Items Pile</strong>
              <span id="a4StatusSummary" style="font-size:0.8125rem; color:var(--text-muted)">Draw items to begin</span>
            </div>

            <div class="viewport-canvas" style="flex-direction:column; padding:24px; justify-content:flex-start; gap:16px; overflow-y:auto">
              <!-- Drawn Items Tray -->
              <div style="width:100%">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px">Hand / Drawn Sequence</div>
                <div id="a4DrawnPile" style="display:flex; flex-wrap:wrap; gap:8px; min-height:48px; background:var(--bg-surface); padding:10px; border-radius:var(--radius-md); border:1px solid var(--border-light)"></div>
              </div>

              <!-- Color Buckets Counter -->
              <div style="width:100%">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px">Counts per Category</div>
                <div id="a4CategoryBuckets" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Worked Example -->
        <section class="card" style="margin:24px 0">
          <h3>6. Worked Example: Playing Cards</h3>
          <p style="margin:8px 0">
            <strong>Question:</strong> How many cards must you pick from a standard deck to guarantee at least 3 cards of the same suit?
          </p>
          <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md); line-height:1.6">
            <p>• Types ($k$): 4 suits (♠ Spades, ♥ Hearts, ♦ Diamonds, ♣ Clubs).</p>
            <p>• Target ($r$): 3 cards of the same suit.</p>
            <p>• Worst-case scenario: You draw 2 Spades, 2 Hearts, 2 Diamonds, and 2 Clubs (total $4 \times (3 - 1) = 8$ cards).</p>
            <p>• <strong>The Guarantee:</strong> $k(r - 1) + 1 = 4(2) + 1 = \mathbf{9}$ cards. Card #9 must complete a triplet of some suit!</p>
          </div>
        </section>

        <!-- 8. Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Formula Evaluation</strong>
            <code>O(1)</code> arithmetic: <code>k*(r - 1) + 1</code>
          </div>
          <div class="complexity-item">
            <strong>Adversary Search</strong>
            <code>O(k · r)</code> simulation
          </div>
        </section>

        <!-- 9. Quiz Widget -->
        <section id="a4QuizSection"></section>

        <!-- 10. Common Mistakes -->
        <section class="card" style="margin:24px 0">
          <h3>10. Common Mistakes to Avoid</h3>
          <ul style="padding-left:20px; line-height:1.7; color:var(--text-muted)">
            <li><strong>Forgetting the "+1":</strong> Drawing $k(r - 1)$ items allows every category to have $r - 1$ items, which fails to guarantee $r$. You must draw one more!</li>
            <li><strong>Gloves vs Socks:</strong> Socks are identical, so any 2 of the same color make a pair. Left and right gloves are distinct: to guarantee a usable matched pair among $k$ colors of gloves requires $k + 1$ if only choosing right gloves first, or $2k$ worst-case considerations.</li>
          </ul>
        </section>

        <!-- 11. Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/a2_generalized" class="btn btn-outline">← Back: A2. Generalized Principle</a>
          <a href="#/module/a5_strong_weighted" class="btn btn-outline">A5. Strong / Weighted →</a>
          <a href="#/module/b10_core_table" class="btn btn-outline">Next: B10. The Pigeonhole Table →</a>
        </section>
      </div>
    `;

    this.initTabs();
    this.initProof();
    this.initPlayground();
    this.initQuiz();
    this.renderState();
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
    const proofWrap = this.container.querySelector('#a4ProofStepper');
    const steps = [
      {
        title: 'Maximal Sub-Threshold Configuration',
        content: 'To prevent any category from reaching $r$ items, each of the $k$ categories can hold at most $r - 1$ items.'
      },
      {
        title: 'Worst-Case Capacity Bound',
        content: 'Summing across all $k$ categories, the maximum number of items that can be drawn without having $r$ of any single type is: $$N_{\\text{fail}} = \\sum_{i=1}^k (r - 1) = k(r - 1)$$'
      },
      {
        title: 'The Guarantee (+1)',
        content: 'If we draw $N = k(r - 1) + 1$ items, by the Generalized Pigeonhole Principle, at least one category must contain at least: $$\\left\\lceil \\frac{k(r - 1) + 1}{k} \\right\\rceil = \\left\\lceil (r - 1) + \\frac{1}{k} \\right\\rceil = (r - 1) + 1 = r$$'
      },
      {
        title: 'Conclusion',
        content: 'Therefore, drawing $k(r - 1) + 1$ items strictly guarantees at least $r$ items of the same category. ∎'
      }
    ];

    new Stepper(proofWrap, steps);
  },

  initPlayground() {
    const kSlider = this.container.querySelector('#a4KSlider');
    const rSlider = this.container.querySelector('#a4RSlider');
    const kDisplay = this.container.querySelector('#a4KVal');
    const rDisplay = this.container.querySelector('#a4RVal');
    const formulaDisplay = this.container.querySelector('#a4FormulaDisplay');
    const variantSelect = this.container.querySelector('#a4VariantSelect');

    const drawBtn = this.container.querySelector('#a4DrawOneBtn');
    const worstCaseBtn = this.container.querySelector('#a4WorstCaseBtn');
    const resetBtn = this.container.querySelector('#a4ResetBtn');

    const updateFormula = () => {
      this.k = parseInt(kSlider.value, 10);
      this.r = parseInt(rSlider.value, 10);
      kDisplay.textContent = this.k;
      rDisplay.textContent = this.r;
      const guarantee = this.k * (this.r - 1) + 1;
      formulaDisplay.textContent = `${guarantee} draws (${this.k} × (${this.r} - 1) + 1)`;
      this.drawnItems = [];
      this.renderState();
    };

    kSlider.addEventListener('input', updateFormula);
    rSlider.addEventListener('input', updateFormula);

    variantSelect.addEventListener('change', (e) => {
      this.variant = e.target.value;
      if (this.variant === 'cards') {
        kSlider.value = 4;
        rSlider.value = 3;
      } else if (this.variant === 'birthdays') {
        kSlider.value = 12;
        rSlider.value = 2;
      } else {
        kSlider.value = 3;
        rSlider.value = 2;
      }
      updateFormula();
    });

    drawBtn.addEventListener('click', () => {
      const type = Math.floor(Math.random() * this.k);
      this.drawnItems.push(type);
      this.renderState();
    });

    worstCaseBtn.addEventListener('click', () => {
      // Create adversarial worst-case sequence: r - 1 of each type, then 1 more
      this.drawnItems = [];
      for (let rep = 0; rep < this.r - 1; ++rep) {
        for (let type = 0; type < this.k; ++type) {
          this.drawnItems.push(type);
        }
      }
      // The fatal +1 draw
      this.drawnItems.push(0);
      this.renderState();
    });

    resetBtn.addEventListener('click', () => {
      this.drawnItems = [];
      this.renderState();
    });
  },

  getCategoryLabels() {
    if (this.variant === 'cards') return ['♠ Spades', '♥ Hearts', '♦ Diamonds', '♣ Clubs'];
    if (this.variant === 'birthdays') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Cyan', 'Pink', 'Lime', 'Teal', 'Brown', 'Grey'];
    return colors.slice(0, this.k);
  },

  renderState() {
    const pile = this.container.querySelector('#a4DrawnPile');
    const buckets = this.container.querySelector('#a4CategoryBuckets');
    const status = this.container.querySelector('#a4StatusSummary');
    const banner = this.container.querySelector('#a4Banner');

    const labels = this.getCategoryLabels();
    pile.innerHTML = '';
    buckets.innerHTML = '';

    const counts = new Array(this.k).fill(0);
    this.drawnItems.forEach((type, idx) => {
      counts[type]++;
      const token = document.createElement('div');
      token.className = 'pigeon-token';
      token.style.background = `hsl(${(type * 360) / this.k}, 70%, 45%)`;
      token.textContent = `${idx + 1}`;
      token.title = `Draw ${idx + 1}: ${labels[type]}`;
      pile.appendChild(token);
    });

    let successType = -1;
    for (let i = 0; i < this.k; ++i) {
      const b = document.createElement('div');
      b.className = 'hole-box';
      b.style.borderColor = `hsl(${(i * 360) / this.k}, 70%, 45%)`;
      if (counts[i] >= this.r) {
        b.classList.add('has-collision');
        successType = i;
      }
      b.innerHTML = `
        <span class="hole-box-label">${labels[i]}</span>
        <span class="hole-box-count">${counts[i]} / ${this.r} target</span>
      `;
      buckets.appendChild(b);
    }

    const guarantee = this.k * (this.r - 1) + 1;
    if (successType !== -1) {
      status.innerHTML = `<strong style="color:var(--accent-green-600)">Goal Achieved!</strong> You have ${counts[successType]} items of ${labels[successType]}!`;
      banner.style.display = 'flex';
      banner.className = 'verify-result-banner verified';
      banner.textContent = `Goal reached in ${this.drawnItems.length} draws. (Theoretical guarantee: ≤ ${guarantee} draws).`;
    } else {
      status.textContent = `Drawn: ${this.drawnItems.length} items. Worst-case safe draws remaining: ${Math.max(0, guarantee - 1 - this.drawnItems.length)}.`;
      banner.style.display = 'none';
    }
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#a4QuizSection');
    const questions = [
      {
        question: 'A drawer has red, blue, and yellow socks. How many socks must you pull to guarantee 2 socks of the same color?',
        options: ['3 socks', '4 socks', '5 socks', '6 socks'],
        answer: 1,
        hint: 'Apply k*(r - 1) + 1 with k = 3 colors and r = 2.',
        explanation: '3 × (2 - 1) + 1 = 3 + 1 = 4 socks. The first 3 could be R, B, Y. Sock #4 must match one of them.'
      },
      {
        question: 'How many people must be in a room to guarantee that at least 3 share the same birth month?',
        options: ['24 people', '25 people', '36 people', '37 people'],
        answer: 1,
        hint: 'k = 12 months, target r = 3.',
        explanation: '12 × (3 - 1) + 1 = 12 × 2 + 1 = 25 people.'
      },
      {
        question: 'In a deck of cards (4 suits), what is the worst-case number of cards drawn before getting 5 cards of any suit?',
        options: ['16 cards', '17 cards', '20 cards', '21 cards'],
        answer: 1,
        hint: 'Evaluate 4 × (5 - 1) + 1.',
        explanation: '4 × 4 + 1 = 17 cards. In the worst case you draw 4 cards of each of the 4 suits (16 cards), and the 17th card gives you 5 of a suit.'
      }
    ];

    new Quiz(quizSection, questions);
  },

  unmount() {}
};
