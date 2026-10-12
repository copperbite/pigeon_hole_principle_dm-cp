# Pigeonhole Lab: REST API Specification & Developer Guide

The Pigeonhole Lab server is a high-performance C++17 microservice listening by default on port `8080`. All request payloads and response bodies adhere to JSON schemas with standard CORS headers (`Access-Control-Allow-Origin: *`).

---

## Base URL & General Headers

```
http://localhost:8080/api
```

- **Content-Type**: `application/json`
- **Error Format**:
  ```json
  {
    "ok": false,
    "error": {
      "code": 400,
      "message": "Detailed error explanation"
    }
  }
  ```

---

## Endpoints Index

### 1. System Health
- **`GET /api/health`**
  - **Description**: Returns server uptime, status, and compilation features.
  - **Curl**:
    ```bash
    curl -X GET http://localhost:8080/api/health
    ```
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "status": "online",
      "version": "1.0.0",
      "engine": "C++17 Pigeonhole Lab Server"
    }
    ```

---

### 2. Core Pigeonhole Operations
- **`GET /api/core/simulate`**
  - **Query Parameters**:
    - `pigeons` (integer, default: 8): Number of items to place.
    - `holes` (integer, default: 5): Number of boxes.
    - `strategy` (string: `random`, `round_robin`, `adversarial`, default: `random`).
    - `seed` (integer, optional): Seed for PRNG reproducibility.
  - **Curl**:
    ```bash
    curl -X GET "http://localhost:8080/api/core/simulate?pigeons=10&holes=4&strategy=adversarial"
    ```
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "pigeons": 10,
      "holes": 4,
      "strategy": "adversarial",
      "ceilingBound": 3,
      "counts": [3, 3, 2, 2],
      "maxCount": 3,
      "hasCollision": true,
      "collisionHoles": [0, 1]
    }
    ```

- **`POST /api/core/verify`**
  - **Description**: Exhaustive search over all $k^n$ mappings to verify the Pigeonhole Principle.
  - **Body**:
    ```json
    { "pigeons": 4, "holes": 3 }
    ```
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "totalConfigurations": 81,
      "validPigeonholeCount": 81,
      "counterexamplesFound": 0,
      "verified": true,
      "timeElapsedMs": 0.12
    }
    ```

- **`GET /api/core/draws`**
  - **Description**: Calculates worst-case minimum draws using formula $k(r - 1) + 1$.
  - **Query Parameters**:
    - `categories` (integer): Number of distinct types/colors ($k$).
    - `target` (integer): Required count of matching items ($r$).
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "categories": 4,
      "target": 3,
      "worstCaseDraws": 9,
      "formula": "k * (r - 1) + 1"
    }
    ```

---

### 3. Number Theory & Probabilistic Endpoints

- **`POST /api/divisible/solve`**
  - **Description**: Solves the Divisible Subsequence problem via prefix sum residues.
  - **Body**:
    ```json
    { "numbers": [4, 7, 2, 9, 3] }
    ```
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "n": 5,
      "prefixSums": [0, 4, 11, 13, 22, 25],
      "residues": [0, 4, 1, 3, 2, 0],
      "match": { "startIndex": 0, "endIndex": 5 },
      "subsequence": [4, 7, 2, 9, 3],
      "subsequenceSum": 25,
      "isDivisible": true
    }
    ```

- **`GET /api/dirichlet/solve`**
  - **Description**: Computes Dirichlet approximation rational bound for real $\alpha$ and bound $N$.
  - **Query Parameters**:
    - `alpha` (float, e.g., `3.1415926535`).
    - `n` (integer, e.g., `10`).
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "alpha": 3.1415926535,
      "N": 10,
      "bestQ": 7,
      "bestP": 22,
      "approxValue": 3.1428571428,
      "absError": 0.0012644893,
      "bound": 0.01
    }
    ```

- **`GET /api/birthday/compute`**
  - **Query Parameters**:
    - `n` (integer): Number of people.
    - `days` (integer, default: 365): Number of possible days in year.
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "people": 23,
      "days": 365,
      "exactProbability": 0.507297,
      "approxProbability": 0.500001,
      "phpGuaranteedAt": 366
    }
    ```

---

### 4. Combinatorics, Sequences & Graphs

- **`POST /api/erdos/solve`**
  - **Description**: $O(n^2)$ Dynamic programming finding $(L_i, D_i)$ pairs and longest monotonic sequences.
  - **Body**:
    ```json
    { "sequence": [3, 1, 4, 1, 5, 9, 2, 6, 5] }
    ```
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "pairs": [
        {"val": 3, "L": 1, "D": 1},
        {"val": 1, "L": 1, "D": 2},
        {"val": 4, "L": 2, "D": 1}
      ],
      "longestIncreasing": [1, 4, 5, 9],
      "longestDecreasing": [4, 2]
    }
    ```

- **`GET /api/ramsey/verify`**
  - **Description**: Exhaustive verification of all $2^{15} = 32,768$ 2-colorings of $K_6$.
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "totalColorings": 32768,
      "allHaveMonochromaticTriangle": true,
      "minTrianglesFound": 2,
      "ramseyBoundConfirmed": true
    }
    ```

- **`POST /api/hall/match`**
  - **Description**: Executes Kuhn's bipartite matching algorithm and returns matches or Hall violator subset $S$.
  - **Body**:
    ```json
    {
      "boysCount": 4,
      "girlsCount": 4,
      "edges": [[0,0], [0,1], [1,1], [2,1], [3,2]]
    }
    ```
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "isPerfectMatching": false,
      "matchingSize": 3,
      "matching": [[0, 0], [1, 1], [3, 2]],
      "hallViolator": {
        "S": [0, 1, 2],
        "sizeS": 3,
        "NS": [0, 1],
        "sizeNS": 2,
        "violated": true
      }
    }
    ```

---

### 5. Sorting & Benchmark Endpoints

- **`POST /api/sort/pigeonhole`**
  - **Description**: Runs Pigeonhole Sort vs `std::sort` and reports operation metrics.
  - **Body**:
    ```json
    { "array": [14, 3, 2, 19, 14, 5, 2] }
    ```
  - **Response 200 OK**:
    ```json
    {
      "ok": true,
      "sorted": [2, 2, 3, 5, 14, 14, 19],
      "min": 2,
      "max": 19,
      "range": 18,
      "timePigeonholeUs": 1.4,
      "timeStdSortUs": 2.1
    }
    ```
