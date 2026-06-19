import { useState } from 'react';

/**
 * A custom hook to persist state in localStorage
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The fallback value if nothing is saved
 */
function validateSchema(parsed, template) {
  if (typeof template !== 'object' || template === null) {
    if (parsed === null || parsed === undefined) return template;
    return typeof parsed === typeof template ? parsed : template;
  }
  
  if (typeof parsed !== 'object' || parsed === null) {
    return template;
  }
  
  if (Array.isArray(template)) {
    if (!Array.isArray(parsed)) return template;
    if (template.length === 0) return parsed;
    const itemTemplate = template[0];
    return parsed.map(item => validateSchema(item, itemTemplate));
  }
  
  const validated = {};
  for (const key in template) {
    if (Object.prototype.hasOwnProperty.call(template, key)) {
      if (!(key in parsed) || parsed[key] === undefined) {
        validated[key] = template[key];
      } else {
        validated[key] = validateSchema(parsed[key], template[key]);
      }
    }
  }
  return validated;
}

/**
 * A custom hook to persist state in localStorage
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The fallback value if nothing is saved
 */
export function useLocalStorage(key, initialValue) {
  // Get initial state from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      const parsed = JSON.parse(item);
      if (parsed === null || parsed === undefined) return initialValue;
      return validateSchema(parsed, initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped setter function that updates state and localStorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
