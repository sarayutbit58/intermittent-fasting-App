"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { AppData } from "@/types";
import { getAppData } from "@/lib/storage";
import FastingHistory from "@/components/FastingHistory";
import StatsSummary from "@/components/StatsSummary";

export default function HistoryPage() {
  const [appData, setAppData] = useState<AppData | null>(null);

  useEffect(() => {
    setAppData(getAppData());
  }, []);

  if (!appData) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <p>Loading History...</p>
        </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl text-left w-full">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              History & Stats
            </h1>
            <Link href="/" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                Back to Dashboard
            </Link>
        </div>

        <StatsSummary stats={appData.stats} />
        <FastingHistory fasts={appData.fasts} />

      </div>
    </main>
  );
}
