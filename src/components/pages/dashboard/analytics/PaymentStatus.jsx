import React from "react";
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

const PaymentStatus = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  }));

  // Define gradient colors for each status, including Undefined
  const colors = {
    Paid: ["#66bb6a", "#43a047"],
    "Partially Paid": ["#ffca28", "#ffb300"],
    // Unpaid: ["#ef5350", "#d32f2f"],
    // Undefined: ["#bdbdbd", "#757575"], // Gray gradient for undefined status
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend
          payload={Object.entries(colors).map(
            ([status, [startColor, endColor]]) => ({
              id: status,
              value: status,
              type: "square",
              color: `url(#gradient-${status})`,
            })
          )}
        />
        <defs>
          {Object.entries(colors).map(([status, [startColor, endColor]]) => (
            <linearGradient
              key={status}
              id={`gradient-${status}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={startColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={endColor} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
        <Bar
          dataKey="value"
          fill="#8884d8"
          shape={(props) => {
            const { x, y, width, height, name } = props;
            const status = colors.hasOwnProperty(name) ? name : "Undefined";
            const gradientId = `gradient-${status}`;
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={`url(#${gradientId})`}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PaymentStatus;
