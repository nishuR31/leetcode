import benchmark from "../util/performance";

function removeDuplicates(nums: number[]): number {
    let i = 0; let j = 1;

    while (j < nums.length) {
        if (nums[i] === nums[j]) {
            j++;
        } else {
            i++;
            (nums)[i] = nums[j];
            j++;
        }
    }

    return i + 1;
}


benchmark(26, "removeDuplicates", removeDuplicates, [[[1, 1, 2, 2]], [[1, 2, 2, 3, 3]]]);
