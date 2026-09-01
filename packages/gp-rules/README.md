# @generatedpixel/gp-rules

> **Dynamic, Reactive Business Rules Engine for Angular and gp-ui**

`@generatedpixel/gp-rules` is a powerful, declarative, and lightweight Business Rules Engine for Angular 19+ and `@generatedpixel/gp-ui`. It empowers developers to define declarative automation rules triggered by component events (such as `keypress` with configurable debounce, `blur` / lose focus, `change` / `valueChange`, and `click`), evaluate rich composite conditions, and execute reactive UI actions without boilerplate.

---

## 🌟 Key Features

- **⚡ Reactive Event Triggers**:
  - `keypress` & `input` with configurable **`debounce`** delay (e.g. `debounce: 300` ms) and key filters (e.g. `Enter`).
  - `blur` & `focusout` (lose focus verification and formatting).
  - `focus` & `focusin` (gain focus guidance).
  - `change` & `valueChange` (reactive form control and signal value changes).
  - `click` & `select` (buttons, chips, options, and table rows).
  - `init` & `mount` (initialization automation).
- **🧠 Rich Condition Engine**:
  - Operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`, `notContains`, `startsWith`, `endsWith`, `matches` (Regex), `in`, `notIn`, `empty`, `notEmpty`, `truthy`, `falsy`.
  - Composite Logic: `all` (AND), `any` (OR), `none` (NOR), `not` (negation).
  - Expression strings: `quantity * price > 500 && country === 'US'`.
  - Custom TypeScript predicate functions.
- **🚀 Dynamic Action Handlers**:
  - **State**: `setValue`, `patchValues`, `reset`, `clear`.
  - **Visibility**: `show`, `hide`, `toggleVisibility`.
  - **Control State**: `enable`, `disable`, `setRequired`, `setReadonly`.
  - **Cascading Selects**: `setOptions`, `filterOptions` (Country ➔ State ➔ City).
  - **Formulas & Computations**: `compute` / `calculate` (e.g. `quantity * unitPrice * (1 - discount/100)`).
  - **Effects**: `toast`, `emit`, `apiCall`, and `custom` programmatic functions.
- **🎯 Angular Directives & Visual Components**:
  - `[gpRule]` / `[gpRules]`: Attach rules directly to DOM inputs or `gp-ui` components.
  - `[gpRuleGroup]`: Scope rules across forms with shared reactive state.
  - `<gp-rule-inspector>`: Live audit trail displaying real-time execution logs with timing metrics (`durationMs`) and match status.
  - `<gp-rule-builder>`: Interactive UI component to design and register rules dynamically in the browser.

---

## 📦 Installation

```bash
npm install @generatedpixel/gp-rules @generatedpixel/gp-ui
```

---

## 🚀 Quick Start

### 1. Define a Business Rule

```typescript
import { GpBusinessRule } from '@generatedpixel/gp-rules';

export const PROMO_CODE_RULE: GpBusinessRule = {
  id: 'promo-code-evaluator',
  name: 'Debounced Promo Code Evaluator',
  priority: 10,
  trigger: {
    event: 'keypress',
    debounce: 300,
    targetField: 'promoCode'
  },
  condition: {
    field: 'promoCode',
    operator: 'eq',
    value: 'SAVE20'
  },
  actions: [
    { type: 'setValue', target: 'discount', value: 20 },
    { type: 'toast', message: 'Promo code SAVE20 applied! (20% OFF)', severity: 'success' }
  ],
  elseActions: [
    { type: 'setValue', target: 'discount', value: 0 }
  ]
};
```

### 2. Attach to Component with Directive

```html
<gp-input-text
  [(ngModel)]="promoCode"
  placeholder="Enter promo code..."
  [gpRule]="promoRule"
  [gpRuleState]="formState"
/>

<!-- Live Audit Trail -->
<gp-rule-inspector />
```

---

## 📖 API Reference

### Trigger Configuration (`GpRuleTrigger`)

| Property | Type | Description |
|---|---|---|
| `event` | `'keypress' \| 'blur' \| 'focus' \| 'change' \| 'click' \| 'init'` | Event to listen for |
| `debounce` | `number` | Debounce delay in milliseconds (e.g. `300`) |
| `throttle` | `number` | Throttle interval in milliseconds |
| `targetField` | `string` | Optional field name to scope trigger |
| `keyFilter` | `string \| string[]` | Keyboard key filter (e.g. `'Enter'`) |

### Operators (`GpRuleOperator`)

| Operator | Description | Example |
|---|---|---|
| `eq` / `equals` | Equality check (`===` or `==`) | `{ field: 'tier', operator: 'eq', value: 'pro' }` |
| `neq` / `notEquals` | Not equal | `{ field: 'status', operator: 'neq', value: 'archived' }` |
| `gt` / `gte` | Greater than / Greater than or equal | `{ field: 'age', operator: 'gte', value: 18 }` |
| `lt` / `lte` | Less than / Less than or equal | `{ field: 'stock', operator: 'lt', value: 5 }` |
| `contains` | Substring or array inclusion | `{ field: 'roles', operator: 'contains', value: 'admin' }` |
| `startsWith` | String prefix matching | `{ field: 'taxId', operator: 'startsWith', value: 'US-' }` |
| `matches` | Regular expression match | `{ field: 'email', operator: 'matches', value: '^[\\w.-]+@[\\w.-]+\\.\\w+$' }` |
| `empty` / `notEmpty` | Checks null, undefined, empty string or array | `{ field: 'phone', operator: 'notEmpty' }` |

### Action Types (`GpRuleActionType`)

| Action | Description | Example |
|---|---|---|
| `setValue` | Updates target field value | `{ type: 'setValue', target: 'discount', value: 20 }` |
| `patchValues` | Updates multiple values at once | `{ type: 'patchValues', value: { city: 'Austin', state: 'TX' } }` |
| `show` / `hide` | Toggles target field visibility | `{ type: 'show', target: 'shippingAddress' }` |
| `enable` / `disable` | Toggles control disabled state | `{ type: 'disable', target: 'submitBtn' }` |
| `compute` / `calculate` | Evaluates mathematical formulas | `{ type: 'compute', target: 'total', formula: 'quantity * unitPrice' }` |
| `setOptions` | Populates dynamic dropdown options | `{ type: 'setOptions', target: 'state', options: [...] }` |
| `toast` | Displays a toast notification | `{ type: 'toast', message: 'Order submitted', severity: 'success' }` |

---

## 📄 License

MIT © [Generated Pixel](https://generatedpixel.dev)
