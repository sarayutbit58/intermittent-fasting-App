"use client";

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { AppData } from "@/types";
import { getAppData, saveAppData } from "@/lib/storage";
import SettingsForm from "@/components/SettingsForm";

// New component for Data Management
const DataManagement = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        try {
            const data = getAppData();
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(data, null, 2)
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = `fasting-app-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
        } catch (error) {
            alert("Failed to export data.");
            console.error("Export error:", error);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read.");

                const importedData = JSON.parse(text);

                // Basic validation to ensure it looks like our data
                if (importedData.settings && importedData.fasts && importedData.stats) {
                    if (window.confirm("This will overwrite all current application data. This action cannot be undone. Are you sure you want to continue?")) {
                        saveAppData(importedData);
                        alert("Data imported successfully! The page will now reload to apply the changes.");
                        window.location.reload();
                    }
                } else {
                    throw new Error("The selected file does not have the correct data structure.");
                }
            } catch (error) {
                if (error instanceof Error) {
                    alert(`Error importing data: ${error.message}`);
                } else {
                    alert('An unknown error occurred during import.');
                }
            }
        };
        reader.onerror = () => {
            alert("Failed to read the file.");
        }
        reader.readAsText(file);

        // Reset file input to allow importing the same file again
        event.target.value = '';
    };

    return (
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Data Management
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleExport}
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
                >
                    Export Data to JSON
                </button>
                <button
                    onClick={handleImportClick}
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors"
                >
                    Import Data from JSON
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />
            </div>
        </div>
    );
};


export default function SettingsPage() {
  const [appData, setAppData] = useState<AppData | null>(null);

  useEffect(() => {
    setAppData(getAppData());
  }, []);

  const handleSettingsSaved = (newSettings: AppData['settings']) => {
    const currentData = getAppData();
    const updatedData = { ...currentData, settings: newSettings };
    saveAppData(updatedData);
    setAppData(updatedData);
  };

  if (!appData) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <p>Loading Settings...</p>
        </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl text-left w-full">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Settings
            </h1>
            <Link href="/" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                Back to Dashboard
            </Link>
        </div>

        <SettingsForm initialSettings={appData.settings} onSettingsSaved={handleSettingsSaved} />
        <DataManagement />

      </div>
    </main>
  );
}
