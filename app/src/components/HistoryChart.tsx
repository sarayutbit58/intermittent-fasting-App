"use client";

import { Fast } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HistoryChartProps {
  fasts: Fast[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ fasts }) => {
  const completedFasts = fasts.filter((f) => f.endTime !== null);

  if (completedFasts.length === 0) {
    return null; // Don't render a chart if there's no data
  }

  const chartData = completedFasts
    .map((fast) => ({
      // Format the date for the X-axis label, e.g., "May 23"
      name: new Date(fast.startTime * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      // Actual duration in hours
      "Actual Duration": parseFloat(((fast.endTime! - fast.startTime) / 3600).toFixed(1)),
      // Target duration in hours
      "Target Duration": fast.durationHours,
    }))
    .reverse(); // Show oldest fasts first

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mt-8">
       <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Fasting Progress
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: -10, // Adjust to make Y-axis labels visible
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis unit="h" allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem'
            }}
           />
          <Legend />
          <Bar dataKey="Target Duration" fill="#8884d8" opacity={0.6} />
          <Bar dataKey="Actual Duration" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
