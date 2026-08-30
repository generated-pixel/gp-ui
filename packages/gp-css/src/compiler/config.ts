import { CompileConfig } from './index.js';
import { GpCssPlugin } from './plugins.js';

export interface GpCssUserConfig extends CompileConfig {
  plugins?: GpCssPlugin[];
  /** CLI-only content file globs or directories. */
  content?: string[];
  /** CLI-only path to an input stylesheet containing gp-css directives. */
  input?: string;
  /** CLI-only output stylesheet path. */
  output?: string;
}

export function defineConfig(config: GpCssUserConfig): GpCssUserConfig {
  return config;
}
