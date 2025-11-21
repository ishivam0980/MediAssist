"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface HistoryItem {
  _id?: string;
  id?: string;
  disease: string;
  result: {
    probability: number;
  };
  createdAt: string;
}

interface HistoryChartProps {
  data: HistoryItem[];
}

export function HistoryChart({ data }: HistoryChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Process data for the chart
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    // Sort by date ascending
    const sortedData = [...data].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedData.map((item) => ({
      ...item,
      date: new Date(item.createdAt),
      value: item.result.probability * 100, // Convert to percentage
    }));
  }, [data]);

  if (chartData.length < 2) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-neutral-500">
        Not enough data for visualization
      </div>
    );
  }

  // Chart dimensions
  const width = 800;
  const height = 200;
  const padding = 20;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Scales
  const minDate = chartData[0].date.getTime();
  const maxDate = chartData[chartData.length - 1].date.getTime();
  const timeSpan = maxDate - minDate;

  const getX = (date: Date) => {
    if (timeSpan === 0) return padding + graphWidth / 2;
    return padding + ((date.getTime() - minDate) / timeSpan) * graphWidth;
  };

  const getY = (value: number) => {
    return height - padding - (value / 100) * graphHeight;
  };

  // Group by disease for colors
  const getColor = (disease: string) => {
    switch (disease) {
      case "diabetes":
        return "#3b82f6"; // blue-500
      case "heart-disease":
        return "#f43f5e"; // rose-500
      case "parkinsons":
        return "#8b5cf6"; // violet-500
      default:
        return "#10b981"; // emerald-500
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        Risk Trends Over Time
      </h3>
      
      <div className="relative w-full h-[200px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid Lines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line
                x1={padding}
                y1={getY(tick)}
                x2={width - padding}
                y2={getY(tick)}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 10}
                y={getY(tick) + 4}
                textAnchor="end"
                className="text-[10px] fill-neutral-400"
              >
                {tick}%
              </text>
            </g>
          ))}

          {/* Data Lines & Points */}
          {chartData.map((item, i) => {
            if (i === 0) return null;
            const prev = chartData[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={getX(prev.date)}
                y1={getY(prev.value)}
                x2={getX(item.date)}
                y2={getY(item.value)}
                stroke={getColor(item.disease)}
                strokeWidth="2"
                strokeOpacity="0.5"
              />
            );
          })}

          {chartData.map((item, i) => (
            <g key={`point-${i}`}>
              <circle
                cx={getX(item.date)}
                cy={getY(item.value)}
                r="4"
                fill={getColor(item.disease)}
                className="cursor-pointer transition-all hover:r-6"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {hoveredPoint === i && (
                <g>
                  <rect
                    x={getX(item.date) - 60}
                    y={getY(item.value) - 45}
                    width="120"
                    height="35"
                    rx="4"
                    fill="currentColor"
                    className="text-neutral-800 dark:text-neutral-700"
                  />
                  <text
                    x={getX(item.date)}
                    y={getY(item.value) - 25}
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                  >
                    {item.disease}: {item.value.toFixed(1)}%
                  </text>
                  <text
                    x={getX(item.date)}
                    y={getY(item.value) - 14}
                    textAnchor="middle"
                    className="text-[8px] fill-white opacity-80"
                  >
                    {item.date.toLocaleDateString()}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        {[
          { label: "Diabetes", color: "bg-blue-500" },
          { label: "Heart Disease", color: "bg-rose-500" },
          { label: "Parkinson's", color: "bg-violet-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
