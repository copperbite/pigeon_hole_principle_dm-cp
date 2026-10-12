#pragma once

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <random>
#include <cmath>
#include <cstdint>
#include <stdexcept>
#include "../third_party/json.hpp"

using json = nlohmann::json;

// ============================================================================
// Core Classes Preserved and Enhanced from Original backend.cpp
// ============================================================================

struct Pigeon {
    int id;
    explicit Pigeon(int id = 0) : id(id) {}
};

class Pigeonhole {
private:
    int id;
    std::vector<Pigeon> occupants;

public:
    explicit Pigeonhole(int id = 0) : id(id) {}

    void addPigeon(const Pigeon& pigeon) {
        occupants.push_back(pigeon);
    }

    size_t getCount() const {
        return occupants.size();
    }

    bool hasCollision() const {
        return occupants.size() > 1;
    }

    int getId() const {
        return id;
    }

    const std::vector<Pigeon>& getOccupants() const {
        return occupants;
    }

    void clear() {
        occupants.clear();
    }
};

class PigeonholeTable {
private:
    int totalObjects;
    int numHoles;
    std::vector<Pigeonhole> holes;
    std::vector<int> assignments;

public:
    PigeonholeTable(int objects, int boxes) : totalObjects(objects), numHoles(boxes) {
        if (numHoles < 1) numHoles = 1;
        if (totalObjects < 0) totalObjects = 0;
        holes.reserve(numHoles);
        for (int i = 0; i < numHoles; ++i) {
            holes.emplace_back(i);
        }
    }

    int hashFunction(int objectIndex) const {
        return (numHoles > 0) ? (objectIndex % numHoles) : 0;
    }

    // Default modulo / round-robin distribution (preserves original behavior)
    void distribute() {
        distributeWithStrategy("round-robin", 42);
    }

    // Enhanced distribution supporting round-robin, random, and adversarial strategies
    void distributeWithStrategy(const std::string& strategy, uint64_t seed = 42) {
        assignments.clear();
        assignments.reserve(totalObjects);
        for (auto& hole : holes) {
            hole.clear();
        }

        if (strategy == "random") {
            std::mt19937_64 rng(seed);
            std::uniform_int_distribution<int> dist(0, numHoles - 1);
            for (int i = 0; i < totalObjects; ++i) {
                int bucketIndex = dist(rng);
                Pigeon pigeon(i + 1);
                holes[bucketIndex].addPigeon(pigeon);
                assignments.push_back(bucketIndex);
            }
        } else if (strategy == "adversarial") {
            // Adversarial tries to spread objects as evenly as possible to minimize max occupancy
            // Hole with smallest current count gets the next pigeon
            for (int i = 0; i < totalObjects; ++i) {
                int bestBucket = 0;
                size_t minCount = holes[0].getCount();
                for (int b = 1; b < numHoles; ++b) {
                    if (holes[b].getCount() < minCount) {
                        minCount = holes[b].getCount();
                        bestBucket = b;
                    }
                }
                Pigeon pigeon(i + 1);
                holes[bestBucket].addPigeon(pigeon);
                assignments.push_back(bestBucket);
            }
        } else {
            // Default: round-robin (preserves original modulo behavior)
            for (int i = 0; i < totalObjects; ++i) {
                Pigeon pigeon(i + 1);
                int bucketIndex = hashFunction(i);
                holes[bucketIndex].addPigeon(pigeon);
                assignments.push_back(bucketIndex);
            }
        }
    }

    // Theoretical guarantee: ceil(n / k) = floor((n + k - 1) / k)
    int getTheoreticalGuarantee() const {
        if (numHoles <= 0) return 0;
        return (totalObjects + numHoles - 1) / numHoles;
    }

    int getMaxOccupancy() const {
        size_t maxCount = 0;
        for (const auto& hole : holes) {
            maxCount = std::max(maxCount, hole.getCount());
        }
        return static_cast<int>(maxCount);
    }

    int countCollisions() const {
        int collisionCount = 0;
        for (const auto& hole : holes) {
            if (hole.hasCollision()) {
                collisionCount++;
            }
        }
        return collisionCount;
    }

    int getTotalObjects() const { return totalObjects; }
    int getNumHoles() const { return numHoles; }
    const std::vector<int>& getAssignments() const { return assignments; }
    const std::vector<Pigeonhole>& getHoles() const { return holes; }

    void display() const {
        std::cout << "Objects: " << totalObjects << " | Boxes: " << numHoles << "\n";
        std::cout << "Theoretical Guarantee: " << getTheoreticalGuarantee() << "\n";
        for (int i = 0; i < numHoles; ++i) {
            std::cout << "Box [" << i << "] (" << holes[i].getCount() << " items): ";
            for (const auto& p : holes[i].getOccupants()) {
                std::cout << p.id << " ";
            }
            std::cout << "\n";
        }
    }
};

// ============================================================================
// Core Module API Controller & Verification Functions
// ============================================================================

namespace CoreModule {

    inline json simulate(int objects, int boxes, const std::string& strategy = "round-robin", uint64_t seed = 42) {
        int clampedObjects = std::max(1, std::min(objects, 30));
        int clampedBoxes = std::max(1, std::min(boxes, 12));

        PigeonholeTable table(clampedObjects, clampedBoxes);
        table.distributeWithStrategy(strategy, seed);

        json boxCounts = json::array();
        for (int i = 0; i < clampedBoxes; ++i) {
            boxCounts.push_back(table.getHoles()[i].getCount());
        }

        return json{
            {"objects", table.getTotalObjects()},
            {"boxes", table.getNumHoles()},
            {"guarantee", table.getTheoreticalGuarantee()},
            {"maxOccupancy", table.getMaxOccupancy()},
            {"collisionCount", table.countCollisions()},
            {"hasCollision", table.getMaxOccupancy() > 1},
            {"assignments", table.getAssignments()},
            {"boxCounts", boxCounts},
            {"strategy", strategy}
        };
    }

    // Exhaustive verifier checking all k^n mappings (capped at n, k <= 8)
    inline json exhaustiveVerify(int n, int k) {
        if (n < 1 || k < 1) {
            throw std::invalid_argument("n and k must be positive integers");
        }
        if (n > 8 || k > 8) {
            throw std::invalid_argument("Exhaustive verification is capped at n <= 8 and k <= 8");
        }

        int expectedMinMax = (n + k - 1) / k; // ceil(n/k)
        uint64_t totalMappings = 1;
        for (int i = 0; i < n; ++i) {
            totalMappings *= k;
        }

        std::vector<int> current(n, 0);
        std::vector<int> counts(k, 0);
        int observedMinMax = k + 10;
        std::vector<int> tightestMapping;
        uint64_t countChecked = 0;

        for (uint64_t m = 0; m < totalMappings; ++m) {
            std::fill(counts.begin(), counts.end(), 0);
            for (int i = 0; i < n; ++i) {
                counts[current[i]]++;
            }
            int maxOcc = 0;
            for (int c : counts) {
                if (c > maxOcc) maxOcc = c;
            }
            if (maxOcc < observedMinMax) {
                observedMinMax = maxOcc;
                tightestMapping = current;
            }
            countChecked++;

            // Odometer increment
            for (int i = n - 1; i >= 0; --i) {
                current[i]++;
                if (current[i] < k) break;
                current[i] = 0;
            }
        }

        return json{
            {"n", n},
            {"k", k},
            {"totalMappings", totalMappings},
            {"countChecked", countChecked},
            {"expectedMinMax", expectedMinMax},
            {"observedMinMax", observedMinMax},
            {"theoremHolds", observedMinMax >= expectedMinMax},
            {"tightestMapping", tightestMapping}
        };
    }

    // Minimum draws / socks problem: k*(r - 1) + 1
    inline json minimumDraws(int types, int r) {
        if (types < 1 || r < 1) {
            throw std::invalid_argument("Types and target r must be >= 1");
        }
        int guaranteedDraws = types * (r - 1) + 1;
        return json{
            {"types", types},
            {"r", r},
            {"guaranteedDraws", guaranteedDraws},
            {"formula", "k * (r - 1) + 1"}
        };
    }

    // Strong / weighted pigeonhole principle: sum(thresholds) - k + 1
    inline json strongPigeonhole(const std::vector<int>& thresholds) {
        if (thresholds.empty()) {
            throw std::invalid_argument("Thresholds list cannot be empty");
        }
        int k = static_cast<int>(thresholds.size());
        int sumThresholds = 0;
        for (int t : thresholds) {
            if (t < 1) throw std::invalid_argument("Each threshold must be >= 1");
            sumThresholds += t;
        }
        int thresholdTotal = sumThresholds - k + 1;
        return json{
            {"boxes", k},
            {"thresholds", thresholds},
            {"sumThresholds", sumThresholds},
            {"requiredObjects", thresholdTotal},
            {"survivableCount", sumThresholds - k}
        };
    }

} // namespace CoreModule
