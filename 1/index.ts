import benchmark from "../util/performance";

function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i]!;

        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }

        map.set(nums[i]!, i);
    }

    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));

benchmark(1, "twoSum", twoSum, [[[2, 7, 11, 15], 9]]);
