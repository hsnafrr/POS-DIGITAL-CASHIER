import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { analyticsData, dashboardKPI, products, orders, customers } from "../data/mockData";
import { Order, Product } from "../types";

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<"today" | "7days" | "30days" | "90days" | "custom">("30days");

  // Format currency to IDR
  const formatIDR = (value: number): string => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(1)}K`;
    }
    return `Rp ${value}`;
  };

  // Revenue by payment method
  const paymentMethodData = useMemo(() => {
    const methodMap = new Map<string, number>();
    methodMap.set("Cash", 0);
    methodMap.set("QRIS", 0);
    methodMap.set("Debit", 0);
    methodMap.set("Credit", 0);
    methodMap.set("E-Wallet", 0);

    orders.forEach((order) => {
      if (order.paymentMethod === "cash") {
        methodMap.set("Cash", (methodMap.get("Cash") || 0) + order.grandTotal);
      } else if (order.paymentMethod === "card") {
        methodMap.set("Debit", (methodMap.get("Debit") || 0) + order.grandTotal * 0.6);
        methodMap.set("Credit", (methodMap.get("Credit") || 0) + order.grandTotal * 0.4);
      } else if (order.paymentMethod === "digital") {
        methodMap.set("QRIS", (methodMap.get("QRIS") || 0) + order.grandTotal * 0.5);
        methodMap.set("E-Wallet", (methodMap.get("E-Wallet") || 0) + order.grandTotal * 0.5);
      }
    });

    return Array.from(methodMap, ([name, value]) => ({ name, value }));
  }, []);

  // Category performance
  const categoryPerformance = useMemo(() => {
    const categoryMap = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = categoryMap.get(item.product.category);
        categoryMap.set(
          item.product.category,
          (existing || 0) + item.subtotal
        );
      });
    });

    return Array.from(categoryMap, ([category, sales]) => ({ category, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  }, []);

  // Hourly sales heatmap data
  const hourlyHeatmap = useMemo(() => {
    const heatmapData = Array(24)
      .fill(0)
      .map((_, hour) => ({
        hour: `${hour.toString().padStart(2, "0")}:00`,
        day1: Math.floor(Math.random() * 20 + 5),
        day2: Math.floor(Math.random() * 20 + 5),
        day3: Math.floor(Math.random() * 20 + 5),
        day4: Math.floor(Math.random() * 20 + 5),
        day5: Math.floor(Math.random() * 20 + 5),
        day6: Math.floor(Math.random() * 20 + 5),
        day7: Math.floor(Math.random() * 20 + 5),
      }));
    return heatmapData;
  }, []);

  // Top products table
  const topProducts = useMemo(() => {
    const productMap = new Map<
      string,
      {
        product: Product;
        unitsSold: number;
        revenue: number;
      }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productMap.get(item.product.id);
        if (existing) {
          existing.unitsSold += item.qty;
          existing.revenue += item.subtotal;
        } else {
          productMap.set(item.product.id, {
            product: item.product,
            unitsSold: item.qty,
            revenue: item.subtotal,
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map((item, idx) => ({
        rank: idx + 1,
        ...item,
        growth: Math.floor(Math.random() * 40 - 10),
      }));
  }, []);

  // Customer growth data
  const customerGrowthData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months.map((month, idx) => ({
      month,
      new: Math.floor(Math.random() * 150 + 50),
      returning: Math.floor(Math.random() * 200 + 100),
    }));
  }, []);

  // Membership distribution
  const membershipData = useMemo(() => {
    const counts = new Map<string, number>();
    counts.set("Bronze", 0);
    counts.set("Silver", 0);
    counts.set("Gold", 0);
    counts.set("Platinum", 0);

    customers.forEach((customer) => {
      const level =
        customer.membershipLevel.charAt(0).toUpperCase() +
        customer.membershipLevel.slice(1);
      counts.set(level, (counts.get(level) || 0) + 1);
    });

    return Array.from(counts, ([name, value]) => ({ name, value }));
  }, []);

  // Outlet comparison data
  const outletComparison = useMemo(() => {
    return [
      {
        outlet: "Main Branch",
        revenue: 450000000,
        orders: 1200,
        avgOrder: 375000,
      },
      {
        outlet: "South Park",
        revenue: 320000000,
        orders: 950,
        avgOrder: 337000,
      },
      {
        outlet: "North Mall",
        revenue: 280000000,
        orders: 820,
        avgOrder: 341000,
      },
      {
        outlet: "West Avenue",
        revenue: 215000000,
        orders: 650,
        avgOrder: 331000,
      },
    ];
  }, []);

  // Popular menu grid (top 8 products)
  const popularMenu = useMemo(() => {
    return topProducts.slice(0, 8);
  }, [topProducts]);

  const COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA500"];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      style={{ background: 'linear-gradient(135deg, #1C1917 0%, #292524 50%, #3B3530 100%)' }}
      className="page-container min-h-screen text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar */}
      <motion.div
        className="sticky top-0 z-40 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">
              Deep business insights and trends
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex gap-2 bg-slate-700/50 rounded-lg p-2">
              {[
                { label: "Today", value: "today" as const },
                { label: "7 Days", value: "7days" as const },
                { label: "30 Days", value: "30days" as const },
                { label: "90 Days", value: "90days" as const },
                { label: "Custom", value: "custom" as const },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-all ${
                    dateRange === option.value
                      ? "bg-gold-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download size={18} />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="p-6 max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Revenue Analysis Section */}
        <motion.div variants={item} className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend Line Chart */}
          <motion.div
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            className="rounded-xl p-6 hover:border-gold-500/50 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Revenue Trend (12 Months)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.revenueByMonth}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#FFD700"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="#FFD700"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#475569"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => formatIDR(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      formatIDR(value),
                      "Revenue",
                    ]}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FFD700"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Payment Method Pie Chart */}
          <motion.div
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            className="rounded-xl p-6 hover:border-gold-500/50 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Revenue by Payment Method
            </h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatIDR(value)}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Sales Analysis Section */}
        <motion.div variants={item} className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Category Performance */}
          <motion.div
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            className="rounded-xl p-6 hover:border-gold-500/50 transition-all md:col-span-1"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Category Performance
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryPerformance}
                  layout="vertical"
                  margin={{ left: 100, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#475569"
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => formatIDR(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="#94a3b8"
                    style={{ fontSize: "11px" }}
                    width={95}
                  />
                  <Tooltip
                    formatter={(value: number) => formatIDR(value)}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#FFD700"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Hourly Sales Heatmap */}
          <motion.div
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            className="rounded-xl p-6 hover:border-gold-500/50 transition-all md:col-span-1"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Hourly Sales Heatmap
            </h3>
            <div className="h-80 overflow-y-auto">
              <div className="space-y-1">
                {hourlyHeatmap.map((hour, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-12">
                      {hour.hour}
                    </span>
                    <div className="flex gap-1 flex-1">
                      {[
                        hour.day1,
                        hour.day2,
                        hour.day3,
                        hour.day4,
                        hour.day5,
                        hour.day6,
                        hour.day7,
                      ].map((value, dayIdx) => (
                        <div
                          key={dayIdx}
                          className="h-6 flex-1 rounded transition-all hover:scale-110"
                          style={{
                            backgroundColor: `rgba(255, 215, 0, ${value / 25})`,
                            border: "1px solid rgba(255, 215, 0, 0.3)",
                          }}
                          title={`Day ${dayIdx + 1}: ${value} orders`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Products Table */}
          <motion.div
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            className="rounded-xl p-6 hover:border-gold-500/50 transition-all md:col-span-1"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Top Products</h3>
            <div className="h-80 overflow-y-auto">
              <div className="space-y-2">
                {topProducts.slice(0, 8).map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between bg-slate-600/30 p-2 rounded hover:bg-slate-600/50 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gold-500 font-bold text-xs w-6">
                          #{item.rank}
                        </span>
                        <span className="text-white text-sm truncate">
                          {item.product.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 ml-8">
                        {item.unitsSold} units
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-white text-sm font-semibold">
                        {formatIDR(item.revenue)}
                      </div>
                      <div
                        className={`text-xs flex items-center justify-end gap-1 ${
                          item.growth >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {item.growth >= 0 ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )}
                        {Math.abs(item.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Customer Analytics Section */}
        <motion.div variants={item} className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Customer Growth */}
          <motion.div
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            className="rounded-xl p-6 hover:border-gold-500/50 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Customer Growth
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#475569"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="new"
                    stroke="#FFD700"
                    strokeWidth={2}
                    dot={{ fill: "#FFD700" }}
                    name="New Customers"
                  />
                  <Line
                    type="monotone"
                    dataKey="returning"
                    stroke="#4ECDC4"
                    strokeWidth={2}
                    dot={{ fill: "#4ECDC4" }}
                    name="Returning Customers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Membership Distribution */}
          <motion.div
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            className="rounded-xl p-6 hover:border-gold-500/50 transition-all"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Membership Distribution
            </h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {membershipData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Outlet Comparison */}
        <motion.div
          variants={item}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
          className="rounded-xl p-6 hover:border-gold-500/50 transition-all mb-6"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">
            Outlet Comparison
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outletComparison}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#475569"
                  vertical={false}
                />
                <XAxis
                  dataKey="outlet"
                  stroke="#94a3b8"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => formatIDR(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatIDR(value)}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#FFD700"
                  radius={[8, 8, 0, 0]}
                  name="Revenue"
                />
                <Bar
                  dataKey="avgOrder"
                  fill="#4ECDC4"
                  radius={[8, 8, 0, 0]}
                  name="Avg Order"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Popular Menu Grid */}
        <motion.div
          variants={item}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
          className="rounded-xl p-6 hover:border-gold-500/50 transition-all"
          whileHover={{ y: -5 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">
            Popular Menu Items
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularMenu.map((item, idx) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-slate-600/30 rounded-lg overflow-hidden hover:border-gold-500/50 border border-slate-600/50 transition-all hover:shadow-lg hover:shadow-gold-500/20"
              >
                <div className="relative overflow-hidden h-40 bg-slate-600">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gold-500 font-bold text-sm">
                        #{item.rank}
                      </span>
                      <div className="flex items-center gap-1 bg-gold-500/20 px-2 py-1 rounded">
                        <TrendingUp size={14} className="text-gold-400" />
                        <span className="text-gold-400 text-xs font-semibold">
                          {item.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-white font-semibold text-sm truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1">
                    {item.unitsSold} orders
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/50">
                    <span className="text-gold-500 font-bold text-sm">
                      {formatIDR(item.revenue)}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(item.product.rating)
                              ? "text-gold-400"
                              : "text-slate-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
