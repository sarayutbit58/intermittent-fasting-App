import { Fast } from '@/types';

/**
 * Calculates the average duration of completed fasts in hours.
 * @param fasts An array of Fast objects.
 * @returns The average duration in hours, or 0 if no fasts are completed.
 */
export const calculateAverageDuration = (fasts: Fast[]): number => {
  const completedFasts = fasts.filter(f => f.endTime !== null);
  if (completedFasts.length === 0) return 0;

  const totalDurationSeconds = completedFasts.reduce(
    (acc, fast) => acc + (fast.endTime! - fast.startTime),
    0
  );

  const averageSeconds = totalDurationSeconds / completedFasts.length;
  return averageSeconds / 3600; // convert to hours
};

/**
 * Calculates the success rate of fasts.
 * Success is defined as the actual duration being >= target duration.
 * @param fasts An array of Fast objects.
 * @returns The success rate as a percentage (0-100), or 0 if no fasts are completed.
 */
export const calculateSuccessRate = (fasts: Fast[]): number => {
    const completedFasts = fasts.filter(f => f.endTime !== null);
    if (completedFasts.length === 0) return 0;

    const successfulFasts = completedFasts.filter(fast => {
        const actualDurationHours = (fast.endTime! - fast.startTime) / 3600;
        return actualDurationHours >= fast.durationHours;
    });

    return (successfulFasts.length / completedFasts.length) * 100;
};

/**
 * Calculates the current and longest fasting streaks based on calendar days.
 * @param fasts An array of Fast objects.
 * @returns An object containing the current and longest streaks.
 */
export const calculateStreaks = (fasts: Fast[], referenceDate: Date = new Date()): { currentStreak: number; longestStreak: number } => {
    const completedFasts = fasts.filter(f => f.endTime !== null);
    if (completedFasts.length < 1) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique days on which fasts were started, in descending order
    const fastDays = [
        ...new Set(
            completedFasts.map(f => new Date(f.startTime * 1000).setHours(0, 0, 0, 0))
        ),
    ].sort((a, b) => b - a);

    if (fastDays.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    let longestStreak = 0;
    let currentStreak = 0;

    // Calculate longest streak in history
    if (fastDays.length > 0) {
        longestStreak = 1;
        let runningStreak = 1;
        for (let i = 0; i < fastDays.length - 1; i++) {
            const day1 = fastDays[i];
            const day2 = fastDays[i + 1];
            const expectedPreviousDay = new Date(day1).setDate(new Date(day1).getDate() - 1);

            if (day2 === expectedPreviousDay) {
                runningStreak++;
            } else {
                runningStreak = 1; // Reset
            }

            if (runningStreak > longestStreak) {
                longestStreak = runningStreak;
            }
        }
    }

    // Calculate current streak
    const today = referenceDate.setHours(0, 0, 0, 0);
    const yesterday = new Date(today).setDate(new Date(today).getDate() - 1);

    if (fastDays[0] === today || fastDays[0] === yesterday) {
        currentStreak = 1;
        for (let i = 0; i < fastDays.length - 1; i++) {
            const day1 = fastDays[i];
            const day2 = fastDays[i + 1];
            const expectedPreviousDay = new Date(day1).setDate(new Date(day1).getDate() - 1);

            if (day2 === expectedPreviousDay) {
                currentStreak++;
            } else {
                break; // Current streak is broken
            }
        }
    }

    return { currentStreak, longestStreak };
};
