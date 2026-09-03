import fs from "node:fs";
import path from "node:path";

const question = Number(process.argv[2]);

if (!Number.isInteger(question) || question <= 0) {
    console.error("Usage: bun run setup <question-number>");
    process.exit(1);
}

const baseDir = process.cwd();
const questionDir = path.join(baseDir, String(question));

if (fs.existsSync(questionDir)) {
    console.error(`Question ${question} already exists.`);
    process.exit(1);
}

fs.mkdirSync(questionDir);

fs.writeFileSync(
    path.join(questionDir, "index.ts"),
    "",
    "utf-8",
);

fs.writeFileSync(
    path.join(questionDir, "problem.txt"),
    "",
    "utf-8",
);

console.log(`Created question ${question}:`);
console.log(`  ${question}/index.ts`);
console.log(`  ${question}/problem.txt`);
