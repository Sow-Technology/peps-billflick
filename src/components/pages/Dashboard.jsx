"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  startOfQuarter,
  format,
  differenceInDays,
  subQuarters,
} from "date-fns";
import Invoices from "./dashboard/Invoices";
import Invoicess from "./dashboard/quotes";

import Sidebar from "./dashboard/Sidebar";
import { useState, useEffect, use } from "react";
import DashboardSection from "./dashboard/DashboardSection";
import { useSession } from "next-auth/react";
import Products from "./dashboard/products/Products";
import { redirect, useSearchParams } from "next/navigation";
import Stores from "./dashboard/stores/Stores";
import Coupons from "./dashboard/coupons/Coupons";
import Users from "./dashboard/users/Users";
import Analytics from "./dashboard/analytics/Analytics";
import Expenses from "./dashboard/expenses/Expenses";
import OrderForm from "./dashboard/order/OrderForm";

export default function Dashboard() {
  const session = useSession();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("active") || "Dashboard";

  const [active, setActive] = useState(activeSection);
  const [storeName, setStoreName] = useState("all");
  const [dateRange, setDateRange] = useState(() => {
    const currentDate = new Date();
    const startOfCurrentQuarter = startOfQuarter(currentDate);

    const gapInDays = differenceInDays(currentDate, startOfCurrentQuarter);

    if (gapInDays < 30) {
      const previousQuarterStart = startOfQuarter(subQuarters(currentDate, 1));
      return {
        from: previousQuarterStart,
        to: currentDate,
      };
    }

    return {
      from: startOfCurrentQuarter,
      to: currentDate,
    };
  });

  const formattedFrom = format(dateRange.from, "yyyy-MM-dd");
  const formattedTo = format(dateRange.to, "yyyy-MM-dd");

  const {
    data: invoiceData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices", formattedFrom, formattedTo, storeName],
    queryFn: async () => {
      const response = await axios.get("/api/getInvoices", {
        params: {
          from: formattedFrom,
          to: formattedTo,
          storeName,
        },
      });
      return response.data;
    },
  });

  const fetchMetrics = async () => {
    const { data } = await axios.get("/api/metrics", {
      params: {
        from: formattedFrom,
        to: formattedTo,
        storeName,
      },
    });
    return data;
  };

  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery({
    queryKey: ["metrics", formattedFrom, formattedTo, storeName],
    queryFn: () => fetchMetrics(),
  });

  const { data: stores, isLoading: isStoreLoading } = useQuery({
    queryKey: ["store"],
    queryFn: async () => {
      const response = await axios.get("/api/getStores");
      return response.data;
    },
  });
  // Update URL search parameters when active section changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("active", active);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  }, [active]);
  if (isLoading || metricsLoading || isStoreLoading)
    return <div>Loading...</div>;
  if (error) return <div>Error loading invoices: {error.message}</div>;
  console.log(session);
  if (session.status == "unauthenticated") {
    redirect("/auth");
  }
  if (session.status == "authenticated" && session.data.user.role == "user") {
    redirect("/unauthorized");
  }
  return (
    <div className="flex min-h-screen w-full  ">
      <Sidebar
        active={active}
        setActive={setActive}
        user={session.data?.user}
      />
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full mx-auto max-w-[85vw] ">
        {/* Section Rendering */}
        {active === "Dashboard" && (
          <DashboardSection
            data={metricsData}
            invoiceData={invoiceData}
            dateRange={dateRange}
            isDataLoading={metricsLoading}
            setDateRange={setDateRange}
            storeName={storeName}
            stores={stores}
            setStoreName={setStoreName}
          />
        )}
        {active === "Invoices" && <Invoices data={invoiceData} />}
        {active === "Order Form" && <OrderForm data={invoiceData} />}
        {active === "Coupons" && <Coupons />}
        {active === "Analytics" && <Analytics />}
        {active === "Products" && <Products />}
        {active === "Stores" && <Stores />}
        {active === "Users" && <Users data={invoiceData} />}
        {active === "Expense Table" && <Expenses data={invoiceData} />}
        {active === "Quotes" && <Invoicess data={invoiceData} />}
      </div>
    </div>
  );
}
