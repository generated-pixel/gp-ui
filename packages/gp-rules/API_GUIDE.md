# `@generatedpixel/gp-rules` Comprehensive API & Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Event Triggers & Debounce](#event-triggers--debounce)
3. [Condition Operators & Expressions](#condition-operators--expressions)
4. [Dynamic Field-to-Field Comparison](#dynamic-field-to-field-comparison)
5. [Action Types & Value Transformations](#action-types--value-transformations)
6. [Formula Calculation Engine](#formula-calculation-engine)
7. [Dry-Run Simulator (`GpRuleSimulator`)](#dry-run-simulator-gprulesimulator)
8. [Static Linter & Validator (`GpRuleValidator`)](#static-linter--validator-gprulevalidator)
9. [Visual Audit Inspector (`<gp-rule-inspector>`)](#visual-audit-inspector-gp-rule-inspector)
10. [Visual Rule Builder (`<gp-rule-builder>`)](#visual-rule-builder-gp-rule-builder)
11. [Enterprise Presets Catalog](#enterprise-presets-catalog)
12. [Reactive Forms Integration](#reactive-forms-integration)

---

## 1. Architecture Overview

`@generatedpixel/gp-rules` is a declarative, reactive Business Rules Engine designed for Angular 19+ and `@generatedpixel/gp-ui`. It allows developers to define reactive business automation rules once, bind them to DOM elements, signals, or Angular Reactive Forms, and execute composite action pipelines with zero boilerplate.

```
┌─────────────────────────────────────────────────────────────┐
│                       Event Trigger                         │
│  keypress (debounced), blur, change, valueChange, click     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 GpRuleEngineService Pipeline                │
│  Topological priority sort ➔ Scoped debounce ➔ Context Map  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Condition Evaluation                      │
│  Operators (eq, between, isAfter...) / compareToField       │
│  Async Predicates & Expression strings                      │
└──────────────┬───────────────────────────────┬──────────────┘
               │ (True)                        │ (False)
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Primary Actions         │ │       Else Actions         │
│  setValue, transformValue,   │ │  setValue, reset, clear,   │
│  compute, setValidationError │ │  clearValidationError      │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Context State Mutation & Audit                │
│  Reactive Form / Signal State Patch ➔ Inspector Execution Log│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Event Triggers & Debounce

Triggers specify when a business rule should be evaluated.

### Trigger Properties (`GpRuleTrigger`)
- `event`: `'keypress' | 'keydown' | 'keyup' | 'input' | 'blur' | 'focus' | 'focusin' | 'focusout' | 'change' | 'valueChange' | 'click' | 'select' | 'init' | 'mount' | 'custom'`
- `debounce`: Number in milliseconds (e.g. `debounce: 300`). Ideal for keystroke search, promo code validation, and live price recalculations.
- `throttle`: Throttle interval in milliseconds.
- `targetField`: Field identifier to scope event evaluation to a specific property.
- `keyFilter`: String or array of keys (e.g. `'Enter'`, `['Tab', 'Escape']`).

---

## 3. Condition Operators & Expressions

### Complete Operator Matrix

| Operator | Syntax | Description | Example |
|---|---|---|---|
| `eq` / `equals` | `===` | Equality check | `{ field: 'tier', operator: 'eq', value: 'gold' }` |
| `neq` / `notEquals` | `!==` | Inequality check | `{ field: 'status', operator: 'neq', value: 'disabled' }` |
| `gt` / `greaterThan` | `>` | Numeric greater than | `{ field: 'age', operator: 'gt', value: 18 }` |
| `gte` / `greaterThanOrEqual` | `>=` | Greater than or equal | `{ field: 'score', operator: 'gte', value: 80 }` |
| `lt` / `lessThan` | `<` | Numeric less than | `{ field: 'inventory', operator: 'lt', value: 5 }` |
| `lte` / `lessThanOrEqual` | `<=` | Less than or equal | `{ field: 'price', operator: 'lte', value: 100 }` |
| `between` | `[min, max]` | Range inclusion (inclusive) | `{ field: 'age', operator: 'between', value: [18, 65] }` |
| `notBetween` | `[min, max]` | Outside range | `{ field: 'temp', operator: 'notBetween', value: [32, 212] }` |
| `isBefore` | `Date` / string | Date chronologically earlier | `{ field: 'startDate', operator: 'isBefore', compareToField: 'endDate' }` |
| `isAfter` | `Date` / string | Date chronologically later | `{ field: 'endDate', operator: 'isAfter', compareToField: 'startDate' }` |
| `isSameDay` | `Date` / string | Same calendar date | `{ field: 'pickupDate', operator: 'isSameDay', value: new Date() }` |
| `isBetweenDates` | `[d1, d2]` | Date within range | `{ field: 'checkIn', operator: 'isBetweenDates', value: ['2026-06-01', '2026-08-31'] }` |
| `isFuture` | none | Date is in the future | `{ field: 'flightDate', operator: 'isFuture' }` |
| `isPast` | none | Date is in the past | `{ field: 'dob', operator: 'isPast' }` |
| `contains` | Substring / item | Substring or array contains | `{ field: 'roles', operator: 'contains', value: 'admin' }` |
| `notContains` | Substring / item | Does not contain | `{ field: 'tags', operator: 'notContains', value: 'archived' }` |
| `startsWith` | String prefix | Prefix matching | `{ field: 'vatNumber', operator: 'startsWith', value: 'GB' }` |
| `endsWith` | String suffix | Suffix matching | `{ field: 'email', operator: 'endsWith', value: '@company.com' }` |
| `matches` | Regex pattern | Regular expression test | `{ field: 'zip', operator: 'matches', value: '^\\d{5}$' }` |
| `allIn` | Array of items | Array contains all items | `{ field: 'userBadges', operator: 'allIn', value: ['pro', 'verified'] }` |
| `anyIn` | Array of items | Array contains at least one | `{ field: 'userRoles', operator: 'anyIn', value: ['editor', 'admin'] }` |
| `noneIn` | Array of items | Array contains none | `{ field: 'userFlags', operator: 'noneIn', value: ['banned', 'suspended'] }` |
| `hasLength` | Number | String or array exact length | `{ field: 'pin', operator: 'hasLength', value: 4 }` |
| `lengthGt` | Number | Length greater than | `{ field: 'password', operator: 'lengthGt', value: 8 }` |
| `lengthLt` | Number | Length less than | `{ field: 'bio', operator: 'lengthLt', value: 160 }` |
| `empty` / `notEmpty` | none | Null / empty string / empty array | `{ field: 'comment', operator: 'notEmpty' }` |
| `truthy` / `falsy` | none | Boolean coercions | `{ field: 'agreedToTerms', operator: 'truthy' }` |

---

## 4. Dynamic Field-to-Field Comparison

Conditions can compare against dynamic values from other context or form fields using `compareToField`:

```typescript
export const PASSWORD_MATCH_RULE: GpBusinessRule = {
  id: 'confirm-password-match',
  trigger: [{ event: 'keypress', debounce: 200, targetField: 'confirmPassword' }],
  condition: {
    field: 'confirmPassword',
    operator: 'eq',
    compareToField: 'password' // Resolves dynamically from context
  },
  actions: [
    { type: 'clearValidationError', target: 'confirmPassword', errorKey: 'mismatch' },
    { type: 'setClass', target: 'confirmPassword', className: 'field-valid', removeClassName: 'field-invalid' }
  ],
  elseActions: [
    { type: 'setValidationError', target: 'confirmPassword', errorKey: 'mismatch', errorMessage: 'Passwords do not match.' },
    { type: 'setClass', target: 'confirmPassword', className: 'field-invalid', removeClassName: 'field-valid' }
  ]
};
```

---

## 5. Action Types & Value Transformations

| Action Type | Key Properties | Purpose |
|---|---|---|
| `setValue` | `target`, `value` | Sets a field value in form / context |
| `copyValue` | `fromField`, `target` | Copies value from one field to another |
| `transformValue` | `fromField`, `target`, `transformType` | Formats string (`slugify`, `uppercase`, `lowercase`, `titlecase`, `capitalize`, `trim`, `currency`, `phone`) |
| `setValidationError` | `target`, `errorKey`, `errorMessage` | Injects error on Angular Reactive Form control |
| `clearValidationError` | `target`, `errorKey` | Removes validation error from control |
| `setClass` | `target`, `className`, `removeClassName` | Toggles CSS classes on target DOM element |
| `setStyle` | `target`, `styles` | Applies inline styles |
| `setFocus` | `target` | Focuses the target input element |
| `show` / `hide` | `target` | Sets target visibility flag |
| `enable` / `disable` | `target` | Toggles control disabled status |
| `compute` / `calculate` | `target`, `formula` | Mathematical and string formula computation |
| `setOptions` | `target`, `options` | Populates dropdown select options |
| `toast` | `message`, `severity` | Emits a toast notification |
| `apiCall` | `url`, `method`, `responseMapping` | Executes REST request & maps JSON response to state |
| `custom` | `execute: (ctx) => void` | Programmatic TypeScript callback |

---

## 6. Formula Calculation Engine

The formula evaluator (`compute` / `calculate`) includes safety token checks and built-in helper functions:

### Built-in Helper Functions
- **Math**:
  - `SUM(a, b, ...)`
  - `AVG(a, b, ...)`
  - `MIN(a, b, ...)`
  - `MAX(a, b, ...)`
  - `ROUND(value, decimals = 2)`
  - `ABS(value)`
  - `CEIL(value)`
  - `FLOOR(value)`
- **Logic**:
  - `IF(condition, trueValue, falseValue)`
- **Strings**:
  - `CONCAT(a, b, ...)`
  - `UPPER(str)`
  - `LOWER(str)`
  - `TRIM(str)`
- **Dates**:
  - `DATE_DIFF(date1, date2, 'days' | 'hours' | 'minutes')`

### Formula Example:
```typescript
{
  type: 'compute',
  target: 'orderTotal',
  formula: 'ROUND(IF(quantity > 10, quantity * unitPrice * 0.9, quantity * unitPrice) + tax, 2)'
}
```

---

## 7. Dry-Run Simulator (`GpRuleSimulator`)

Execute simulations on mock data without mutating real UI components or form groups:

```typescript
import { GpRuleSimulator } from '@generatedpixel/gp-rules';

const result = await GpRuleSimulator.simulate({
  rules: [couponRule, pricingRule],
  initialState: {
    quantity: 4,
    unitPrice: 50,
    couponCode: 'SAVE20',
    discountPercent: 0,
    total: 0
  },
  triggerEvent: 'change'
});

console.log('Matched Rules:', result.matchedRules);
console.log('Final State:', result.finalState);
console.log('State Diffs:', result.stateDiff);
```

---

## 8. Static Linter & Validator (`GpRuleValidator`)

Validate rule definitions prior to registering them in production or during CI/CD:

```typescript
import { GpRuleValidator } from '@generatedpixel/gp-rules';

const validation = GpRuleValidator.validate(myBusinessRules);

if (!validation.valid) {
  console.error('Validation errors found:', validation.errors);
  console.warn('Cyclic dependencies:', validation.cyclicDependencies);
}
```

---

## 9. Visual Audit Inspector (`<gp-rule-inspector>`)

Embed a live execution log and analytics bar directly into your template:

```html
<gp-rule-inspector
  title="Real-Time Audit Trail"
  [maxLogs]="50"
  [showStats]="true"
/>
```

Features:
- Real-time runs count, match rate (%), and average execution duration (ms).
- Search query and status filters ('All', 'Matched', 'Unmatched').
- One-click JSON export of execution logs.

---

## 10. Visual Rule Builder (`<gp-rule-builder>`)

Allow users, administrators, or developers to construct and register business rules interactively:

```html
<gp-rule-builder (ruleCreated)="onRuleCreated($event)" />
```

---

## 11. Enterprise Presets Catalog

Import pre-configured, tested business rules from `@generatedpixel/gp-rules`:

- `GP_COUPON_RULE`: Keypress debounced coupon code verification.
- `GP_ORDER_CALCULATOR_RULES`: Multi-tier order total and subtotal calculator.
- `GP_CONFIRM_FIELD_RULE`: Password vs Confirm Password equality validator.
- `GP_PASSWORD_STRENGTH_RULE`: Multi-factor password complexity scoring.
- `GP_CREDIT_CARD_TYPE_RULE`: Auto-detects Visa, Mastercard, Amex, Discover and CVV length.
- `GP_DATE_RANGE_RULE`: Booking / reservation date range chronology validator.
- `GP_SLUGIFY_RULE`: Auto-transforms article titles into URL-friendly slugs.
- `GP_SHIPPING_VISIBILITY_RULE`: Conditional shipping section visibility toggle.
- `GP_DEPENDENT_COUNTRY_RULE`: Dynamic Country-to-State cascading selector.

---

## 12. Reactive Forms Integration

Attach rules directly to Reactive Forms using directives:

```html
<form [formGroup]="userForm" [gpRuleGroup]="formRules">
  <gp-input-text
    formControlName="password"
    placeholder="New Password"
    [gpRule]="passwordStrengthRule"
  />

  <gp-input-text
    formControlName="confirmPassword"
    placeholder="Confirm Password"
    [gpRule]="confirmPasswordRule"
  />
</form>
```

---

## License

MIT © [Generated Pixel](https://generatedpixel.dev)
