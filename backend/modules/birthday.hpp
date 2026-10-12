#pragma once

#include <iostream>
#include <vector>
#include <cmath>
#include <random>
#include <algorithm>
#include <cstdint>
#include "../third_party/json.hpp"

using json = nlohmann::json;

namespace BirthdayModule {

    inline json computeBirthday(int n, int k = 365, int trials = 10000, uint64_t seed = 42) {
        int clampedN = std::max(1, std::min(n, 500));
        int clampedK = std::max(2, std::min(k, 10000));
        int clampedTrials = std::max(100, std::min(trials, 1000000));

        // 1. Exact Probability P(n, k)
        double exactP = 1.0;
        if (clampedN > clampedK) {
            exactP = 1.0; // 100% guaranteed by Pigeonhole Principle
        } else {
            double logNoCollision = 0.0;
            for (int i = 0; i < clampedN; ++i) {
                logNoCollision += std::log(1.0 - static_cast<double>(i) / clampedK);
            }
            exactP = 1.0 - std::exp(logNoCollision);
        }

        // 2. Exponential Approximation: 1 - exp(-n(n - 1) / (2k))
        double expApprox = 1.0 - std::exp(-static_cast<double>(clampedN) * (clampedN - 1) / (2.0 * clampedK));

        // 3. Expected Colliding Pairs
        double expectedPairs = (static_cast<double>(clampedN) * (clampedN - 1)) / (2.0 * clampedK);

        // 4. Monte Carlo Simulation
        std::mt19937_64 rng(seed);
        std::uniform_int_distribution<int> dist(0, clampedK - 1);
        int collisionsObserved = 0;

        for (int t = 0; t < clampedTrials; ++t) {
            std::vector<bool> seen(clampedK, false);
            bool hasCollision = false;
            for (int i = 0; i < clampedN; ++i) {
                int b = dist(rng);
                if (seen[b]) {
                    hasCollision = true;
                    break;
                }
                seen[b] = true;
            }
            if (hasCollision) collisionsObserved++;
        }

        double simulatedP = static_cast<double>(collisionsObserved) / clampedTrials;

        // Generate Probability Curve Points for plotting
        json curve = json::array();
        int maxCurveN = std::min(clampedK + 2, 70);
        for (int i = 1; i <= maxCurveN; ++i) {
            double prob = 0.0;
            if (i > clampedK) prob = 1.0;
            else {
                double lnc = 0.0;
                for (int j = 0; j < i; ++j) {
                    lnc += std::log(1.0 - static_cast<double>(j) / clampedK);
                }
                prob = 1.0 - std::exp(lnc);
            }
            curve.push_back({
                {"n", i},
                {"exact", prob},
                {"approx", 1.0 - std::exp(-static_cast<double>(i) * (i - 1) / (2.0 * clampedK))}
            });
        }

        return json{
            {"n", clampedN},
            {"k", clampedK},
            {"exactProbability", exactP},
            {"exponentialApprox", expApprox},
            {"simulatedProbability", simulatedP},
            {"expectedPairs", expectedPairs},
            {"trialsRun", clampedTrials},
            {"ruleOfThumb50", 1.1774 * std::sqrt(clampedK)},
            {"pigeonholeCertaintyN", clampedK + 1},
            {"curve", curve}
        };
    }
}
