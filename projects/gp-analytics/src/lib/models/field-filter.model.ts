import { resolveDisplayValue, LocalizedValueMapping } from './localized-value.model';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'startsWith'
  | 'in'
  | 'notIn';

export type FilterMatchTarget = 'raw' | 'display' | 'both';

export interface FieldFilter {
  id?: string;
  fieldName: string;
  operator: FilterOperator;
  value: unknown;
  matchTarget?: FilterMatchTarget;
  locale?: string;
}

export interface FieldFilterOptions {
  mapping?: LocalizedValueMapping;
  customResolver?: (val: unknown, locale: string) => string;
  activeLocale?: string;
}

/**
 * Evaluates whether a raw row value satisfies a FieldFilter,
 * taking localization (display value vs raw value) into consideration.
 */
export function evaluateFieldFilter(
  rawValue: unknown,
  filter: FieldFilter,
  options: FieldFilterOptions = {},
): boolean {
  const target = filter.matchTarget ?? 'both';
  const activeLocale = filter.locale || options.activeLocale || 'en-US';

  const rawMatch = evaluateCondition(rawValue, filter.operator, filter.value);

  // If match target is raw-only, return raw match immediately
  if (target === 'raw') {
    return rawMatch;
  }

  // Calculate localized display value for display-aware matching
  const displayVal = resolveDisplayValue(
    rawValue,
    options.mapping,
    options.customResolver,
    activeLocale,
  );

  const displayMatch = evaluateCondition(displayVal, filter.operator, filter.value);

  if (target === 'display') {
    return displayMatch;
  }

  // 'both': satisfies filter if either raw value matches or localized display value matches
  return rawMatch || displayMatch;
}

function evaluateCondition(actual: unknown, op: FilterOperator, expected: unknown): boolean {
  if (actual === null || actual === undefined) {
    return op === 'neq' ? expected !== null && expected !== undefined : false;
  }

  const strActual = String(actual).toLowerCase().trim();
  const strExpected = expected !== null && expected !== undefined ? String(expected).toLowerCase().trim() : '';

  switch (op) {
    case 'eq':
      if (typeof actual === 'number' && !isNaN(Number(expected))) {
        return Number(actual) === Number(expected);
      }
      return strActual === strExpected;

    case 'neq':
      if (typeof actual === 'number' && !isNaN(Number(expected))) {
        return Number(actual) !== Number(expected);
      }
      return strActual !== strExpected;

    case 'gt':
      return Number(actual) > Number(expected);

    case 'gte':
      return Number(actual) >= Number(expected);

    case 'lt':
      return Number(actual) < Number(expected);

    case 'lte':
      return Number(actual) <= Number(expected);

    case 'contains':
      return strActual.includes(strExpected);

    case 'startsWith':
      return strActual.startsWith(strExpected);

    case 'in':
      if (Array.isArray(expected)) {
        return expected.some((exp) =>
          typeof actual === 'number' && !isNaN(Number(exp))
            ? Number(actual) === Number(exp)
            : strActual === String(exp).toLowerCase().trim(),
        );
      }
      return strActual === strExpected;

    case 'notIn':
      if (Array.isArray(expected)) {
        return !expected.some((exp) =>
          typeof actual === 'number' && !isNaN(Number(exp))
            ? Number(actual) === Number(exp)
            : strActual === String(exp).toLowerCase().trim(),
        );
      }
      return strActual !== strExpected;

    default:
      return true;
  }
}
