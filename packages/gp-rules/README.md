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
  - Operators: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `between`, `notBetween`, `contains`, `notContains`, `startsWith`, `endsWith`, `matches` (Regex), `in`, `notIn`, `allIn`, `anyIn`, `noneIn`, `hasLength`, `lengthGt`, `lengthLt`, `isBefore`, `isAfter`, `isSameDay`, `isBetweenDates`, `isFuture`, `isPast`, `empty`, `notEmpty`, `truthy`, `falsy`.
  - **Dynamic Field-to-Field Comparisons**: `compareToField: 'password'` (compare `confirmPassword` against `password`).
  - Composite Logic: `all` (AND), `any` (OR), `none` (NOR), `not` (negation).
  - Expression strings: `quantity * price > 500 && country === 'US'`.
  - Custom TypeScript synchronous and asynchronous predicate functions (`customPredicate`, `asyncPredicate`).
- **🚀 Dynamic Action Handlers**:
  - **State & Transformations**: `setValue`, `patchValues`, `copyValue`, `transformValue` (`slugify`, `uppercase`, `lowercase`, `titlecase`, `trim`, `currency`, `phone`), `reset`, `clear`.
  - **Form Validation**: `setValidationError`, `clearValidationError`.
  - **UI & Styling**: `show`, `hide`, `toggleVisibility`, `setClass`, `setStyle`, `setFocus`.
  - **Control State**: `enable`, `disable`, `setRequired`, `setReadonly`.
  - **Cascading Selects**: `setOptions`, `filterOptions` (Country ➔ State ➔ City).
  - **Formulas & Computations**: Built-in math and logic helpers (`SUM`, `AVG`, `MIN`, `MAX`, `ROUND`, `IF`, `DATE_DIFF`, `CONCAT`, `UPPER`, `LOWER`, `TRIM`).
  - **Effects & Network**: `toast`, `emit`, `apiCall` (with automated JSON response mapping), and `custom` programmatic functions.
- **🧪 Simulator, Linter & Diagnostics**:
  - `GpRuleSimulator.simulate(...)`: Dry-run simulations with before/after state diffs without mutating UI or forms.
  - `GpRuleValidator.validate(...)`: Static analysis, linting, syntax checking, and cyclic dependency detection.
- **🎯 Angular Directives & Visual Components**:
  - `[gpRule]` / `[gpRules]`: Attach rules directly to DOM inputs or `gp-ui` components.
  - `[gpRuleGroup]`: Scope rules across forms with shared reactive state.
  - `<gp-rule-inspector>`: Live audit trail displaying real-time execution metrics (`totalExecutions`, `successRate`, `averageDurationMs`), filtering, search, and JSON export.
  - `<gp-rule-builder>`: Interactive UI component to design, test, and register rules dynamically in the browser.

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
  elseActions: [{ type: 'setValue', target: 'discount', value: 0 }]
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

<!-- Live Audit Trail with Metrics -->
<gp-rule-inspector />
```

---

## 📖 API Reference

### Trigger Configuration (`GpRuleTrigger`)

| Property      | Type                                                               | Description                                 |
| ------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| `event`       | `'keypress' \| 'blur' \| 'focus' \| 'change' \| 'click' \| 'init'` | Event to listen for                         |
| `debounce`    | `number`                                                           | Debounce delay in milliseconds (e.g. `300`) |
| `throttle`    | `number`                                                           | Throttle interval in milliseconds           |
| `targetField` | `string`                                                           | Optional field name to scope trigger        |
| `keyFilter`   | `string \| string[]`                                               | Keyboard key filter (e.g. `'Enter'`)        |

### Operators (`GpRuleOperator`)

| Operator                  | Description                                | Example                                                                        |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| `eq` / `equals`           | Equality check (`===` or `==`)             | `{ field: 'confirmPassword', operator: 'eq', compareToField: 'password' }`     |
| `neq` / `notEquals`       | Not equal                                  | `{ field: 'status', operator: 'neq', value: 'archived' }`                      |
| `gt` / `gte`              | Greater than / Greater than or equal       | `{ field: 'age', operator: 'gte', value: 18 }`                                 |
| `lt` / `lte`              | Less than / Less than or equal             | `{ field: 'stock', operator: 'lt', value: 5 }`                                 |
| `between` / `notBetween`  | Range check `[min, max]`                   | `{ field: 'score', operator: 'between', value: [80, 100] }`                    |
| `isBefore` / `isAfter`    | Date chronological comparison              | `{ field: 'endDate', operator: 'isAfter', compareToField: 'startDate' }`       |
| `isSameDay`               | Date calendar day equality                 | `{ field: 'deliveryDate', operator: 'isSameDay', value: new Date() }`          |
| `hasLength` / `lengthGt`  | String or array length check               | `{ field: 'password', operator: 'lengthGt', value: 8 }`                        |
| `contains`                | Substring or array inclusion               | `{ field: 'roles', operator: 'contains', value: 'admin' }`                     |
| `startsWith` / `endsWith` | String prefix / suffix matching            | `{ field: 'taxId', operator: 'startsWith', value: 'US-' }`                     |
| `matches`                 | Regular expression match                   | `{ field: 'email', operator: 'matches', value: '^[\\w.-]+@[\\w.-]+\\.\\w+$' }` |
| `empty` / `notEmpty`      | Checks null, undefined, empty string/array | `{ field: 'phone', operator: 'notEmpty' }`                                     |

### Action Types (`GpRuleActionType`)

| Action                  | Description                        | Example                                                                                              |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `setValue`              | Updates target field value         | `{ type: 'setValue', target: 'discount', value: 20 }`                                                |
| `copyValue`             | Copies value from another field    | `{ type: 'copyValue', fromField: 'billingAddress', target: 'shippingAddress' }`                      |
| `transformValue`        | Transforms string format           | `{ type: 'transformValue', fromField: 'title', target: 'slug', transformType: 'slugify' }`           |
| `setValidationError`    | Sets custom validation error       | `{ type: 'setValidationError', target: 'confirmPassword', errorKey: 'mismatch' }`                    |
| `clearValidationError`  | Clears custom validation error     | `{ type: 'clearValidationError', target: 'confirmPassword', errorKey: 'mismatch' }`                  |
| `setClass`              | Adds/removes CSS class             | `{ type: 'setClass', target: 'emailField', className: 'is-valid' }`                                  |
| `setFocus`              | Focuses target element             | `{ type: 'setFocus', target: 'shippingZip' }`                                                        |
| `show` / `hide`         | Toggles target field visibility    | `{ type: 'show', target: 'shippingAddress' }`                                                        |
| `enable` / `disable`    | Toggles control disabled state     | `{ type: 'disable', target: 'submitBtn' }`                                                           |
| `compute` / `calculate` | Formula evaluation with math utils | `{ type: 'compute', target: 'total', formula: 'ROUND(SUM(subtotal, tax) * (1 - discount/100), 2)' }` |
| `setOptions`            | Populates dynamic dropdown options | `{ type: 'setOptions', target: 'state', options: [...] }`                                            |
| `toast`                 | Displays a toast notification      | `{ type: 'toast', message: 'Order submitted', severity: 'success' }`                                 |
| `apiCall`               | Executes REST API & maps response  | `{ type: 'apiCall', url: '/api/zip/90210', responseMapping: { 'city': 'city' } }`                    |

---

## 📄 License

MIT © [Generated Pixel](https://generatedpixel.dev)
