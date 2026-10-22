#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include <algorithm>
#include <cmath>
#include <iomanip>


struct Pigeon {
    int id;
    explicit Pigeon(int id) : id(id) {}
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
};

class PigeonholeTable {
private:
    int totalObjects;
    int numHoles;
    std::vector<Pigeonhole> holes;
    std::vector<int> assignments;

public:
    PigeonholeTable(int objects, int boxes) : totalObjects(objects), numHoles(boxes) {
        holes.reserve(numHoles);
        for (int i = 0; i < numHoles; ++i) {
            holes.emplace_back(i);
        }
    }

    int hashFunction(int objectIndex) const {
        return objectIndex % numHoles;
    }

    void distribute() {
        assignments.clear();
        assignments.reserve(totalObjects);

        for (int i = 0; i < totalObjects; ++i) {
            Pigeon pigeon(i + 1);
            int bucketIndex = hashFunction(i);
            holes[bucketIndex].addPigeon(pigeon);
            assignments.push_back(bucketIndex);
        }
    }

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

struct SimulationResult {
    int objects;
    int boxes;
    int guarantee;
    std::vector<int> assignments;
};

int clampValue(int value, int minimum, int maximum) {
    return std::max(minimum, std::min(value, maximum));
}

SimulationResult runSimulation(int objects, int boxes) {
    int clampedObjects = clampValue(objects, 1, 30);
    int clampedBoxes = clampValue(boxes, 1, 12);

    PigeonholeTable table(clampedObjects, clampedBoxes);
    table.distribute();

    SimulationResult result;
    result.objects = table.getTotalObjects();
    result.boxes = table.getNumHoles();
    result.guarantee = table.getTheoreticalGuarantee();
    result.assignments = table.getAssignments();

    return result;
}

std::map<std::string, std::string> parseQueryParameters(const std::string& request) {
    std::map<std::string, std::string> parameters;
    const std::size_t queryStart = request.find('?');
    const std::size_t queryEnd = request.find(' ', queryStart);
    if (queryStart == std::string::npos || queryEnd == std::string::npos) return parameters;
    
    std::stringstream query(request.substr(queryStart + 1, queryEnd - queryStart - 1));
    std::string pair;
    while (std::getline(query, pair, '&')) {
        const std::size_t equals = pair.find('=');
        if (equals != std::string::npos) {
            parameters[pair.substr(0, equals)] = pair.substr(equals + 1);
        }
    }
    return parameters;
}

int getIntParam(const std::map<std::string, std::string>& params, const std::string& key, int defaultValue) {
    const auto it = params.find(key);
    if (it == params.end()) return defaultValue;
    try {
        return std::stoi(it->second);
    } catch (...) {
        return defaultValue;
    }
}

std::string serializeToJson(const SimulationResult& result) {
    std::ostringstream json;
    json << "{\"objects\":" << result.objects 
         << ",\"boxes\":" << result.boxes
         << ",\"guarantee\":" << result.guarantee 
         << ",\"assignments\":[";
    for (std::size_t i = 0; i < result.assignments.size(); ++i) {
        if (i > 0) json << ',';
        json << result.assignments[i];
    }
    json << "]}";
    return json.str();
}



