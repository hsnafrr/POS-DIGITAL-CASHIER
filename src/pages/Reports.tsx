import React, { useState, useMemo } from "react";
import {
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
  FileText,
  Table as TableIcon,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { orders, products } from "../data/mockData";

interface ReportPeriod {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  ordersCount: number;
  avgOrder: number;
  trend: number;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  // Format currency to IDR
  const formatIDR = (value: number): string => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(1)}K`;
    }
    return `Rp ${value}`;
  };

  // Calculate totals
  const totals = useMemo(() => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalOrders = 0;

    orders.forEach((order) => {
      totalRevenue += order.grandTotal;
      totalOrders += 1;
      order.items.forEach((item) => {
        totalExpenses += item.product.costPrice * item.qty;
      });
    });

    const profit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit,
      margin,
      avgOrder: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      orders: totalOrders,
    };
  }, []);

  // Generate report data based on period
  const reportData = useMemo((): ReportPeriod[] => {
    const data: ReportPeriod[] = [];

    if (reportType === "daily") {
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const revenue = Math.floor(Math.random() * 50000000 + 20000000);
        const expenses = Math.floor(revenue * 0.4);
        const profit = revenue - expenses;
        data.push({
          period: date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          }),
          revenue,
          expenses,
          profit,
          margin: (profit / revenue) * 100,
          ordersCount: Math.floor(Math.random() * 150 + 50),
          avgOrder: Math.floor(revenue / (Math.floor(Math.random() * 150 + 50))),
          trend: Math.floor(Math.random() * 20 - 10),
        });
      }
    } else if (reportType === "weekly") {
      for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        const revenue = Math.floor(Math.random() * 350000000 + 140000000);
        const expenses = Math.floor(revenue * 0.4);
        const profit = revenue - expenses;
        data.push({
          period: `Week ${53 - i}`,
          revenue,
          expenses,
          profit,
          margin: (profit / revenue) * 100,
          ordersCount: Math.floor(Math.random() * 1000 + 400),
          avgOrder: Math.floor(revenue / (Math.floor(Math.random() * 1000 + 400))),
          trend: Math.floor(Math.random() * 20 - 10),
        });
      }
    } else if (reportType === "monthly") {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      months.forEach((month, idx) => {
        const revenue = Math.floor(Math.random() * 1500000000 + 500000000);
        const expenses = Math.floor(revenue * 0.4);
        const profit = revenue - expenses;
        data.push({
          period: month,
          revenue,
          expenses,
          profit,
          margin: (profit / revenue) * 100,
          ordersCount: Math.floor(Math.random() * 4000 + 1500),
          avgOrder: Math.floor(revenue / (Math.floor(Math.random() * 4000 + 1500))),
          trend: Math.floor(Math.random() * 30 - 15),
        });
      });
    } else {
      for (let i = 0; i < 5; i++) {
        const year = 2020 + i;
        const revenue = Math.floor(Math.random() * 18000000000 + 6000000000);
        const expenses = Math.floor(revenue * 0.4);
        const profit = revenue - expenses;
        data.push({
          period: year.toString(),
          revenue,
          expenses,
          profit,
          margin: (profit / revenue) * 100,
          ordersCount: Math.floor(Math.random() * 50000 + 20000),
          avgOrder: Math.floor(revenue / (Math.floor(Math.random() * 50000 + 20000))),
          trend: Math.floor(Math.random() * 40 - 20),
        });
      }
    }

    return data;
  }, [reportType]);

  // Top products for report
  const topProductsReport = useMemo(() => {
    const productMap = new Map<
      string,
      {
        name: string;
        category: string;
        units: number;
        revenue: number;
      }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productMap.get(item.product.id);
        if (existing) {
          existing.units += item.qty;
          existing.revenue += item.subtotal;
        } else {
          productMap.set(item.product.id, {
            name: item.product.name,
            category: item.product.category,
            units: item.qty,
            revenue: item.subtotal,
          });
        }
      });
    });

    const totalRevenue = Array.from(productMap.values()).reduce(
      (sum, p) => sum + p.revenue,
      0
    );

    return Array.from(productMap.values())
      .map((item, idx) => ({
        rank: idx + 1,
        ...item,
        percentage: (item.revenue / totalRevenue) * 100,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, []);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
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

    return Array.from(categoryMap, ([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value);
  }, []);

  // Tax report data
  const taxReport = useMemo(() => {
    const taxRate = 0.11; // 11% PPN
    let totalTax = 0;

    orders.forEach((order) => {
      totalTax += order.tax;
    });

    const outletTax = [
      {
        outlet: "Main Branch",
        taxCollected: Math.floor(totals.revenue * 0.25 * taxRate),
        orders: Math.floor(totals.orders * 0.35),
      },
      {
        outlet: "South Park",
        taxCollected: Math.floor(totals.revenue * 0.2 * taxRate),
        orders: Math.floor(totals.orders * 0.25),
      },
      {
        outlet: "North Mall",
        taxCollected: Math.floor(totals.revenue * 0.18 * taxRate),
        orders: Math.floor(totals.orders * 0.2),
      },
      {
        outlet: "West Avenue",
        taxCollected: Math.floor(totals.revenue * 0.17 * taxRate),
        orders: Math.floor(totals.orders * 0.2),
      },
    ];

    return {
      total: totalTax,
      byOutlet: outletTax,
    };
  }, [totals]);

  // Cash flow data
  const cashFlowData = useMemo(() => {
    const inflows = [
      { name: "Steak Sales", value: Math.floor(totals.revenue * 0.35) },
      { name: "Chicken Sales", value: Math.floor(totals.revenue * 0.25) },
      { name: "Beverages", value: Math.floor(totals.revenue * 0.2) },
      { name: "Desserts & Others", value: Math.floor(totals.revenue * 0.2) },
    ];

    const outflows = [
      { name: "Cost of Goods Sold", value: Math.floor(totals.expenses * 0.6) },
      { name: "Labor Costs", value: Math.floor(totals.expenses * 0.25) },
      { name: "Utilities & Rent", value: Math.floor(totals.expenses * 0.15) },
    ];

    const totalInflows = inflows.reduce((sum, item) => sum + item.value, 0);
    const totalOutflows = outflows.reduce((sum, item) => sum + item.value, 0);

    return {
      inflows,
      outflows,
      netCashFlow: totalInflows - totalOutflows,
    };
  }, [totals]);

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
      className="page-container min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Reports</h1>
              <p className="text-slate-400 text-sm mt-1">
                Financial reporting and business summaries
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download size={18} />
              Export All
            </motion.button>
          </div>

          <div className="flex gap-3">
            {/* Report Type Tabs */}
            <div className="flex gap-2 bg-slate-700/50 rounded-lg p-2">
              {[
                { label: "Daily", value: "daily" as const },
                { label: "Weekly", value: "weekly" as const },
                { label: "Monthly", value: "monthly" as const },
                { label: "Yearly", value: "yearly" as const },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setReportType(option.value)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-all ${
                    reportType === option.value
                      ? "bg-gold-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Export Options */}
            <div className="flex gap-2">
              {[
                { label: "PDF", icon: FileText },
                { label: "Excel", icon: TableIcon },
              ].map((option) => (
                <motion.button
                  key={option.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg font-medium transition-colors text-sm"
                  title={`Export as ${option.label}`}
                >
                  <option.icon size={16} />
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="p-6 max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Report Summary Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Revenue",
              value: totals.revenue,
              icon: "DollarSign",
              color: "gold",
              gradient: 'linear-gradient(135deg, #FDF8E8, #F9EDC5, #F3DA8B)',
              border: '1px solid rgba(201,154,46,0.2)',
            },
            {
              label: "Total Expenses",
              value: totals.expenses,
              icon: "TrendingDown",
              color: "red",
              gradient: 'linear-gradient(135deg, #FEF2F2, #FEE2E2, #FECACA)',
              border: '1px solid rgba(239,68,68,0.2)',
            },
            {
              label: "Gross Profit",
              value: totals.profit,
              icon: "TrendingUp",
              color: "green",
              gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)',
              border: '1px solid rgba(16,185,129,0.2)',
            },
            {
              label: "Profit Margin",
              value: totals.margin.toFixed(1) + "%",
              icon: "BarChart3",
              color: "blue",
              gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)',
              border: '1px solid rgba(59,130,246,0.2)',
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              style={{ background: card.gradient, border: card.border }}
              className="rounded-xl p-4 hover:shadow-lg transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm font-medium">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-white mt-2">
                    {typeof card.value === "number"
                      ? formatIDR(card.value)
                      : card.value}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg bg-${card.color}-500/10`}
                >
                  {card.icon === "DollarSign" && (
                    <div className="text-gold-500">💰</div>
                  )}
                  {card.icon === "TrendingDown" && (
                    <TrendingDown className="text-red-500" size={20} />
                  )}
                  {card.icon === "TrendingUp" && (
                    <TrendingUp className="text-green-500" size={20} />
                  )}
                  {card.icon === "BarChart3" && (
                    <div className="text-blue-500">📊</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Report Table */}
        <motion.div
          variants={item}
          style={{ background: 'linear-gradient(180deg, #FFFFFF, #FAFAF9)', border: '1px solid rgba(0,0,0,0.05)' }}
          className="rounded-xl p-6 transition-all mb-6"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Revenue Report</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm"
            >
              <Download size={16} />
              Export
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600/50">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold text-sm">
                    Period
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Revenue
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Expenses
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Profit
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Margin
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Orders
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Avg Order
                  </th>
                  <th className="text-center px-4 py-3 text-slate-400 font-semibold text-sm">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.slice(-10).map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-600/30 hover:bg-slate-600/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {row.period}
                    </td>
                    <td className="text-right px-4 py-3 text-gold-400 font-semibold">
                      {formatIDR(row.revenue)}
                    </td>
                    <td className="text-right px-4 py-3 text-red-400 font-semibold">
                      {formatIDR(row.expenses)}
                    </td>
                    <td className="text-right px-4 py-3 text-green-400 font-semibold">
                      {formatIDR(row.profit)}
                    </td>
                    <td className="text-right px-4 py-3 text-blue-400 font-semibold">
                      {row.margin.toFixed(1)}%
                    </td>
                    <td className="text-right px-4 py-3 text-slate-300">
                      {row.ordersCount}
                    </td>
                    <td className="text-right px-4 py-3 text-slate-300">
                      {formatIDR(row.avgOrder)}
                    </td>
                    <td className="text-center px-4 py-3">
                      <div
                        className={`flex items-center justify-center gap-1 ${
                          row.trend >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {row.trend >= 0 ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        <span className="text-sm font-semibold">
                          {Math.abs(row.trend)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Products Report */}
        <motion.div
          variants={item}
          style={{ background: 'linear-gradient(180deg, #FFFFFF, #FAFAF9)', border: '1px solid rgba(0,0,0,0.05)' }}
          className="rounded-xl p-6 transition-all mb-6"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Top Products Report</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm"
            >
              <Download size={16} />
              Export
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600/50">
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold text-sm">
                    Rank
                  </th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold text-sm">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-slate-400 font-semibold text-sm">
                    Category
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Units Sold
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    Revenue
                  </th>
                  <th className="text-right px-4 py-3 text-slate-400 font-semibold text-sm">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProductsReport.map((item, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-600/30 hover:bg-slate-600/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-gold-500 font-bold">
                      #{item.rank}
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {item.category}
                    </td>
                    <td className="text-right px-4 py-3 text-slate-300">
                      {item.units}
                    </td>
                    <td className="text-right px-4 py-3 text-gold-400 font-semibold">
                      {formatIDR(item.revenue)}
                    </td>
                    <td className="text-right px-4 py-3 text-blue-400 font-semibold">
                      {item.percentage.toFixed(1)}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Category Breakdown & Tax Report */}
        <motion.div variants={item} className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Category Breakdown */}
          <motion.div
            style={{ background: 'linear-gradient(180deg, #FFFFFF, #FAFAF9)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-xl p-6 transition-all"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Category Breakdown</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm"
              >
                <Download size={16} />
              </motion.button>
            </div>
            <div className="h-64 flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryBreakdown.map((entry, index) => (
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
            <div className="space-y-2">
              {categoryBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-600/30 p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-white text-sm">{item.name}</span>
                  </div>
                  <span className="text-gold-400 font-semibold text-sm">
                    {formatIDR(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tax Report */}
          <motion.div
            style={{ background: 'linear-gradient(180deg, #FFFFFF, #FAFAF9)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-xl p-6 transition-all"
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Tax Report</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm"
              >
                <Download size={16} />
              </motion.button>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-4 mb-4">
              <p className="text-slate-400 text-sm mb-1">Total Tax Collected</p>
              <p className="text-3xl font-bold text-gold-400">
                {formatIDR(taxReport.total)}
              </p>
            </div>
            <p className="text-white font-semibold mb-3">By Outlet</p>
            <div className="space-y-2">
              {taxReport.byOutlet.map((outlet, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-600/30 p-3 rounded hover:bg-slate-600/50 transition-colors"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {outlet.outlet}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {outlet.orders} orders
                    </p>
                  </div>
                  <p className="text-gold-400 font-semibold">
                    {formatIDR(outlet.taxCollected)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Cash Flow Statement */}
        <motion.div
          variants={item}
          style={{ background: 'linear-gradient(180deg, #FFFFFF, #FAFAF9)', border: '1px solid rgba(0,0,0,0.05)' }}
          className="rounded-xl p-6 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Cash Flow Statement</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gold-500 hover:text-gold-400 text-sm"
            >
              <Download size={16} />
              Export
            </motion.button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Inflows */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className="text-green-400 font-bold text-sm mb-3">
                CASH INFLOWS
              </h4>
              <div className="space-y-2">
                {cashFlowData.inflows.map((item, idx) => (
                  <div key={idx} className="bg-slate-600/30 p-3 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">
                        {item.name}
                      </span>
                      <span className="text-green-400 font-semibold text-sm">
                        {formatIDR(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded p-3">
                <p className="text-slate-400 text-xs">Total Inflows</p>
                <p className="text-green-400 font-bold text-lg">
                  {formatIDR(
                    cashFlowData.inflows.reduce((sum, i) => sum + i.value, 0)
                  )}
                </p>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center justify-center">
              <div className="hidden md:flex flex-col items-center h-full">
                <ArrowRight className="text-slate-600 rotate-90 md:rotate-0" />
              </div>
            </div>

            {/* Outflows */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h4 className="text-red-400 font-bold text-sm mb-3">
                CASH OUTFLOWS
              </h4>
              <div className="space-y-2">
                {cashFlowData.outflows.map((item, idx) => (
                  <div key={idx} className="bg-slate-600/30 p-3 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">
                        {item.name}
                      </span>
                      <span className="text-red-400 font-semibold text-sm">
                        {formatIDR(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded p-3">
                <p className="text-slate-400 text-xs">Total Outflows</p>
                <p className="text-red-400 font-bold text-lg">
                  {formatIDR(
                    cashFlowData.outflows.reduce((sum, i) => sum + i.value, 0)
                  )}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Net Cash Flow */}
          <motion.div
            className="mt-6 bg-gradient-to-r from-gold-500/10 to-gold-500/5 border border-gold-500/30 rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-slate-400 text-sm mb-1">Net Cash Flow</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-gold-400">
                {formatIDR(cashFlowData.netCashFlow)}
              </p>
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  cashFlowData.netCashFlow >= 0
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {cashFlowData.netCashFlow >= 0 ? "Positive" : "Negative"}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Reports;
