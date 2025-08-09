import type { AppData } from '@/types';

const STORAGE_KEY = 'fasting-app-data';

/**
 * Returns the default initial state for the application.
 */
function getDefaultData(): AppData {
    return {
        profile: {
          weightUnit: 'kg',
          heightUnit: 'cm',
        },
        settings: {
          fastingMode: '16:8',
          customFastingHours: 16,
          notifications: {
            enabled: true,
            reminders: {
              drinkWater: true,
              progressive: true,
            },
          },
          theme: 'system',
        },
        fasts: [],
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          averageDurationHours: 0,
          successRatePercentage: 0,
          totalFasts: 0,
        },
      };
}

/**
 * Retrieves the entire application data object from localStorage.
 * If no data is found, it returns a default initial state.
 * @returns The AppData object.
 */
export function getAppData(): AppData {
  // localStorage is only available in the browser.
  if (typeof window === 'undefined') {
    // Return a default structure for server-side rendering or build steps.
    return getDefaultData();
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      // Basic check to see if the parsed data looks like our AppData
      const parsedData = JSON.parse(rawData);
      if (parsedData.settings && parsedData.fasts) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error('Failed to parse data from localStorage', error);
    // If parsing fails, fall back to default data.
  }

  return getDefaultData();
}

/**
 * Saves the entire application data object to localStorage.
 * @param data The AppData object to save.
 */
export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const rawData = JSON.stringify(data);
    window.localStorage.setItem(STORAGE_KEY, rawData);
  } catch (error) {
    console.error('Failed to save data to localStorage', error);
  }
}
