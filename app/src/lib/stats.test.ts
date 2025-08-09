import { Fast } from '@/types';
import {
  calculateAverageDuration,
  calculateSuccessRate,
  calculateStreaks,
} from './stats';

// Mock data for testing
const now = new Date('2025-08-10T10:00:00.000Z');
const nowSeconds = now.getTime() / 1000;
const hour = 3600;
const day = 24 * hour;

describe('Statistics Calculation', () => {
  describe('calculateAverageDuration', () => {
    it('should return 0 for no completed fasts', () => {
      const fasts: Fast[] = [{ id: '1', startTime: nowSeconds, endTime: null, durationHours: 16 }];
      expect(calculateAverageDuration(fasts)).toBe(0);
    });

    it('should calculate the correct average duration in hours', () => {
      const fasts: Fast[] = [
        { id: '1', startTime: nowSeconds - 16 * hour, endTime: nowSeconds, durationHours: 16 }, // 16h
        { id: '2', startTime: nowSeconds - 20 * hour, endTime: nowSeconds, durationHours: 18 }, // 20h
      ];
      expect(calculateAverageDuration(fasts)).toBeCloseTo(18); // (16+20)/2
    });
  });

  describe('calculateSuccessRate', () => {
    it('should return 0 for no completed fasts', () => {
        const fasts: Fast[] = [{ id: '1', startTime: nowSeconds, endTime: null, durationHours: 16 }];
        expect(calculateSuccessRate(fasts)).toBe(0);
    });

    it('should calculate the correct success rate', () => {
        const fasts: Fast[] = [
            { id: '1', startTime: nowSeconds - 16 * hour, endTime: nowSeconds, durationHours: 16 }, // success
            { id: '2', startTime: nowSeconds - 17 * hour, endTime: nowSeconds, durationHours: 18 }, // fail
            { id: '3', startTime: nowSeconds - 18 * hour, endTime: nowSeconds, durationHours: 18 }, // success
        ];
        expect(calculateSuccessRate(fasts)).toBeCloseTo((2/3) * 100);
    });
  });

  describe('calculateStreaks', () => {
    it('should return 0 for no fasts', () => {
        expect(calculateStreaks([], now)).toEqual({ currentStreak: 0, longestStreak: 0 });
    });

    it('should calculate current streak correctly for today and yesterday', () => {
        const fasts: Fast[] = [
            { id: 'a', startTime: nowSeconds - 5 * hour, endTime: nowSeconds, durationHours: 16 }, // today
            { id: 'b', startTime: nowSeconds - day - 5 * hour, endTime: nowSeconds - day, durationHours: 16 }, // yesterday
        ];
        expect(calculateStreaks(fasts, now)).toEqual({ currentStreak: 2, longestStreak: 2 });
    });

    it('should have a current streak of 1 if last fast was today', () => {
        const fasts: Fast[] = [
            { id: 'a', startTime: nowSeconds - 5 * hour, endTime: nowSeconds, durationHours: 16 }, // today
            { id: 'b', startTime: nowSeconds - 2 * day - 5 * hour, endTime: nowSeconds - 2 * day, durationHours: 16 }, // day before yesterday
        ];
        expect(calculateStreaks(fasts, now)).toEqual({ currentStreak: 1, longestStreak: 1 });
    });

    it('should have a current streak of 0 if last fast was not recent', () => {
        const fasts: Fast[] = [
            { id: 'a', startTime: nowSeconds - 3 * day, endTime: nowSeconds - 3 * day + 16*hour, durationHours: 16 },
        ];
        expect(calculateStreaks(fasts, now).currentStreak).toBe(0);
    });

    it('should correctly identify the longest streak when it is not the current streak', () => {
        const fasts: Fast[] = [
            { id: 'a', startTime: nowSeconds - 5 * day, endTime: nowSeconds - 5 * day + 16*hour, durationHours: 16 }, // a lone fast, breaks current streak
            { id: 'b', startTime: nowSeconds - 10 * day, endTime: nowSeconds - 10 * day + 16*hour, durationHours: 16 }, // start of a 3-day streak
            { id: 'c', startTime: nowSeconds - 11 * day, endTime: nowSeconds - 11 * day + 16*hour, durationHours: 16 },
            { id: 'd', startTime: nowSeconds - 12 * day, endTime: nowSeconds - 12 * day + 16*hour, durationHours: 16 },
        ];
        expect(calculateStreaks(fasts, now)).toEqual({ currentStreak: 0, longestStreak: 3 });
    });

    it('should handle an ongoing fast gracefully', () => {
        const fasts: Fast[] = [
            { id: 'a', startTime: nowSeconds - 5 * hour, endTime: null, durationHours: 16 }, // ongoing
            { id: 'b', startTime: nowSeconds - day - 5 * hour, endTime: nowSeconds - day, durationHours: 16 }, // yesterday
        ];
        expect(calculateStreaks(fasts, now)).toEqual({ currentStreak: 1, longestStreak: 1 });
    });
  });
});
