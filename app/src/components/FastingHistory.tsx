"use client";

import { Fast } from "@/types";

interface FastingHistoryProps {
  fasts: Fast[];
}

// Helper to format a Unix timestamp into a readable date and time
const formatDateTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

// Helper to calculate and format the actual duration of a fast
const formatDuration = (startTime: number, endTime: number | null) => {
  if (endTime === null) {
    return "In Progress";
  }
  const durationSeconds = endTime - startTime;
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const FastingHistory: React.FC<FastingHistoryProps> = ({ fasts }) => {
  if (fasts.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p>No fasting history yet.</p>
        <p>Complete your first fast to see it here!</p>
      </div>
    );
  }

  // We only want to show completed fasts in the history
  const completedFasts = fasts.filter(f => f.endTime !== null);

  if (completedFasts.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
        <p>No completed fasts yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Completed Fasts
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {completedFasts.map((fast) => (
          <li key={fast.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-md font-medium text-gray-900 dark:text-white">
                {formatDateTime(fast.startTime)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Actual: {formatDuration(fast.startTime, fast.endTime)}
              </p>
            </div>
            <div className="text-right">
                <p className="text-md font-semibold text-green-600 dark:text-green-400">
                    {fast.durationHours}h
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Target</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FastingHistory;
