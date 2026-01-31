export const toProperCase = (str: string) =>
    str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

// Type definitions for better type safety
type FlattenedObject = Record<string, any>;
type InputValue = any;

/**
 * Flattens a nested JSON object into a single-level object
 * @param obj - The object to flatten
 * @param prefix - Optional prefix for keys (used internally for recursion)
 * @param separator - Separator to use between nested keys (default: '.')
 * @returns Flattened object
 */
export function flattenJson(
  obj: InputValue, 
  prefix: string = '', 
  separator: string = '.'
): FlattenedObject {
  const flattened: FlattenedObject = {};

  function flatten(current: InputValue, currentPrefix: string = ''): void {
    if (current === null || current === undefined) {
      flattened[currentPrefix || 'root'] = current;
      return;
    }

    if (Array.isArray(current)) {
      if (current.length === 0) {
        flattened[currentPrefix] = [];
      } else {
        current.forEach((item, index) => {
          const key = currentPrefix ? `${currentPrefix}${separator}${index}` : `${index}`;
          flatten(item, key);
        });
      }
    } else if (typeof current === 'object') {
      const keys = Object.keys(current);
      if (keys.length === 0) {
        flattened[currentPrefix] = {};
      } else {
        keys.forEach(key => {
          const newKey = currentPrefix ? `${currentPrefix}${separator}${key}` : key;
          flatten(current[key], newKey);
        });
      }
    } else {
      flattened[currentPrefix] = current;
    }
  }

  flatten(obj, prefix);
  return flattened;
}