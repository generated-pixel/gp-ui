import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { compile } from "../compiler/index.js";

async function getFilesRecursively(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
        continue;
      }
      if (entry.isDirectory()) {
        const subFiles = await getFilesRecursively(fullPath, extensions);
        results.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch {
    // Ignore unreadable dirs
  }
  return results;
}

export async function runCli(args: string[]) {
  const command = args[0] || "build";

  if (command === "init") {
    const configContent = `import { defineConfig } from "@generatedpixel/gp-css";

export default defineConfig({
  content: ["./src/**/*.{html,ts,tsx,js,jsx}", "./public/**/*.html"],
  prefix: "",
  minify: true,
});
`;
    await writeFile("gp-css.config.mjs", configContent, "utf-8");
    console.log("✓ Created gp-css.config.mjs");
    return;
  }

  if (command === "build" || command === "watch") {
    const searchDirs = ["./src", "./public"];
    const fileExts = [".html", ".ts", ".tsx", ".js", ".jsx", ".vue", ".svelte", ".css"];
    const filesToScan: string[] = [];

    for (const dir of searchDirs) {
      const found = await getFilesRecursively(path.resolve(process.cwd(), dir), fileExts);
      filesToScan.push(...found);
    }

    const contents: string[] = [];
    for (const file of filesToScan) {
      try {
        contents.push(await readFile(file, "utf-8"));
      } catch {
        // Skip unreadable files
      }
    }

    let inputCss = "@gp-css theme;\n@gp-css base;\n@gp-css components;\n@gp-css utilities;";
    const customCssPath = path.resolve(process.cwd(), "src/styles.css");
    try {
      inputCss = await readFile(customCssPath, "utf-8");
    } catch {
      // Use default inputCss
    }

    const result = compile({
      content: contents,
      inputCss,
      minify: args.includes("--minify"),
    });

    const outDir = path.resolve(process.cwd(), "dist");
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "gp-css.css"), result.css, "utf-8");

    console.log(`✓ gp-css compiled successfully:`);
    console.log(`  Scanned: ${filesToScan.length} files`);
    console.log(`  Rules generated: ${result.matchedRulesCount}`);
    console.log(`  Output: dist/gp-css.css (${Buffer.byteLength(result.css)} bytes)`);
  }
}
