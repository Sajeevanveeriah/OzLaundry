import { copyFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsDir = resolve(__dirname, "../../../docs");

await copyFile(resolve(docsDir, "index.html"), resolve(docsDir, "404.html"));
console.log("Copied docs/index.html -> docs/404.html");

await writeFile(resolve(docsDir, ".nojekyll"), "");
console.log("Created docs/.nojekyll");
