import { useState, useEffect, useRef } from 'react';

// Wrapper for versioned data
interface StorageData<T> {
    version: number;
    value: T;
}

export function useLocalStorage<T>(key: string, initialValue: T, version: number = 1) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                const parsed: StorageData<T> = JSON.parse(item);

                // Simple version check: if version mismatches, discard (or migrate in future) and use initial
                if (parsed.version === version) {
                    return parsed.value;
                } else {
                    console.warn(`Version mismatch for ${key}: stored ${parsed.version} vs current ${version}. Resetting.`);
                    return initialValue;
                }
            }
            return initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            if (typeof window !== 'undefined') {
                const data: StorageData<T> = { version, value: valueToStore };
                window.localStorage.setItem(key, JSON.stringify(data));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}
