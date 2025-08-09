"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Timer from "@/components/Timer";
import { AppData } from "@/types";
import { isFasting, startFast, endFast } from "@/lib/fasting";
import { getAppData, saveAppData } from "@/lib/storage";
import { calculateStreaks, calculateAverageDuration, calculateSuccessRate } from "@/lib/stats";

export default function Home() {
  // Initialize state from localStorage, ensuring this only runs on the client.
  const [appData, setAppData] = useState<AppData | null>(null);

  useEffect(() => {
    setAppData(getAppData());
  }, []);

  const refreshData = () => {
    setAppData(getAppData());
  };

  const handleStartFast = () => {
    const currentData = getAppData();
    const currentFast = currentData.fasts.find(f => isFasting(f));

    if (currentFast) {
        alert("A fast is already in progress.");
        return;
    }

    const newFast = startFast(currentData.settings);
    const updatedData = {
        ...currentData,
        fasts: [newFast, ...currentData.fasts],
    };

    saveAppData(updatedData);
    refreshData();
  };

  const handleEndFast = () => {
    const currentData = getAppData();
    const currentFastIndex = currentData.fasts.findIndex(f => isFasting(f));

    if (currentFastIndex === -1) {
        alert("No active fast to end.");
        return;
    }

    const completedFast = endFast(currentData.fasts[currentFastIndex]);
    currentData.fasts[currentFastIndex] = completedFast;

    // Recalculate stats
    const completedFasts = currentData.fasts.filter(f => f.endTime !== null);
    const newStreaks = calculateStreaks(currentData.fasts);

    currentData.stats = {
      currentStreak: newStreaks.currentStreak,
      longestStreak: newStreaks.longestStreak,
      averageDurationHours: calculateAverageDuration(currentData.fasts),
      successRatePercentage: calculateSuccessRate(currentData.fasts),
      totalFasts: completedFasts.length,
    };

    saveAppData(currentData);
    refreshData();
  };

  if (!appData) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <p>Loading App...</p>
        </div>
    );
  }

  const currentFast = appData.fasts.find(f => isFasting(f));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
          Intermittent Fasting
        </h1>

        {currentFast ? (
            <>
              <div className="p-8 bg-white dark:bg-gray-800 rounded-full shadow-2xl w-80 h-80 flex items-center justify-center mx-auto mb-8">
                <Timer
                  startTime={currentFast.startTime}
                  durationHours={currentFast.durationHours}
                />
              </div>
              <button
                onClick={handleEndFast}
                className="px-8 py-3 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                End Fast
              </button>
            </>
        ) : (
            <>
              <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm mx-auto mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  You're not fasting
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Ready to start your next fast?
                </p>
              </div>
              <button
                onClick={handleStartFast}
                className="px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-colors"
              >
                Start Fasting ({appData.settings.fastingMode})
              </button>
            </>
        )}

        <div className="mt-12 flex justify-center gap-6">
          <Link href="/history" className="text-blue-500 hover:underline">
            History
          </Link>
          <Link href="/settings" className="text-blue-500 hover:underline">
            Settings
          </Link>
        </div>
      </div>
    </main>
  );
}
