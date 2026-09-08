import benchmark from "../util/performance"


function lengthOfLastWord(s: string): number {
    return s.trim().split(/\s+/).pop()!.length;
}


benchmark(58, "lengthOfLastWord", lengthOfLastWord, [["What you know"]])