#define WIN32_LEAN_AND_MEAN
#include <iostream>
#include <chrono>
#include <string>
#include <vector>
#include "third_party/httplib.h"
#include "third_party/json.hpp"
#include "modules/core.hpp"
#include "modules/hashing.hpp"
#include "modules/number_theory.hpp"
#include "modules/birthday.hpp"
#include "modules/sequences_graphs.hpp"

using json = nlohmann::json;

// Standard JSON response envelope
void sendJsonSuccess(httplib::Response& res, const json& data, double elapsedMs = 0.0) {
    json response = {
        {"ok", true},
        {"data", data},
        {"meta", {
            {"elapsedMs", elapsedMs}
        }}
    };
    res.set_content(response.dump(), "application/json");
    res.status = 200;
}

void sendJsonError(httplib::Response& res, int statusCode, const std::string& code, const std::string& message) {
    json response = {
        {"ok", false},
        {"error", {
            {"code", code},
            {"message", message}
        }}
    };
    res.set_content(response.dump(), "application/json");
    res.status = statusCode;
}

int main() {
    httplib::Server svr;

    // Default CORS headers
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type, Authorization"}
    });

    // Handle preflight OPTIONS requests
    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        res.status = 204;
    });

    // Health check
    svr.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        sendJsonSuccess(res, {
            {"status", "healthy"},
            {"version", "1.0.0"},
            {"service", "Pigeonhole Lab C++ Backend"}
        });
    });

    // Core simulation endpoint (/api/core/simulate and legacy /api/simulate)
    auto handleSimulate = [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int objects = 8;
        int boxes = 5;
        std::string strategy = "round-robin";
        uint64_t seed = 42;

        if (req.has_param("objects")) {
            try { objects = std::stoi(req.get_param_value("objects")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "objects must be an integer"); }
        }
        if (req.has_param("boxes")) {
            try { boxes = std::stoi(req.get_param_value("boxes")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "boxes must be an integer"); }
        }
        if (req.has_param("strategy")) {
            strategy = req.get_param_value("strategy");
        }
        if (req.has_param("seed")) {
            try { seed = std::stoull(req.get_param_value("seed")); }
            catch (...) { seed = 42; }
        }

        if (objects < 1 || objects > 1000) {
            return sendJsonError(res, 400, "RANGE_ERROR", "objects must be between 1 and 1000");
        }
        if (boxes < 1 || boxes > 100) {
            return sendJsonError(res, 400, "RANGE_ERROR", "boxes must be between 1 and 100");
        }

        json result = CoreModule::simulate(objects, boxes, strategy, seed);
        auto endTime = std::chrono::high_resolution_clock::now();
        double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
        sendJsonSuccess(res, result, elapsedMs);
    };

    svr.Get("/api/simulate", handleSimulate);
    svr.Get("/api/core/simulate", handleSimulate);

    // Exhaustive verifier
    svr.Get("/api/core/verify", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int n = 4;
        int k = 3;
        if (req.has_param("n")) {
            try { n = std::stoi(req.get_param_value("n")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "n must be an integer"); }
        }
        if (req.has_param("k")) {
            try { k = std::stoi(req.get_param_value("k")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "k must be an integer"); }
        }

        try {
            json result = CoreModule::exhaustiveVerify(n, k);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "VERIFICATION_ERROR", e.what());
        }
    });

    // Minimum draws / socks problem
    svr.Get("/api/core/draws", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int types = 3;
        int r = 2;
        if (req.has_param("types")) {
            try { types = std::stoi(req.get_param_value("types")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "types must be an integer"); }
        }
        if (req.has_param("r")) {
            try { r = std::stoi(req.get_param_value("r")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "r must be an integer"); }
        }

        try {
            json result = CoreModule::minimumDraws(types, r);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "PARAM_ERROR", e.what());
        }
    });

    // Hash comparison endpoint
    svr.Get("/api/hash/compare", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int keys = 20;
        int buckets = 10;
        std::string strategy = "modulo";
        std::string pattern = "sequential";

        if (req.has_param("keys")) {
            try { keys = std::stoi(req.get_param_value("keys")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "keys must be an integer"); }
        }
        if (req.has_param("buckets")) {
            try { buckets = std::stoi(req.get_param_value("buckets")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "buckets must be an integer"); }
        }
        if (req.has_param("strategy")) strategy = req.get_param_value("strategy");
        if (req.has_param("pattern")) pattern = req.get_param_value("pattern");

        try {
            json result = HashModule::analyzeHashing(keys, buckets, strategy, pattern);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "HASH_ERROR", e.what());
        }
    });

    // B3: Divisible Subsequence
    svr.Get("/api/divisible/solve", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        std::vector<int> numbers;

        if (req.has_param("numbers")) {
            std::stringstream ss(req.get_param_value("numbers"));
            std::string item;
            while (std::getline(ss, item, ',')) {
                try {
                    if (!item.empty()) numbers.push_back(std::stoi(item));
                } catch (...) {}
            }
        }
        if (numbers.empty()) {
            // Default 5 numbers
            numbers = {4, 7, 2, 9, 3};
        }

        try {
            json result = NumberTheoryModule::solveDivisibleSubsequence(numbers);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "DIVISIBLE_ERROR", e.what());
        }
    });

    // B2: Dirichlet Approximation
    svr.Get("/api/dirichlet/solve", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        double alpha = 3.141592653589793;
        int N = 10;

        if (req.has_param("alpha")) {
            try { alpha = std::stod(req.get_param_value("alpha")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "alpha must be a floating-point number"); }
        }
        if (req.has_param("N")) {
            try { N = std::stoi(req.get_param_value("N")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "N must be an integer"); }
        }

        try {
            json result = NumberTheoryModule::solveDirichlet(alpha, N);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "DIRICHLET_ERROR", e.what());
        }
    });

    // B4: Birthday Paradox
    svr.Get("/api/birthday/compute", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int n = 23;
        int k = 365;
        int trials = 10000;
        uint64_t seed = 42;

        if (req.has_param("n")) {
            try { n = std::stoi(req.get_param_value("n")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "n must be an integer"); }
        }
        if (req.has_param("k")) {
            try { k = std::stoi(req.get_param_value("k")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "k must be an integer"); }
        }
        if (req.has_param("trials")) {
            try { trials = std::stoi(req.get_param_value("trials")); }
            catch (...) {}
        }
        if (req.has_param("seed")) {
            try { seed = std::stoull(req.get_param_value("seed")); }
            catch (...) {}
        }

        try {
            json result = BirthdayModule::computeBirthday(n, k, trials, seed);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "BIRTHDAY_ERROR", e.what());
        }
    });

    // B1: Erdős-Szekeres Monotone Subsequence
    svr.Get("/api/erdos/solve", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int m = 3;
        int n = 3;
        if (req.has_param("m")) {
            try { m = std::stoi(req.get_param_value("m")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "m must be an integer"); }
        }
        if (req.has_param("n")) {
            try { n = std::stoi(req.get_param_value("n")); }
            catch (...) { return sendJsonError(res, 400, "INVALID_PARAM", "n must be an integer"); }
        }

        std::vector<double> sequence;
        if (req.has_param("sequence")) {
            std::stringstream ss(req.get_param_value("sequence"));
            std::string item;
            while (std::getline(ss, item, ',')) {
                try { if (!item.empty()) sequence.push_back(std::stod(item)); }
                catch (...) {}
            }
        }

        try {
            json result = SequencesGraphsModule::solveErdosSzekeres(m, n, sequence);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "ERDOS_ERROR", e.what());
        }
    });

    // B6: Ramsey Verification
    svr.Get("/api/ramsey/verify", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int size = 6;
        if (req.has_param("size")) {
            try { size = std::stoi(req.get_param_value("size")); }
            catch (...) { size = 6; }
        }

        try {
            json result = SequencesGraphsModule::verifyRamsey(size);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "RAMSEY_ERROR", e.what());
        }
    });

    // B6: Ramsey User Graph Check
    svr.Get("/api/ramsey/check", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int n = 6;
        std::vector<int> colors;
        if (req.has_param("n")) {
            try { n = std::stoi(req.get_param_value("n")); }
            catch (...) { n = 6; }
        }
        if (req.has_param("colors")) {
            std::stringstream ss(req.get_param_value("colors"));
            std::string item;
            while (std::getline(ss, item, ',')) {
                try { if (!item.empty()) colors.push_back(std::stoi(item)); }
                catch (...) {}
            }
        }

        try {
            json result = SequencesGraphsModule::checkUserRamsey(n, colors);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "RAMSEY_ERROR", e.what());
        }
    });

    // B7: Handshake / Random Graph with Equal Degrees
    svr.Get("/api/degree/random", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        int n = 6;
        double p = 0.5;
        uint64_t seed = 42;

        if (req.has_param("n")) {
            try { n = std::stoi(req.get_param_value("n")); }
            catch (...) { n = 6; }
        }
        if (req.has_param("p")) {
            try { p = std::stod(req.get_param_value("p")); }
            catch (...) { p = 0.5; }
        }
        if (req.has_param("seed")) {
            try { seed = std::stoull(req.get_param_value("seed")); }
            catch (...) { seed = 42; }
        }

        try {
            json result = SequencesGraphsModule::generateRandomGraph(n, p, seed);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "DEGREE_ERROR", e.what());
        }
    });

    // C1: Havel-Hakimi Graphic Sequence
    svr.Get("/api/degree/havelhakimi", [](const httplib::Request& req, httplib::Response& res) {
        auto startTime = std::chrono::high_resolution_clock::now();
        std::vector<int> sequence;

        if (req.has_param("sequence")) {
            std::stringstream ss(req.get_param_value("sequence"));
            std::string item;
            while (std::getline(ss, item, ',')) {
                try { if (!item.empty()) sequence.push_back(std::stoi(item)); }
                catch (...) {}
            }
        }
        if (sequence.empty()) {
            sequence = {3, 3, 2, 2, 2}; // default graphic sequence
        }

        try {
            json result = SequencesGraphsModule::solveHavelHakimi(sequence);
            auto endTime = std::chrono::high_resolution_clock::now();
            double elapsedMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();
            sendJsonSuccess(res, result, elapsedMs);
        } catch (const std::exception& e) {
            sendJsonError(res, 400, "HAVEL_HAKIMI_ERROR", e.what());
        }
    });

    std::cout << "====================================================\n";
    std::cout << " Pigeonhole Lab Backend Server Starting on port 8080\n";
    std::cout << " Health: http://localhost:8080/api/health\n";
    std::cout << " Simulate: http://localhost:8080/api/core/simulate\n";
    std::cout << " Hash: http://localhost:8080/api/hash/compare\n";
    std::cout << "====================================================\n";

    if (!svr.listen("127.0.0.1", 8080)) {
        std::cerr << "Failed to bind to 127.0.0.1:8080\n";
        return 1;
    }

    return 0;
}
