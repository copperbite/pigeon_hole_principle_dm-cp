#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <map>
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <winsock2.h>
#include <ws2tcpip.h>

#pragma comment(lib, "ws2_32.lib")

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

void sendHttpResponse(SOCKET client, const std::string& status, const std::string& body) {
    const std::string response = "HTTP/1.1 " + status + "\r\n"
        "Content-Type: application/json; charset=utf-8\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Connection: close\r\n"
        "Content-Length: " + std::to_string(body.size()) + "\r\n\r\n" + body;
    send(client, response.c_str(), static_cast<int>(response.size()), 0);
}

int main() {
    WSADATA winsockData;
    if (WSAStartup(MAKEWORD(2, 2), &winsockData) != 0) {
        return 1;
    }

    SOCKET server = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (server == INVALID_SOCKET) {
        WSACleanup();
        return 1;
    }

    BOOL reuse = TRUE;
    setsockopt(server, SOL_SOCKET, SO_REUSEADDR, reinterpret_cast<const char*>(&reuse), sizeof(reuse));

    sockaddr_in address{};
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    address.sin_port = htons(8080);

    if (bind(server, reinterpret_cast<sockaddr*>(&address), sizeof(address)) == SOCKET_ERROR) {
        closesocket(server);
        WSACleanup();
        return 1;
    }

    if (listen(server, SOMAXCONN) == SOCKET_ERROR) {
        closesocket(server);
        WSACleanup();
        return 1;
    }

    std::cout << "Pigeonhole server running at http://localhost:8080/api/simulate\n";

    while (true) {
        SOCKET client = accept(server, nullptr, nullptr);
        if (client == INVALID_SOCKET) continue;

        char buffer[4096]{};
        const int received = recv(client, buffer, sizeof(buffer) - 1, 0);
        const std::string request(buffer, received > 0 ? received : 0);

        if (request.rfind("GET /api/simulate", 0) == 0) {
            const auto parameters = parseQueryParameters(request);
            int objects = getIntParam(parameters, "objects", 8);
            int boxes = getIntParam(parameters, "boxes", 5);

            SimulationResult result = runSimulation(objects, boxes);
            sendHttpResponse(client, "200 OK", serializeToJson(result));
        } else {
            sendHttpResponse(client, "404 Not Found", "{\"error\":\"Not found\"}");
        }

        closesocket(client);
    }

    closesocket(server);
    WSACleanup();
    return 0;
}
