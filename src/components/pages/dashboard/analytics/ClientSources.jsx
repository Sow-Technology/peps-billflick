import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#4A90E2",
  "#50E3C2",
  "#F5A623",
  "#D0021B",
  "#BD10E0",
  "#B8E986",
];

export default function ClientSources({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
        className="mx-auto  flex items-center justify-center"
      >
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            itemStyle={{
              color: "hsl(var(--foreground))",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
