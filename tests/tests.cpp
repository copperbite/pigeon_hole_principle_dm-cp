#include <iostream>
#include <cassert>
#include <vector>
#include <cmath>
#include <random>
#include "../backend/modules/core.hpp"
#include "../backend/modules/hashing.hpp"
#include "../backend/modules/number_theory.hpp"
#include "../backend/modules/birthday.hpp"
#include "../backend/modules/sequences_graphs.hpp"

void testCeilFormula() {
    std::cout << "[TEST] Testing ceiling guarantee formula [n/k]...\n";
    PigeonholeTable t1(8, 5);
    assert(t1.getTheoreticalGuarantee() == 2);
    PigeonholeTable t2(10, 5);
    assert(t2.getTheoreticalGuarantee() == 2);
    PigeonholeTable t3(11, 5);
    assert(t3.getTheoreticalGuarantee() == 3);
    PigeonholeTable t4(7, 1);
    assert(t4.getTheoreticalGuarantee() == 7);
    PigeonholeTable t5(3, 5);
    assert(t5.getTheoreticalGuarantee() == 1);
    PigeonholeTable t6(0, 5);
    assert(t6.getTheoreticalGuarantee() == 0);
    std::cout << "  -> PASS: All ceiling guarantee tests passed.\n";
}

void testExhaustiveVerifier() {
    std::cout << "[TEST] Testing exhaustive verifier for all n, k <= 4...\n";
    for (int n = 1; n <= 4; ++n) {
        for (int k = 1; k <= 4; ++k) {
            json result = CoreModule::exhaustiveVerify(n, k);
            int expected = (n + k - 1) / k;
            int observed = result["observedMinMax"];
            assert(observed == expected);
            assert(result["theoremHolds"] == true);
        }
    }
    std::cout << "  -> PASS: Exhaustive verifier verified against ceil(n/k) for all combinations.\n";
}

void testDirichletApproximation() {
    std::cout << "[TEST] Testing Dirichlet's Approximation Theorem...\n";
    std::vector<double> alphas = {3.141592653589793, 1.414213562373095, 2.718281828459045, 1.618033988749895};
    std::vector<int> Ns = {10, 50, 100, 500, 1000};

    for (double a : alphas) {
        for (int N : Ns) {
            json res = NumberTheoryModule::solveDirichlet(a, N);
            assert(res["satisfiesDirichlet"] == true);
            double err = res["absoluteError"];
            double bound = res["bucketThreshold"];
            assert(err < bound);
            int q = res["q"];
            assert(q >= 1 && q <= N);
        }
    }
    std::cout << "  -> PASS: Dirichlet condition |q*alpha - p| < 1/N satisfied for all constants and N up to 1000.\n";
}

void testDivisibleSubsequence() {
    std::cout << "[TEST] Testing Divisible Subsequence on 1,000 random arrays...\n";
    std::mt19937_64 rng(12345);
    std::uniform_int_distribution<int> valDist(-1000, 1000);
    std::uniform_int_distribution<int> lenDist(2, 25);

    for (int trial = 0; trial < 1000; ++trial) {
        int n = lenDist(rng);
        std::vector<int> nums(n);
        for (int i = 0; i < n; ++i) nums[i] = valDist(rng);

        json res = NumberTheoryModule::solveDivisibleSubsequence(nums);
        assert(res["isDivisible"] == true);
        int sum = res["blockSum"];
        assert(sum % n == 0);
    }
    std::cout << "  -> PASS: Divisible consecutive block verified on 1,000 random arrays.\n";
}

void testBirthdayParadox() {
    std::cout << "[TEST] Testing Birthday Paradox calculations...\n";
    json b23 = BirthdayModule::computeBirthday(23, 365, 5000);
    double p23 = b23["exactProbability"];
    assert(p23 > 0.50 && p23 < 0.51);

    json b366 = BirthdayModule::computeBirthday(366, 365, 100);
    double p366 = b366["exactProbability"];
    assert(p366 == 1.0);
    assert(b366["pigeonholeCertaintyN"] == 366);

    std::cout << "  -> PASS: Birthday exact probability 0.5073 at n=23 and 1.0 at n=k+1 verified.\n";
}

void testErdosSzekeres() {
    std::cout << "[TEST] Testing Erdős-Szekeres Monotone Subsequence Theorem...\n";
    for (int m = 1; m <= 4; ++m) {
        for (int n = 1; n <= 4; ++n) {
            json res = SequencesGraphsModule::solveErdosSzekeres(m, n);
            assert(res["theoremHolds"] == true);
            int incLen = res["maxInc"];
            int decLen = res["maxDec"];
            assert(incLen >= m + 1 || decLen >= n + 1);
        }
    }
    std::cout << "  -> PASS: Erdős-Szekeres bounds verified for all (m,n) <= 4.\n";
}

void testRamseyK6() {
    std::cout << "[TEST] Testing Ramsey Theory R(3,3)=6 verification...\n";
    json res = SequencesGraphsModule::verifyRamsey(6);
    assert(res["theoremVerified"] == true);
    assert(res["allContainMonoTriangle"] == true);
    assert(res["totalColorings"] == 32768);
    std::cout << "  -> PASS: Ramsey K6 all 32,768 colorings contain monochromatic triangle.\n";
}

int main() {
    std::cout << "========================================\n";
    std::cout << " RUNNING PIGEONHOLE LAB UNIT TESTS (FULL)\n";
    std::cout << "========================================\n";

    testCeilFormula();
    testExhaustiveVerifier();
    testDirichletApproximation();
    testDivisibleSubsequence();
    testBirthdayParadox();
    testErdosSzekeres();
    testRamseyK6();

    std::cout << "\n========================================\n";
    std::cout << " ALL UNIT TESTS PASSED SUCCESSFULLY! (100%)\n";
    std::cout << "========================================\n";
    return 0;
}
