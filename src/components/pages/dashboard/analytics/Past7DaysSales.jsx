"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { format, subDays, eachDayOfInterval, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
} from "recharts";

const Past7DaysSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date(); // Current date
      const startDate = subDays(endDate, 6); // 7 days ago (including today)

      const response = await axios.get(
        `/api/sales/daily?startDate=${format(
          startDate,
          "yyyy-MM-dd"
        )}&endDate=${format(endDate, "yyyy-MM-dd")}`
      );

      const processedData = processData(response.data.data, startDate, endDate);
      setSalesData(processedData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (data, startDate, endDate) => {
    const dataMap = new Map(
      data.map((item) => [item._id.toString(), item.totalSales])
    );
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    return allDates.map((date) => {
      const key = format(date, "yyyy-MM-dd");
      return {
        _id: key,
        totalSales: dataMap.get(key) || 0,
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartConfig = useMemo(
    () => ({
      xAxisFormatter: (date) => format(parseISO(date), "EEE"), // Display short day names
      tooltipFormatter: (date) => format(parseISO(date), "MMM dd, yyyy"),
    }),
    []
  );

  const formatYAxis = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={salesData}>
            <defs>
              <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(221.21, 83.19%, 63%)" />{" "}
                {/* Lighter blue */}
                <stop offset="100%" stopColor="hsl(221.21, 83.19%, 43%)" />{" "}
                {/* Darker blue */}
              </linearGradient>
            </defs>
            <XAxis dataKey="_id" tickFormatter={chartConfig.xAxisFormatter} />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip
              labelFormatter={chartConfig.tooltipFormatter}
              formatter={(value) => [`${formatYAxis(value)}`, "Total Sales"]}
              // Custom label "Total Sales"
            />
            <Bar dataKey="totalSales" fill="url(#gradientBar)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Past7DaysSales;
