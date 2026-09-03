const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

type GraphQLError = {
    message: string;
};

type GraphQLResponse<T> = {
    data?: T;
    errors?: GraphQLError[];
};

export async function leetcodeGraphQL<T>(
    query: string,
    variables: Record<string, unknown> = {},
): Promise<T> {
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/149 Safari/537.36",
            "Referer": "https://leetcode.com/",
        },

        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(
            `LeetCode GraphQL HTTP ${response.status}\n${text}`,
        );
    }

    const result = JSON.parse(text) as GraphQLResponse<T>;

    if (result.errors?.length) {
        throw new Error(
            result.errors
                .map((error) => error.message)
                .join("\n"),
        );
    }

    if (!result.data) {
        throw new Error(
            "LeetCode GraphQL returned no data",
        );
    }

    return result.data;
}
