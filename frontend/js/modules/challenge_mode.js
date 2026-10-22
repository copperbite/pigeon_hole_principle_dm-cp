// ============================================================================
// Module: Challenge Mode - "Spot the Pigeonhole"
// ============================================================================

const challenge_mode = {
  _state: { current: 0, score: 0, answered: false, results: [] },

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._state = { current: 0, score: 0, answered: false, results: [] };
    this._renderQuestion(container);
    this._initControls(container);
  },
  unmount() {},

  _questions() {
    return [
      {
        scenario: "In a group of 13 people, must two of them share the same birth month?",
        pigeons: "13 people",
        holes: "12 months of the year",
        answer: 0,
        options: ["Yes — 13 > 12, so by PHP two share a month", "No — birthdays can be in any month", "Only if they were born in the same year", "We need more information to determine this"],
        explanation: "Correct! By the Pigeonhole Principle, 13 people (pigeons) into 12 months (holes) guarantees that at least ⌈13/12⌉ = 2 share a birth month.",
        difficulty: 'easy'
      },
      {
        scenario: "A hash table has 100 buckets and 150 keys are inserted using a perfect hash function. What is the minimum guaranteed maximum chain length?",
        pigeons: "150 keys",
        holes: "100 buckets",
        answer: 1,
        options: ["1 (all keys fit in separate buckets)", "⌈150/100⌉ = 2 (at least one bucket has ≥ 2 keys)", "150 (worst case)", "We cannot determine without knowing the hash function"],
        explanation: "By the Generalized Pigeonhole Principle, ⌈n/k⌉ = ⌈150/100⌉ = 2. At least one bucket must contain 2 or more keys.",
        difficulty: 'medium'
      },
      {
        scenario: "You have a deck of 52 playing cards. You draw cards one at a time. What is the minimum number of cards needed to guarantee at least 3 cards of the same suit?",
        pigeons: "cards drawn",
        holes: "4 suits (♠ ♥ ♦ ♣)",
        answer: 2,
        options: ["4 cards (one per suit)", "8 cards (two per suit)", "⌈n/k⌉ = 9 cards (guarantees 3 of one suit by k(r-1)+1)", "13 cards (full suit)"],
        explanation: "Using the formula k(r-1)+1 with k=4 suits and r=3 required: 4×(3-1)+1 = 9. With 9 cards, the adversary can at most give 2 of each suit (8 cards total), so the 9th must create a third in some suit.",
        difficulty: 'medium'
      },
      {
        scenario: "In any set of 5 integers, must at least two have the same remainder when divided by 4?",
        pigeons: "5 integers",
        holes: "Remainders mod 4: {0, 1, 2, 3}",
        answer: 0,
        options: ["Yes — 5 integers into 4 remainder classes guarantees a repeat", "No — integers can have different remainders", "Only if all are consecutive", "Only if all are positive"],
        explanation: "Yes! The 4 possible remainders mod 4 are the holes. With 5 integers (pigeons), at least two must land in the same remainder class by the Pigeonhole Principle.",
        difficulty: 'easy'
      },
      {
        scenario: "Git uses 7-character hexadecimal commit hashes. A repository has 30,000 commits. Must there be a collision?",
        pigeons: "30,000 commits",
        holes: "16^7 = 268,435,456 possible 7-hex-char hashes",
        answer: 1,
        options: ["Yes — 30,000 > some bound so collisions are certain", "No — 30,000 ≪ 268 million, so collisions are not guaranteed", "Yes, always, because hashing is lossy", "We need to know the actual hash function"],
        explanation: "No collision is guaranteed! 30,000 ≪ 268,435,456. The Pigeonhole Principle only guarantees collision when pigeons > holes. Here, 30,000 < 268M, so all commits could theoretically have unique short hashes. Collision is only probabilistic here.",
        difficulty: 'hard'
      },
      {
        scenario: "In a graph of 10 vertices, what is the minimum number of odd-degree vertices that can exist?",
        pigeons: "Sum of degrees",
        holes: "Edges (each contributes 2 to sum)",
        answer: 1,
        options: ["0 — it's possible for all vertices to have even degree", "1 — at least one must be odd", "2 — there must be at least 2 odd-degree vertices", "It depends on the number of edges"],
        explanation: "By the Handshaking Lemma, ∑deg(v) = 2|E| is always even. The sum of an odd number of odd-degree vertices would be odd — contradiction. So the count of odd-degree vertices must be even. The minimum is 0 (all even degrees, as in a cycle graph).",
        difficulty: 'hard'
      },
      {
        scenario: "In a room of 23 people, what is the approximate probability that at least two people share the exact same birthday (month and day)?",
        pigeons: "23 individuals",
        holes: "365 days of the year",
        answer: 2,
        options: ["Less than 5% (since 23 is tiny compared to 365)", "About 23/365 ≈ 6.3%", "Over 50% (approx 50.7%)", "100% guaranteed by the Pigeonhole Principle"],
        explanation: "Over 50%! While the Pigeonhole Principle requires 366+1 = 367 people for a 100% certainty, there are 23×22/2 = 253 pairs of people. The probability that all 23 birthdays are distinct drops below 50% (1 - 365×364×...×343 / 365^23 ≈ 50.7%).",
        difficulty: 'medium'
      },
      {
        scenario: "Using the Havel-Hakimi theorem, can a simple graph have degree sequence (3, 3, 3, 1)?",
        pigeons: "Sum of degrees = 10",
        holes: "Degree bounds and graphic realizations",
        answer: 1,
        options: ["Yes — the sum of degrees is even so it is graphic", "No — reduction yields a negative degree, so it is non-graphic", "Only if multi-edges are allowed", "Yes, as a complete graph"],
        explanation: "Havel-Hakimi removes 3 and decrements the next 3: (3, 3, 1) becomes (2, 2, 0). Next, remove 2 and decrement: (2, 0) becomes (1, -1), containing a negative degree! Thus (3,3,3,1) is not graphic.",
        difficulty: 'hard'
      },
      {
        scenario: "In a tournament of 8 teams (every pair plays once), must two teams have the same number of wins?",
        pigeons: "8 teams",
        holes: "Possible win counts: {0,1,...,7} but 0 and 7 can't both occur",
        answer: 0,
        options: ["Yes — by the Pigeonhole Principle, 8 teams into at most 7 valid win counts", "No — each team can have a unique number of wins", "Only in a balanced tournament", "We need to know the matchups"],
        explanation: "Correct! A team with 7 wins beat everyone, but then no team can have 0 wins (they lost to the 7-win team). So valid win counts are 0–7 minus one possibility: at most 7 distinct values for 8 teams → guaranteed tie by Pigeonhole!",
        difficulty: 'medium'
      },
      {
        scenario: "A connected graph has exactly 2 vertices of odd degree and all other vertices have even degree. What does Euler's theorem guarantee?",
        pigeons: "Odd-degree endpoints",
        holes: "Edge traversal parity constraints",
        answer: 0,
        options: ["An Eulerian path exists (starting and ending at the 2 odd vertices)", "An Eulerian circuit exists (returning to the start)", "No path can traverse all edges", "The graph must be a tree"],
        explanation: "By Euler's theorem, an Eulerian trail visiting every edge exactly once exists if and only if exactly 0 or 2 vertices have odd degree. When exactly 2 are odd, the path starts at one odd vertex and terminates at the other.",
        difficulty: 'medium'
      },
      {
        scenario: "Three jars have capacities of 3, 4, and 5 marbles respectively. What is the minimum number of marbles needed to guarantee that at least one jar is completely filled?",
        pigeons: "Marbles placed",
        holes: "3 jars with quotas (3, 4, 5)",
        answer: 2,
        options: ["12 marbles (sum of all capacities)", "11 marbles", "(3-1) + (4-1) + (5-1) + 1 = 10 marbles", "9 marbles"],
        explanation: "By the Strong/Weighted Pigeonhole Principle: the adversary can place (c_i - 1) marbles into each jar without filling any: 2 + 3 + 4 = 9 marbles. The 10th marble is guaranteed to completely fill at least one jar!",
        difficulty: 'hard'
      },
      {
        scenario: "If the infinite set of all natural numbers N is partitioned into 5 disjoint subsets, what does the Infinite Pigeonhole Principle guarantee?",
        pigeons: "Infinitely many natural numbers",
        holes: "5 disjoint partition subsets",
        answer: 0,
        options: ["At least one of the 5 subsets must be infinite", "All 5 subsets must be infinite", "Exactly one subset is infinite and 4 are finite", "Each subset contains 20% of the numbers"],
        explanation: "By the Infinite Pigeonhole Principle: a finite union of finite sets is always finite. If all 5 subsets were finite, their union would be finite, contradicting that N is infinite. Thus at least one subset must be infinite.",
        difficulty: 'medium'
      }
    ];
  },

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge badge-tier1" style="background:var(--warning)">Challenge</span>
    <h1 class="module-title">🎯 Spot the Pigeonhole</h1>
    <p class="module-subtitle">Test your understanding of the Pigeonhole Principle with 12 challenging scenarios. Identify the pigeons, the holes, and the guarantee.</p>
  </div>

  <div style="display:flex;gap:var(--space-3);align-items:center;margin-bottom:var(--space-3);flex-wrap:wrap">
    <div class="stat-box" style="display:inline-flex;gap:var(--space-2)">
      <span>Score:</span> <strong id="scoreDisplay">0 / 0</strong>
    </div>
    <div id="progressBar" style="flex:1;min-width:200px;height:8px;background:var(--surface-alt);border-radius:4px;overflow:hidden">
      <div id="progressFill" style="height:100%;background:var(--success);width:0%;transition:width 0.3s"></div>
    </div>
    <button class="btn btn-secondary" id="restartBtn">🔄 Restart</button>
  </div>

  <div id="questionCard" class="card">
    <div class="card-header">
      <span id="questionNum" style="color:var(--text-muted)">Question 1 of 12</span>
      <span id="diffBadge" class="nav-badge"></span>
    </div>
    <div class="card-body">
      <div class="callout callout-idea" id="scenarioText" style="font-size:1.05rem;line-height:1.6"></div>
      <div style="margin:var(--space-2) 0;font-size:0.85rem;color:var(--text-muted)">
        <strong>Pigeons:</strong> <span id="pigeonHint"></span><br>
        <strong>Holes:</strong> <span id="holeHint"></span>
      </div>
      <div id="optionsContainer" style="display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-3)"></div>
      <div id="explanationBox" style="display:none;margin-top:var(--space-3)"></div>
      <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
        <button class="btn btn-primary" id="nextBtn" style="display:none">Next Question →</button>
        <button class="btn btn-secondary" id="skipBtn">Skip</button>
      </div>
    </div>
  </div>

  <div id="finalCard" class="card" style="display:none;margin-top:var(--space-4)">
    <div class="card-header"><h3>🏆 Final Results</h3></div>
    <div class="card-body" id="finalResults"></div>
  </div>
</div>`;
  },

  _initControls(container) {
    container.querySelector('#restartBtn').addEventListener('click', () => {
      this._state = { current: 0, score: 0, answered: false, results: [] };
      container.querySelector('#finalCard').style.display = 'none';
      container.querySelector('#questionCard').style.display = '';
      this._renderQuestion(container);
    });
    container.querySelector('#skipBtn').addEventListener('click', () => {
      if (!this._state.answered) {
        this._state.results.push({ correct: false, skipped: true });
        this._state.answered = true;
      }
      this._nextQuestion(container);
    });
    container.querySelector('#nextBtn').addEventListener('click', () => this._nextQuestion(container));
  },

  _renderQuestion(container) {
    const qs = this._questions();
    const state = this._state;
    if (state.current >= qs.length) { this._showFinal(container); return; }

    const q = qs[state.current];
    state.answered = false;

    container.querySelector('#questionNum').textContent = `Question ${state.current+1} of ${qs.length}`;
    container.querySelector('#scoreDisplay').textContent = `${state.score} / ${state.current}`;

    const diffColors = { easy:'var(--success)', medium:'var(--warning)', hard:'var(--error)' };
    const diffBadge = container.querySelector('#diffBadge');
    diffBadge.textContent = q.difficulty.toUpperCase();
    diffBadge.style.background = diffColors[q.difficulty];

    container.querySelector('#scenarioText').textContent = q.scenario;
    container.querySelector('#pigeonHint').textContent = q.pigeons;
    container.querySelector('#holeHint').textContent = q.holes;
    container.querySelector('#explanationBox').style.display = 'none';
    container.querySelector('#nextBtn').style.display = 'none';

    const fill = Math.round(state.current/qs.length*100);
    container.querySelector('#progressFill').style.width = fill+'%';

    const opts = container.querySelector('#optionsContainer');
    opts.innerHTML = q.options.map((opt, i) => `
      <button class="option-btn" data-idx="${i}" style="text-align:left;padding:var(--space-2) var(--space-3);border:2px solid var(--border-color);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;color:var(--text-primary)">
        <span style="font-weight:700;margin-right:var(--space-2)">${String.fromCharCode(65+i)}.</span>${opt}
      </button>`).join('');

    opts.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => { if(!state.answered) btn.style.borderColor='var(--primary)'; });
      btn.addEventListener('mouseleave', () => { if(!state.answered) btn.style.borderColor='var(--border-color)'; });
      btn.addEventListener('click', () => {
        if (state.answered) return;
        state.answered = true;
        const idx = parseInt(btn.getAttribute('data-idx'));
        const correct = idx === q.answer;
        if (correct) state.score++;
        state.results.push({ correct, skipped: false });

        opts.querySelectorAll('.option-btn').forEach((b, i) => {
          b.style.cursor = 'default';
          if (i === q.answer) { b.style.borderColor='var(--success)'; b.style.background='var(--success-muted)'; }
          else if (i === idx && !correct) { b.style.borderColor='var(--error)'; b.style.background='rgba(239,68,68,0.1)'; }
        });

        const expBox = container.querySelector('#explanationBox');
        expBox.style.display = '';
        expBox.innerHTML = `<div class="callout callout-${correct?'success':'warning'}">
          <strong>${correct?'✅ Correct!':'❌ Incorrect.'}</strong> ${q.explanation}
        </div>`;

        container.querySelector('#scoreDisplay').textContent = `${state.score} / ${state.current+1}`;
        container.querySelector('#nextBtn').style.display = '';
      });
    });
  },

  _nextQuestion(container) {
    this._state.current++;
    const qs = this._questions();
    if (this._state.current >= qs.length) {
      this._showFinal(container);
    } else {
      this._renderQuestion(container);
    }
  },

  _showFinal(container) {
    container.querySelector('#questionCard').style.display = 'none';
    const finalCard = container.querySelector('#finalCard');
    finalCard.style.display = '';

    const { score, results } = this._state;
    const total = results.length;
    const pct = Math.round(score/total*100);
    const grade = pct >= 90 ? '🏆 Expert' : pct >= 70 ? '🎓 Proficient' : pct >= 50 ? '📚 Learning' : '🌱 Beginner';

    container.querySelector('#finalResults').innerHTML = `
      <div style="text-align:center;margin-bottom:var(--space-4)">
        <div style="font-size:3rem;margin-bottom:var(--space-2)">${grade.split(' ')[0]}</div>
        <div style="font-size:1.5rem;font-weight:700">${grade.split(' ')[1]}</div>
        <div style="font-size:1.1rem;color:var(--text-muted)">${score} / ${total} correct (${pct}%)</div>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:var(--space-3)">
        ${results.map((r,i) => `<div style="width:28px;height:28px;background:${r.correct?'var(--success)':r.skipped?'var(--border-color)':'var(--error)'};border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold">${i+1}</div>`).join('')}
      </div>
      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn-primary" id="retryBtn">🔄 Try Again</button>
        <a href="#/" class="btn btn-secondary">← Back to Home</a>
      </div>`;

    container.querySelector('#retryBtn').addEventListener('click', () => {
      this._state = { current: 0, score: 0, answered: false, results: [] };
      finalCard.style.display = 'none';
      container.querySelector('#questionCard').style.display = '';
      this._renderQuestion(container);
    });
  }
};

export default challenge_mode;
