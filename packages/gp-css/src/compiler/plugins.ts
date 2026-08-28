import { GpThemeTokens } from '../tokens/default-tokens.js';

export interface PluginContext {
  tokens: GpThemeTokens;
  addUtility: (name: string, css: string) => void;
  addComponent: (selector: string, css: string) => void;
}

export type GpCssPlugin = (ctx: PluginContext) => void;

export function definePlugin(plugin: GpCssPlugin): GpCssPlugin {
  return plugin;
}
