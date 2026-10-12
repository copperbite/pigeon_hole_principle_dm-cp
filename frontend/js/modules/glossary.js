// ============================================================================
// Module: Glossary - Searchable Term Definitions for Pigeonhole Lab
// ============================================================================

const glossary = {
  _terms: {
    "Pigeonhole Principle (Schubfachprinzip)": "Formulated by Dirichlet in 1834: If $n$ items are distributed into $k$ containers and $n > k$, then at least one container must contain at least two items. Symbolically: if $|S| > |T|$, no injective function $f: S \\to T$ exists.",
    "Generalized Pigeonhole Principle": "If $n$ objects are placed into $k$ boxes, then at least one box must contain at least $\\lceil n/k \\rceil$ objects, and at least one box must contain at most $\\lfloor n/k \\rfloor$ objects.",
    "Strong / Weighted Pigeonhole Principle": "If $k$ boxes have respective capacities/thresholds $n_1, n_2, \\dots, n_k$, then placing $\\sum_{i=1}^k n_i - k + 1$ objects guarantees that for at least one box $i$, it contains at least $n_i$ objects.",
    "Averaging Principle": "For any set of real numbers, there exists at least one element greater than or equal to the arithmetic mean, and at least one element less than or equal to the mean. Forms the conceptual bridge to Erdős's Probabilistic Method.",
    "Infinite Pigeonhole Principle": "If an infinite set $S$ is partitioned into a finite number $k$ of disjoint subsets $S_1, \\dots, S_k$, then at least one subset $S_i$ is infinite.",
    "Erdős–Szekeres Theorem (1935)": "Every sequence of $mn + 1$ distinct real numbers contains either a monotonically increasing subsequence of length $m + 1$ or a monotonically decreasing subsequence of length $n + 1$. Proved via the Pigeonhole Principle on $(L_i, D_i)$ length pairs.",
    "Dirichlet's Approximation Theorem (1842)": "For any real number $\\alpha$ and any integer $N \\ge 1$, there exist integers $p$ and $q$ with $1 \\le q \\le N$ such that $|q\\alpha - p| < 1/N$. Proven by dividing $[0, 1)$ into $N$ equal pigeonhole sub-intervals of width $1/N$.",
    "Divisible Subsequence Theorem": "Given any sequence of $n$ integers $a_1, a_2, \\dots, a_n$, there exists a contiguous subsequence whose sum is divisible by $n$. Proven by applying PHP to the $n+1$ prefix sum residues $S_i \\bmod n$ for $i \\in \\{0, 1, \\dots, n\\}$.",
    "Birthday Paradox": "In a group of 23 people, the probability that at least two share a birthday exceeds 50%; for 70 people, it exceeds 99.9%. While the Pigeonhole Principle guarantees 100% collision only at 366+ people, square-root birthday collisions occur at roughly $\\sqrt{2k \\ln 2} \\approx 1.177\\sqrt{k}$.",
    "Ramsey Theory $R(3,3) = 6$ (The Party Problem)": "In any group of 6 people where every pair are either mutual friends or mutual strangers, there exists either a group of 3 mutual friends or 3 mutual strangers ($K_3$). Verified exhaustively over all $2^{15} = 32,768$ 2-colorings of $K_6$.",
    "Handshaking Lemma": "In every finite undirected graph, $\\sum_{v \\in V} \\deg(v) = 2|E|$. As an immediate corollary, every graph must have an even number of vertices of odd degree.",
    "Equal Degree Invariant": "In any simple graph with $n \\ge 2$ vertices, there exist at least two vertices with the exact same degree. Since isolated vertices (degree 0) and full-degree vertices (degree $n-1$) cannot coexist, $n$ vertices map into at most $n-1$ distinct degrees.",
    "Havel–Hakimi Theorem (1955/1962)": "A degree sequence $d_1 \\ge d_2 \\ge \\dots \\ge d_n$ is graphic (realizable by a simple graph) if and only if the reduced sequence $d_2 - 1, d_3 - 1, \\dots, d_{d_1+1} - 1, d_{d_1+2}, \\dots, d_n$ is graphic.",
    "Hall's Marriage Theorem (1935)": "A bipartite graph $G = (X \\cup Y, E)$ contains a matching that covers $X$ if and only if for every subset $S \\subseteq X$, $|N(S)| \\ge |S|$, where $N(S)$ denotes the collective neighborhood of $S$.",
    "Graph Coloring & Chromatic Number $\\chi(G)$": "The minimum number of colors needed to color vertices such that no two adjacent vertices share a color. By PHP, $\\chi(G) \\ge |V| / \\alpha(G)$, where $\\alpha(G)$ is the independence number.",
    "Mantel's Theorem (1907)": "The maximum number of edges in a triangle-free graph on $n$ vertices is $\\lfloor n^2 / 4 \\rfloor$. The unique extremal graph achieving this bound is the complete balanced bipartite graph $K_{\\lfloor n/2 \\rfloor, \\lceil n/2 \\rceil}$.",
    "Turán's Theorem (1941)": "Generalization of Mantel's Theorem: the maximum number of edges in a graph on $n$ vertices with no complete subgraph $K_{r+1}$ is achieved by the complete $r$-partite Turán graph $T(n, r)$.",
    "Eulerian Circuit": "A closed trail visiting every edge of a graph exactly once. Exists if and only if every vertex has even degree and all edges belong to a single connected component (Euler, 1736).",
    "Hamiltonian Cycle & Dirac's Theorem (1952)": "A closed loop visiting every vertex exactly once. Dirac proved that if a simple graph with $n \\ge 3$ vertices satisfies $\\deg(v) \\ge n/2$ for all $v$, then the graph is Hamiltonian.",
    "Happy Ending Problem (1935)": "Any set of 5 points in the plane in general position (no three collinear) contains 4 points that form the vertices of a convex quadrilateral. Named by Paul Erdős because it led to the marriage of George Szekeres and Esther Klein.",
    "Points in a Unit Square Bound": "Any set of 5 points placed inside a $1 \\times 1$ unit square must contain two points at Euclidean distance at most $\\sqrt{2}/2 \\approx 0.7071$. Proven by dividing the square into four $0.5 \\times 0.5$ quadrant sub-squares.",
    "Lossless Compression Limit": "No lossless compression algorithm can compress all files of length $N$ bits to length $< N$. By the Pigeonhole Principle, $2^N$ distinct inputs cannot injectively map into $\\sum_{i=0}^{N-1} 2^i = 2^N - 1$ shorter bitstrings without collisions.",
    "Pigeonhole Sort": "A non-comparison sorting algorithm suitable when the range of key values $R$ is small. Runs in $O(n + R)$ time and $O(R)$ auxiliary space by placing items directly into corresponding key buckets.",
    "Bloom Filter": "A space-efficient probabilistic data structure used to test set membership. False negatives are zero, but false positives occur with probability approximately $(1 - e^{-hn/m})^h$ due to hash collisions.",
    "Hash Collision Resolution": "Separate Chaining stores colliding elements in linked lists or vectors at the same bucket. Open Addressing (linear, quadratic, or double hashing) searches for the next available slot."
  },

  mount(container, { fetch, isOnline }) {
    container.innerHTML = this._html();
    this._initSearch(container);
  },
  unmount() {},

  _html() {
    return `
<div class="module-container">
  <div class="module-header">
    <span class="module-badge" style="background:var(--accent-blue);color:#fff">Reference Compendium</span>
    <h1 class="module-title">📚 Mathematical & Algorithmic Glossary</h1>
    <p class="module-big-idea">Comprehensive definitions, formal theorem statements, and invariants spanning combinatorics, graph theory, geometry, and computing.</p>
  </div>

  <div class="card" style="margin-bottom:var(--space-4)">
    <div class="card-body">
      <div style="display:flex;gap:var(--space-2);align-items:center;flex-wrap:wrap">
        <input type="text" id="glossarySearch" placeholder="🔍 Search definitions (e.g., Mantel, Dirichlet, Ramsey, Euler)..." class="input-search" style="flex:1;min-width:260px;padding:var(--space-2) var(--space-3);border:1px solid var(--border-light);border-radius:var(--radius-md);background:var(--bg-surface);color:var(--text-main)" />
        <button class="btn btn-secondary" id="clearSearchBtn">Clear</button>
        <span id="termCount" style="color:var(--text-muted);font-size:0.85rem"></span>
      </div>
    </div>
  </div>

  <div id="glossaryList" class="glossary-list" style="display:flex;flex-direction:column;gap:var(--space-3)"></div>
</div>`;
  },

  _initSearch(container) {
    const listEl = container.querySelector('#glossaryList');
    const input = container.querySelector('#glossarySearch');
    const clearBtn = container.querySelector('#clearSearchBtn');
    const termCount = container.querySelector('#termCount');

    const render = (filter = '') => {
      const q = filter.toLowerCase().trim();
      const entries = Object.entries(this._terms)
        .filter(([k, v]) => !q || k.toLowerCase().includes(q) || v.toLowerCase().includes(q))
        .sort((a, b) => a[0].localeCompare(b[0]));

      termCount.textContent = `Showing ${entries.length} of ${Object.keys(this._terms).length} terms`;

      if (entries.length === 0) {
        listEl.innerHTML = `
          <div class="card" style="text-align:center;padding:var(--space-6)">
            <p style="color:var(--text-muted)">No terms matched "<strong>${filter}</strong>". Try searching for <em>Euler</em>, <em>Ramsey</em>, <em>Dirichlet</em>, or <em>Coloring</em>.</p>
          </div>`;
        return;
      }

      listEl.innerHTML = entries.map(([term, def]) => `
        <div class="card" style="padding:var(--space-4);transition:transform 0.15s">
          <h3 style="margin:0 0 var(--space-2);font-size:1.15rem;color:var(--primary);display:flex;align-items:center;gap:var(--space-2)">
            <span>📌</span>
            <span>${term}</span>
          </h3>
          <p style="margin:0;color:var(--text-main);line-height:1.6;font-size:0.95rem">${def}</p>
        </div>`).join('');

      if (window.phlApp && typeof window.phlApp.typesetMath === 'function') {
        window.phlApp.typesetMath(listEl);
      }
    };

    input.addEventListener('input', e => render(e.target.value));
    clearBtn.addEventListener('click', () => {
      input.value = '';
      render();
      input.focus();
    });

    render();
  }
};

export default glossary;
