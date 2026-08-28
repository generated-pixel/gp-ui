import { CompileConfig } from './index.js';
import { GpCssPlugin } from './plugins.js';

export interface GpCssUserConfig extends CompileConfig {
  plugins?: GpCssPlugin[];
}

export function defineConfig(config: GpCssUserConfig): GpCssUserConfig {
  return config;
}
