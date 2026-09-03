# Changelog

## [1.0.1] - 2026-09-02

- **`@generatedpixel/gp-rules` Next-Generation Business Rules Engine**:
  - **Dynamic Field-to-Field Comparison**: Added `compareToField` support to evaluate conditions against other dynamic form fields/context values without hardcoding static values.
  - **Extended Operator Matrix**: Added range (`between`, `notBetween`), chronological (`isBefore`, `isAfter`, `isSameDay`, `isBetweenDates`, `isFuture`, `isPast`), collection (`allIn`, `anyIn`, `noneIn`), and length (`hasLength`, `lengthGt`, `lengthLt`) operators.
  - **Asynchronous Remote Validation**: Added `GpConditionEvaluator.evaluateAsync` for asynchronous asyncPredicate validation pipelines.
  - **Value Transformations & Advanced Actions**: Added `transformValue` (`slugify`, `uppercase`, `lowercase`, `titlecase`, `capitalize`, `trim`, `currency`, `phone`), `copyValue`, `setValidationError`, `clearValidationError`, `setClass`, `setStyle`, `setFocus`, and `apiCall`.
  - **Math & Logical Formula Functions**: Extended formula evaluation with built-in functions: `SUM`, `AVG`, `MIN`, `MAX`, `ROUND`, `ABS`, `CEIL`, `FLOOR`, `IF`, `CONCAT`, `UPPER`, `LOWER`, `TRIM`, and `DATE_DIFF`.
  - **Dry-Run Rule Simulator**: Introduced `GpRuleSimulator.simulate(...)` to execute dry-run rule scenarios on mock input data with granular state diff calculations (`changed`, `added`, `removed`).
  - **Static Rule Linter & Validator**: Introduced `GpRuleValidator.validate(...)` for syntax verification, missing trigger detection, and cyclic dependency graph analysis.
  - **Visual Audit Inspector**: Upgraded `<gp-rule-inspector>` with real-time metrics (Total Runs, Match Rate %, Avg Duration ms, Active Rules), search filtering, match status filtering chips, and JSON log export.
  - **Enterprise Rule Presets**: Added presets for password matching, password complexity scoring, credit card brand detection, date range validation, and live title slugification.
  - **Developer Guide**: Added comprehensive `API_GUIDE.md` for `@generatedpixel/gp-rules`.

- **Base Class Architecture & Deduplication**:
  - Added `GpDateBase` unifying calendar date arithmetic, localization, and overlay popups across `GpDatePicker` and `GpDateRangePicker`.
  - Added `GpFeedbackBase` standardizing severity, sizing, dismissal lifecycle, and automatic icon resolution across `GpBadge`, `GpTag`, `GpChip`, and `GpMessage`.
  - Added `GpBlockBase` standardizing JSON schema binding and action dispatching across `GpDynamicForm`, `GpDynamicHeader`, and `GpDynamicStats`.
  - Added `cx(...)` helper in `GpBase` for clean CSS class composition.
  - Removed redundant ControlValueAccessor method overrides across form controls.

- **Quality & Monorepo Verification**:
  - Verified 111 unit test suites across all packages.
  - Synchronized all packages to version `1.0.1`.

## [1.0.0] - 2026-09-01

- **Official v1.0.0 Production Release of the `@generatedpixel` UI Framework Suite**
- **New Package**: `@generatedpixel/gp-rules` — Dynamic, reactive Business Rules Engine with debounced keypress, blur, focus, change, click triggers, condition evaluators, formula calculators, and visual inspector/builder.
- **New Package**: `@generatedpixel/gp-grid` — High-performance responsive dynamic dashboard grid & KPI/Chart widget engine.
- **New Package**: `@generatedpixel/gp-blocks` — 84+ production-ready UI blocks and dynamic JSON metadata schema engine supporting all 22+ component types.
- **100% Angular Signals API**: Monorepo-wide migration across all 65+ components and 84+ blocks to native signals (`input()`, `model()`, `output()`, `contentChild()`, `viewChild()`, `computed()`).
- **Modern Angular Control Flow**: 100% migrated to `@if`, `@else`, `@for (track ...)`, and `@switch`.
- **New Form Components**: `<gp-label>`, `<gp-float-label>`, `<gp-inset-label>`, `<gp-date-range-picker>`, and `[gpInputText]` directive.
- **Design Tokens & Theming**: Expanded `@generatedpixel/gp-ui-theme` with 12 preset palettes, dark/light mode switching, and token-driven CSS variables.
- **Performance & Code-Splitting**: Full route-level lazy loading (`loadComponent`) across all demo pages and playgrounds.
- Synchronized all 8 packages to `1.0.0`: `@generatedpixel/gp-ui`, `@generatedpixel/gp-ui-theme`, `@generatedpixel/gp-ui-icons`, `@generatedpixel/gp-css`, `@generatedpixel/gp-grid`, `@generatedpixel/gp-blocks`, `@generatedpixel/gp-rules`.

- Release of gp-ui version 1.0.1
- Production components, theming tokens, and accessibility enhancements.

## [0.1.0] - 2026-08-25

- Release of @generatedpixel gp-ui suite v0.1.0
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.1] - 2026-08-25

- Release of @generatedpixel gp-ui suite v0.1.1
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.2] - 2026-08-26

- Release of @generatedpixel gp-ui suite v0.1.2
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.3] - 2026-08-26

- Release of @generatedpixel gp-ui suite v0.1.3
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.4] - 2026-08-26

- Release of @generatedpixel gp-ui suite v0.1.4
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.5] - 2026-08-26

- Release of @generatedpixel gp-ui suite v0.1.5
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.6] - 2026-08-27

- Release of @generatedpixel gp-ui suite v0.1.6
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.7] - 2026-08-27

- Release of @generatedpixel gp-ui suite v0.1.7
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, and @generatedpixel/gp-ui-icons

## [0.1.8] - 2026-08-27

- Release of @generatedpixel gp-ui suite v0.1.8
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [0.1.9] - 2026-08-27

- Release of @generatedpixel gp-ui suite v0.1.9
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [0.2.0] - 2026-08-28

- Release of @generatedpixel gp-ui suite v0.2.0
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [0.2.1] - 2026-08-28

- Release of @generatedpixel gp-ui suite v0.2.1
- Modular base class architecture (`GpButtonBase`, `GpInputBase`, `GpSelectBase`, `GpCheckableBase`, `GpMenuBase`, `GpOverlayBase`, `GpPanelBase`)
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [0.4.0] - 2026-08-29

- Release of @generatedpixel gp-ui suite v0.4.0
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [0.4.1] - 2026-08-30

- Release of @generatedpixel gp-ui suite v0.4.1
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [0.5.0] - 2026-08-30

- Release of @generatedpixel gp-ui suite v0.5.0
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, @generatedpixel/gp-css, @generatedpixel/gp-blocks, and @generatedpixel/gp-grid

## [0.6.0] - 2026-09-01

- Release of @generatedpixel gp-ui suite v0.6.0
- Added comprehensive Label Component Suite (`<gp-label>`, `<gp-float-label>`, `<gp-inset-label>`)
- Full migration across library packages to 100% Angular Signals API (`input()`, `model()`, `output()`, `contentChild()`, `viewChild()`, `computed()`, `signal()`)
- Extracted all HTML templates and SCSS stylesheets into dedicated, standalone `.component.html` and `.component.scss` files
- Added granular theme design tokens for labels, floating labels, inset labels, and form fields in `@generatedpixel/gp-ui-theme`
- Enhanced Pride theme and customizable scrollbar design tokens
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, @generatedpixel/gp-css, @generatedpixel/gp-blocks, and @generatedpixel/gp-grid

## [0.6.0] - 2026-09-01

- Release of @generatedpixel gp-ui suite v0.6.0
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [1.0.0] - 2026-09-01

- Release of @generatedpixel gp-ui suite v1.0.0
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [1.0.1] - 2026-09-02

- Release of @generatedpixel gp-ui suite v1.0.1
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css

## [1.0.2] - 2026-09-03
- Release of @generatedpixel gp-ui suite v1.0.2
- Synchronized @generatedpixel/gp-ui, @generatedpixel/gp-ui-theme, @generatedpixel/gp-ui-icons, and @generatedpixel/gp-css
