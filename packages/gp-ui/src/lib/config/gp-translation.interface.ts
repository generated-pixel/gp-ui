export interface GpTranslation {
  startsWith?: string;
  contains?: string;
  notContains?: string;
  endsWith?: string;
  equals?: string;
  notEquals?: string;
  noFilter?: string;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  dateIs?: string;
  dateIsNot?: string;
  dateBefore?: string;
  dateAfter?: string;
  clear?: string;
  apply?: string;
  matchAll?: string;
  matchAny?: string;
  addRule?: string;
  removeRule?: string;
  accept?: string;
  reject?: string;
  cancel?: string;
  close?: string;
  choose?: string;
  upload?: string;
  search?: string;
  today?: string;
  weekHeader?: string;
  firstDayOfWeek?: number;
  dateFormat?: string;
  dayNames?: string[];
  dayNamesShort?: string[];
  dayNamesMin?: string[];
  monthNames?: string[];
  monthNamesShort?: string[];
  emptyMessage?: string;
  emptyFilterMessage?: string;
  selectionMessage?: string;
  emptySelectionMessage?: string;
  pagination?: {
    firstPage?: string;
    prevPage?: string;
    nextPage?: string;
    lastPage?: string;
    pageReport?: string;
    rowsPerPage?: string;
  };
}

export const GP_DEFAULT_TRANSLATION: GpTranslation = {
  startsWith: 'Starts with',
  contains: 'Contains',
  notContains: 'Not contains',
  endsWith: 'Ends with',
  equals: 'Equals',
  notEquals: 'Not equals',
  noFilter: 'No Filter',
  lt: 'Less than',
  lte: 'Less than or equal to',
  gt: 'Greater than',
  gte: 'Greater than or equal to',
  dateIs: 'Date is',
  dateIsNot: 'Date is not',
  dateBefore: 'Date is before',
  dateAfter: 'Date is after',
  clear: 'Clear',
  apply: 'Apply',
  matchAll: 'Match All',
  matchAny: 'Match Any',
  addRule: 'Add Rule',
  removeRule: 'Remove Rule',
  accept: 'Yes',
  reject: 'No',
  cancel: 'Cancel',
  close: 'Close',
  choose: 'Choose',
  upload: 'Upload',
  search: 'Search...',
  today: 'Today',
  weekHeader: 'Wk',
  firstDayOfWeek: 0,
  dateFormat: 'mm/dd/yy',
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  emptyMessage: 'No records found',
  emptyFilterMessage: 'No results match the filter criteria',
  selectionMessage: '{0} items selected',
  emptySelectionMessage: 'No selected item',
  pagination: {
    firstPage: 'First Page',
    prevPage: 'Previous Page',
    nextPage: 'Next Page',
    lastPage: 'Last Page',
    pageReport: 'Showing {first} to {last} of {totalRecords} entries',
    rowsPerPage: 'Rows per page'
  }
};
