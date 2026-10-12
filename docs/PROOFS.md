# Mathematical Proofs Compendium: The Pigeonhole Principle & Its Applications

**Pigeonhole Lab — Comprehensive Theoretical and Formal Proofs Reference**

---

## Table of Contents
1. [The Simple Pigeonhole Principle](#1-the-simple-pigeonhole-principle)
2. [The Generalized Pigeonhole Principle](#2-the-generalized-pigeonhole-principle)
3. [The Strong / Weighted Pigeonhole Principle](#3-the-strong--weighted-pigeonhole-principle)
4. [Divisible Subsequences (Prefix Sum Residues)](#4-divisible-subsequences-prefix-sum-residues)
5. [Dirichlet's Approximation Theorem](#5-dirichlets-approximation-theorem)
6. [Erdős–Szekeres Monotone Subsequence Theorem](#6-erdos-szekeres-monotone-subsequence-theorem)
7. [Ramsey's Theorem: $R(3,3) = 6$ (The Party Problem)](#7-ramseys-theorem-r33--6-the-party-problem)
8. [Graph Invariant: Equal Degrees In Any Simple Graph](#8-graph-invariant-equal-degrees-in-any-simple-graph)
9. [The Handshaking Lemma and Odd Degree Vertices](#9-the-handshaking-lemma-and-odd-degree-vertices)
10. [Havel–Hakimi Degree Realization Theorem](#10-havel-hakimi-degree-realization-theorem)
11. [Hall's Marriage Theorem (Bipartite Matchings)](#11-halls-marriage-theorem-bipartite-matchings)
12. [Mantel's Theorem & Turán's Bound](#12-mantels-theorem--turans-bound)
13. [Dirac's Theorem on Hamiltonian Cycles](#13-diracs-theorem-on-hamiltonian-cycles)
14. [Closest Pair in a Unit Square ($\sqrt{2}/2$ Bound)](#14-closest-pair-in-a-unit-square-sqrt22-bound)
15. [The Happy Ending Problem (Convex Quadrilateral from 5 Points)](#15-the-happy-ending-problem-convex-quadrilateral-from-5-points)
16. [Impossibility of Universal Lossless Data Compression](#16-impossibility-of-universal-lossless-data-compression)

---

## 1. The Simple Pigeonhole Principle

### Theorem Statement
Let $S$ and $T$ be finite sets. If $|S| > |T|$, then there is no injective function $f: S \to T$. That is, there exist distinct elements $x_1, x_2 \in S$ with $x_1 \ne x_2$ such that:
$$f(x_1) = f(x_2)$$

### Proof by Contradiction
1. Assume for the sake of contradiction that $f: S \to T$ is an injective function.
2. By the definition of injectivity, for all $x, y \in S$, $x \ne y \implies f(x) \ne f(y)$.
3. This implies that the image $f(S) = \{f(x) \mid x \in S\}$ has cardinality exactly equal to $|S|$:
   $$|f(S)| = |S|$$
4. Since $f(S) \subseteq T$, the cardinality of the subset cannot exceed the cardinality of the superset:
   $$|f(S)| \le |T|$$
5. Substituting $|f(S)| = |S|$ yields:
   $$|S| \le |T|$$
6. However, our initial hypothesis states that $|S| > |T|$. This contradiction ($|S| \le |T|$ and $|S| > |T|$) shows our assumption of injectivity is false.
7. Therefore, there must exist at least two distinct elements $x_1, x_2 \in S$ such that $f(x_1) = f(x_2)$. $\blacksquare$

---

## 2. The Generalized Pigeonhole Principle

### Theorem Statement
If $n$ objects are distributed among $k$ boxes, then at least one box contains at least:
$$\left\lceil \frac{n}{k} \right\rceil$$
objects, and at least one box contains at most:
$$\left\lfloor \frac{n}{k} \right\rfloor$$
objects.

### Proof (Ceiling Form)
1. Let $c_i$ denote the number of objects placed into box $i$ for $i \in \{1, 2, \dots, k\}$.
2. The total number of objects is the sum of the counts across all boxes:
   $$\sum_{i=1}^k c_i = n$$
3. Assume for contradiction that no box contains at least $\lceil n/k \rceil$ objects.
4. Then every box contains strictly fewer than $\lceil n/k \rceil$ objects:
   $$c_i \le \left\lceil \frac{n}{k} \right\rceil - 1 \quad \forall i \in \{1, \dots, k\}$$
5. Summing over all $k$ boxes:
   $$n = \sum_{i=1}^k c_i \le k \left( \left\lceil \frac{n}{k} \right\rceil - 1 \right)$$
6. By the properties of the ceiling function, for any real $x$, $\lceil x \rceil < x + 1$. Thus:
   $$\left\lceil \frac{n}{k} \right\rceil - 1 < \frac{n}{k}$$
7. Multiplying by $k > 0$:
   $$k \left( \left\lceil \frac{n}{k} \right\rceil - 1 \right) < k \cdot \frac{n}{k} = n$$
8. Combining inequalities:
   $$n \le k \left( \left\lceil \frac{n}{k} \right\rceil - 1 \right) < n \implies n < n$$
9. This is an impossible contradiction. Hence, at least one box $j$ must satisfy $c_j \ge \lceil n/k \rceil$. $\blacksquare$

---

## 3. The Strong / Weighted Pigeonhole Principle

### Theorem Statement
Let $k$ boxes have capacity thresholds $n_1, n_2, \dots, n_k \in \mathbb{Z}^+$. If the total number of objects $N$ satisfies:
$$N \ge \left( \sum_{i=1}^k n_i \right) - k + 1$$
then there exists at least one box $j \in \{1, \dots, k\}$ that contains at least $n_j$ objects.

### Proof by Worst-Case Adversary
1. Suppose an adversary attempts to distribute objects while avoiding placing $n_i$ objects in box $i$ for every $i \in \{1, \dots, k\}$.
2. In the worst-case scenario, the maximum number of items box $i$ can hold without triggering the threshold is $n_i - 1$.
3. The absolute maximum number of objects that can be distributed across all $k$ boxes without any box reaching its threshold is:
   $$N_{\max,\text{fail}} = \sum_{i=1}^k (n_i - 1) = \left( \sum_{i=1}^k n_i \right) - k$$
4. If $N \ge N_{\max,\text{fail}} + 1 = \sum_{i=1}^k n_i - k + 1$, the adversary has exhausted all available sub-threshold slots.
5. The very next object placed must necessarily enter some box $j$ that already contains $n_j - 1$ items, raising its count to $n_j$.
6. Thus, at least one box $j$ contains $\ge n_j$ items. $\blacksquare$

---

## 4. Divisible Subsequences (Prefix Sum Residues)

### Theorem Statement
Given any sequence of $n$ positive integers $a_1, a_2, \dots, a_n$, there exists a contiguous subsequence $a_{u+1}, a_{u+2}, \dots, a_v$ ($0 \le u < v \le n$) whose sum is divisible by $n$:
$$\sum_{j=u+1}^v a_j \equiv 0 \pmod n$$

### Proof
1. Define the prefix sums $S_0, S_1, \dots, S_n$ by:
   $$S_0 = 0, \quad S_i = \sum_{j=1}^i a_j \quad (i = 1, \dots, n)$$
2. There are $n + 1$ prefix sums: $\{S_0, S_1, \dots, S_n\}$.
3. Compute the residue of each prefix sum modulo $n$:
   $$r_i = S_i \bmod n \in \{0, 1, 2, \dots, n - 1\}$$
4. We have $n + 1$ residues (pigeons) mapped into $n$ possible residue classes $\{0, \dots, n-1\}$ (holes).
5. By the Pigeonhole Principle, since $n + 1 > n$, there exist two indices $u, v$ with $0 \le u < v \le n$ such that:
   $$S_u \equiv S_v \pmod n$$
6. This equivalence means $n \mid (S_v - S_u)$.
7. Expanding the difference:
   $$S_v - S_u = \sum_{j=1}^v a_j - \sum_{j=1}^u a_j = \sum_{j=u+1}^v a_j$$
8. Therefore, the contiguous sum $\sum_{j=u+1}^v a_j$ is a non-empty multiple of $n$. $\blacksquare$

---

## 5. Dirichlet's Approximation Theorem

### Theorem Statement
For any real number $\alpha$ and any integer $N \ge 1$, there exist integers $p$ and $q$ with $1 \le q \le N$ such that:
$$\left| \alpha - \frac{p}{q} \right| < \frac{1}{qN} \le \frac{1}{q^2}$$

### Proof
1. For any real $x$, let $\{x\} = x - \lfloor x \rfloor \in [0, 1)$ denote the fractional part of $x$.
2. Consider the $N + 1$ numbers:
   $$\{0\alpha\}, \{1\alpha\}, \{2\alpha\}, \dots, \{N\alpha\}$$
   where $\{0\alpha\} = 0$.
3. Subdivide the half-open interval $[0, 1)$ into $N$ disjoint sub-intervals of equal length $1/N$:
   $$I_k = \left[ \frac{k-1}{N}, \frac{k}{N} \right), \quad k \in \{1, 2, \dots, N\}$$
4. We have $N + 1$ fractional parts (pigeons) distributed among $N$ sub-intervals (holes).
5. By the Pigeonhole Principle, at least two numbers must fall into the same sub-interval $I_k$. Let these be $\{j\alpha\}$ and $\{i\alpha\}$ with $0 \le i < j \le N$.
6. Since both lie in the same interval of width $1/N$:
   $$|\{j\alpha\} - \{i\alpha\}| < \frac{1}{N}$$
7. Write $j\alpha = \lfloor j\alpha \rfloor + \{j\alpha\}$ and $i\alpha = \lfloor i\alpha \rfloor + \{i\alpha\}$.
8. Subtracting:
   $$(j - i)\alpha - (\lfloor j\alpha \rfloor - \lfloor i\alpha \rfloor) = \{j\alpha\} - \{i\alpha\}$$
9. Define integers $q = j - i$ and $p = \lfloor j\alpha \rfloor - \lfloor i\alpha \rfloor$.
10. Since $0 \le i < j \le N$, we have $1 \le q \le N$.
11. Therefore:
    $$|q\alpha - p| < \frac{1}{N}$$
12. Dividing through by $q > 0$:
    $$\left| \alpha - \frac{p}{q} \right| < \frac{1}{qN} \le \frac{1}{q^2}$$
    which completes the proof. $\blacksquare$

---

## 6. Erdős–Szekeres Monotone Subsequence Theorem

### Theorem Statement
Any sequence of $mn + 1$ distinct real numbers contains either a monotonically increasing subsequence of length $m + 1$ or a monotonically decreasing subsequence of length $n + 1$.

### Proof (Seidenberg's Pigeonhole Approach, 1959)
1. Let the sequence be $(a_1, a_2, \dots, a_N)$ where $N = mn + 1$, with all $a_i$ distinct.
2. For each element $a_k$ ($1 \le k \le N$), associate an ordered pair of positive integers:
   $$(L_k, D_k)$$
   where:
   - $L_k$ is the length of the longest increasing subsequence ending at $a_k$.
   - $D_k$ is the length of the longest decreasing subsequence ending at $a_k$.
3. **Claim**: All ordered pairs $(L_k, D_k)$ for $k = 1, \dots, N$ are mutually distinct.
   - *Proof of claim*: Suppose $j < k$. Since the elements are distinct, either $a_j < a_k$ or $a_j > a_k$.
   - Case A: If $a_j < a_k$, we can append $a_k$ to the longest increasing subsequence ending at $a_j$, giving an increasing subsequence of length $L_j + 1$ ending at $a_k$. Thus $L_k \ge L_j + 1 > L_j$.
   - Case B: If $a_j > a_k$, we can append $a_k$ to the longest decreasing subsequence ending at $a_j$, giving a decreasing subsequence of length $D_j + 1$ ending at $a_k$. Thus $D_k \ge D_j + 1 > D_j$.
   - In either case, $(L_j, D_j) \ne (L_k, D_k)$.
4. Assume for contradiction that there is no increasing subsequence of length $m + 1$ and no decreasing subsequence of length $n + 1$.
5. Then for all $k$:
   $$1 \le L_k \le m \quad \text{and} \quad 1 \le D_k \le n$$
6. The total number of possible pairs $(L_k, D_k)$ is:
   $$m \times n = mn$$
7. However, there are $N = mn + 1$ distinct elements, producing $mn + 1$ distinct pairs (pigeons) mapped into at most $mn$ possible values (holes).
8. By the Pigeonhole Principle, at least two elements must share the exact same pair $(L_k, D_k)$.
9. But our Claim proved that all pairs are strictly distinct. This contradiction proves that either $L_k \ge m + 1$ for some $k$, or $D_k \ge n + 1$ for some $k$. $\blacksquare$

---

## 7. Ramsey's Theorem: $R(3,3) = 6$ (The Party Problem)

### Theorem Statement
Every 2-coloring of the edges of the complete graph $K_6$ with colors Red and Blue contains at least one monochromatic triangle ($K_3$). Furthermore, $K_5$ does not guarantee a monochromatic triangle, establishing that $R(3,3) = 6$.

### Proof
1. Consider $K_6$ with vertex set $V = \{v_1, v_2, v_3, v_4, v_5, v_6\}$. Choose an arbitrary vertex $v_1$.
2. The vertex $v_1$ is connected to the remaining 5 vertices by 5 edges:
   $$e_{12}, e_{13}, e_{14}, e_{15}, e_{16}$$
3. Each of these 5 edges is colored either Red or Blue (2 colors / holes).
4. By the Generalized Pigeonhole Principle, at least:
   $$\left\lceil \frac{5}{2} \right\rceil = 3$$
   edges incident to $v_1$ must have the same color.
5. Without loss of generality, assume edges $\{v_1, v_2\}, \{v_1, v_3\}, \{v_1, v_4\}$ are all colored **Red**.
6. Now inspect the three edges between $\{v_2, v_3, v_4\}$:
   - Case 1: If any edge in $\{\{v_2, v_3\}, \{v_2, v_4\}, \{v_3, v_4\}\}$ is colored **Red** (say $\{v_2, v_3\}$), then $\{v_1, v_2, v_3\}$ forms a **Red monochromatic triangle**.
   - Case 2: If none of those three edges are Red, then all three edges $\{v_2, v_3\}$, $\{v_2, v_4\}$, and $\{v_3, v_4\}$ must be colored **Blue**. Then $\{v_2, v_3, v_4\}$ forms a **Blue monochromatic triangle**.
7. In all cases, a monochromatic $K_3$ exists.
8. **Sharpness ($R(3,3) > 5$)**: Consider $K_5$ arranged as a regular pentagon. Color the 5 perimeter cycle edges Red and the 5 interior diagonal star edges Blue. The cycle has no triangle, and the star $C_5$ has no triangle. Hence $K_5$ can be 2-colored without any monochromatic $K_3$.
9. Therefore, $R(3,3) = 6$. $\blacksquare$

---

## 8. Graph Invariant: Equal Degrees In Any Simple Graph

### Theorem Statement
In any simple graph $G = (V, E)$ with $n \ge 2$ vertices, there exist at least two vertices that have the exact same degree:
$$\exists u, v \in V, u \ne v : \deg(u) = \deg(v)$$

### Proof
1. Let $G = (V, E)$ be a simple graph with $|V| = n \ge 2$.
2. In a simple graph without self-loops or multi-edges, the degree of any vertex $v$ must satisfy:
   $$0 \le \deg(v) \le n - 1$$
3. Thus, there are $n$ possible degree values: $\{0, 1, 2, \dots, n - 1\}$.
4. **Key Invariant**: A vertex of degree $0$ (isolated vertex) and a vertex of degree $n - 1$ (adjacent to all other $n - 1$ vertices) **cannot coexist** in the same simple graph.
   - If there exists a vertex $u$ with $\deg(u) = n - 1$, then $u$ is adjacent to every other vertex in $V$, meaning no vertex can have degree $0$.
   - Conversely, if there exists a vertex $w$ with $\deg(w) = 0$, then no vertex can be connected to all other $n-1$ vertices, so no vertex can have degree $n - 1$.
5. Therefore, the set of possible degrees present in $G$ is restricted to at most one of two sets:
   - Set A: $\{0, 1, 2, \dots, n - 2\}$ ($n - 1$ possible degrees)
   - Set B: $\{1, 2, \dots, n - 1\}$ ($n - 1$ possible degrees)
6. In either case, there are at most $n - 1$ available degree values (holes).
7. Since there are $n$ vertices (pigeons), by the Pigeonhole Principle ($n > n - 1$), at least two vertices must be assigned the exact same degree. $\blacksquare$

---

## 9. The Handshaking Lemma and Odd Degree Vertices

### Theorem Statement
In every finite undirected graph $G = (V, E)$:
$$\sum_{v \in V} \deg(v) = 2|E|$$
Consequently, the number of vertices with odd degree is always even.

### Proof
1. Every edge $e = \{u, v\} \in E$ has exactly two endpoints.
2. When summing the degrees of all vertices $\sum_{v \in V} \deg(v)$, each edge $e$ is counted exactly once at vertex $u$ and once at vertex $v$.
3. Therefore:
   $$\sum_{v \in V} \deg(v) = 2|E|$$
4. Partition the vertex set $V$ into two disjoint sets: $V_{\text{even}}$ (vertices with even degree) and $V_{\text{odd}}$ (vertices with odd degree):
   $$\sum_{v \in V_{\text{even}}} \deg(v) + \sum_{v \in V_{\text{odd}}} \deg(v) = 2|E|$$
5. Rearranging:
   $$\sum_{v \in V_{\text{odd}}} \deg(v) = 2|E| - \sum_{v \in V_{\text{even}}} \deg(v)$$
6. The right-hand side is the difference of two even numbers, hence is **even**.
7. The sum on the left is a sum of odd integers. A sum of odd integers is even if and only if the number of terms is **even**.
8. Therefore, $|V_{\text{odd}}|$ must be an even number. $\blacksquare$

---

## 10. Havel–Hakimi Degree Realization Theorem

### Theorem Statement
A non-increasing sequence of non-negative integers $S = (d_1, d_2, \dots, d_n)$ with $d_1 \ge d_2 \ge \dots \ge d_n$ is graphical if and only if the modified sequence:
$$S' = (d_2 - 1, d_3 - 1, \dots, d_{d_1+1} - 1, d_{d_1+2}, \dots, d_n)$$
(sorted in non-increasing order) is graphical.

### Proof Sketch
1. ($\Leftarrow$) If $S'$ is graphical, let $G'$ be a graph realizing $S'$. Add a new vertex $v$ and connect $v$ to the $d_1$ vertices whose degrees were decremented by 1. The resulting graph has degree sequence $S$.
2. ($\Rightarrow$) Suppose $S$ is graphical. Among all graphs realizing $S$, choose a graph $G$ such that vertex $v_1$ (with degree $d_1$) is adjacent to vertices having the highest possible degrees $v_2, \dots, v_{d_1+1}$.
3. If $v_1$ is not adjacent to some $v_k$ ($2 \le k \le d_1+1$), but is adjacent to some $v_j$ with $j > d_1+1$, then since degrees are non-increasing, $\deg(v_k) \ge \deg(v_j)$.
4. By edge swapping (2-switch alternating paths), one can exchange edges without changing degree sequences until $v_1$ is connected to $v_2, \dots, v_{d_1+1}$.
5. Removing $v_1$ and its incident edges leaves a graph with degree sequence $S'$. $\blacksquare$

---

## 11. Hall's Marriage Theorem (Bipartite Matchings)

### Theorem Statement
Let $G = (X \cup Y, E)$ be a bipartite graph. A matching covering $X$ exists if and only if:
$$\forall S \subseteq X, \quad |N(S)| \ge |S|$$
where $N(S) = \{y \in Y \mid \exists x \in S, \{x, y\} \in E\}$ is the neighborhood of $S$.

### Proof (Augmenting Paths / Contradiction)
1. Necessity ($\Rightarrow$): If a matching $M$ covering $X$ exists, each $x \in S$ is matched to a distinct $y \in N(S)$. Thus $|N(S)| \ge |M(S)| = |S|$.
2. Sufficiency ($\Leftarrow$): Assume Hall's condition holds for all $S \subseteq X$.
3. Let $M$ be a maximum matching in $G$. Suppose for contradiction that $M$ does not cover $X$.
4. Then there exists an unmatched vertex $u \in X$.
5. Consider the set of all vertices reachable from $u$ via alternating paths (paths alternating between non-matching and matching edges). Let $S \subseteq X$ and $T \subseteq Y$ be the reachable vertices.
6. Since $M$ is maximum, by Berge's lemma, there is no augmenting path starting at $u$. Hence, all vertices in $T$ must be matched under $M$.
7. Every neighbor of a vertex in $S$ must belong to $T$, so $N(S) \subseteq T$.
8. Every vertex in $T$ is matched to a vertex in $S \setminus \{u\}$.
9. Therefore, $|T| = |S| - 1$, which implies:
   $$|N(S)| \le |T| = |S| - 1 < |S|$$
10. This contradicts Hall's condition $|N(S)| \ge |S|$. Thus, the maximum matching must cover all of $X$. $\blacksquare$

---

## 12. Mantel's Theorem & Turán's Bound

### Theorem Statement
If a simple graph $G = (V, E)$ on $n$ vertices contains no triangle ($K_3$-free), then:
$$|E| \le \left\lfloor \frac{n^2}{4} \right\rfloor$$
The bound is achieved uniquely by the complete balanced bipartite graph $K_{\lfloor n/2 \rfloor, \lceil n/2 \rceil}$.

### Proof (Cauchy-Schwarz / Handshake)
1. Let $G = (V, E)$ be a triangle-free graph with $n$ vertices and $m = |E|$ edges.
2. For any edge $\{u, v\} \in E$, since $G$ has no triangle, $u$ and $v$ cannot share any common neighbor:
   $$N(u) \cap N(v) = \emptyset$$
3. Therefore:
   $$\deg(u) + \deg(v) \le n$$
4. Summing this inequality over all $m$ edges in $E$:
   $$\sum_{\{u, v\} \in E} (\deg(u) + \deg(v)) \le \sum_{\{u, v\} \in E} n = m \cdot n$$
5. Notice that in the sum $\sum_{\{u, v\} \in E} (\deg(u) + \deg(v))$, each vertex $v$ appears once for every incident edge, which is $\deg(v)$ times:
   $$\sum_{\{u, v\} \in E} (\deg(u) + \deg(v)) = \sum_{v \in V} \deg(v)^2$$
6. By the Cauchy-Schwarz inequality:
   $$\sum_{v \in V} \deg(v)^2 \ge \frac{1}{n} \left( \sum_{v \in V} \deg(v) \right)^2 = \frac{(2m)^2}{n} = \frac{4m^2}{n}$$
7. Combining:
   $$\frac{4m^2}{n} \le m \cdot n \implies 4m \le n^2 \implies m \le \frac{n^2}{4}$$
8. Since $m$ is an integer:
   $$m \le \left\lfloor \frac{n^2}{4} \right\rfloor$$
9. Equality holds if and only if $G$ is complete bipartite $K_{\lfloor n/2 \rfloor, \lceil n/2 \rceil}$. $\blacksquare$

---

## 13. Dirac's Theorem on Hamiltonian Cycles

### Theorem Statement
A simple graph $G = (V, E)$ with $n \ge 3$ vertices is Hamiltonian if:
$$\deg(v) \ge \frac{n}{2} \quad \forall v \in V$$

### Proof
1. First, $G$ must be connected: if $G$ had two disconnected components, the smaller component would have $\le n/2$ vertices, so a vertex would have degree $\le n/2 - 1 < n/2$, contradiction.
2. Consider a longest path in $G$, say $P = (v_1, v_2, \dots, v_k)$.
3. All neighbors of $v_1$ and $v_k$ must lie on $P$ (otherwise $P$ could be extended).
4. By hypothesis, $\deg(v_1) \ge n/2$ and $\deg(v_k) \ge n/2$.
5. Consider the set of indices $S = \{i \mid \{v_1, v_{i+1}\} \in E\}$ and $T = \{i \mid \{v_k, v_i\} \in E\}$.
6. Both $S, T \subseteq \{1, 2, \dots, k-1\}$, so $|S \cup T| \le k - 1 < n$.
7. But $|S| + |T| = \deg(v_1) + \deg(v_k) \ge n/2 + n/2 = n$.
8. By the Pigeonhole Principle ($|S| + |T| > |S \cup T|$), $S \cap T \ne \emptyset$.
9. Thus there exists some index $i$ such that $\{v_1, v_{i+1}\} \in E$ and $\{v_k, v_i\} \in E$.
10. This allows creating a cycle of length $k$:
    $$C = (v_1, v_{i+1}, v_{i+2}, \dots, v_k, v_i, v_{i-1}, \dots, v_1)$$
11. If $k < n$, because $G$ is connected, there is an external vertex adjacent to $C$, allowing construction of a path strictly longer than $k$, contradicting maximality.
12. Hence $k = n$, and $C$ is a Hamiltonian cycle. $\blacksquare$

---

## 14. Closest Pair in a Unit Square ($\sqrt{2}/2$ Bound)

### Theorem Statement
Given any 5 points in a $1 \times 1$ closed square, there exist at least two points whose Euclidean distance is at most $\sqrt{2}/2 \approx 0.7071$.

### Proof
1. Subdivide the $1 \times 1$ unit square into 4 equal sub-squares by lines connecting the midpoints of opposite sides.
2. Each sub-square has side length $s = 1/2$.
3. The maximum distance between any two points in a square of side $s$ is its diagonal length:
   $$d_{\max} = \sqrt{s^2 + s^2} = s\sqrt{2} = \frac{1}{2}\sqrt{2} = \frac{\sqrt{2}}{2}$$
4. We have 5 points (pigeons) placed into 4 sub-squares (holes).
5. By the Pigeonhole Principle ($5 > 4$), at least one sub-square must contain at least 2 points.
6. Since these two points lie in the same sub-square, the distance between them cannot exceed the diagonal length:
   $$d \le \frac{\sqrt{2}}{2} \approx 0.7071$$
7. This bound is tight: placing 4 points at the 4 corners of the unit square gives pairwise distances $\ge 1 > \sqrt{2}/2$. The 5th point forces the condition. $\blacksquare$

---

## 15. The Happy Ending Problem (Convex Quadrilateral from 5 Points)

### Theorem Statement
Any set of 5 points in the Euclidean plane in general position (no three collinear) contains 4 points that form the vertices of a convex quadrilateral.

### Proof (Klein / Szekeres / Erdős)
1. Consider the convex hull $H$ of the 5 points.
2. **Case 1 ($|H| = 5$)**: The 5 points themselves form a convex pentagon. Choosing any 4 points yields a convex quadrilateral.
3. **Case 2 ($|H| = 4$)**: 4 points form the vertices of a convex quadrilateral $Q$, and the 5th point lies in the interior of $Q$. The 4 boundary points form the required convex quadrilateral.
4. **Case 3 ($|H| = 3$)**: 3 points $\{A, B, C\}$ form a triangle, and the remaining 2 points $\{D, E\}$ lie inside $\triangle ABC$.
   - Draw the straight line passing through $D$ and $E$.
   - Because no three points are collinear, line $DE$ does not pass through any of $\{A, B, C\}$.
   - Line $DE$ intersects two sides of $\triangle ABC$.
   - By the Pigeonhole Principle, of the 3 vertices $\{A, B, C\}$, two vertices must lie on the same side of line $DE$.
   - Let these two vertices be $A$ and $B$.
   - Then $\{A, B, E, D\}$ form a convex quadrilateral.
5. In all cases, 4 points forming a convex quadrilateral are guaranteed. $\blacksquare$

---

## 16. Impossibility of Universal Lossless Data Compression

### Theorem Statement
No lossless compression algorithm can compress all files of length $N$ bits to files of length strictly less than $N$ bits.

### Proof
1. Let $\Sigma = \{0, 1\}$. The number of distinct files of length exactly $N$ bits is:
   $$|\Sigma^N| = 2^N$$
2. A lossless compression algorithm is an injective function $C: \Sigma^N \to \bigcup_{k=0}^{N-1} \Sigma^k$ that maps every $N$-bit file to a bitstring of length at most $N - 1$.
3. The total number of all possible output bitstrings of length strictly less than $N$ is:
   $$\sum_{k=0}^{N-1} |\Sigma^k| = \sum_{k=0}^{N-1} 2^k = 2^N - 1$$
4. We have $2^N$ input files (pigeons) mapped into $2^N - 1$ possible compressed representations (holes).
5. By the Pigeonhole Principle, since:
   $$2^N > 2^N - 1$$
   no injective mapping can exist.
6. At least two distinct $N$-bit files must produce the exact same compressed bitstring, which makes unambiguous decompression impossible.
7. Consequently, any algorithm that compresses some files must inevitably expand other files. $\blacksquare$
