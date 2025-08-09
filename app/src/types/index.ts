// app/src/types/index.ts

/**
 * Represents a single fasting session recorded by the user.
 */
export interface Fast {
  id: string; // Unique identifier for the fast
  startTime: number; // Unix timestamp (in seconds)
  endTime: number | null; // Unix timestamp (in seconds), null if ongoing
  durationHours: number; // The target duration in hours (e.g., 16, 18, 20)
  notes?: string; // Optional user notes for the fast
}

/**
 * Represents the user's application settings.
 */
export interface Settings {
  fastingMode: '16:8' | '18:6' | '20:4' | 'OMAD' | '5:2' | 'custom';
  customFastingHours?: number;
  notifications: {
    enabled: boolean;
    reminders: {
      drinkWater: boolean;
      progressive: boolean; // e.g., 30, 15, 5 mins before end
    };
  };
  theme: 'light' | 'dark' | 'system';
}

/**
 * Represents the user's profile and tracked data.
 * For a simple, personal app, we might not need a full user model with login,
 * so this can represent the data for the single user of the app.
 */
export interface UserProfile {
  weight?: number; // in kilograms
  weightUnit: 'kg' | 'lbs';
  height?: number; // in centimeters
  heightUnit: 'cm' | 'in';
}

/**
 * Represents the complete state of the fasting data for a user.
 * In a simple key-value store, we might store this entire object under one key.
 */
export interface AppData {
  profile: UserProfile;
  settings: Settings;
  fasts: Fast[];
  stats: {
    currentStreak: number;
    longestStreak: number;
    averageDurationHours: number;
    successRatePercentage: number;
    totalFasts: number;
  };
}
