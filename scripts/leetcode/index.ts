const ENDPOINT = "https://leetcode.com/graphql";

const username = Bun.env.LEETCODE_USERNAME?.trim();

if (!username) {
    throw new Error(
        "Missing LEETCODE_USERNAME in .env"
    );
}

const query = `
query getUserStats($username: String!) {
    allQuestionsCount {
        difficulty
        count
    }

    matchedUser(username: $username) {
        submitStatsGlobal {
            acSubmissionNum {
                difficulty
                count
            }
        }
    }
}
`;

type Difficulty = "All" | "Easy" | "Medium" | "Hard";

type QuestionCount = {
    difficulty: Difficulty;
    count: number;
};

type Response = {
    data?: {
        allQuestionsCount: QuestionCount[];

        matchedUser: {
            submitStatsGlobal: {
                acSubmissionNum: QuestionCount[];
            };
        } | null;
    };

    errors?: {
        message: string;
    }[];
};

const response = await fetch(ENDPOINT, {
    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://leetcode.com/",
    },

    body: JSON.stringify({
        query,
        variables: {
            username,
        },
    }),
});

const body = await response.text();

if (!response.ok) {
    throw new Error(
        `LeetCode GraphQL HTTP ${response.status}\n${body}`
    );
}

const result = JSON.parse(body) as Response;

if (result.errors?.length) {
    throw new Error(
        result.errors
            .map((error) => error.message)
            .join("\n")
    );
}

if (!result.data?.matchedUser) {
    throw new Error(
        `LeetCode user "${username}" was not found.`
    );
}

const allQuestions =
    result.data.allQuestionsCount;

const solved =
    result.data.matchedUser
        .submitStatsGlobal
        .acSubmissionNum;

function getCount(
    list: QuestionCount[],
    difficulty: Difficulty
): number {
    return (
        list.find(
            (item) =>
                item.difficulty === difficulty
        )?.count ?? 0
    );
}

const easySolved =
    getCount(solved, "Easy");

const mediumSolved =
    getCount(solved, "Medium");

const hardSolved =
    getCount(solved, "Hard");

const easyTotal =
    getCount(allQuestions, "Easy");

const mediumTotal =
    getCount(allQuestions, "Medium");

const hardTotal =
    getCount(allQuestions, "Hard");

const totalSolved =
    easySolved +
    mediumSolved +
    hardSolved;

const totalQuestions =
    easyTotal +
    mediumTotal +
    hardTotal;

const START =
    "<!-- LEETCODE_STATS_START -->";

const END =
    "<!-- LEETCODE_STATS_END -->";

const readmeFile = Bun.file("README.md");

if (!(await readmeFile.exists())) {
    throw new Error("README.md not found.");
}

const readme = await readmeFile.text();

const startIndex =
    readme.indexOf(START);

const endIndex =
    readme.indexOf(END);

if (startIndex === -1 || endIndex === -1) {
    throw new Error(
        `Add these two markers to README.md first:

${START}

${END}`
    );
}

if (endIndex < startIndex) {
    throw new Error(
        "README markers are in the wrong order."
    );
}

function percent(
    solved: number,
    total: number
): string {
    if (!total) return "0.0%";

    return `${(
        (solved / total) *
        100
    ).toFixed(1)}%`;
}

function bar(
    solved: number,
    total: number,
    width = 20
): string {
    if (!total) {
        return "░".repeat(width);
    }

    const filled = Math.round(
        (solved / total) * width
    );

    return (
        "█".repeat(filled) +
        "░".repeat(width - filled)
    );
}

const dashboard = `
## LeetCode

**${username}**

| Difficulty | Solved | Progress |
|:--|--:|:--|
| Easy | ${easySolved}/${easyTotal} | \`${bar(easySolved, easyTotal)}\` ${percent(easySolved, easyTotal)} |
| Medium | ${mediumSolved}/${mediumTotal} | \`${bar(mediumSolved, mediumTotal)}\` ${percent(mediumSolved, mediumTotal)} |
| Hard | ${hardSolved}/${hardTotal} | \`${bar(hardSolved, hardTotal)}\` ${percent(hardSolved, hardTotal)} |
| **Total** | **${totalSolved}/${totalQuestions}** | **${percent(totalSolved, totalQuestions)}** |

`;

const before =
    readme.slice(0, startIndex);

const after =
    readme.slice(
        endIndex + END.length
    );

const updated =
    before +
    START +
    dashboard +
    END +
    after;

await Bun.write(
    "README.md",
    updated
);

console.log("");
console.log("LeetCode dashboard updated.");
console.log("--------------------------------");
console.log(`Username : ${username}`);
console.log(`Total    : ${totalSolved}`);
console.log(`Easy     : ${easySolved}/${easyTotal}`);
console.log(`Medium   : ${mediumSolved}/${mediumTotal}`);
console.log(`Hard     : ${hardSolved}/${hardTotal}`);
console.log("--------------------------------");
console.log("README.md updated.");
