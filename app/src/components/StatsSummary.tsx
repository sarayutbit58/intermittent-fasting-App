"use client";

import { AppData } from "@/types";

interface StatsSummaryProps {
  stats: AppData['stats'];
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center shadow">
    <p className="text-2xl sm:text-3xl font-bold text-blue-500 dark:text-blue-400">
      {value}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
  </div>
);

const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Current Streak" value={`${stats.currentStreak} days`} />
        <StatCard label="Longest Streak" value={`${stats.longestStreak} days`} />
        <StatCard label="Success Rate" value={`${stats.successRatePercentage.toFixed(0)}%`} />
        <StatCard label="Avg Duration" value={`${stats.averageDurationHours.toFixed(1)}h`} />
      </div>
    </div>
  );
};

export default StatsSummary;
