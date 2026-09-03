import { leetcodeGraphQL } from "./graphql";

const QUERY = `
query userProblemsSolved($username: String!) {
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

type Difficulty =
    | "All"
    | "Easy"
    | "Medium"
    | "Hard";

type QuestionCount = {
    difficulty: Difficulty;
    count: number;
};

type SolvedCount = {
    difficulty: Difficulty;
    count: number;
};

type Response = {
    allQuestionsCount: QuestionCount[];

    matchedUser: {
        submitStatsGlobal: {
            acSubmissionNum: SolvedCount[];
        };
    } | null;
};

export type LeetCodeStats = {
    username: string;

    total: number;

    easy: {
        solved: number;
        total: number;
    };

    medium: {
        solved: number;
        total: number;
    };

    hard: {
        solved: number;
        total: number;
    };
};

function findCount(
    data: QuestionCount[] | SolvedCount[],
    difficulty: Difficulty,
): number {
    return (
        data.find(
            (item) =>
                item.difficulty === difficulty,
        )?.count ?? 0
    );
}

export async function getLeetCodeStats(
    username: string,
): Promise<LeetCodeStats> {
    const data =
        await leetcodeGraphQL<Response>(
            QUERY,
            {
                username,
            },
        );

    if (!data.matchedUser) {
        throw new Error(
            `LeetCode user "${username}" not found.`,
        );
    }

    const totalQuestions =
        data.allQuestionsCount;

    const solved =
        data.matchedUser
            .submitStatsGlobal
            .acSubmissionNum;

    const easySolved =
        findCount(solved, "Easy");

    const mediumSolved =
        findCount(solved, "Medium");

    const hardSolved =
        findCount(solved, "Hard");

    return {
        username,

        total:
            easySolved +
            mediumSolved +
            hardSolved,

        easy: {
            solved: easySolved,
            total: findCount(
                totalQuestions,
                "Easy",
            ),
        },

        medium: {
            solved: mediumSolved,
            total: findCount(
                totalQuestions,
                "Medium",
            ),
        },

        hard: {
            solved: hardSolved,
            total: findCount(
                totalQuestions,
                "Hard",
            ),
        },
    };
}
