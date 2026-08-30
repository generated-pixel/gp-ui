import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { compile } from '../compiler/index.js';
import { GpCssUserConfig } from '../compiler/config.js';

async function getFilesRecursively(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
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

function getContentRoot(pattern: string): string {
  const wildcardIndex = pattern.search(/[*!?[{]/);
  const staticPath = wildcardIndex === -1 ? pattern : pattern.slice(0, wildcardIndex);
  const normalizedPath = staticPath.replace(/[\\/]$/, '');
  return path.extname(normalizedPath) ? path.dirname(normalizedPath) : normalizedPath;
}

async function loadUserConfig(): Promise<GpCssUserConfig | undefined> {
  const configPath = path.resolve(process.cwd(), 'gp-css.config.mjs');
  try {
    const configModule = await import(pathToFileURL(configPath).href);
    return configModule.default as GpCssUserConfig;
  } catch (error: any) {
    if (error?.code !== 'ERR_MODULE_NOT_FOUND') {
      throw error;
    }
    return undefined;
  }
}

export async function runCli(args: string[]) {
  const command = args[0] || 'build';

  if (command === 'init') {
    const configContent = `import { defineConfig } from "@generatedpixel/gp-css";

export default defineConfig({
  content: ["./src/**/*.{html,ts,tsx,js,jsx}", "./public/**/*.html"],
  prefix: "",
  minify: true,
});
`;
    await writeFile('gp-css.config.mjs', configContent, 'utf-8');
    console.log('✓ Created gp-css.config.mjs');
    return;
  }

  if (command === 'build' || command === 'watch') {
    const config = await loadUserConfig();
    const contentPatterns = config?.content?.length ? config.content : ['./src', './public'];
    const searchDirs = [...new Set(contentPatterns.map(getContentRoot))];
    const fileExts = ['.html', '.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte', '.css'];
    const filesToScan: string[] = [];

    for (const dir of searchDirs) {
      const found = await getFilesRecursively(path.resolve(process.cwd(), dir), fileExts);
      filesToScan.push(...found);
    }

    const contents: string[] = [];
    for (const file of filesToScan) {
      try {
        contents.push(await readFile(file, 'utf-8'));
      } catch {
        // Skip unreadable files
      }
    }

    let inputCss = config?.inputCss || '@gp-css theme;\n@gp-css base;\n@gp-css components;\n@gp-css utilities;';
    if (config?.input || !config?.inputCss) {
      const customCssPath = path.resolve(process.cwd(), config?.input || 'src/styles.css');
      try {
        inputCss = await readFile(customCssPath, 'utf-8');
      } catch {
        // Use configured or default directives.
      }
    }

    const result = compile({
      content: contents,
      inputCss,
      minify: args.includes('--minify') || config?.minify,
      prefix: config?.prefix,
      tokens: config?.tokens,
      plugins: config?.plugins
    });

    const outputPath = path.resolve(process.cwd(), config?.output || 'dist/gp-css.css');
    const outDir = path.dirname(outputPath);
    await mkdir(outDir, { recursive: true });
    await writeFile(outputPath, result.css, 'utf-8');

    console.log(`✓ gp-css compiled successfully:`);
    console.log(`  Scanned: ${filesToScan.length} files`);
    console.log(`  Rules generated: ${result.matchedRulesCount}`);
    console.log(`  Output: ${path.relative(process.cwd(), outputPath)} (${Buffer.byteLength(result.css)} bytes)`);
  }
}
