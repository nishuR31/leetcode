import type { LeetCodeStats } from "./stats";

const START_MARKER = "<!-- LEETCODE_STATS_START -->";
const END_MARKER = "<!-- LEETCODE_STATS_END -->";

function progressBar(
  solved: number,
  total: number,
  width = 15,
): string {
  if (total === 0) {
    return "░".repeat(width);
  }

  const percentage = solved / total;

  const filled = Math.round(
    percentage * width,
  );

  const empty = width - filled;

  return (
    "█".repeat(filled) +
    "░".repeat(empty)
  );
}

function percentage(
  solved: number,
  total: number,
): string {
  if (total === 0) {
    return "0.0%";
  }

  return `${((solved / total) * 100).toFixed(1)}%`;
}

function generateDashboard(
  stats: LeetCodeStats,
): string {
  return `## LeetCode

**${stats.username}**

| Difficulty | Solved | Progress |
|:---|---:|:---|
| Easy | ${stats.easy.solved}/${stats.easy.total} | \`${progressBar(stats.easy.solved, stats.easy.total)}\` ${percentage(stats.easy.solved, stats.easy.total)} |
| Medium | ${stats.medium.solved}/${stats.medium.total} | \`${progressBar(stats.medium.solved, stats.medium.total)}\` ${percentage(stats.medium.solved, stats.medium.total)} |
| Hard | ${stats.hard.solved}/${stats.hard.total} | \`${progressBar(stats.hard.solved, stats.hard.total)}\` ${percentage(stats.hard.solved, stats.hard.total)} |
| **Total** | **${stats.total}** | |

**Ranking:** ${stats.ranking ?? "N/A"}  
**Reputation:** ${stats.reputation ?? "N/A"}  
**Contribution Points:** ${stats.contributionPoints ?? "N/A"}
`;
}

export async function updateReadme(
  stats: LeetCodeStats,
): Promise<void> {
  const readmePath = "README.md";

  const readme = await Bun.file(
    readmePath,
  ).text();

  const start = readme.indexOf(
    START_MARKER,
  );

  const end = readme.indexOf(
    END_MARKER,
  );

  if (start === -1 || end === -1) {
    throw new Error(
      `README.md must contain:
${START_MARKER}
...
${END_MARKER}`,
    );
  }

  if (end < start) {
    throw new Error(
      "README.md markers are in the wrong order.",
    );
  }

  const dashboard =
    generateDashboard(stats);

  const before = readme.slice(
    0,
    start,
  );

  const after = readme.slice(
    end + END_MARKER.length,
  );

  const updated =
    before +
    START_MARKER +
    "\n\n" +
    dashboard +
    "\n" +
    END_MARKER +
    after;

  await Bun.write(
    readmePath,
    updated,
  );

  console.log(
    "README.md updated successfully.",
  );
}
