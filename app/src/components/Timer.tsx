"use client";

import { useState, useEffect } from 'react';

interface TimerProps {
  startTime: number; // Unix timestamp in seconds
  durationHours: number;
}

// Helper function to format time
const formatTime = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const Timer: React.FC<TimerProps> = ({ startTime, durationHours }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const endTime = startTime + durationHours * 3600;

    const calculateRemainingTime = () => {
      const now = Math.floor(Date.now() / 1000);
      return endTime - now;
    };

    setRemainingTime(calculateRemainingTime());

    const interval = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [startTime, durationHours]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300">
        Time Remaining
      </h2>
      <p className="text-6xl font-bold text-gray-900 dark:text-white font-mono">
        {formatTime(remainingTime)}
      </p>
    </div>
  );
};

export default Timer;
