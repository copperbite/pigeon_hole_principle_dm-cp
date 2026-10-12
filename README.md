# Pigeonhole Lab 🕊️
### Interactive Textbook-Grade Discrete Mathematics & Algorithms Platform

[![C++17](https://img.shields.io/badge/C%2B%2B-17-blue.svg)](https://en.cppreference.com/w/cpp/17)
[![Three.js](https://img.shields.io/badge/3D-Three.js_r128-black.svg)](https://threejs.org/)
[![D3.js](https://img.shields.io/badge/2D-D3.js_v7-orange.svg)](https://d3js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Offline_Capable-100%25-brightgreen.svg)](#offline-capability)

**Pigeonhole Lab** is an interactive discrete mathematics laboratory, proof compendium, and computing engine designed to explore the **Pigeonhole Principle** ($|S| > |T| \implies \exists y \in T : |f^{-1}(y)| \ge \lceil |S|/|T| \rceil$) and its far-reaching implications across combinatorics, number theory, graph theory, geometry, probabilistic analysis, and computer science.

---

## 🌟 Key Highlights

- **31 Interactive Learning Modules**: Covering Simple & Generalized PHP, Exhaustive Verifiers, Dirichlet's Approximation, Erdős–Szekeres, Ramsey Theory $R(3,3)=6$, Handshaking Invariants, Havel-Hakimi, Hall's Marriage, Graph Coloring, Mantel's Theorem, Euler/Hamilton Circuits, Points in a Square, Happy Ending Problem, and 15 Real-World Case Studies.
- **7 Spatial 3D WebGL Scenes (Three.js)**:
  - `S1`: Falling Pigeons into 3D Boxes with collision illumination.
  - `S2`: Erdős-Szekeres $(i, L_i, D_i)$ 3D Coordinate Slab.
  - `S3`: Ramsey $K_6$ Complete Graph on Sphere with live monochromatic triangle detection.
  - `S4`: Dirichlet Approximation Helix & Cylinder Wrapping.
  - `S5`: Birthday Paradox 3D Probability Surface $z = P(n, k)$.
  - `S6`: Hash Load Landscape comparing uniform vs clustered bucket terrains.
  - `S7`: Hall's Marriage 3D Bipartite Parallel Plane Matching.
- **High-Performance C++17 Backend**: Multi-threaded REST microservice handling brute-force combinatorial search, dynamic programming, Kuhn's matching algorithm, and benchmarks.
- **Dual Engine Graceful Degradation**: 100% functional in the browser even when the backend is offline.
- **Comprehensive Documentation Suite**: Complete with formal proofs (`docs/PROOFS.md`), course report (`docs/REPORT.md`), 4-person team viva defense guide (`docs/TEAM_GUIDE.md`), and REST API specifications (`docs/API.md`).

---

## 🚀 Quick Start Guide

### 1. Compile & Start the C++17 Native Server
Open a terminal in the project directory:

```powershell
# Compile the modern multi-threaded server
g++ -std=c++17 backend/main.cpp -o backend/server.exe -lws2_32 -pthread

# Launch the server (listens on http://localhost:8080)
.\backend\server.exe
```

### 2. Launch the Frontend
In a second terminal, start the static web server:

```powershell
python -m http.server 3000 --directory frontend
```

Now open your web browser to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📂 Project Directory Structure

```
Pigeonhole_Principle_Project/
├── backend/
│   ├── main.cpp                  # Multi-threaded REST server (cpp-httplib)
│   ├── modules/                  # Specialized algorithm headers
│   │   ├── core.hpp              # Pigeon, Pigeonhole, PigeonholeTable classes
│   │   ├── erdos_szekeres.hpp    # O(n^2) DP monotone subsequence finder
│   │   ├── dirichlet.hpp         # High-precision fractional parts search
│   │   ├── divisible.hpp         # Prefix sum residue matching
│   │   ├── birthday.hpp          # Exact & Poisson collision formulas
│   │   ├── ramsey.hpp            # Exhaustive K6 (32,768) coloring validator
│   │   ├── degree.hpp            # Graphic degrees & Handshake lemma
│   │   ├── havel_hakimi.hpp      # Graphic degree reduction
│   │   ├── hall_matching.hpp     # Kuhn's bipartite matching & violator finder
│   │   ├── coloring.hpp          # Exact backtracking chromatic number
│   │   ├── geometry.hpp          # 5 points in square & Happy Ending
│   │   └── sorting.hpp           # Pigeonhole Sort vs std::sort benchmark
│   └── third_party/              # Vendored single-header libraries
├── frontend/
│   ├── index.html                # App shell, sticky topbar, sidebar
│   ├── css/                      # Design system (tokens, layout, modules)
│   ├── js/
│   │   ├── app.js                # Router, API client, theme & math orchestrator
│   │   ├── three/                # 7 Three.js WebGL scenes (S1 - S7)
│   │   └── modules/              # 31 ES module controllers
│   └── vendor/                   # 100% offline vendored KaTeX, Three.js, D3.js
├── docs/
│   ├── REPORT.md                 # Exhaustive course report & architecture
│   ├── PROOFS.md                 # Rigorous formal proofs for all 16 theorems
│   ├── TEAM_GUIDE.md             # 4-person team roles, speaking points & viva Q&A
│   ├── API.md                    # REST API specifications & curl examples
│   └── CREDITS.md                # References & mathematical attributions
├── tests/
│   └── tests.cpp                 # C++ unit test suite
└── README.md                     # This file
```

---

## 🎓 4-Person Team Distribution

- **Student 1 (Architecture & Core Principles)**: Modules A1–A4, B10; C++ server runtime; Exhaustive computer verifier.
- **Student 2 (Number Theory & Probabilistic Collisions)**: Modules B2, B3, B4, B8, B9; Dirichlet approximation; Prefix sums; Sorting benchmark.
- **Student 3 (Graph Theory & Combinatorics)**: Modules B1, B6, B7, C1–C5; Erdős-Szekeres DP; Ramsey $R(3,3)=6$; Hall's marriage; Mantel's theorem.
- **Student 4 (Geometry, Real-World Systems & 3D Spatial)**: Modules G1, G2, R1, Challenge Mode, Learning Path; 3D scenes S1–S7; Accessibility.

*See [`docs/TEAM_GUIDE.md`](docs/TEAM_GUIDE.md) for individual viva preparation and defense strategies.*

---

## 📖 License & Acknowledgments

This project is released under the MIT License. Created for discrete mathematics and computer science education.
- Inspired by Johann Peter Gustav Lejeune Dirichlet (1834 *Schubfachprinzip*).
- Graph theory foundations by Paul Erdős, George Szekeres, and Frank P. Ramsey.
