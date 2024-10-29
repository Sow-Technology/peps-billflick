"use client";
import React from "react";
import DataCard from "./DataCard";
import Invoices from "./Invoices";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storesData } from "@/lib/data";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Analytics from "./analytics/Analytics";
import ClientSources from "./analytics/ClientSources";
import PaymentStatus from "./analytics/PaymentStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IndianRupee,
  Percent,
  Receipt,
  Repeat,
  FileText,
  Users,
} from "lucide-react";
import Past7DaysSales from "./analytics/Past7DaysSales";
import SalesByStore from "./analytics/SalesByStore";

const DashboardSection = ({
  data,
  invoiceData,
  dateRange,
  setDateRange,
  isDataLoading,
  stores,
  storeName,
  setStoreName,
}) => {
  console.log("=====METRICS=====", data);

  return (
    <div className="flex flex-1 flex-col gap-10 rounded-3xl sm:pt-4 w-full">
      <div className="p-6 bg-slate-50 rounded-xl shadow-md w-full flex flex-col gap-5">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex gap-4 flex-wrap justify-end ">
            {/* Store Selector */}
            <Select value={storeName} onValueChange={setStoreName} className="">
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Store" className="w-[50px]" />
              </SelectTrigger>
              <SelectContent className="w-[50px]">
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.code} value={store.code}>
                    {store.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateRangePicker
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              showCompare={false}
              className="w-full"
              onUpdate={(values) => {
                const { from, to } = values.range;
                if (!from || !to) return;
                setDateRange({ from, to });
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8 lg:grid-cols-4 ">
          {/* Left Side Graphs */}
          <div className="flex flex-col gap-8 max-2xl:col-span-1 ">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Client Sources</CardTitle>
              </CardHeader>
              <CardContent className=" ">
                <ClientSources data={data.clientSourceSummary} />
              </CardContent>
            </Card>
            <Card className="bg-white ">
              <CardHeader>
                <CardTitle>Sales By Store</CardTitle>
              </CardHeader>
              <CardContent className="">
                <SalesByStore data={data.salesByStore} />
              </CardContent>
            </Card>
          </div>

          {/* Center DataCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-2xl:col-span-2 col-span-1">
            <SkeletonWrapper isLoading={isDataLoading}>
              <DataCard
                title="Total Revenue"
                className="col-span-2 w-full "
                value={`₹${Number(data.totalOrderValue).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
                icon={<IndianRupee className="h-8 w-8 text-white" />}
                revenue="lg:text-[1.8vw]"
              />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isDataLoading}>
              <DataCard
                title="Total Profit"
                value={`₹${Number(data.totalProfit).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                icon={<Percent className="h-8 w-8 text-white" />}
              />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isDataLoading}>
              <DataCard
                title="Total Orders"
                value={data.totalOrders}
                icon={<Receipt className="h-8 w-8 text-white" />}
              />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isDataLoading}>
              <DataCard
                title="Repeat Customers"
                value={data.totalRepeatedCustomers}
                icon={<Repeat className="h-8 w-8 text-white" />}
              />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isDataLoading}>
              <DataCard
                title="Total Tax Collected"
                value={`₹${Number(data.totalTaxValue).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                icon={<FileText className="h-8 w-8 text-white" />}
              />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isDataLoading}>
              <DataCard
                title="Total Customers"
                value={data.totalCustomers}
                icon={<Users className="h-8 w-8 text-white" />}
              />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isDataLoading}>
              <DataCard
                title="Aspire 15"
                value={`₹${Number(data.aspire15).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                icon={<IndianRupee className="h-8 w-8 text-white" />}
              />
            </SkeletonWrapper>
          </div>

          {/* Right Side Graphs */}
          <div className="flex flex-col gap-8 col-span-1">
            <Card className="bg-white flex-1">
              <CardHeader>
                <CardTitle>Invoice Status</CardTitle>
              </CardHeader>
              <CardContent className="">
                <PaymentStatus data={data.paymentStatusSummary} />
              </CardContent>
            </Card>
            <Card className="bg-white flex-1 ">
              <CardHeader>
                <CardTitle>Daily Sales (Past 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Past7DaysSales />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="p-6 bg-slate-50 rounded-xl shadow-md w-full">
        <Analytics />
      </div>

      {/* Invoices Section */}
      <div className="">
        <Invoices data={invoiceData} />
      </div>
    </div>
  );
};

export default DashboardSection;
