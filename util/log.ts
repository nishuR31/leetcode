import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";



export default function log(question: number, payload: any): void {
    fs.writeFileSync(path.join(process.cwd(), question.toString(), "performance.json"), JSON.stringify(payload), { encoding: "utf-8" });
}