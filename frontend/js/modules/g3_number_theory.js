// ============================================================================
// Module G3: Number Theory Gallery (Tier 2, Intermediate)
// 4 Interactive Mathematical Cards with Long-Division Visualizer
// ============================================================================

import { Callout } from '../ui/Callout.js';
import { Quiz } from '../ui/Quiz.js';

export default {
  id: 'g3_number_theory',
  title: 'Number Theory Pigeonhole Gallery',
  tier: 2,
  badge: 'Intermediate',
  time: '6 min',
  summary: 'Four classical number-theory gems proven by the Pigeonhole Principle with live calculators.',

  mount(container, api) {
    this.container = container;
    this.api = api;

    container.innerHTML = `
      <div class="module-view">
        <header class="module-header">
          <div class="module-meta-row">
            <span class="badge badge-intermediate">Tier 2 · Intermediate</span>
            <span style="font-size:0.8125rem; color:var(--text-muted)">⏱️ Est. Time: 6 min</span>
          </div>
          <h1 class="module-title">G3. Number Theory Pigeonhole Gallery</h1>
          <p class="module-big-idea">
            🔢 The Pigeonhole Principle is the secret weapon behind some of arithmetic's most astonishing guarantees:
            repeating decimals, coprime subsets, and repunit multiples with digits 0 and 1!
          </p>
        </header>

        <!-- 4 Interactive Number Theory Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin:24px 0">
          <!-- Card 1: Decimal Expansion Repeats -->
          <article class="card">
            <h3 style="color:var(--primary-600)">1. Decimal Expansion Must Repeat</h3>
            <p style="font-size:0.875rem; color:var(--text-muted); margin:8px 0">
              When dividing $a$ by $b$, the remainder in long division must be in $\{0, 1, \dots, b - 1\}$.
              After at most $b$ steps, a remainder MUST repeat, forcing the decimal digits into an infinite cycle!
            </p>
            <div style="display:flex; gap:8px; margin:12px 0">
              <input type="number" id="g3NumA" value="1" min="1" style="width:70px; padding:6px; border-radius:var(--radius-sm); border:1px solid var(--border-light)">
              <span style="align-self:center">/</span>
              <input type="number" id="g3NumB" value="7" min="1" max="100" style="width:70px; padding:6px; border-radius:var(--radius-sm); border:1px solid var(--border-light)">
              <button class="btn btn-primary btn-sm" id="g3DivideBtn">Run Long Division</button>
            </div>
            <div id="g3DivisionResult" style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-sm); font-size:0.8125rem; font-family:var(--font-mono)">
              1/7 = 0.(142857)... (Cycle length: 6)
            </div>
          </article>

          <!-- Card 2: Two Coprime Integers from {1..2n} -->
          <article class="card">
            <h3 style="color:var(--accent-orange-600)">2. Two Coprime Numbers</h3>
            <p style="font-size:0.875rem; color:var(--text-muted); margin:8px 0">
              Choose any $n + 1$ integers from $\{1, 2, \dots, 2n\}$.
              At least two must be consecutive! Because $\gcd(k, k+1) = 1$, they are guaranteed to be <strong>coprime</strong>!
            </p>
            <div style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-sm); font-size:0.8125rem">
              <strong>Pigeonholes:</strong> $n$ pairs $\{1, 2\}, \{3, 4\}, \dots, \{2n-1, 2n\}$.<br>
              Selecting $n + 1$ numbers forces at least one full pair $\{2k-1, 2k\}$ to be picked.
            </div>
          </article>

          <!-- Card 3: Multiple Using Only Digits 0 and 1 -->
          <article class="card">
            <h3 style="color:var(--accent-green-600)">3. Multiples in {0, 1}</h3>
            <p style="font-size:0.875rem; color:var(--text-muted); margin:8px 0">
              For every integer $n$, there exists a positive multiple of $n$ whose base-10 representation contains only digits 0 and 1!
            </p>
            <div style="display:flex; gap:8px; margin:12px 0">
              <input type="number" id="g3RepunitN" value="7" min="2" max="99" style="width:80px; padding:6px; border-radius:var(--radius-sm); border:1px solid var(--border-light)">
              <button class="btn btn-primary btn-sm" id="g3RepunitBtn">Find Multiple</button>
            </div>
            <div id="g3RepunitResult" style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-sm); font-size:0.8125rem; font-family:var(--font-mono)">
              Multiple for 7: 1001 (7 × 143 = 1001)
            </div>
          </article>

          <!-- Card 4: Modulo Parity & Remainders -->
          <article class="card">
            <h3 style="color:var(--accent-purple-600)">4. Modulo Parity</h3>
            <p style="font-size:0.875rem; color:var(--text-muted); margin:8px 0">
              Among any 3 integers, at least two have the same parity (both even or both odd), because there are only 2 parities!
              Consequently, $(a - b)(b - c)(c - a)$ is always even.
            </p>
            <div style="padding:10px; background:var(--bg-subtle); border-radius:var(--radius-sm); font-size:0.8125rem">
              <strong>Generalization:</strong> Among any $n + 1$ integers, at least two have the same remainder modulo $n$.
            </div>
          </article>
        </div>

        <!-- Complexity Box -->
        <section class="complexity-box">
          <div class="complexity-item">
            <strong>Decimal Cycle Finder</strong>
            <code>O(b)</code> remainders tracking
          </div>
          <div class="complexity-item">
            <strong>Repunit Search</strong>
            <code>O(n)</code> prefix residues mod n
          </div>
        </section>

        <!-- Quiz Widget -->
        <section id="g3QuizSection"></section>

        <!-- Related Modules -->
        <section style="margin:24px 0; display:flex; gap:12px; flex-wrap:wrap">
          <a href="#/module/b3_divisible" class="btn btn-outline">← Back: B3. Divisible Subsequence</a>
          <a href="#/module/b2_dirichlet" class="btn btn-outline">B2. Dirichlet Approximation →</a>
          <a href="#/module/b1_erdos_szekeres" class="btn btn-outline">B1. Erdős-Szekeres Theorem →</a>
        </section>
      </div>
    `;

    this.initCardLogics();
    this.initQuiz();
  },

  initCardLogics() {
    // 1. Long Division Logic
    const divBtn = this.container.querySelector('#g3DivideBtn');
    divBtn.addEventListener('click', () => {
      const a = parseInt(this.container.querySelector('#g3NumA').value, 10) || 1;
      const b = parseInt(this.container.querySelector('#g3NumB').value, 10) || 7;
      const resultEl = this.container.querySelector('#g3DivisionResult');

      let remainder = a % b;
      const seen = new Map();
      const digits = [];
      let step = 0;

      while (remainder !== 0 && !seen.has(remainder) && step < 100) {
        seen.set(remainder, step);
        remainder *= 10;
        digits.push(Math.floor(remainder / b));
        remainder %= b;
        step++;
      }

      if (remainder === 0) {
        resultEl.textContent = `${a}/${b} = ${(a/b).toFixed(digits.length)} (Terminating decimal)`;
      } else {
        const cycleStart = seen.get(remainder);
        const nonRepeat = digits.slice(0, cycleStart).join('');
        const repeat = digits.slice(cycleStart).join('');
        resultEl.innerHTML = `
          ${a}/${b} = ${Math.floor(a/b)}.${nonRepeat}<b>(${repeat})</b>...<br>
          Cycle length: ${repeat.length} (≤ ${b - 1} remainders)
        `;
      }
    });

    // 3. Repunit Multiples Logic (1, 11, 111, 1111...)
    const repBtn = this.container.querySelector('#g3RepunitBtn');
    repBtn.addEventListener('click', () => {
      const n = parseInt(this.container.querySelector('#g3RepunitN').value, 10) || 7;
      const resultEl = this.container.querySelector('#g3RepunitResult');

      // Consider numbers 1, 11, 111, 1111, ... mod n
      const seen = new Map();
      seen.set(0, 0); // R_0 = 0
      let rem = 0;
      let u = -1, v = -1;

      for (let i = 1; i <= n + 1; ++i) {
        rem = (rem * 10 + 1) % n;
        if (seen.has(rem)) {
          u = seen.get(rem);
          v = i;
          break;
        }
        seen.set(rem, i);
      }

      // Number is R_v - R_u = 111...1000...0
      const ones = v - u;
      const zeros = u;
      const repStr = '1'.repeat(ones) + '0'.repeat(zeros);
      resultEl.innerHTML = `
        Multiple for ${n}: <b>${repStr}</b><br>
        Formed by difference R_${v} - R_${u} (digits in {0, 1})
      `;
    });
  },

  initQuiz() {
    const quizSection = this.container.querySelector('#g3QuizSection');
    const questions = [
      {
        question: 'Why must the decimal representation of any fraction a/b either terminate or repeat?',
        options: [
          'Because decimal systems are base 10.',
          'Because in long division, there are at most b possible remainders {0, ..., b-1}; by PHP, a remainder must repeat after at most b steps.',
          'Because computer screens have finite width.',
          'Because all fractions are irrational.'
        ],
        answer: 1,
        hint: 'How many different remainders can you get when dividing by b?',
        explanation: 'Dividing by b yields remainders in {0, 1, ..., b-1}. If remainder 0 appears, it terminates; otherwise, by PHP, one of the b-1 remainders must repeat within b steps, forcing repeating digits.'
      },
      {
        question: 'If you choose 51 numbers from {1, 2, ..., 100}, what is guaranteed?',
        options: [
          'All numbers are odd.',
          'At least two numbers are coprime.',
          'All numbers are prime.',
          'The sum is divisible by 100.'
        ],
        answer: 1,
        hint: 'Partition {1..100} into 50 pairs of consecutive numbers {2k-1, 2k}.',
        explanation: 'There are 50 pairs {1, 2}, {3, 4}, ..., {99, 100}. By PHP, choosing 51 numbers forces both elements of some pair to be chosen. Consecutive integers are always coprime (gcd = 1).'
      },
      {
        question: 'Why does every integer n have a positive multiple made only of digits 0 and 1?',
        options: [
          'Binary numbers are always multiples of n.',
          'Among the n + 1 numbers 1, 11, 111, ..., two must have the same remainder mod n, and their difference uses only 1s and 0s.',
          'By Fermat\'s Little Theorem.',
          'Because 0 is divisible by all numbers.'
        ],
        answer: 1,
        hint: 'Subtract two repunits 1111... - 11... = 11...00...',
        explanation: 'The n + 1 repunits mod n must produce two identical residues by PHP. Their difference is an integer composed entirely of 1s followed by 0s that is divisible by n.'
      }
    ];

    new Quiz(quizSection, questions);
  },

  unmount() {}
};
