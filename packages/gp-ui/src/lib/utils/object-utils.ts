export class ObjectUtils {
  public static resolveFieldData(data: any, field: string | null | undefined): any {
    if (!data || !field) {
      return data;
    }

    if (field.indexOf('.') === -1) {
      return data[field];
    }

    const fields: string[] = field.split('.');
    let value = data;
    for (let i = 0; i < fields.length; ++i) {
      if (value == null) {
        return null;
      }
      value = value[fields[i]];
    }
    return value;
  }

  public static equals(obj1: any, obj2: any, field?: string): boolean {
    if (field) {
      return ObjectUtils.resolveFieldData(obj1, field) === ObjectUtils.resolveFieldData(obj2, field);
    }
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  public static filter(value: any, filterValue: any, matchMode: string): boolean {
    if (filterValue === undefined || filterValue === null || filterValue === '') {
      return true;
    }
    if (value === undefined || value === null) {
      return false;
    }

    const strValue = String(value).toLowerCase();
    const strFilter = String(filterValue).toLowerCase();

    switch (matchMode) {
      case 'startsWith':
        return strValue.startsWith(strFilter);
      case 'contains':
        return strValue.includes(strFilter);
      case 'endsWith':
        return strValue.endsWith(strFilter);
      case 'equals':
        return strValue === strFilter;
      case 'notEquals':
        return strValue !== strFilter;
      case 'gt':
        return Number(value) > Number(filterValue);
      case 'gte':
        return Number(value) >= Number(filterValue);
      case 'lt':
        return Number(value) < Number(filterValue);
      case 'lte':
        return Number(value) <= Number(filterValue);
      default:
        return strValue.includes(strFilter);
    }
  }

  public static clone<T>(value: T): T {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (value instanceof Date) {
      return new Date(value.getTime()) as any;
    }
    if (Array.isArray(value)) {
      return value.map(item => ObjectUtils.clone(item)) as any;
    }
    const clonedObj: any = {};
    for (const prop in value) {
      if (Object.prototype.hasOwnProperty.call(value, prop)) {
        clonedObj[prop] = ObjectUtils.clone((value as any)[prop]);
      }
    }
    return clonedObj;
  }
}
