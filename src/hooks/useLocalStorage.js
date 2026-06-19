import { useState } from 'react';

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
      if (typeof initialValue === 'object' && initialValue !== null) {
        if (typeof parsed !== 'object' || parsed === null) {
          return initialValue;
        }
      }
      return parsed;
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
