// ============================================================================
// Module B1: The Pigeonhole Table (DSA Demo)
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';

export default {
  id: 'b10_core_table',
  title: 'B1. The Pigeonhole Table (DSA Demo)',
  tier: 1,
  badge: 'DSA Core',
  time: '5 min',
  summary: 'The original interactive PigeonholeTable demo modeling hash mapping, bucket slots, and collisions.',

  mount(container, api) {
    this.container = container;
    this.api = api;
    this.timer = null;
    this.simulationId = 0;

    const scenarios = {
      custom: {
        objects: 8, boxes: 5, token: 'O', box: 'Box',
        caption: 'Numbered objects are placed into simple boxes using modulo hash mapping.',
        labels: count => Array.from({ length: count }, (_, index) => `Box ${index + 1}`)
      },
      students: {
        objects: 25, boxes: 12, token: 'S', box: 'month',
        caption: 'Each student is grouped by their birth month (Jan - Dec).',
        labels: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      birthdays: {
        objects: 8, boxes: 7, token: 'P', box: 'day',
        caption: 'Each person is placed on one day of a seven-day birthday week.',
        labels: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      codes: {
        objects: 20, boxes: 10, token: 'U', box: 'code',
        caption: 'Each user receives one of a limited set of access codes.',
        labels: count => Array.from({ length: count }, (_, index) => `CODE-${String(index + 1).padStart(2, '0')}`)
      }
    };

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-beginner">Core DSA · Tier 1</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 5 min</span>
          </div>
          <h1 class="module-title">B1. The Pigeonhole Table (DSA Demo)</h1>
          <p class="module-big-idea">
            🗄️ In Data Structures & Algorithms, hash tables map keys to index buckets via a hash function $h(k) = k \bmod m$.
            When the key space exceeds the bucket count ($n > m$), the Pigeonhole Principle guarantees that collisions <strong>must occur</strong>.
            This module preserves your original simulation and shows how C++ Object-Oriented Structures model it.
          </p>
        </header>

        <!-- Explanation -->
        <section class="card" style="margin-bottom:24px">
          <h3>Data Structures Architecture in C++</h3>
          <p style="margin:8px 0; color:var(--text-muted)">
            The C++ backend encapsulates this process cleanly:
          </p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin-top:12px">
            <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md)">
              <code>struct Pigeon</code>
              <p style="font-size:0.8125rem; margin-top:4px">Represents an individual node/item ($P_i$) with a unique identifier.</p>
            </div>
            <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md)">
              <code>class Pigeonhole</code>
              <p style="font-size:0.8125rem; margin-top:4px">Represents a bucket container holding dynamic occupants with collision detection methods.</p>
            </div>
            <div style="padding:12px; background:var(--bg-subtle); border-radius:var(--radius-md)">
              <code>class PigeonholeTable</code>
              <p style="font-size:0.8125rem; margin-top:4px">The codomain array managing $h(i) = i \bmod k$ distribution and theoretical bounds.</p>
            </div>
          </div>
        </section>

        <!-- Playground -->
        <section class="playground-container">
          <div class="playground-controls">
            <h3>Simulation Scenarios</h3>

            <div class="control-group">
              <label style="font-size:0.875rem; font-weight:600; display:block; margin-bottom:6px">Preset Scenario:</label>
              <select id="b10ScenarioSelect" style="width:100%; padding:8px; border-radius:var(--radius-md); border:1px solid var(--border-light); background:var(--bg-input); color:var(--text-main)">
                <option value="custom">Custom objects and boxes</option>
                <option value="students">Students and birth months</option>
                <option value="birthdays">Birthdays in a week</option>
                <option value="codes">Users and access codes</option>
              </select>
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Objects</span>
                <span id="b10ObjVal">8</span>
              </div>
              <input type="range" class="control-slider" id="b10ObjSlider" min="1" max="30" value="8">
            </div>

            <div class="control-group">
              <div class="control-label">
                <span>Boxes</span>
                <span id="b10BoxVal">5</span>
              </div>
              <input type="range" class="control-slider" id="b10BoxSlider" min="1" max="12" value="5">
            </div>

            <div style="display:flex; gap:8px; margin-top:8px">
              <button class="btn btn-primary" id="b10DropBtn" style="flex:1">Drop Objects</button>
              <button class="btn btn-outline" id="b10ResetBtn">Reset</button>
            </div>

            <div style="margin-top:12px; font-size:0.875rem; padding:10px; background:var(--bg-subtle); border-radius:var(--radius-md)" id="b10GuaranteeText"></div>
          </div>

          <div class="playground-viewport">
            <div class="viewport-toolbar">
              <div style="display:flex; align-items:center; gap:8px">
                <span class="status-dot" id="b10StatusDot"></span>
                <strong style="font-size:0.875rem" id="b10StatusTitle">Ready to explore</strong>
              </div>
              <span id="b10StatusSub" style="font-size:0.8125rem; color:var(--text-muted)">Press "Drop objects"</span>
            </div>

            <div class="viewport-canvas" style="flex-direction:column; padding:20px; justify-content:space-between">
              <div>
                <p id="b10Caption" style="font-size:0.8125rem; color:var(--text-muted); margin-bottom:10px"></p>
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Objects Waiting</div>
                <div id="b10WaitingObjects" style="display:flex; flex-wrap:wrap; gap:6px; min-height:40px"></div>
              </div>
              <div style="text-align:center; color:var(--text-dim); font-size:1.25rem">↓</div>
              <div>
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px">Holes / Table Slots</div>
                <div id="b10BoxGrid" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Time Complexity</strong>
            <code>O(n)</code> linear insertion
          </div>
          <div class="complexity-item">
            <strong>Hash Function</strong>
            <code>O(1)</code> modulo: <code>i % k</code>
          </div>
        </section>

        <!-- Quiz Widget -->
        <section id="b10QuizSection"></section>

        <!-- Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/a7_infinite" class="btn btn-outline">← Back: A5. Infinite Principle</a>
          <a href="#/module/b5_hashing" class="btn btn-outline">Next: B2. Hashing &amp; Collisions →</a>
        </section>
      </div>
    `;

    this.initControls(scenarios);
    this.initQuiz();
  },

  initControls(scenarios) {
    const objSlider = this.container.querySelector('#b10ObjSlider');
    const boxSlider = this.container.querySelector('#b10BoxSlider');
    const scenarioSelect = this.container.querySelector('#b10ScenarioSelect');
    const dropBtn = this.container.querySelector('#b10DropBtn');
    const resetBtn = this.container.querySelector('#b10ResetBtn');

    const renderReady = () => {
      this.simulationId++;
      if (this.timer) clearTimeout(this.timer);

      const objects = parseInt(objSlider.value, 10);
      const boxes = parseInt(boxSlider.value, 10);
      const sc = { ...scenarios[scenarioSelect.value], key: scenarioSelect.value };
      const labels = sc.labels(boxes).slice(0, boxes);

      this.container.querySelector('#b10ObjVal').textContent = objects;
      this.container.querySelector('#b10BoxVal').textContent = boxes;
      this.container.querySelector('#b10Caption').textContent = sc.caption;

      const waiting = this.container.querySelector('#b10WaitingObjects');
      waiting.innerHTML = Array.from({ length: objects }, (_, i) => `
        <span class="pigeon-token" id="b10-p-${i + 1}">${sc.token}${i + 1}</span>
      `).join('');

      const grid = this.container.querySelector('#b10BoxGrid');
      grid.innerHTML = labels.map((label, idx) => `
        <div class="hole-box" id="b10-box-${idx}">
          <span class="hole-box-label">${label}</span>
          <span class="hole-box-count">0</span>
          <div class="hole-occupants" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px; justify-content:center"></div>
        </div>
      `).join('');

      const dot = this.container.querySelector('#b10StatusDot');
      dot.className = 'status-dot';
      this.container.querySelector('#b10StatusTitle').textContent = 'Ready to explore';
      this.container.querySelector('#b10StatusSub').textContent = 'Press "Drop objects" to watch the distribution.';

      const minGuaranteed = Math.ceil(objects / boxes);
      this.container.querySelector('#b10GuaranteeText').innerHTML =
        `<strong>Theoretical Guarantee:</strong> At least one ${sc.box} must contain <b>${minGuaranteed}</b> item${minGuaranteed === 1 ? '' : 's'}.`;
    };

    objSlider.addEventListener('input', () => { scenarioSelect.value = 'custom'; renderReady(); });
    boxSlider.addEventListener('input', () => { scenarioSelect.value = 'custom'; renderReady(); });
    scenarioSelect.addEventListener('change', () => {
      const sc = scenarios[scenarioSelect.value];
      objSlider.value = sc.objects;
      boxSlider.value = sc.boxes;
      renderReady();
    });

    dropBtn.addEventListener('click', async () => {
      const objects = parseInt(objSlider.value, 10);
      const boxes = parseInt(boxSlider.value, 10);
      const sc = { ...scenarios[scenarioSelect.value], key: scenarioSelect.value };

      let assignments = [];
      try {
        const res = await this.api.fetch(`/simulate?objects=${objects}&boxes=${boxes}`);
        assignments = res.data ? res.data.assignments : res.assignments;
      } catch {
        // Fallback
        assignments = Array.from({ length: objects }, (_, i) => i % boxes);
      }

      renderReady();
      const currentSim = this.simulationId;
      const slots = Array.from({ length: boxes }, () => []);

      this.container.querySelector('#b10StatusTitle').textContent = 'Distributing items...';

      assignments.forEach((boxIdx, idx) => {
        this.timer = setTimeout(() => {
          if (currentSim !== this.simulationId) return;
          slots[boxIdx].push(idx + 1);

          const pEl = document.getElementById(`b10-p-${idx + 1}`);
          if (pEl) pEl.style.opacity = '0.3';

          const boxEl = document.getElementById(`b10-box-${boxIdx}`);
          const token = document.createElement('span');
          token.className = 'pigeon-token';
          token.textContent = `${sc.token}${idx + 1}`;
          boxEl.querySelector('.hole-occupants').appendChild(token);

          const count = slots[boxIdx].length;
          boxEl.querySelector('.hole-box-count').textContent = count;

          if (count > 1) {
            boxEl.classList.add('has-collision');
            token.classList.add('collision-glow');
          }

          if (idx === assignments.length - 1) {
            const collisions = slots.filter(s => s.length > 1).length;
            const dot = this.container.querySelector('#b10StatusDot');
            if (collisions > 0) {
              dot.className = 'status-dot online';
              dot.style.background = 'var(--accent-orange-500)';
              this.container.querySelector('#b10StatusTitle').textContent = 'Collision Found!';
              this.container.querySelector('#b10StatusSub').textContent =
                `${collisions} ${sc.box}${collisions === 1 ? '' : 's'} contain more than one ${sc.token}.`;
            } else {
              this.container.querySelector('#b10StatusTitle').textContent = 'No Collisions';
              this.container.querySelector('#b10StatusSub').textContent = 'Every item remained in a separate bucket.';
            }
          }
        }, (idx + 1) * 120);
      });
    });

    resetBtn.addEventListener('click', renderReady);
    renderReady();
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#b10QuizSection');
    const questions = [
      {
        question: 'What is the role of hashFunction(i) in PigeonholeTable?',
        options: [
          'It counts how many boxes are empty.',
          'It maps an object index i to a bucket index via i % numHoles.',
          'It dynamically resizes the table.',
          'It generates random keys.'
        ],
        answer: 1,
        hint: 'Review backend.cpp lines 63-65.',
        explanation: 'hashFunction(objectIndex) returns objectIndex % numHoles, providing an O(1) modulo mapping into buckets.'
      },
      {
        question: 'When the number of objects exceeds the number of buckets in a hash table, what does the Pigeonhole Principle guarantee?',
        options: [
          'The hash table is guaranteed to crash.',
          'At least one bucket is guaranteed to receive more than one element (a collision).',
          'Every bucket is guaranteed to have the exact same number of elements.',
          'No collisions can occur.'
        ],
        answer: 1,
        hint: 'More pigeons than pigeonholes.',
        explanation: 'By the Pigeonhole Principle, whenever n > k, at least one bucket must receive at least 2 elements, necessitating collision resolution strategies.'
      },
      {
        question: 'Why do hash tables use collision resolution (such as separate chaining or open addressing)?',
        options: [
          'To prevent the user from typing invalid keys.',
          'Because collisions are mathematically unavoidable whenever n > k.',
          'To sort the keys in alphabetical order.',
          'To make the code harder to reverse engineer.'
        ],
        answer: 1,
        hint: 'Can collisions be completely avoided when elements exceed buckets?',
        explanation: 'Because the Pigeonhole Principle guarantees collisions when n > k, every hash table implementation must have a collision resolution strategy.'
      }
    ];

    new Quiz(quizSection, questions);
  },

  unmount() {
    if (this.timer) clearTimeout(this.timer);
  }
};
