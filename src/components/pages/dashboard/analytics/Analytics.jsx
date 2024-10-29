import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  format,
  parseISO,
  eachDayOfInterval,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SalesAnalytics from "./SalesAnalytics";
import TopSellingProductsChart from "./TopSellingProductsChart";

const Analytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [viewMode, setViewMode] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isPast30Days, setIsPast30Days] = useState(true);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [stores, setStores] = useState([]);

  const fetchTopSellingProducts = async () => {
    try {
      const response = await axios.get("/api/sales/top-products");
      console.log("Frontend - Top Selling Products Response:", response.data);

      setTopSellingProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get("/api/stores");
      setStores(response.data.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let response;
      let startDate, endDate;
      switch (viewMode) {
        case "daily":
          if (isPast30Days) {
            endDate = new Date(); // Set the current date as the end date
            startDate = subDays(endDate, 29); // Calculate 30 days ago
          } else {
            startDate = startOfMonth(selectedDate);
            endDate = endOfMonth(selectedDate);
          }
          response = await axios.get(
            `/api/sales/daily?startDate=${format(
              startDate,
              "yyyy-MM-dd"
            )}&endDate=${format(endDate, "yyyy-MM-dd")}`
          );
          break;

        case "monthly":
          startDate = startOfYear(selectedDate);
          endDate = endOfYear(selectedDate);
          response = await axios.get(
            `/api/sales/monthly?year=${selectedDate.getFullYear()}`
          );
          break;
        case "yearly":
          const currentYear = new Date().getFullYear();
          startDate = new Date(currentYear - 4, 0, 1);
          endDate = new Date(currentYear, 11, 31);
          response = await axios.get(
            `/api/sales/yearly?startYear=${startDate.getFullYear()}&endYear=${endDate.getFullYear()}`
          );
          break;
      }

      const processedData = processData(response.data.data, startDate, endDate);
      setSalesData(processedData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("saleSDARA", salesData);

  const processData = (data, startDate, endDate) => {
    const dataMap = new Map(
      data.map((item) => [item._id.toString(), item.totalSales])
    );
    let allDates;

    if (viewMode === "daily") {
      allDates = eachDayOfInterval({ start: startDate, end: endDate });
    } else if (viewMode === "monthly") {
      allDates = eachMonthOfInterval({ start: startDate, end: endDate });
    } else {
      allDates = Array.from(
        { length: endDate.getFullYear() - startDate.getFullYear() + 1 },
        (_, i) => new Date(startDate.getFullYear() + i, 0, 1)
      );
    }

    return allDates.map((date) => {
      let key;
      if (viewMode === "daily") {
        key = format(date, "yyyy-MM-dd");
      } else if (viewMode === "monthly") {
        key = format(date, "MM");
      } else {
        key = date.getFullYear().toString();
      }
      return {
        _id: key,
        totalSales: dataMap.get(key) || 0,
      };
    });
  };

  useEffect(() => {
    fetchData();
    fetchTopSellingProducts();
    fetchStores();
  }, [viewMode, selectedDate, isPast30Days]);

  const chartConfig = useMemo(() => {
    const configs = {
      daily: {
        title: `Daily Sales 
           (${
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
  const handleDateSelection = (value) => {
    if (value === "past30days") {
      setSelectedDate(new Date());
      setIsPast30Days(true); // Mark it as past 30 days
    } else {
      setSelectedDate(new Date(value));
      setIsPast30Days(false); // Mark it as a specific month or year
    }
  };

  const renderDateSelector = () => {
    if (viewMode === "daily" || viewMode === "monthly") {
      const options =
        viewMode === "daily"
          ? [
              { value: "past30days", label: "Past 30 Days" },
              ...Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                return {
                  value: format(date, "yyyy-MM"),
                  label: format(date, "MMMM yyyy"),
                };
              }),
            ]
          : Array.from({ length: 12 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return {
                value: year.toString(),
                label: year.toString(),
              };
            });

      return (
        <Select
          value={
            viewMode === "daily"
              ? isPast30Days
                ? "past30days"
                : format(selectedDate, "yyyy-MM")
              : selectedDate.getFullYear().toString()
          }
          onValueChange={handleDateSelection}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={`Select ${viewMode === "daily" ? "period" : "year"}`}
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    return null;
  };
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Sales Analytics</h2>
      <div className="flex space-x-4">
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger>
            <SelectValue placeholder="Select view mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        {renderDateSelector()}
      </div>

      <SalesAnalytics
        salesData={salesData}
        viewMode={viewMode}
        selectedDate={selectedDate}
        isLoading={isLoading}
        isPast30Days={isPast30Days}
      />

      {/* <StoreSalesAnalytics
        salesData={salesData}
        stores={stores}
        viewMode={viewMode}
        selectedDate={selectedDate}
        isLoading={isLoading}
      /> */}
      {/* <TopSellingProductsChart data={topSellingProducts} /> */}
    </div>
  );
};

export default Analytics;
