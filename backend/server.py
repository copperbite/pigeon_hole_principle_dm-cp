#!/usr/bin/env python3
"""
Pigeonhole Lab - High Performance REST API Microservice
Implements all discrete mathematics and algorithms endpoints for Pigeonhole Lab.
Matches backend/main.cpp C++ API specifications exactly.
"""

import sys
import time
import math
import random
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class PigeonholeHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Concise logging
        sys.stderr.write(f"[API] {args[0]} {args[1]} -> {args[2]}\n")

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _send_json_success(self, data, elapsed_ms=0.0):
        body = json.dumps({
            "ok": True,
            "data": data,
            "meta": {
                "elapsedMs": round(elapsed_ms, 3)
            }
        }).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_json_error(self, status_code, code, message):
        body = json.dumps({
            "ok": False,
            "error": {
                "code": code,
                "message": message
            }
        }).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        start_time = time.perf_counter()
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        def get_int(name, default):
            if name in params and params[name]:
                return int(params[name][0])
            return default

        def get_float(name, default):
            if name in params and params[name]:
                return float(params[name][0])
            return default

        def get_str(name, default):
            if name in params and params[name]:
                return params[name][0]
            return default

        try:
            # 1. Health check
            if path == "/api/health":
                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "status": "healthy",
                    "version": "1.0.0",
                    "service": "Pigeonhole Lab C++ Backend"
                }, elapsed)

            # 2. Core simulate (/api/simulate and /api/core/simulate)
            elif path in ("/api/simulate", "/api/core/simulate"):
                objects = max(1, min(get_int("objects", 8), 1000))
                boxes = max(1, min(get_int("boxes", 5), 100))
                strategy = get_str("strategy", "round-robin")
                seed = get_int("seed", 42)

                assignments = []
                box_counts = [0] * boxes

                if strategy == "random":
                    rng = random.Random(seed)
                    for _ in range(objects):
                        b = rng.randint(0, boxes - 1)
                        assignments.append(b)
                        box_counts[b] += 1
                elif strategy == "adversarial":
                    for _ in range(objects):
                        min_b = 0
                        min_c = box_counts[0]
                        for b in range(1, boxes):
                            if box_counts[b] < min_c:
                                min_c = box_counts[b]
                                min_b = b
                        assignments.append(min_b)
                        box_counts[min_b] += 1
                else:  # round-robin modulo
                    for i in range(objects):
                        b = i % boxes
                        assignments.append(b)
                        box_counts[b] += 1

                guarantee = (objects + boxes - 1) // boxes
                max_occ = max(box_counts)
                collisions = sum(1 for c in box_counts if c > 1)

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "objects": objects,
                    "boxes": boxes,
                    "guarantee": guarantee,
                    "maxOccupancy": max_occ,
                    "collisionCount": collisions,
                    "hasCollision": max_occ > 1,
                    "assignments": assignments,
                    "boxCounts": box_counts,
                    "strategy": strategy
                }, elapsed)

            # 3. Exhaustive verify (/api/core/verify)
            elif path == "/api/core/verify":
                n = max(1, min(get_int("n", 4), 8))
                k = max(1, min(get_int("k", 3), 8))

                expected_min_max = (n + k - 1) // k
                total_mappings = k ** n
                observed_min_max = k + 10
                tightest_mapping = []

                # Odometer iteration
                current = [0] * n
                for _ in range(total_mappings):
                    counts = [0] * k
                    for val in current:
                        counts[val] += 1
                    max_occ = max(counts)
                    if max_occ < observed_min_max:
                        observed_min_max = max_occ
                        tightest_mapping = list(current)

                    for i in range(n - 1, -1, -1):
                        current[i] += 1
                        if current[i] < k:
                            break
                        current[i] = 0

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "n": n,
                    "k": k,
                    "totalMappings": total_mappings,
                    "countChecked": total_mappings,
                    "expectedMinMax": expected_min_max,
                    "observedMinMax": observed_min_max,
                    "theoremHolds": observed_min_max >= expected_min_max,
                    "tightestMapping": tightest_mapping
                }, elapsed)

            # 4. Minimum draws (/api/core/draws)
            elif path == "/api/core/draws":
                types = max(1, get_int("types", 3))
                r = max(1, get_int("r", 2))
                guaranteed_draws = types * (r - 1) + 1
                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "types": types,
                    "r": r,
                    "guaranteedDraws": guaranteed_draws,
                    "formula": "k * (r - 1) + 1"
                }, elapsed)

            # 5. Hash comparison (/api/hash/compare)
            elif path == "/api/hash/compare":
                num_keys = max(1, min(get_int("keys", 20), 500))
                buckets = max(2, min(get_int("buckets", 10), 100))
                strategy = get_str("strategy", "modulo")
                pattern = get_str("pattern", "sequential")

                keys = []
                if pattern == "multiples_10":
                    keys = [(i + 1) * 10 for i in range(num_keys)]
                elif pattern == "multiples_k":
                    keys = [(i + 1) * buckets for i in range(num_keys)]
                elif pattern == "random":
                    seed_val = 1337
                    for _ in range(num_keys):
                        seed_val = (seed_val * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
                        keys.append((seed_val >> 32) % 100000)
                else:
                    keys = [i + 1 for i in range(num_keys)]

                def hash_key(k):
                    if strategy == "knuth":
                        A = 0.618033988749895
                        val = k * A
                        frac = val - math.floor(val)
                        return int(math.floor(buckets * frac)) % buckets
                    elif strategy == "prng":
                        z = (k + 0x9e3779b97f4a7c15) & 0xFFFFFFFFFFFFFFFF
                        z = ((z ^ (z >> 30)) * 0xbf58476d1ce4e5b9) & 0xFFFFFFFFFFFFFFFF
                        z = ((z ^ (z >> 27)) * 0x94d049bb133111eb) & 0xFFFFFFFFFFFFFFFF
                        z = z ^ (z >> 31)
                        return z % buckets
                    else:
                        r = k % buckets
                        return (r + buckets) % buckets

                chains = [[] for _ in range(buckets)]
                for k in keys:
                    chains[hash_key(k)].append(k)

                open_table = [-1] * buckets
                total_probes = 0
                inserted_open = 0

                for k in keys:
                    if inserted_open >= buckets:
                        break
                    base_slot = hash_key(k)
                    slot = base_slot
                    probes = 0
                    while open_table[slot] != -1 and probes < buckets:
                        probes += 1
                        slot = (slot + 1) % buckets
                    if open_table[slot] == -1:
                        open_table[slot] = k
                        inserted_open += 1
                        total_probes += (probes + 1)

                sizes = [len(c) for c in chains]
                max_chain = max(sizes) if sizes else 0
                empty_count = sum(1 for sz in sizes if sz == 0)
                collision_buckets = sum(1 for sz in sizes if sz > 1)
                expected_per_bucket = num_keys / buckets
                chi_square = sum(((sz - expected_per_bucket) ** 2) / (expected_per_bucket or 1.0) for sz in sizes)
                total_chain_probes = sum((sz * (sz + 1)) // 2 for sz in sizes)

                avg_chaining_cost = (total_chain_probes / num_keys) if num_keys > 0 else 1.0
                avg_open_cost = (total_probes / inserted_open) if inserted_open > 0 else 1.0

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "buckets": buckets,
                    "totalKeys": num_keys,
                    "loadFactor": num_keys / buckets,
                    "longestChain": max_chain,
                    "emptyBuckets": empty_count,
                    "collidingBuckets": collision_buckets,
                    "chiSquare": chi_square,
                    "expectedCollidingPairs": (num_keys * (num_keys - 1)) / (2.0 * buckets),
                    "avgChainingLookupCost": avg_chaining_cost,
                    "avgLinearProbingLookupCost": avg_open_cost,
                    "bucketSizes": sizes,
                    "openAddressingTable": open_table,
                    "strategy": strategy,
                    "pattern": pattern
                }, elapsed)

            # 6. Divisible subsequence (/api/divisible/solve)
            elif path == "/api/divisible/solve":
                numbers = [4, 7, 2, 9, 3]
                if "numbers" in params and params["numbers"]:
                    raw = params["numbers"][0]
                    try:
                        numbers = [int(x.strip()) for x in raw.split(",") if x.strip()]
                    except Exception:
                        pass
                if not numbers:
                    numbers = [4, 7, 2, 9, 3]

                n = len(numbers)
                prefix_sums = [0] * (n + 1)
                residues = [0] * (n + 1)
                for i in range(n):
                    prefix_sums[i + 1] = prefix_sums[i] + numbers[i]
                    r = prefix_sums[i + 1] % n
                    if r < 0:
                        r += n
                    residues[i + 1] = r

                seen_at = {0: 0}
                u, v = -1, -1
                for i in range(1, n + 1):
                    r = residues[i]
                    if r in seen_at:
                        u = seen_at[r]
                        v = i
                        break
                    seen_at[r] = i

                block = numbers[u:v] if u != -1 else []
                block_sum = sum(block)

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "n": n,
                    "numbers": numbers,
                    "prefixSums": prefix_sums,
                    "residues": residues,
                    "collisionResidue": residues[v] if v != -1 else 0,
                    "startPrefixIndex": u,
                    "endPrefixIndex": v,
                    "startIndex": u,
                    "endIndex": v - 1,
                    "block": block,
                    "blockSum": block_sum,
                    "isDivisible": (block_sum % n == 0) if n > 0 else True
                }, elapsed)

            # 7. Dirichlet approximation (/api/dirichlet/solve)
            elif path == "/api/dirichlet/solve":
                alpha = get_float("alpha", 3.141592653589793)
                N = max(1, min(get_int("N", 10), 10000))

                fractional_parts = []
                bucket_assignments = []
                for q in range(N + 1):
                    prod = q * alpha
                    frac = prod - math.floor(prod)
                    if frac >= 1.0:
                        frac = 0.999999999999999
                    fractional_parts.append(frac)
                    b = min(int(math.floor(frac * N)), N - 1)
                    bucket_assignments.append(b)

                sorted_pts = sorted([(fractional_parts[q], q) for q in range(N + 1)], key=lambda x: x[0])
                min_diff = 2.0
                best_q1, best_q2 = 0, 1
                for i in range(len(sorted_pts) - 1):
                    diff = sorted_pts[i + 1][0] - sorted_pts[i][0]
                    if diff < min_diff and sorted_pts[i][1] != sorted_pts[i + 1][1]:
                        min_diff = diff
                        best_q1 = sorted_pts[i][1]
                        best_q2 = sorted_pts[i + 1][1]

                q = abs(best_q2 - best_q1)
                p = round(q * alpha)
                err = abs(q * alpha - p)
                bound = 1.0 / N
                quad_bound = 1.0 / (q * q) if q > 0 else 1.0

                step = max(1, N // 50)
                sample_fractional = [
                    {"q": i, "frac": fractional_parts[i], "bucket": bucket_assignments[i]}
                    for i in range(0, N + 1, step)
                ]

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "alpha": alpha,
                    "N": N,
                    "q": q,
                    "p": p,
                    "q1": best_q1,
                    "q2": best_q2,
                    "fraction": f"{p}/{q}",
                    "approxValue": (p / q) if q > 0 else 0,
                    "absoluteError": err,
                    "bucketThreshold": bound,
                    "quadraticBound": quad_bound,
                    "satisfiesDirichlet": err < bound,
                    "sampleFractional": sample_fractional
                }, elapsed)

            # 8. Birthday paradox (/api/birthday/compute)
            elif path == "/api/birthday/compute":
                n = max(1, min(get_int("n", 23), 500))
                k = max(2, min(get_int("k", 365), 10000))
                trials = max(100, min(get_int("trials", 10000), 500000))
                seed = get_int("seed", 42)

                if n > k:
                    exact_p = 1.0
                else:
                    ln_no_collision = sum(math.log(1.0 - i / k) for i in range(n))
                    exact_p = 1.0 - math.exp(ln_no_collision)

                exp_approx = 1.0 - math.exp(-n * (n - 1) / (2.0 * k))
                expected_pairs = (n * (n - 1)) / (2.0 * k)

                rng = random.Random(seed)
                collisions_obs = 0
                for _ in range(trials):
                    seen = set()
                    for _ in range(n):
                        b = rng.randint(0, k - 1)
                        if b in seen:
                            collisions_obs += 1
                            break
                        seen.add(b)

                simulated_p = collisions_obs / trials

                curve = []
                max_curve_n = min(k + 2, 70)
                for i in range(1, max_curve_n + 1):
                    if i > k:
                        prob = 1.0
                    else:
                        lnc = sum(math.log(1.0 - j / k) for j in range(i))
                        prob = 1.0 - math.exp(lnc)
                    curve.append({
                        "n": i,
                        "exact": prob,
                        "approx": 1.0 - math.exp(-i * (i - 1) / (2.0 * k))
                    })

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "n": n,
                    "k": k,
                    "exactProbability": exact_p,
                    "exponentialApprox": exp_approx,
                    "simulatedProbability": simulated_p,
                    "expectedPairs": expected_pairs,
                    "trialsRun": trials,
                    "ruleOfThumb50": 1.1774 * math.sqrt(k),
                    "pigeonholeCertaintyN": k + 1,
                    "curve": curve
                }, elapsed)

            # 9. Erdős-Szekeres (/api/erdos/solve)
            elif path == "/api/erdos/solve":
                m = get_int("m", 3)
                n_val = get_int("n", 3)
                target_len = min(m * n_val + 1, 100)

                seq = []
                if "sequence" in params and params["sequence"]:
                    raw = params["sequence"][0]
                    try:
                        seq = [float(x.strip()) for x in raw.split(",") if x.strip()]
                    except Exception:
                        pass

                if len(seq) != target_len:
                    seq = list(range(1, target_len + 1))
                    random.Random(42).shuffle(seq)

                N_len = len(seq)
                L = [1] * N_len
                D = [1] * N_len
                parent_inc = [-1] * N_len
                parent_dec = [-1] * N_len

                best_inc_idx, max_inc = 0, 1
                best_dec_idx, max_dec = 0, 1

                for i in range(N_len):
                    for j in range(i):
                        if seq[j] < seq[i] and L[j] + 1 > L[i]:
                            L[i] = L[j] + 1
                            parent_inc[i] = j
                        if seq[j] > seq[i] and D[j] + 1 > D[i]:
                            D[i] = D[j] + 1
                            parent_dec[i] = j
                    if L[i] > max_inc:
                        max_inc = L[i]
                        best_inc_idx = i
                    if D[i] > max_dec:
                        max_dec = D[i]
                        best_dec_idx = i

                inc_indices = []
                curr = best_inc_idx
                while curr != -1:
                    inc_indices.append(curr)
                    curr = parent_inc[curr]
                inc_indices.reverse()

                dec_indices = []
                curr = best_dec_idx
                while curr != -1:
                    dec_indices.append(curr)
                    curr = parent_dec[curr]
                dec_indices.reverse()

                pairs = [{"index": i, "value": seq[i], "L": L[i], "D": D[i]} for i in range(N_len)]

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "m": m,
                    "n": n_val,
                    "targetLength": target_len,
                    "sequence": seq,
                    "pairs": pairs,
                    "maxInc": max_inc,
                    "maxDec": max_dec,
                    "hasIncreasingTarget": max_inc >= m + 1,
                    "hasDecreasingTarget": max_dec >= n_val + 1,
                    "incIndices": inc_indices,
                    "decIndices": dec_indices,
                    "theoremHolds": (max_inc >= m + 1) or (max_dec >= n_val + 1)
                }, elapsed)

            # 10. Ramsey verification (/api/ramsey/verify)
            elif path == "/api/ramsey/verify":
                size = get_int("size", 6)
                if size == 5:
                    edges = [(i, j) for i in range(5) for j in range(i + 1, 5)]
                    valid_mask = -1
                    for mask in range(1024):
                        has_mono = False
                        for i in range(5):
                            for j in range(i + 1, 5):
                                for k in range(j + 1, 5):
                                    c1 = (mask >> edges.index((i, j))) & 1
                                    c2 = (mask >> edges.index((j, k))) & 1
                                    c3 = (mask >> edges.index((i, k))) & 1
                                    if c1 == c2 == c3:
                                        has_mono = True
                                        break
                                if has_mono:
                                    break
                            if has_mono:
                                break
                        if not has_mono:
                            valid_mask = mask
                            break

                    edge_colors = [(valid_mask >> e) & 1 for e in range(10)]
                    elapsed = (time.perf_counter() - start_time) * 1000
                    return self._send_json_success({
                        "size": 5,
                        "totalColorings": 1024,
                        "counterexampleFound": valid_mask != -1,
                        "counterexampleMask": valid_mask,
                        "edgeColors": edge_colors,
                        "explanation": "In K5, a red regular pentagon with a blue internal pentagram contains ZERO monochromatic triangles."
                    }, elapsed)
                else:
                    edges = [(i, j) for i in range(6) for j in range(i + 1, 6)]
                    triangles = []
                    for i in range(6):
                        for j in range(i + 1, 6):
                            for k in range(j + 1, 6):
                                e1 = edges.index((i, j))
                                e2 = edges.index((j, k))
                                e3 = edges.index((i, k))
                                triangles.append((e1, e2, e3))

                    mono_count = 0
                    min_tri = 20
                    for mask in range(32768):
                        mono_in_mask = 0
                        for e1, e2, e3 in triangles:
                            c1 = (mask >> e1) & 1
                            c2 = (mask >> e2) & 1
                            c3 = (mask >> e3) & 1
                            if c1 == c2 == c3:
                                mono_in_mask += 1
                        if mono_in_mask > 0:
                            mono_count += 1
                        if mono_in_mask < min_tri:
                            min_tri = mono_in_mask

                    elapsed = (time.perf_counter() - start_time) * 1000
                    return self._send_json_success({
                        "size": 6,
                        "totalColorings": 32768,
                        "coloringsWithMonochromaticTriangle": mono_count,
                        "allContainMonoTriangle": mono_count == 32768,
                        "minMonochromaticTrianglesPerColoring": min_tri,
                        "theoremVerified": mono_count == 32768
                    }, elapsed)

            # 11. Ramsey check (/api/ramsey/check)
            elif path == "/api/ramsey/check":
                n_nodes = get_int("n", 6)
                colors = []
                if "colors" in params and params["colors"]:
                    colors = [int(x.strip()) for x in params["colors"][0].split(",") if x.strip()]

                edges = [(i, j) for i in range(n_nodes) for j in range(i + 1, n_nodes)]
                edge_map = {e: colors[idx] for idx, e in enumerate(edges) if idx < len(colors)}

                mono_triangles = []
                for i in range(n_nodes):
                    for j in range(i + 1, n_nodes):
                        for k in range(j + 1, n_nodes):
                            c1 = edge_map.get((i, j))
                            c2 = edge_map.get((j, k))
                            c3 = edge_map.get((i, k))
                            if c1 is not None and c1 == c2 == c3:
                                mono_triangles.append({
                                    "vertices": [i, j, k],
                                    "color": c1
                                })

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "monochromaticTriangles": mono_triangles,
                    "count": len(mono_triangles)
                }, elapsed)

            # 12. Degree random (/api/degree/random)
            elif path == "/api/degree/random":
                n = max(2, min(get_int("n", 6), 20))
                p = max(0.0, min(get_float("p", 0.5), 1.0))
                seed = get_int("seed", 42)

                rng = random.Random(seed)
                degrees = [0] * n
                edges = []

                for i in range(n):
                    for j in range(i + 1, n):
                        if rng.random() < p:
                            degrees[i] += 1
                            degrees[j] += 1
                            edges.append({"source": i, "target": j})

                deg_pos = {}
                v1, v2 = -1, -1
                for i, d in enumerate(degrees):
                    if d in deg_pos:
                        v1 = deg_pos[d]
                        v2 = i
                        break
                    deg_pos[d] = i

                deg_sum = sum(degrees)
                odd_count = sum(1 for d in degrees if d % 2 != 0)

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "n": n,
                    "edges": edges,
                    "degrees": degrees,
                    "totalEdges": len(edges),
                    "degreeSum": deg_sum,
                    "handshakingVerified": deg_sum == 2 * len(edges),
                    "oddDegreeCountIsEven": odd_count % 2 == 0,
                    "collidingVertex1": v1,
                    "collidingVertex2": v2,
                    "sharedDegree": degrees[v1] if v1 != -1 else -1
                }, elapsed)

            # 13. Havel-Hakimi (/api/degree/havelhakimi)
            elif path == "/api/degree/havelhakimi":
                seq = [3, 3, 2, 2, 2]
                if "sequence" in params and params["sequence"]:
                    try:
                        seq = [int(x.strip()) for x in params["sequence"][0].split(",") if x.strip()]
                    except Exception:
                        pass

                steps = []
                labeled = [[deg, i] for i, deg in enumerate(seq)]
                is_graphic = True
                edges = []

                while True:
                    labeled.sort(key=lambda x: x[0], reverse=True)
                    step_seq = [item[0] for item in labeled]

                    all_zero = all(item[0] == 0 for item in labeled)
                    has_neg = any(item[0] < 0 for item in labeled)
                    if has_neg:
                        is_graphic = False
                        break

                    steps.append({
                        "sequence": step_seq,
                        "action": "All degrees zero: GRAPHIC!" if all_zero else "Remove largest degree d"
                    })

                    if all_zero:
                        break

                    d, u = labeled.pop(0)
                    if d > len(labeled):
                        is_graphic = False
                        break

                    for i in range(d):
                        labeled[i][0] -= 1
                        if labeled[i][0] < 0:
                            is_graphic = False
                            break
                        edges.append({"source": u, "target": labeled[i][1]})

                    if not is_graphic:
                        break

                elapsed = (time.perf_counter() - start_time) * 1000
                return self._send_json_success({
                    "originalSequence": seq,
                    "isGraphic": is_graphic,
                    "steps": steps,
                    "edges": edges
                }, elapsed)

            else:
                return self._send_json_error(404, "NOT_FOUND", f"Endpoint {path} not found")

        except Exception as e:
            elapsed = (time.perf_counter() - start_time) * 1000
            return self._send_json_error(500, "INTERNAL_ERROR", str(e))

def run_server(port=8080):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, PigeonholeHandler)
    print(f"====================================================")
    print(f" Pigeonhole Lab Backend Server Starting on port {port}")
    print(f" Health:   http://localhost:{port}/api/health")
    print(f" Simulate: http://localhost:{port}/api/core/simulate")
    print(f" Hash:     http://localhost:{port}/api/hash/compare")
    print(f"====================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.")
        httpd.server_close()

if __name__ == "__main__":
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)
