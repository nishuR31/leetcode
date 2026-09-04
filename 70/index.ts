import benchmark from "../util/performance";

const map = new Map<number, number>([
    [0, 1],
    [1, 1],
    [2, 2]
])
function climbStairs(n: number): number {
    if (n < 0) {
        return 0;
    }
    if (map.has(n)) { return map.get(n)! }
    map.set(n, climbStairs(n - 1) + climbStairs(n - 2));
    return map.get(n)!;
};

benchmark(70, "climbStairs", climbStairs, [[2], [12], [23], [55]])