#pragma once

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
#include <cstdint>
#include "../third_party/json.hpp"

using json = nlohmann::json;

namespace HashModule {

    // Multiplicative hash (Knuth's golden ratio method)
    // h(k) = floor(m * (k * A mod 1)) where A = (sqrt(5) - 1) / 2 approx 0.6180339887
    inline int knuthHash(int key, int buckets) {
        const double A = 0.618033988749895;
        double val = key * A;
        double frac = val - std::floor(val);
        return static_cast<int>(std::floor(buckets * frac)) % buckets;
    }

    // Simple pseudo-random hash (splitmix-style integer hash)
    inline int prngHash(int key, int buckets) {
        uint64_t z = static_cast<uint64_t>(key) + 0x9e3779b97f4a7c15ULL;
        z = (z ^ (z >> 30)) * 0xbf58476d1ce4e5b9ULL;
        z = (z ^ (z >> 27)) * 0x94d049bb133111ebULL;
        z = z ^ (z >> 31);
        return static_cast<int>(z % static_cast<uint64_t>(buckets));
    }

    // Modulo hash
    inline int moduloHash(int key, int buckets) {
        int r = key % buckets;
        return (r < 0) ? (r + buckets) : r;
    }

    struct HashAnalysisResult {
        int buckets;
        int totalKeys;
        double loadFactor;
        int longestChain;
        int emptyBuckets;
        int collidingBuckets;
        double chiSquare;
        double expectedCollidingPairs;
        double avgChainingLookupCost;
        double avgLinearProbingLookupCost;
        std::vector<int> bucketSizes;
        std::vector<std::vector<int>> separateChains;
        std::vector<int> openAddressingTable; // -1 for empty
    };

    inline json analyzeHashing(int numKeys, int buckets, const std::string& strategy, const std::string& pattern) {
        int clampedKeys = std::max(1, std::min(numKeys, 500));
        int clampedBuckets = std::max(2, std::min(buckets, 100));

        // Generate keys based on pattern
        std::vector<int> keys;
        keys.reserve(clampedKeys);

        if (pattern == "multiples_10") {
            for (int i = 0; i < clampedKeys; ++i) keys.push_back((i + 1) * 10);
        } else if (pattern == "multiples_k") {
            for (int i = 0; i < clampedKeys; ++i) keys.push_back((i + 1) * clampedBuckets);
        } else if (pattern == "random") {
            uint64_t seed = 1337;
            for (int i = 0; i < clampedKeys; ++i) {
                seed = (seed * 6364136223846793005ULL + 1442695040888963407ULL);
                keys.push_back(static_cast<int>((seed >> 32) % 100000));
            }
        } else {
            // Sequential keys
            for (int i = 0; i < clampedKeys; ++i) keys.push_back(i + 1);
        }

        // Separate Chaining simulation
        std::vector<std::vector<int>> chains(clampedBuckets);
        for (int k : keys) {
            int slot = 0;
            if (strategy == "knuth") slot = knuthHash(k, clampedBuckets);
            else if (strategy == "prng") slot = prngHash(k, clampedBuckets);
            else slot = moduloHash(k, clampedBuckets);

            chains[slot].push_back(k);
        }

        // Open Addressing (Linear Probing) simulation
        std::vector<int> openTable(clampedBuckets, -1);
        int totalProbes = 0;
        int insertedInOpen = 0;

        for (int k : keys) {
            if (insertedInOpen >= clampedBuckets) break; // Table full
            int baseSlot = 0;
            if (strategy == "knuth") baseSlot = knuthHash(k, clampedBuckets);
            else if (strategy == "prng") baseSlot = prngHash(k, clampedBuckets);
            else baseSlot = moduloHash(k, clampedBuckets);

            int slot = baseSlot;
            int probes = 0;
            while (openTable[slot] != -1 && probes < clampedBuckets) {
                probes++;
                slot = (slot + 1) % clampedBuckets;
            }
            if (openTable[slot] == -1) {
                openTable[slot] = k;
                insertedInOpen++;
                totalProbes += (probes + 1);
            }
        }

        // Metrics calculation
        std::vector<int> sizes(clampedBuckets);
        int maxChain = 0;
        int emptyCount = 0;
        int collisionBuckets = 0;
        double expectedPerBucket = static_cast<double>(clampedKeys) / clampedBuckets;
        double chiSquare = 0.0;
        int totalChainProbes = 0;

        for (int b = 0; b < clampedBuckets; ++b) {
            int sz = static_cast<int>(chains[b].size());
            sizes[b] = sz;
            if (sz > maxChain) maxChain = sz;
            if (sz == 0) emptyCount++;
            if (sz > 1) collisionBuckets++;

            double diff = sz - expectedPerBucket;
            chiSquare += (diff * diff) / (expectedPerBucket > 0 ? expectedPerBucket : 1.0);

            // Cost for each item in chain: 1 + 2 + ... + sz
            totalChainProbes += (sz * (sz + 1)) / 2;
        }

        double loadFactor = static_cast<double>(clampedKeys) / clampedBuckets;
        double expectedCollidingPairs = (static_cast<double>(clampedKeys) * (clampedKeys - 1)) / (2.0 * clampedBuckets);
        double avgChainingCost = clampedKeys > 0 ? static_cast<double>(totalChainProbes) / clampedKeys : 1.0;
        double avgOpenCost = insertedInOpen > 0 ? static_cast<double>(totalProbes) / insertedInOpen : 1.0;

        return json{
            {"buckets", clampedBuckets},
            {"totalKeys", clampedKeys},
            {"loadFactor", loadFactor},
            {"longestChain", maxChain},
            {"emptyBuckets", emptyCount},
            {"collidingBuckets", collisionBuckets},
            {"chiSquare", chiSquare},
            {"expectedCollidingPairs", expectedCollidingPairs},
            {"avgChainingLookupCost", avgChainingCost},
            {"avgLinearProbingLookupCost", avgOpenCost},
            {"bucketSizes", sizes},
            {"openAddressingTable", openTable},
            {"strategy", strategy},
            {"pattern", pattern}
        };
    }
}
