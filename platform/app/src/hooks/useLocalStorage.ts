import { useState } from 'react';

function useLocalStorage(key: string, initialValue: string | null = null) {
  const [storedValue, setStoredValue] = useState<string | null>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? item : initialValue;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return initialValue;
    }
  });

  const setValue = (value: string | null) => {
    try {
      setStoredValue(value);
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
