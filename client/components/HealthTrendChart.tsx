"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface HistoryItem {
  _id?: string;
  id?: string;
  disease: string;
  result: {
    probability: number;
    risk_level: string;
  };
  createdAt: string;
}

interface HealthTrendChartProps {
  data: HistoryItem[];
}

export function HealthTrendChart({ data }: HealthTrendChartProps) {
  // Process data for Recharts
  // We need to flatten the data so that for a given date, we have keys like 'diabetes', 'heart-disease', etc.
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    // Sort by date ascending
    const sortedData = [...data].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedData.map((item) => ({
      date: new Date(item.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      fullDate: new Date(item.createdAt).toLocaleString(),
      // Use the disease name as the key and probability as the value
      [item.disease]: parseFloat((item.result.probability * 100).toFixed(1)),
      riskLevel: item.result.risk_level,
      originalDate: new Date(item.createdAt).getTime(),
    }));
  }, [data]);

  if (chartData.length < 2) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 p-8 text-center">
        <p className="text-lg font-medium mb-2">Not enough data to show trends</p>
        <p className="text-sm">Complete at least two assessments to see your health progression over time.</p>
      </div>
    );
  }

  // Custom Tooltip Component for better styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-800 p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize text-neutral-600 dark:text-neutral-300">
                {entry.name.replace("-", " ")}:
              </span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Health Risk Trends
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Tracking probability scores across all assessments over time.
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              unit="%" 
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => <span className="capitalize text-neutral-700 dark:text-neutral-300 font-medium ml-2">{value.replace("-", " ")}</span>} 
            />
            
            {/* Diabetes Line */}
            <Line
              type="monotone"
              dataKey="diabetes"
              name="Diabetes"
              stroke="#3b82f6" // blue-500
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls={true}
              animationDuration={1500}
            />

            {/* Heart Disease Line */}
            <Line
              type="monotone"
              dataKey="heart-disease"
              name="Heart Disease"
              stroke="#f43f5e" // rose-500
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls={true}
              animationDuration={1500}
            />

            {/* Parkinson's Line */}
            <Line
              type="monotone"
              dataKey="parkinsons"
              name="Parkinsons"
              stroke="#8b5cf6" // violet-500
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls={true}
              animationDuration={1500}
            />
            
            {/* Reference Lines for High/Low Risk */}
            <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" opacity={0.3} label={{ position: 'insideRight', value: 'High Risk', fill: 'red', fontSize: 10 }} />
            <ReferenceLine y={40} stroke="green" strokeDasharray="3 3" opacity={0.3} label={{ position: 'insideRight', value: 'Low Risk', fill: 'green', fontSize: 10 }} />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
