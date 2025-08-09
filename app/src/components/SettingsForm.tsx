"use client";

import { useState } from 'react';
import { Settings } from '@/types';
import { useTheme } from '@/components/ThemeProvider';

interface SettingsFormProps {
  initialSettings: Settings;
  onSettingsSaved: (newSettings: Settings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ initialSettings, onSettingsSaved }) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setTheme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value as any }));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as Settings['theme'];
    setSettings(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettingsSaved(settings);
    setSuccessMessage('Settings saved!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      <div>
        <label htmlFor="fastingMode" className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
          Default Fasting Mode
        </label>
        <select
          id="fastingMode"
          name="fastingMode"
          value={settings.fastingMode}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="16:8">16:8</option>
          <option value="18:6">18:6</option>
          <option value="20:4">20:4</option>
          <option value="OMAD">OMAD (One Meal a Day)</option>
        </select>
      </div>

      <div>
        <label htmlFor="theme" className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
          Theme
        </label>
        <select
          id="theme"
          name="theme"
          value={settings.theme}
          onChange={handleThemeChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
      {successMessage && <p className="text-green-500 mt-4 text-right">{successMessage}</p>}
    </form>
  );
};

export default SettingsForm;
