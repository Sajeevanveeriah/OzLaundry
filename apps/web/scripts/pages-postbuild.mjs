import { copyFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const docsDir = resolve(process.cwd(), "../../docs");
await copyFile(resolve(docsDir, "index.html"), resolve(docsDir, "404.html"));
await writeFile(resolve(docsDir, ".nojekyll"), "");
console.log("Prepared GitHub Pages SPA fallbacks: 404.html + .nojekyll");
