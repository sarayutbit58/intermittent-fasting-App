import { Fast, Settings } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gets the fasting duration in hours based on the selected mode.
 * @param mode The selected fasting mode.
 * @param customFastingHours The custom duration, if applicable.
 * @returns The duration of the fast in hours.
 */
export const getDurationFromMode = (
  mode: Settings['fastingMode'],
  customFastingHours?: number
): number => {
  switch (mode) {
    case '16:8':
      return 16;
    case '18:6':
      return 18;
    case '20:4':
      return 20;
    case 'OMAD': // One Meal a Day
      return 23; // Typically 23 hours of fasting
    case '5:2':
        // This mode is about calorie restriction for 2 days, not continuous fasting.
        // For simplicity in a timer app, we can treat it as a 24-hour fast on those days.
        // A more complex implementation would be needed for true 5:2 tracking.
      return 24;
    case 'custom':
      return customFastingHours || 24; // Default to 24 if not provided
    default:
      return 16; // Default to 16:8
  }
};

/**
 * Creates a new fasting session object.
 * @param settings The user's current settings.
 * @returns A new Fast object representing the session that just started.
 */
export const startFast = (settings: Settings): Fast => {
  const durationHours = getDurationFromMode(
    settings.fastingMode,
    settings.customFastingHours
  );

  const newFast: Fast = {
    id: uuidv4(),
    startTime: Math.floor(Date.now() / 1000),
    endTime: null,
    durationHours: durationHours,
  };

  return newFast;
};

/**
 * Ends an ongoing fasting session.
 * @param fast The fasting session to end.
 * @returns The updated Fast object with the endTime set.
 */
export const endFast = (fast: Fast): Fast => {
  if (fast.endTime !== null) {
    // Fast has already ended, return it as is.
    console.warn("Attempted to end a fast that has already been completed.");
    return fast;
  }

  return {
    ...fast,
    endTime: Math.floor(Date.now() / 1000),
  };
};

/**
 * Checks if a fast is currently in progress.
 * @param fast A Fast object or null/undefined.
 * @returns True if the fast is ongoing, false otherwise.
 */
export const isFasting = (fast: Fast | null | undefined): boolean => {
    return !!fast && fast.endTime === null;
}
