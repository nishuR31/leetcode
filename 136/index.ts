import benchmark from "../util/performance"

function singleNumber(nums: number[]): number {
    return nums.reduce((acc, ini) => acc ^ ini, 0)
};


benchmark(136, "singleNumber", singleNumber, [[[4, 1, 2, 1, 2]]])