import benchmark from "../util/performance";
function plusOne(digits: number[]): number[] {
    for (let i = digits.length - 1; i >= 0; i--) {

        if (digits[i]! < 9) {
            digits[i]!++;
            return digits;
        }

        digits[i] = 0;
    }

    digits.unshift(1);

    return digits;
}


benchmark(66, "plusOne", plusOne, [[[7, 9, 6, 9]], [[9, 9, 9]], [[4, 8, 9]], [[2, 7, 6]]])