# Pigeonhole Lab: Comprehensive Project Technical & Theoretical Report

**An Interactive Discrete Mathematics, Algorithms & 2D/3D Visualization Platform**

---

## Executive Summary

**Pigeonhole Lab** is an interactive, textbook-grade web platform and high-performance C++17 computing engine designed to teach the Pigeonhole Principle ($|S| > |T| \implies \exists y \in T : |f^{-1}(y)| \ge \lceil |S|/|T| \rceil$), its generalized and weighted extensions, and its deep connections across discrete mathematics, graph theory, geometry, probabilistic analysis, and computer systems.

Developed as a flagship multi-person course project, the platform pairs formal mathematical rigor with responsive user interfaces, real-time client-side fallbacks, WebGL/Three.js 3D spatial simulations, and an exhaustive suite of REST API microservices.

---

## 1. System Architecture

The project employs a clean decoupling between the client presentation layer and the native computing backend:

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT (BROWSER)                                 |
|                                                                                   |
|  [ Shell: Sidebar Nav | Sticky Topbar | Global Search | Light/Dark Theme ]        |
|                                                                                   |
|  +---------------------------+  +------------------------+  +------------------+  |
|  |     UI Components         |  |   Module Lifecycle     |  | Visual Viewports |  |
|  | Card, Stepper, ProofBox,  |  | Mount(container, ctx)  |  | 2D (D3/Canvas)   |  |
|  | Callout, Quiz, Tooltip    |  | Unmount()              |  | 3D (Three.js)    |  |
|  +---------------------------+  +------------------------+  +------------------+  |
|                                             |                                     |
|                                             v                                     |
|                                  [ API Client + Fallback ]                        |
|                                             |                                     |
+---------------------------------------------|-------------------------------------+
                                              | HTTP / JSON (:8080)
                                              v
+-----------------------------------------------------------------------------------+
|                                C++17 NATIVE SERVER                                |
|                                                                                   |
|  [ cpp-httplib Server | Multi-threaded Pool | CORS | Input Sanitization ]         |
|                                                                                   |
|  +---------------------+  +----------------------+  +---------------------------+ |
|  | Core & Hashing      |  | Combinatorics        |  | Graph Theory & Geometry   | |
|  | PigeonholeTable     |  | Erdős-Szekeres (DP)  |  | Ramsey K6/K5 Verification | |
|  | Modulo / Knuth / PRNG| | Dirichlet Approx     |  | Havel-Hakimi & Kuhn's     | |
|  | Separate Chaining   |  | Prefix Sum Residues  |  | Mantel & Turán Graph      | |
|  | Open Addressing     |  | Birthday Paradox     |  | Unit Square & Convex Quad | |
|  +---------------------+  +----------------------+  +---------------------------+ |
+-----------------------------------------------------------------------------------+
```

### 1.1 Technical Stack
- **Native Backend**: C++17 single-binary server using `cpp-httplib` and `nlohmann/json`. Compiled with GCC/MinGW on Windows with `-lws2_32 -pthread`.
- **Frontend Core**: Vanilla HTML5, CSS3 Custom Properties (tokens system), and ES Modules (`app.js`, `home.js`, 31 module controllers).
- **2D Visualizations**: D3.js (v7) and HTML5 Canvas for dynamic bipartite matching, force-directed graph physics, residue clocks, and prefix sum arrays.
- **3D Spatial Environments**: Three.js (r128) with OrbitControls across 7 distinct interactive 3D scenes:
  1. `S1`: Falling 3D box physics with height gauges and collision illumination.
  2. `S2`: Erdős-Szekeres 3D coordinate slab $(i, L_i, D_i)$.
  3. `S3`: Ramsey complete graph on sphere with real-time monochromatic triangle detection.
  4. `S4`: Dirichlet approximation continuous helix wrapping.
  5. `S5`: Birthday paradox bivariate probability surface.
  6. `S6`: Hash load landscape comparing balanced vs pathological bucket terrains.
  7. `S7`: Hall's marriage 3D bipartite parallel plane matching.
- **Offline Integrity**: 100% offline capable. All libraries are vendored locally in `frontend/vendor/`.

---

## 2. Theoretical Scope & Module Breakdown

The laboratory is divided into five academic parts, covering 28 instructional modules:

### Part A: Forms of the Principle
- **A1. Simple Pigeonhole Principle**: Classical Dirichlet theorem ($n > k \implies \ge 2$), animated particle drops, interactive manual drag-and-drop, contradiction proofs.
- **A2. Generalized Pigeonhole Principle**: Bound $\lceil n/k \rceil$, round-robin vs adversarial strategies, tightness verification.
- **A3. Computer Exhaustive Verifier**: Exhaustive search over $k^n$ mappings, odometer permutation engine, computer proof vs analytical deduction.
- **A4. Minimum Draws & Socks Problem**: Worst-case adversary formula $k(r-1)+1$ with glove and playing card variations.
- **A5. Strong / Weighted Principle**: Heterogeneous bucket capacities $n_i$, threshold formula $\sum n_i - k + 1$.
- **A6. Averaging Principle**: Continuous and discrete arithmetic means, bridge to Erdős's Probabilistic Method.
- **A7. Infinite Pigeonhole Principle**: Partition of $\mathbb{N}$ into finite classes, ordinal representations.
- **A8. Higher Structure & Double Counting**: Counting edges by incidence, tournament parity, and bipartite relations.

### Part B: Classic Applications & Data Structures
- **B10. The Pigeonhole Table**: Direct extension of original hash table demo, load factors $\lambda = n/k$, bucket chains.
- **B5. Hashing & Collisions**: Modulo, Knuth multiplicative hash, PRNG distribution, separate chaining vs linear open addressing probing.
- **B3. Divisible Subsequences**: Prefix sum residues $S_i \bmod n$, guaranteed non-empty zero-sum sub-array.
- **B2. Dirichlet's Approximation Theorem**: Rational approximations $|q\alpha - p| < 1/N$, fractional part clustering in $[0, 1)$.
- **B4. Birthday Paradox**: Exact product formula, Poisson approximation, Monte Carlo simulator, square-root collision threshold vs 100% PHP bound.
- **B1. Erdős–Szekeres Theorem**: $O(n^2)$ dynamic programming computing $(L_i, D_i)$ pairs, guaranteed monotonic sequence of length $m+1$ or $n+1$.
- **B6. Ramsey Theory $R(3,3) = 6$**: Complete 2-colorings of $K_6$ ($2^{15} = 32,768$) and $K_5$ ($2^{10} = 1,024$) counterexample.
- **B7. Handshake Lemma & Equal Degrees**: Graphic degree invariants, degree sequence parity.
- **B8. Lossless Compression Impossibility**: Counting argument $2^N$ vs $2^N-1$, Run-Length Encoding failure on high-entropy data.
- **B9. Pigeonhole Sort**: Non-comparison sorting in $O(n + \text{range})$, benchmark comparison with `std::sort`.

### Part C: Graph Theory Connections
- **C1. Havel–Hakimi Theorem**: Recursive graphic sequence verification and graph realization.
- **C2. Hall's Marriage Theorem**: Bipartite matchings, Kuhn's augmenting path algorithm, automatic Hall violator subset $S$ isolation.
- **C3. Graph Coloring & Pigeonhole Bounds**: Chromatic number $\chi(G) \ge |V| / \alpha(G)$, greedy vs exact backtracking coloring.
- **C4. Mantel's Theorem & Turán Graphs**: Triangle-free maximum edges $\lfloor n^2/4 \rfloor$, balanced complete bipartite extremal graph.
- **C5. Euler Circuits & Hamilton Cycles**: Euler's all-even degrees criterion, Dirac's minimum degree $\deg(v) \ge n/2$ condition.

### Part D: Geometry & Numbers
- **G1. Points in a Unit Square**: Quadrant partitioning proving closest pair distance $\le \sqrt{2}/2 \approx 0.7071$.
- **G2. Happy Ending Problem**: 5 planar points in general position guaranteed to contain a convex quadrilateral.
- **G3. Number Theory Cards**: Coprime sets, decimal expansion period cycles, and binary multiples.

### Part E: Real-World Applications & Interactive Assessment
- **R1. Real-World Case Files**: 15 interactive simulators (human hair, Git short hashes, UUID collision risk, NAT/IPv4 exhaustions, Bloom filters, cache conflict misses, DNA barcodes).
- **Challenge Mode**: 12 scenario multiple-choice questions with score tracking and progressive difficulty.
- **Learning Path**: Interactive D3 force-directed dependency roadmap tracking progress in `localStorage`.
- **Glossary & Accessibility**: Searchable compendium of 25+ definitions, high-contrast modes, font-scaling, and motion toggles.

---

## 3. Algorithm Complexity & Performance Benchmark

| Module / Algorithm | Time Complexity | Space Complexity | Description |
| :--- | :--- | :--- | :--- |
| **Exhaustive Verifier (A3)** | $O(k^n)$ | $O(n)$ | Odometer permutation search |
| **Pigeonhole Sort (B9)** | $O(n + R)$ | $O(R)$ | Direct bucket indexing ($R = \max - \min + 1$) |
| **Erdős-Szekeres DP (B1)** | $O(n^2)$ | $O(n)$ | Longest increasing & decreasing paths |
| **Dirichlet Approx (B2)** | $O(N)$ | $O(N)$ | Fractional residue sorting / bucket search |
| **Divisible Subsequence (B3)** | $O(n)$ | $O(n)$ | Prefix sum residues with hash map index |
| **Ramsey $K_6$ Exhaustive (B6)**| $O(2^{15} \cdot \binom{6}{3}) \approx 6.5 \times 10^5$ | $O(1)$ | Exhaustive verification of all 32,768 colorings |
| **Havel-Hakimi (C1)** | $O(n^2 \log n)$ | $O(n)$ | Degree reduction and sorting |
| **Kuhn's Matching (C2)** | $O(V \cdot E)$ | $O(V + E)$ | DFS augmenting paths for bipartite graphs |
| **Exact Chromatic Number (C3)**| $O(k^V)$ | $O(V)$ | Backtracking vertex coloring |
| **Mantel Triangle Finder (C4)**| $O(V^3)$ or $O(E \cdot V)$ | $O(V^2)$ | Common neighbor intersection |
| **Happy Ending Finder (G2)** | $O(\binom{n}{4}) = O(1)$ | $O(1)$ | Convex hull test on 5 points |

---

## 4. Engineering & Reliability Standards

1. **Dual Execution Engine (Client-Server Synergy)**: Every module functions autonomously in the browser via client-side JavaScript math engines. When the native C++ backend is active, operations tap into multi-threaded native C++ implementations.
2. **WCAG AA Compliance**: High-contrast ratios, semantic headings, responsive typography, and full keyboard accessibility.
3. **Graceful Motion Handling**: Full support for `prefers-reduced-motion` to disable high-frequency animations in sensitive viewing environments.
