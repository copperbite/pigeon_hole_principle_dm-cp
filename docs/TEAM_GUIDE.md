# 4-Person Team Guide: Roles, Defense Speaking Points & Viva Q&A

**Pigeonhole Lab — Collaborative Discrete Mathematics Project**

---

## 1. Project Task Distribution Matrix

| Student | Core Domain | Frontend Modules | Backend & Architecture | Key Theorems & Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Student 1**<br>*(Team Lead / Systems)* | Core Principles & Platform Architecture | `a1_simple`, `a2_generalized`, `a3_exhaustive`, `a4_socks_draws`, `b10_core_table` | `backend/main.cpp`, `core.hpp`, build pipeline, router | Simple & Generalized PHP, Exhaustive Verifier, Hash table core, REST API |
| **Student 2**<br>*(Analyst / Number Theory)* | Number Theory, Probability & Benchmarks | `b2_dirichlet`, `b3_divisible`, `b4_birthday`, `b8_compression`, `b9_pigeon_sort` | `dirichlet.hpp`, `divisible.hpp`, `birthday.hpp`, `sorting.hpp` | Dirichlet Approx, Prefix Sum Residues, Birthday Paradox, Pigeonhole Sort, Compression Impossibility |
| **Student 3**<br>*(Combinatorics / Graphs)* | Graph Theory, Combinatorics & Ramsey | `b1_erdos_szekeres`, `b6_ramsey`, `b7_handshake`, `c1_havel_hakimi`, `c2_hall_marriage`, `c3_graph_coloring` | `erdos_szekeres.hpp`, `ramsey.hpp`, `degree.hpp`, `hall_matching.hpp` | Erdős-Szekeres Theorem, Ramsey $R(3,3)=6$, Havel-Hakimi, Hall's Marriage, Chromatic Number |
| **Student 4**<br>*(Graphics & Real-World)* | Geometry, Real-World Systems & 3D Visuals | `g1_points_square`, `g2_happy_ending`, `r1_real_world`, `learning_path`, `challenge_mode` | 3D Scenes (`S1` through `S7`), WebGL renderers, CSS design system | 5 Points in Square, Happy Ending 4-gon, 15 Real-World Case Files, 3D Viewports |

---

## 2. Student 1: Core Principles & Backend Architecture

### Speaking Points
- "I designed the overarching C++17 single-binary microservice architecture using `cpp-httplib` and modern JSON serialization, replacing vulnerable legacy Winsock code with a robust multi-threaded server."
- "I implemented the fundamental Pigeonhole Principle modules (A1–A4) and preserved our original project core in module B10, demonstrating how hash tables intrinsically depend on the Pigeonhole Principle for load balancing and collision handling."
- "I built the exhaustive verifier (A3), which contrasts deductive proof with algorithmic brute-force checking across all $k^n$ mappings, demonstrating how early pruning optimizes verification."

### Expected Viva Questions & Model Answers

**Q1: How do you mathematically prove the Generalized Pigeonhole Principle?**
> *Answer*: "By contradiction. If we distribute $n$ items into $k$ boxes and no box contains at least $\lceil n/k \rceil$ items, then each box has at most $\lceil n/k \rceil - 1 < n/k$ items. Summing across all $k$ boxes gives a total count $< k \cdot (n/k) = n$, which contradicts that there are $n$ total items. Hence, at least one box must contain $\ge \lceil n/k \rceil$ items."

**Q2: What happens to your web application if the C++ backend process crashes or is unreachable?**
> *Answer*: "We implemented graceful degradation with dual client-server engines. The frontend immediately detects server status through an asynchronous heartbeat probe to `/api/health`. If offline, a warning banner appears, and all mathematical simulations seamlessly switch to native client-side JavaScript calculation engines with zero UI disruption."

---

## 3. Student 2: Number Theory, Probability & Benchmarks

### Speaking Points
- "I implemented the mathematical modules linking discrete modular arithmetic and real approximations to the Pigeonhole Principle (B2, B3, B4, B8, B9)."
- "In Dirichlet's Approximation Theorem (B2), we demonstrated how dividing $[0, 1)$ into $N$ sub-intervals guarantees an integer denominator $q \le N$ such that $|q\alpha - p| < 1/N$."
- "I created the comparison between the Pigeonhole Principle and the Birthday Paradox (B4), highlighting why 50% probability occurs at $\approx 23$ people while the 100% deterministic guarantee requires 366 people."
- "I proved the universal lossless compression impossibility theorem (B8) using counting arguments and benchmarked Pigeonhole Sort (B9) against comparison-based sorts."

### Expected Viva Questions & Model Answers

**Q1: Why is it impossible to compress all files of 1000 bytes losslessly?**
> *Answer*: "There are $2^{8000}$ possible files of 1000 bytes. The total number of all possible files of length strictly less than 1000 bytes (from 0 to 999 bytes) is $\sum_{i=0}^{999} 2^i = 2^{8000} - 1$. By the Pigeonhole Principle, mapping $2^{8000}$ distinct inputs to $2^{8000} - 1$ outputs cannot be injective. At least two files will collide, making lossless reconstruction mathematically impossible."

**Q2: How does the prefix sum algorithm in module B3 guarantee a divisible subsequence in $O(n)$ time?**
> *Answer*: "For $n$ numbers, we compute $n+1$ prefix sums $S_0 = 0, S_1, \dots, S_n$. By the Pigeonhole Principle, among $n+1$ prefix sums modulo $n$, two must share the same residue $r$. If $S_u \equiv S_v \pmod n$ with $u < v$, then $S_v - S_u = \sum_{i=u+1}^v a_i$ is a multiple of $n$, yielding the solution in $O(n)$ time using a hash table of visited residues."

---

## 4. Student 3: Graph Theory, Combinatorics & Ramsey

### Speaking Points
- "I focused on graph invariants, Ramsey theory, and bipartite matching (B1, B6, B7, C1, C2, C3, C4, C5)."
- "I implemented the Erdős-Szekeres monotone subsequence theorem (B1) using an $O(n^2)$ dynamic programming approach, proving the distinctness of $(L_i, D_i)$ coordinate pairs."
- "For Ramsey's Theorem $R(3,3)=6$ (B6), our backend completely verifies all $2^{15} = 32,768$ two-colorings of $K_6$, proving every coloring possesses a monochromatic triangle, while showing the regular pentagon counterexample for $K_5$."
- "In Hall's Marriage Theorem (C2), I integrated Kuhn's augmenting path algorithm and automated the identification of Hall violator sets when no perfect matching exists."

### Expected Viva Questions & Model Answers

**Q1: How does the Pigeonhole Principle prove that every simple graph with $n \ge 2$ vertices has at least two vertices of the same degree?**
> *Answer*: "The possible degrees of any vertex in a simple graph of size $n$ range from $0$ to $n-1$. However, a degree 0 vertex (connected to nobody) and a degree $n-1$ vertex (connected to everybody) cannot exist simultaneously in the same simple graph. Therefore, the actual degree range contains at most $n-1$ distinct values. Distributing $n$ vertices into at most $n-1$ available degree values guarantees a duplicate degree by PHP."

**Q2: What is the relationship between chromatic number $\chi(G)$, clique number $\omega(G)$, and the independence number $\alpha(G)$?**
> *Answer*: "First, $\chi(G) \ge \omega(G)$ because every vertex in a clique must receive a distinct color. Second, by the Pigeonhole Principle, each color class in a proper vertex coloring forms an independent set, having size at most $\alpha(G)$. Thus, $|V| = \sum |C_i| \le \chi(G) \cdot \alpha(G)$, which implies $\chi(G) \ge |V| / \alpha(G)$."

---

## 5. Student 4: Geometry, Real-World Systems & 3D Visuals

### Speaking Points
- "I developed the geometric combinatorics modules (G1, G2), the Real-World Case Files gallery (R1), and the Seven Interactive 3D WebGL scenes using Three.js."
- "In Module G1, I proved that 5 points inside a unit square guarantee two points within distance $\sqrt{2}/2 \approx 0.7071$ by partitioning the square into 4 quadrants."
- "I designed the interactive 3D spatial scenes: falling box physics in S1, the $(i, L_i, D_i)$ coordinate slab in S2, the spherical Ramsey graph in S3, the Dirichlet cylindrical helix in S4, the 3D Birthday probability surface in S5, the Hash load landscape in S6, and the 3D bipartite layers in S7."
- "I built the interactive Learning Path dependency tree and the 12-question 'Spot the Pigeonhole' Challenge Mode, along with complete WCAG AA accessibility compliance."

### Expected Viva Questions & Model Answers

**Q1: Explain how the 5 points in a unit square proof works.**
> *Answer*: "We divide the $1 \times 1$ square into 4 sub-squares of size $0.5 \times 0.5$. By the Pigeonhole Principle, placing 5 points into 4 sub-squares means at least one sub-square contains at least 2 points. The maximum distance between any two points in a square of side $0.5$ is its diagonal length: $\sqrt{(0.5)^2 + (0.5)^2} = \sqrt{0.5} = \sqrt{2}/2 \approx 0.7071$. Thus, the closest pair must be within that distance."

**Q2: What is the significance of the 3D scenes versus traditional 2D plots?**
> *Answer*: "Discrete mathematics concepts often involve multi-dimensional state spaces that flatten unhelpfully in 2D. For example, in Erdős-Szekeres (S2), plotting each sequence element in 3D space $(i, L_i, D_i)$ allows students to visually inspect that no two points occupy the same vertical column or height plane. In Ramsey Theory (S3), placing vertices on a 3D sphere prevents overlapping edge crossings, making monochromatic triangle detection immediate."
