import benchmark from "../util/performance";

function myPow(x: number, n: number): number {

    if (n === 0) { return 1; };
    if (x === 1) { return 1; };
    if (n < 0) {
        return 1 / myPow(x, -n);
    }
    let max = myPow(x, Math.floor(n / 2));
    if (n & 1) { x = max * max * x }
    else { x = max * max };
    return x;

};

benchmark(50, "myPow", myPow, [[2, 4], [3, 6], [34, 54]]);