/**
 * @file public-api.ts
 * Public entrypoint for @generatedpixel/gp-rules.
 */

// Types & Interfaces
export * from './lib/types/trigger.types';
export * from './lib/types/condition.types';
export * from './lib/types/action.types';
export * from './lib/types/context.types';
export * from './lib/types/rule.types';

// Engine & Services
export * from './lib/engine/condition-evaluator';
export * from './lib/engine/action-executor';
export * from './lib/engine/rule-context';
export * from './lib/engine/rule-engine.service';

// Directives
export * from './lib/directives/rule.directive';
export * from './lib/directives/rule-group.directive';

// Presets
export * from './lib/presets/common-rules';
export * from './lib/presets/dependent-dropdown-rules';

// Visual Components
export * from './lib/components/rule-inspector/rule-inspector.component';
export * from './lib/components/rule-builder/rule-builder.component';
