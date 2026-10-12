// ============================================================================
// Landing Page Module (Hero, Live Drop Animation, Module Card Grid)
// ============================================================================

export default {
  id: 'home',
  title: 'Pigeonhole Lab - Interactive Combinatorics Platform',
  tier: 1,
  summary: 'Interactive exploration of the Pigeonhole Principle, theorems, and computing applications.',

  mount(container, api) {
    container.innerHTML = `
      <section class="hero-section">
        <div class="hero-pill">
          <span>🕊️</span> Discrete Mathematics & Data Structures
        </div>
        <h1 class="hero-title">The Pigeonhole Principle Lab</h1>
        <p class="hero-description">
          If you place more pigeons than holes, at least one hole must contain two or more pigeons.
          Explore the fundamental counting principle that drives modern hashing, Ramsey theory, and discrete mathematics.
        </p>

        <!-- Live Hero Animation Card -->
        <div class="hero-animation-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3)">
            <strong style="font-size:0.9375rem">Live Interactive Demonstration</strong>
            <button class="btn btn-primary btn-sm" id="heroDropBtn">Drop 5 Pigeons into 4 Holes</button>
          </div>
          <div class="hero-canvas-wrap">
            <div class="hero-pigeon-source" id="heroSourceRow"></div>
            <div class="hero-holes-row" id="heroHolesRow"></div>
          </div>
          <div id="heroCollisionNotice" style="margin-top:var(--space-4); font-size:0.875rem; font-weight:600; color:var(--text-muted)">
            Press "Drop Pigeons" to observe the guaranteed collision.
          </div>
        </div>

        <!-- Filter Buttons -->
        <div class="module-grid-filter">
          <button class="filter-btn active" data-filter="all">All Modules</button>
          <button class="filter-btn" data-filter="beginner">Beginner</button>
          <button class="filter-btn" data-filter="intermediate">Intermediate</button>
          <button class="filter-btn" data-filter="advanced">Advanced</button>
          <button class="filter-btn" data-filter="graphs">Graphs & Geometry</button>
          <button class="filter-btn" data-filter="realworld">Real-World</button>
        </div>

        <!-- Modules Grid -->
        <div class="modules-grid" id="modulesGrid"></div>
      </section>
    `;

    this.initHeroAnimation();
    this.renderModuleCards(container);
  },

  initHeroAnimation() {
    const sourceRow = document.getElementById('heroSourceRow');
    const holesRow = document.getElementById('heroHolesRow');
    const dropBtn = document.getElementById('heroDropBtn');
    const notice = document.getElementById('heroCollisionNotice');

    const numPigeons = 5;
    const numHoles = 4;

    function reset() {
      sourceRow.innerHTML = '';
      holesRow.innerHTML = '';
      for (let i = 1; i <= numPigeons; ++i) {
        sourceRow.insertAdjacentHTML('beforeend', `<div class="pigeon-token" id="hp-${i}">P${i}</div>`);
      }
      for (let j = 1; j <= numHoles; ++j) {
        holesRow.insertAdjacentHTML('beforeend', `
          <div class="hole-box" id="hh-${j}">
            <span class="hole-box-label">Hole ${j}</span>
            <span class="hole-box-count">0 items</span>
            <div class="hole-occupants" style="display:flex; gap:4px; margin-top:6px"></div>
          </div>
        `);
      }
    }

    reset();

    dropBtn.addEventListener('click', () => {
      reset();
      dropBtn.disabled = true;
      notice.textContent = 'Distributing pigeons across available holes...';

      // 5 pigeons into 4 holes: assign pigeon 5 to hole 1 for collision
      const targets = [1, 2, 3, 4, 1];
      const counts = [0, 0, 0, 0];

      targets.forEach((targetHole, idx) => {
        setTimeout(() => {
          const pigeonEl = document.getElementById(`hp-${idx + 1}`);
          if (pigeonEl) pigeonEl.style.opacity = '0.3';

          const holeEl = document.getElementById(`hh-${targetHole}`);
          counts[targetHole - 1]++;
          holeEl.querySelector('.hole-box-count').textContent = `${counts[targetHole - 1]} items`;

          const token = document.createElement('div');
          token.className = 'pigeon-token';
          token.textContent = `P${idx + 1}`;
          holeEl.querySelector('.hole-occupants').appendChild(token);

          if (counts[targetHole - 1] > 1) {
            holeEl.classList.add('has-collision');
            token.classList.add('collision-glow');
          }

          if (idx === targets.length - 1) {
            dropBtn.disabled = false;
            notice.innerHTML = `<span style="color:var(--accent-orange-600)">Collision Detected!</span> Hole 1 holds 2 pigeons (⌈5/4⌉ = 2). The principle guarantees this unavoidable overlap!`;
          }
        }, (idx + 1) * 350);
      });
    });
  },

  renderModuleCards(container) {
    const modules = [
      { id: 'a1_simple', title: 'A1. Simple Pigeonhole Principle', badge: 'Beginner', category: 'beginner', icon: '🕊️', summary: 'The fundamental theorem: if n > k, at least one box contains ≥ 2 objects.' },
      { id: 'a2_generalized', title: 'A2. Generalized Principle', badge: 'Beginner', category: 'beginner', icon: '📊', summary: 'Ceiling bound ⌈n/k⌉. Compare round-robin, random, and adversarial allocations.' },
      { id: 'a3_exhaustive', title: 'A3. Exhaustive Computer Verifier', badge: 'Intermediate', category: 'intermediate', icon: '💻', summary: 'Odometer brute-force check over all kⁿ mappings verifying that the bound is tight.' },
      { id: 'a4_socks_draws', title: 'A4. Minimum Draws / Socks', badge: 'Beginner', category: 'beginner', icon: '🧦', summary: 'Worst-case adversary strategy requiring k(r - 1) + 1 draws to guarantee r identical items.' },
      { id: 'b10_core_table', title: 'B10. The Pigeonhole Table (DSA)', badge: 'Beginner', category: 'beginner', icon: '🗄️', summary: 'The original interactive PigeonholeTable with modulo hash mapping and collision detection.' },
      { id: 'b5_hashing', title: 'B5. Hashing & Collisions', badge: 'Intermediate', category: 'intermediate', icon: '⚡', summary: 'Separate chaining vs linear probing with modulo, Knuth multiplicative, and PRNG hashes.' },
      { id: 'b3_divisible', title: 'B3. Divisible Subsequences', badge: 'Intermediate', category: 'intermediate', icon: '🔢', summary: 'Prefix sums modulo n guarantee a contiguous subarray whose sum is divisible by n.' },
      { id: 'b2_dirichlet', title: 'B2. Dirichlet Approximation', badge: 'Advanced', category: 'advanced', icon: '🎯', summary: 'Approximating irrational numbers within 1/q² via fractional parts in 1/N buckets.' },
      { id: 'b4_birthday', title: 'B4. Birthday Paradox', badge: 'Intermediate', category: 'intermediate', icon: '🎂', summary: '50% probability at 23 people vs 100% pigeonhole certainty at 366 people.' },
      { id: 'b1_erdos_szekeres', title: 'B1. Erdős-Szekeres Theorem', badge: 'Advanced', category: 'advanced', icon: '📈', summary: 'Any sequence of mn + 1 distinct numbers has an increasing (m+1) or decreasing (n+1) subsequence.' },
      { id: 'b6_ramsey', title: 'B6. Ramsey Theory R(3,3)=6', badge: 'Advanced', category: 'graphs', icon: '🎉', summary: 'The Party Problem: 6 people always contain 3 mutual friends or 3 mutual strangers.' },
      { id: 'b7_handshake', title: 'B7. Handshake / Equal Degrees', badge: 'Beginner', category: 'graphs', icon: '🤝', summary: 'Any graph with n ≥ 2 vertices has two vertices of equal degree. Handshaking lemma.' },
      { id: 'c1_havel_hakimi', title: 'C1. Havel-Hakimi Algorithm', badge: 'Intermediate', category: 'graphs', icon: '🕸️', summary: 'Determining if a degree sequence is graphic, with step-by-step constructive graph realization.' },
      { id: 'c2_hall_marriage', title: 'C2. Hall\'s Marriage Theorem', badge: 'Advanced', category: 'graphs', icon: '💍', summary: 'Bipartite maximum matching via augmenting paths and Hall violator set detection.' },
      { id: 'g1_points_square', title: 'G1. Points in a Unit Square', badge: 'Beginner', category: 'graphs', icon: '📐', summary: 'Any 5 points in a unit square contain a pair within distance √2 / 2.' },
      { id: 'r1_real_world', title: 'R1. Real-World Case Files', badge: 'Beginner', category: 'realworld', icon: '🌍', summary: '15 real-world case files: Bloom filters, Git hashes, hair counts, IPv4 NAT, cache misses.' },
      { id: 'learning_path', title: 'Learning Path Interactive Map', badge: 'All Levels', category: 'all', icon: '🗺️', summary: 'Guided graph showing how the principle flows from basic counting to advanced graph invariants.' }
    ];

    const grid = container.querySelector('#modulesGrid');
    const filterBtns = container.querySelectorAll('.filter-btn');

    function render(filter) {
      const filtered = filter === 'all' ? modules : modules.filter(m => m.category === filter || m.badge.toLowerCase() === filter);
      grid.innerHTML = filtered.map(m => `
        <a href="#/module/${m.id}" class="module-card">
          <div class="module-card-icon">${m.icon}</div>
          <h3 class="module-card-title">${m.title}</h3>
          <p class="module-card-summary">${m.summary}</p>
          <div class="module-card-footer">
            <span class="badge badge-${m.badge.toLowerCase()}">${m.badge}</span>
            <span class="btn btn-outline" style="font-size:0.75rem; padding:4px 10px">Explore →</span>
          </div>
        </a>
      `).join('');
    }

    render('all');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        render(e.currentTarget.dataset.filter);
      });
    });
  },

  unmount() {}
};
