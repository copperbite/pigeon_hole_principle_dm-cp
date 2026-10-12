#pragma once

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <numeric>
#include <algorithm>
#include "../third_party/json.hpp"

using json = nlohmann::json;

namespace NumberTheoryModule {

    // B3: Divisible Subsequence (Prefix-Sum Residues mod n)
    // Statement: Among any n integers, there is a non-empty block of consecutive ones whose sum is divisible by n.
    // Proof: S_0 = 0, S_1, ..., S_n mod n are n+1 values in n residue boxes {0, ..., n-1}.
    // By PHP, two are identical: S_u = S_v (u < v). Then sum_{i=u+1}^v a_i = S_v - S_u = 0 (mod n).
    inline json solveDivisibleSubsequence(const std::vector<int>& numbers) {
        if (numbers.empty()) {
            throw std::invalid_argument("Numbers array cannot be empty");
        }

        int n = static_cast<int>(numbers.size());
        std::vector<int> prefixSums(n + 1, 0);
        std::vector<int> residues(n + 1, 0);

        for (int i = 0; i < n; ++i) {
            prefixSums[i + 1] = prefixSums[i] + numbers[i];
            int r = prefixSums[i + 1] % n;
            if (r < 0) r += n;
            residues[i + 1] = r;
        }

        // Find collision among the n + 1 residues in {0, ..., n - 1}
        std::vector<int> seenAt(n, -1);
        seenAt[0] = 0; // S_0 = 0 is at index 0

        int u = -1;
        int v = -1;

        for (int i = 1; i <= n; ++i) {
            int r = residues[i];
            if (seenAt[r] != -1) {
                u = seenAt[r];
                v = i;
                break;
            }
            seenAt[r] = i;
        }

        // Consecutive block is numbers[u ... v - 1] (1-indexed: numbers[u] to numbers[v-1])
        std::vector<int> block;
        int blockSum = 0;
        for (int i = u; i < v; ++i) {
            block.push_back(numbers[i]);
            blockSum += numbers[i];
        }

        return json{
            {"n", n},
            {"numbers", numbers},
            {"prefixSums", prefixSums},
            {"residues", residues},
            {"collisionResidue", residues[v]},
            {"startPrefixIndex", u},
            {"endPrefixIndex", v},
            {"startIndex", u},
            {"endIndex", v - 1},
            {"block", block},
            {"blockSum", blockSum},
            {"isDivisible", blockSum % n == 0}
        };
    }

    // B2: Dirichlet's Approximation Theorem
    // Statement: For any real alpha and positive integer N, there exist integers p and q with
    // 1 <= q <= N such that |q * alpha - p| < 1/N. Consequence: |alpha - p/q| < 1 / (q * N) <= 1 / q^2.
    // Proof: Consider the N + 1 numbers {0 * alpha}, {1 * alpha}, ..., {N * alpha} in [0, 1).
    // Divide [0, 1) into N buckets [j/N, (j+1)/N). By PHP, two numbers land in the same bucket:
    // |{q2 * alpha} - {q1 * alpha}| < 1/N with q = |q2 - q1| in [1, N].
    inline json solveDirichlet(double alpha, int N) {
        if (N < 1) throw std::invalid_argument("N must be >= 1");
        int clampedN = std::min(N, 10000);

        long double ldAlpha = static_cast<long double>(alpha);
        std::vector<long double> fractionalParts(clampedN + 1);
        std::vector<int> bucketAssignment(clampedN + 1);

        for (int q = 0; q <= clampedN; ++q) {
            long double product = q * ldAlpha;
            long double frac = product - std::floor(product);
            if (frac >= 1.0) frac = 0.999999999999999;
            fractionalParts[q] = frac;

            int bucket = static_cast<int>(std::floor(frac * clampedN));
            if (bucket >= clampedN) bucket = clampedN - 1;
            bucketAssignment[q] = bucket;
        }

        // Find two points landing in the same bucket of width 1/N
        // Alternatively, find the closest pair in fractional parts
        struct Pt {
            long double frac;
            int q;
        };
        std::vector<Pt> sortedPts;
        sortedPts.reserve(clampedN + 1);
        for (int q = 0; q <= clampedN; ++q) {
            sortedPts.push_back({fractionalParts[q], q});
        }
        std::sort(sortedPts.begin(), sortedPts.end(), [](const Pt& a, const Pt& b) {
            return a.frac < b.frac;
        });

        long double minDiff = 2.0;
        int bestQ1 = 0, bestQ2 = 1;

        for (size_t i = 0; i < sortedPts.size() - 1; ++i) {
            long double diff = sortedPts[i + 1].frac - sortedPts[i].frac;
            if (diff < minDiff && sortedPts[i].q != sortedPts[i + 1].q) {
                minDiff = diff;
                bestQ1 = sortedPts[i].q;
                bestQ2 = sortedPts[i + 1].q;
            }
        }

        int q = std::abs(bestQ2 - bestQ1);
        long double qAlpha = q * ldAlpha;
        int p = static_cast<int>(std::round(qAlpha));
        double error = static_cast<double>(std::abs(qAlpha - p));
        double bound = 1.0 / clampedN;
        double quadBound = 1.0 / (static_cast<double>(q) * q);

        json sampleFractional = json::array();
        int step = std::max(1, clampedN / 50);
        for (int i = 0; i <= clampedN; i += step) {
            sampleFractional.push_back({
                {"q", i},
                {"frac", static_cast<double>(fractionalParts[i])},
                {"bucket", bucketAssignment[i]}
            });
        }

        return json{
            {"alpha", alpha},
            {"N", clampedN},
            {"q", q},
            {"p", p},
            {"q1", bestQ1},
            {"q2", bestQ2},
            {"fraction", std::to_string(p) + "/" + std::to_string(q)},
            {"approxValue", static_cast<double>(p) / q},
            {"absoluteError", error},
            {"bucketThreshold", bound},
            {"quadraticBound", quadBound},
            {"satisfiesDirichlet", error < bound},
            {"sampleFractional", sampleFractional}
        };
    }
}
