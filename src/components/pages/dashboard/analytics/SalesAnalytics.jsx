// SalesAnalytics.jsx
import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesAnalytics = ({
  salesData,
  viewMode,
  selectedDate,
  isLoading,
  isPast30Days,
}) => {
  const chartConfig = useMemo(() => {
    const configs = {
      daily: {
        title: `Daily Sales (${
          isPast30Days ? "Past 30 Days" : format(selectedDate, "MMMM yyyy")
        })`,
        xAxisFormatter: (date) => format(parseISO(date), "dd"),
        tooltipFormatter: (date) => format(parseISO(date), "MMM dd, yyyy"),
      },
      monthly: {
        title: `Monthly Sales (${selectedDate.getFullYear()})`,
        xAxisFormatter: (month) =>
          format(new Date(0, parseInt(month) - 1), "MMM"),
        tooltipFormatter: (month) =>
          format(
            new Date(selectedDate.getFullYear(), parseInt(month) - 1),
            "MMMM yyyy"
          ),
      },
      yearly: {
        title: "Yearly Sales (Past 5 Years)",
        xAxisFormatter: (year) => year,
        tooltipFormatter: (year) => year,
      },
    };
    return configs[viewMode];
  }, [viewMode, selectedDate]);

  const formatYAxis = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const processedData = useMemo(() => {
    if (!Array.isArray(salesData)) return [];

    return salesData.map((item) => ({
      _id: item._id,
      totalSales: item.totalSales,
    }));
  }, [salesData]);

  if (isLoading) {
    return (
      <Card className="bg-white ">
        <CardHeader>
          <CardTitle>{chartConfig.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[300px]">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!Array.isArray(salesData) || salesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{chartConfig.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[300px]">
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{chartConfig.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" tickFormatter={chartConfig.xAxisFormatter} />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip
              labelFormatter={chartConfig.tooltipFormatter}
              formatter={(value) => [formatYAxis(value), "Total Sales"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#8884d8"
              name="Total Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesAnalytics;
