#pragma once

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>
#include <random>
#include <cstdint>
#include <queue>
#include "../third_party/json.hpp"

using json = nlohmann::json;

namespace SequencesGraphsModule {

    // ========================================================================
    // B1: Erdős-Szekeres Monotone Subsequence Theorem
    // mn + 1 elements contain increasing of length m + 1 or decreasing of length n + 1
    // ========================================================================
    inline json solveErdosSzekeres(int m, int n, std::vector<double> sequence = {}) {
        int targetLen = m * n + 1;
        if (targetLen > 100) targetLen = 100;

        if (sequence.empty() || static_cast<int>(sequence.size()) != targetLen) {
            // Generate random permutation of 1 .. targetLen
            sequence.resize(targetLen);
            for (int i = 0; i < targetLen; ++i) sequence[i] = i + 1;
            std::mt19937_64 rng(42);
            std::shuffle(sequence.begin(), sequence.end(), rng);
        }

        int N = static_cast<int>(sequence.size());
        std::vector<int> L(N, 1); // Longest Increasing ending at i
        std::vector<int> D(N, 1); // Longest Decreasing ending at i
        std::vector<int> parentInc(N, -1);
        std::vector<int> parentDec(N, -1);

        int bestIncIdx = 0, maxInc = 1;
        int bestDecIdx = 0, maxDec = 1;

        for (int i = 0; i < N; ++i) {
            for (int j = 0; j < i; ++j) {
                if (sequence[j] < sequence[i] && L[j] + 1 > L[i]) {
                    L[i] = L[j] + 1;
                    parentInc[i] = j;
                }
                if (sequence[j] > sequence[i] && D[j] + 1 > D[i]) {
                    D[i] = D[j] + 1;
                    parentDec[i] = j;
                }
            }
            if (L[i] > maxInc) { maxInc = L[i]; bestIncIdx = i; }
            if (D[i] > maxDec) { maxDec = D[i]; bestDecIdx = i; }
        }

        // Reconstruct increasing subsequence
        std::vector<int> incIndices;
        int curr = bestIncIdx;
        while (curr != -1) {
            incIndices.push_back(curr);
            curr = parentInc[curr];
        }
        std::reverse(incIndices.begin(), incIndices.end());

        // Reconstruct decreasing subsequence
        std::vector<int> decIndices;
        curr = bestDecIdx;
        while (curr != -1) {
            decIndices.push_back(curr);
            curr = parentDec[curr];
        }
        std::reverse(decIndices.begin(), decIndices.end());

        bool hasIncreasingTarget = (maxInc >= m + 1);
        bool hasDecreasingTarget = (maxDec >= n + 1);

        json pairs = json::array();
        for (int i = 0; i < N; ++i) {
            pairs.push_back({
                {"index", i},
                {"value", sequence[i]},
                {"L", L[i]},
                {"D", D[i]}
            });
        }

        return json{
            {"m", m},
            {"n", n},
            {"targetLength", targetLen},
            {"sequence", sequence},
            {"pairs", pairs},
            {"maxInc", maxInc},
            {"maxDec", maxDec},
            {"hasIncreasingTarget", hasIncreasingTarget},
            {"hasDecreasingTarget", hasDecreasingTarget},
            {"incIndices", incIndices},
            {"decIndices", decIndices},
            {"theoremHolds", (hasIncreasingTarget || hasDecreasingTarget)}
        };
    }

    // ========================================================================
    // B6: Ramsey Theory R(3,3) = 6
    // Brute force all 2^15 = 32,768 colorings of K_6, verify K_5 counterexample
    // ========================================================================
    inline json verifyRamsey(int size = 6) {
        if (size == 5) {
            // K5 has 10 edges: 2^10 = 1024 colorings.
            // Find the pentagon/pentagram 2-coloring with 0 monochromatic triangles
            const int numEdges = 10;
            std::vector<std::pair<int, int>> edges;
            for (int i = 0; i < 5; ++i) {
                for (int j = i + 1; j < 5; ++j) {
                    edges.push_back({i, j});
                }
            }

            int validColoringMask = -1;
            for (int mask = 0; mask < 1024; ++mask) {
                // Check all C(5, 3) = 10 triangles
                bool hasMono = false;
                for (int i = 0; i < 5; ++i) {
                    for (int j = i + 1; j < 5; ++j) {
                        for (int k = j + 1; k < 5; ++k) {
                            // Find color of (i,j), (j,k), (i,k)
                            int c1 = -1, c2 = -1, c3 = -1;
                            for (int e = 0; e < 10; ++e) {
                                if (edges[e] == std::make_pair(i, j)) c1 = (mask >> e) & 1;
                                if (edges[e] == std::make_pair(j, k)) c2 = (mask >> e) & 1;
                                if (edges[e] == std::make_pair(i, k)) c3 = (mask >> e) & 1;
                            }
                            if (c1 == c2 && c2 == c3) { hasMono = true; break; }
                        }
                        if (hasMono) break;
                    }
                    if (hasMono) break;
                }
                if (!hasMono) {
                    validColoringMask = mask;
                    break;
                }
            }

            std::vector<int> edgeColors(10);
            for (int e = 0; e < 10; ++e) {
                edgeColors[e] = (validColoringMask >> e) & 1;
            }

            return json{
                {"size", 5},
                {"totalColorings", 1024},
                {"counterexampleFound", validColoringMask != -1},
                {"counterexampleMask", validColoringMask},
                {"edgeColors", edgeColors},
                {"explanation", "In K5, a red regular pentagon with a blue internal pentagram contains ZERO monochromatic triangles."}
            };
        }

        // K6 has 15 edges: 2^15 = 32,768 colorings.
        // Confirm that EVERY coloring contains at least 1 monochromatic triangle!
        const int numEdges = 15;
        std::vector<std::pair<int, int>> edges;
        for (int i = 0; i < 6; ++i) {
            for (int j = i + 1; j < 6; ++j) {
                edges.push_back({i, j});
            }
        }

        // Precompute triangle edge indices
        struct Tri { int e1, e2, e3; };
        std::vector<Tri> triangles;
        for (int i = 0; i < 6; ++i) {
            for (int j = i + 1; j < 6; ++j) {
                for (int k = j + 1; k < 6; ++k) {
                    int e1 = -1, e2 = -1, e3 = -1;
                    for (int e = 0; e < 15; ++e) {
                        if (edges[e] == std::make_pair(i, j)) e1 = e;
                        if (edges[e] == std::make_pair(j, k)) e2 = e;
                        if (edges[e] == std::make_pair(i, k)) e3 = e;
                    }
                    triangles.push_back({e1, e2, e3});
                }
            }
        }

        int monoCountChecked = 0;
        int minTrianglesFound = 20;

        for (int mask = 0; mask < 32768; ++mask) {
            int monoInMask = 0;
            for (const auto& tri : triangles) {
                int c1 = (mask >> tri.e1) & 1;
                int c2 = (mask >> tri.e2) & 1;
                int c3 = (mask >> tri.e3) & 1;
                if (c1 == c2 && c2 == c3) monoInMask++;
            }
            if (monoInMask > 0) monoCountChecked++;
            if (monoInMask < minTrianglesFound) minTrianglesFound = monoInMask;
        }

        return json{
            {"size", 6},
            {"totalColorings", 32768},
            {"coloringsWithMonochromaticTriangle", monoCountChecked},
            {"allContainMonoTriangle", monoCountChecked == 32768},
            {"minMonochromaticTrianglesPerColoring", minTrianglesFound},
            {"theoremVerified", monoCountChecked == 32768}
        };
    }

    inline json checkUserRamsey(int n, const std::vector<int>& colors) {
        std::vector<std::pair<int, int>> edges;
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                edges.push_back({i, j});
            }
        }

        json monoTriangles = json::array();
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                for (int k = j + 1; k < n; ++k) {
                    int c1 = -1, c2 = -1, c3 = -1;
                    for (size_t e = 0; e < edges.size(); ++e) {
                        if (edges[e] == std::make_pair(i, j) && e < colors.size()) c1 = colors[e];
                        if (edges[e] == std::make_pair(j, k) && e < colors.size()) c2 = colors[e];
                        if (edges[e] == std::make_pair(i, k) && e < colors.size()) c3 = colors[e];
                    }
                    if (c1 != -1 && c1 == c2 && c2 == c3) {
                        monoTriangles.push_back({
                            {"vertices", {i, j, k}},
                            {"color", c1}
                        });
                    }
                }
            }
        }

        return json{
            {"monochromaticTriangles", monoTriangles},
            {"count", monoTriangles.size()}
        };
    }

    // ========================================================================
    // B7: Handshake / Equal Degrees
    // Any simple graph with n >= 2 has two vertices with equal degree
    // Handshaking Lemma: sum(deg(v)) = 2 * |E|
    // ========================================================================
    inline json generateRandomGraph(int n, double p = 0.5, uint64_t seed = 42) {
        int clampedN = std::max(2, std::min(n, 20));
        std::mt19937_64 rng(seed);
        std::uniform_real_distribution<double> dist(0.0, 1.0);

        std::vector<std::vector<int>> adj(clampedN, std::vector<int>(clampedN, 0));
        std::vector<int> degrees(clampedN, 0);
        json edges = json::array();
        int totalEdges = 0;

        for (int i = 0; i < clampedN; ++i) {
            for (int j = i + 1; j < clampedN; ++j) {
                if (dist(rng) < p) {
                    adj[i][j] = 1;
                    adj[j][i] = 1;
                    degrees[i]++;
                    degrees[j]++;
                    edges.push_back({{"source", i}, {"target", j}});
                    totalEdges++;
                }
            }
        }

        // Find equal degree pair by PHP
        int v1 = -1, v2 = -1;
        std::vector<int> degreePos(clampedN, -1);
        for (int i = 0; i < clampedN; ++i) {
            int d = degrees[i];
            if (degreePos[d] != -1) {
                v1 = degreePos[d];
                v2 = i;
                break;
            }
            degreePos[d] = i;
        }

        int degreeSum = 0;
        int oddDegreeCount = 0;
        for (int d : degrees) {
            degreeSum += d;
            if (d % 2 != 0) oddDegreeCount++;
        }

        return json{
            {"n", clampedN},
            {"edges", edges},
            {"degrees", degrees},
            {"totalEdges", totalEdges},
            {"degreeSum", degreeSum},
            {"handshakingVerified", degreeSum == 2 * totalEdges},
            {"oddDegreeCountIsEven", oddDegreeCount % 2 == 0},
            {"collidingVertex1", v1},
            {"collidingVertex2", v2},
            {"sharedDegree", v1 != -1 ? degrees[v1] : -1}
        };
    }

    // ========================================================================
    // C1: Havel-Hakimi Theorem
    // Decide if degree sequence is graphic and reconstruct simple graph
    // ========================================================================
    inline json solveHavelHakimi(std::vector<int> sequence) {
        if (sequence.empty()) throw std::invalid_argument("Sequence cannot be empty");

        json steps = json::array();
        std::vector<std::pair<int, int>> labeled; // (degree, original vertex id)
        for (size_t i = 0; i < sequence.size(); ++i) {
            labeled.push_back({sequence[i], static_cast<int>(i)});
        }

        bool isGraphic = true;
        std::vector<std::pair<int, int>> constructedEdges;

        while (true) {
            // Sort in descending order
            std::sort(labeled.begin(), labeled.end(), [](const auto& a, const auto& b) {
                return a.first > b.first;
            });

            json stepSeq = json::array();
            for (const auto& item : labeled) stepSeq.push_back(item.first);

            // Check if all zero
            bool allZero = true;
            for (const auto& item : labeled) {
                if (item.first > 0) { allZero = false; break; }
                if (item.first < 0) { isGraphic = false; break; }
            }
            if (!isGraphic) break;

            steps.push_back({
                {"sequence", stepSeq},
                {"action", allZero ? "All degrees zero: GRAPHIC!" : "Remove largest degree d"}
            });

            if (allZero) break;

            int d = labeled[0].first;
            int u = labeled[0].second;
            labeled.erase(labeled.begin());

            if (d > static_cast<int>(labeled.size())) {
                isGraphic = false;
                break;
            }

            for (int i = 0; i < d; ++i) {
                labeled[i].first--;
                if (labeled[i].first < 0) {
                    isGraphic = false;
                    break;
                }
                constructedEdges.push_back({u, labeled[i].second});
            }
            if (!isGraphic) break;
        }

        json edgesJson = json::array();
        for (const auto& e : constructedEdges) {
            edgesJson.push_back({{"source", e.first}, {"target", e.second}});
        }

        return json{
            {"originalSequence", sequence},
            {"isGraphic", isGraphic},
            {"steps", steps},
            {"edges", edgesJson}
        };
    }
}
