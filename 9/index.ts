import benchmark from '../util/performance';
function isPalindrome(num: number): boolean { //12321
    const copy: number = num;
    let digit: number = 0;
    let lastDigit: number;
    if (num < 0) return false;

    while (num > 0) {
        lastDigit = num % 10;
        digit = digit * 10 + lastDigit;
        num = Math.floor(num / 10);
    }
    return digit === copy;
}

console.log(benchmark(9, "isPalindrome", isPalindrome, [[12321], [-121], [141]]));
