/**
 * @file dependent-dropdown-rules.ts
 * Business rules for cascading and dependent dropdown selectors.
 */

import { GpBusinessRule } from '../types/rule.types';

export const STATES_BY_COUNTRY: Record<string, Array<{ label: string; value: string }>> = {
  US: [
    { label: 'California', value: 'CA' },
    { label: 'Texas', value: 'TX' },
    { label: 'New York', value: 'NY' },
    { label: 'Washington', value: 'WA' }
  ],
  CA: [
    { label: 'Ontario', value: 'ON' },
    { label: 'Quebec', value: 'QC' },
    { label: 'British Columbia', value: 'BC' },
    { label: 'Alberta', value: 'AB' }
  ],
  UK: [
    { label: 'Greater London', value: 'LDN' },
    { label: 'Manchester', value: 'MAN' },
    { label: 'Scotland', value: 'SCT' }
  ],
  DE: [
    { label: 'Bavaria', value: 'BY' },
    { label: 'Berlin', value: 'BE' },
    { label: 'Hesse', value: 'HE' }
  ]
};

export const GP_DEPENDENT_COUNTRY_RULE: GpBusinessRule = {
  id: 'country-state-cascade',
  name: 'Country to State Cascader',
  description: 'Dynamically updates state options and clears previous state selection when country changes.',
  trigger: ['change', 'valueChange', 'select'],
  actions: [
    {
      type: 'custom',
      execute: (context) => {
        const country = context.get('country');
        const states = STATES_BY_COUNTRY[country] || [];
        context.setOptions('state', states);
        context.set('state', states.length > 0 ? states[0].value : null);
        context.setDisabled('state', states.length === 0);
      }
    }
  ]
};
