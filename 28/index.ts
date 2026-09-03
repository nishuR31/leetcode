import benchmark from "../util/performance";

function strStr(haystack: string, needle: string): number {
    for (let i = 0; i <= haystack.length - needle.length; i++) {
        const window = haystack.slice(i, i + needle.length);

        if (window === needle) {
            return i;
        }
    }

    return -1;
}


benchmark(28, "strStr", strStr, [["hello", "ll"], ["aaaaa", "bba"]]);