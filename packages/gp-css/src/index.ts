export { compile } from "./compiler/index.js";
export type { CompileConfig, CompileResult } from "./compiler/index.js";
export { scanContent } from "./compiler/scanner.js";
export type { ScanOptions } from "./compiler/scanner.js";
export { GpCssGenerator } from "./compiler/generator.js";
export type { GeneratorOptions, GeneratedRule } from "./compiler/generator.js";
export { processDirectives } from "./compiler/directives.js";
export { defaultTokens } from "./tokens/default-tokens.js";
export type { GpThemeTokens } from "./tokens/default-tokens.js";

export function defineConfig(config: import("./compiler/index.js").CompileConfig) {
  return config;
}
