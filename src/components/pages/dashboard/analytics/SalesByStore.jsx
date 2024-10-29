import { TooltipProvider, Tooltip } from "@radix-ui/react-tooltip";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function SalesByStore({ data }) {
  // You can customize the color scheme based on the number of statuses
  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  // Transforming the data into a format compatible with the chart
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <TooltipProvider>
      <ResponsiveContainer width="100%" height={300}>
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
                fill={COLORS[index % COLORS.length]} // Assign colors to each slice
              />
            ))}
          </Pie>
          <Tooltip />
          {/* <Legend layout="horizontal" verticalAlign="bottom" align="center" /> */}
        </PieChart>
      </ResponsiveContainer>
    </TooltipProvider>
  );
}
