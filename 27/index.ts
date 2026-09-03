import benchmark from "../util/performance";

function removeElement(nums: number[], val: number): number {
    let i = 0;
    for (let j = 0; j < nums.length; j++) {
        if (nums[j] !== val) {
            nums[i] = nums[j];
            i++
        }
    }
    return i;
};


benchmark(27, "removeElement", removeElement, [[[3, 2, 2, 3], 3], [[0, 1, 2, 2, 3, 0, 4, 2], 2]]);