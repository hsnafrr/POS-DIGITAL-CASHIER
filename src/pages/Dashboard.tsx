import React, { useMemo } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
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
} from "recharts";
import { motion } from "framer-motion";
import {
  dashboardKPI,
  analyticsData,
  products,
  orders,
  outlets,
} from "../data/mockData";
import { Order, Product } from "../types";

const Dashboard: React.FC = () => {
  const formatIDR = (value: number): string => {
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `Rp ${(value / 1000).toFixed(1)}K`;
    return `Rp ${value}`;
  };

  const bestSellers = useMemo(() => {
    const sellersMap = new Map<string, { product: Product; unitsSold: number; revenue: number }>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = sellersMap.get(item.product.id);
        if (existing) {
          existing.unitsSold += item.qty;
          existing.revenue += item.subtotal;
        } else {
          sellersMap.set(item.product.id, { product: item.product, unitsSold: item.qty, revenue: item.subtotal });
        }
      });
    });
    return Array.from(sellersMap.values()).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
  }, []);

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, []);

  const getStatusStyle = (status: Order["status"]): { bg: string; color: string; border: string } => {
    const map: Record<string, { bg: string; color: string; border: string }> = {
      completed: { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.25)' },
      served: { bg: 'rgba(249,115,22,0.12)', color: '#EA580C', border: 'rgba(249,115,22,0.25)' },
      ready: { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.25)' },
      preparing: { bg: 'rgba(245,158,11,0.12)', color: '#D97706', border: 'rgba(245,158,11,0.25)' },
      pending: { bg: 'rgba(107,114,128,0.12)', color: '#4B5563', border: 'rgba(107,114,128,0.25)' },
      cancelled: { bg: 'rgba(239,68,68,0.12)', color: '#DC2626', border: 'rgba(239,68,68,0.25)' },
    };
    return map[status] || map.pending;
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const todayRevenue = orders.reduce((sum, order) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    return orderDate === today ? sum + order.grandTotal : sum;
  }, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing").length;
  const lowStockItems = products.filter((p) => p.stock < 20).length;

  const kpiCards = [
    { title: "Revenue", value: formatIDR(dashboardKPI.revenue), icon: <DollarSign className="w-5 h-5" />, trend: 12.5, trendUp: true, gradient: 'linear-gradient(135deg, #FDF8E8 0%, #F9EDC5 40%, #F3DA8B 100%)', iconBg: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'rgba(201,154,46,0.2)', glow: 'rgba(245,158,11,0.15)' },
    { title: "Orders", value: dashboardKPI.orders.toLocaleString("id-ID"), icon: <ShoppingCart className="w-5 h-5" />, trend: 8.3, trendUp: true, gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 40%, #FDBA74 100%)', iconBg: 'linear-gradient(135deg, #F97316, #EA580C)', border: 'rgba(249,115,22,0.2)', glow: 'rgba(249,115,22,0.15)' },
    { title: "Customers", value: dashboardKPI.customers.toLocaleString("id-ID"), icon: <Users className="w-5 h-5" />, trend: 5.1, trendUp: true, gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 40%, #A7F3D0 100%)', iconBg: 'linear-gradient(135deg, #10B981, #059669)', border: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.15)' },
    { title: "Avg Order", value: formatIDR(dashboardKPI.avgOrder), icon: <TrendingUp className="w-5 h-5" />, trend: 2.1, trendUp: false, gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #BFDBFE 100%)', iconBg: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'rgba(59,130,246,0.2)', glow: 'rgba(59,130,246,0.15)' },
  ];

  return (
    <motion.div className="page-container" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold text-surface-900 mb-2">Dashboard</h1>
        <p className="text-surface-500">Welcome back! Here's your business overview.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ y: -6, boxShadow: `0 20px 40px ${card.glow}` }}
            className="rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
            style={{ background: card.gradient, border: `1px solid ${card.border}` }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-30"
              style={{ background: card.iconBg, transform: 'translate(25%, -25%)', filter: 'blur(30px)' }}
            />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-semibold text-surface-600 uppercase tracking-wider">{card.title}</h3>
              <div className="rounded-xl p-2.5 shadow-lg" style={{ background: card.iconBg }}>
                <div className="text-white">{card.icon}</div>
              </div>
            </div>
            <div className="mb-4 relative z-10">
              <p className="text-3xl font-bold text-surface-900">{card.value}</p>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                card.trendUp ? 'bg-success-100/80 text-success-700' : 'bg-error-100/80 text-error-700'
              }`}>
                {card.trendUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                <span>{card.trendUp ? '+' : '-'}{card.trend}%</span>
              </div>
              <span className="text-xs text-surface-500">vs last period</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue & Orders Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl shadow-card p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 100%)', border: '1px solid rgba(201,154,46,0.1)' }}
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.revenueByMonth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                  <stop offset="50%" stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <Tooltip contentStyle={{ background: 'linear-gradient(135deg, #FFFFFF, #FFFBEB)', border: '1px solid rgba(201,154,46,0.2)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} formatter={(value: number) => formatIDR(value)} />
              <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl shadow-card p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)', border: '1px solid rgba(249,115,22,0.1)' }}
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Orders by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.ordersByDay}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <Tooltip contentStyle={{ background: 'linear-gradient(135deg, #FFFFFF, #FFF7ED)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[10, 10, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category / Peak / Outlet Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl shadow-card p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)', border: '1px solid rgba(249,115,22,0.08)' }}
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analyticsData.categorySales} cx="50%" cy="50%" labelLine={false} label={({ category, sales }) => `${category}`} outerRadius={80} fill="#8884d8" dataKey="sales">
                {analyticsData.categorySales.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#F97316', '#E6B426', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4', '#F59E0B'][index % 8]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatIDR(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl shadow-card p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FDF8E8 100%)', border: '1px solid rgba(201,154,46,0.08)' }}
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Peak Hours</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.peakHours}>
              <defs>
                <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E6B426" />
                  <stop offset="100%" stopColor="#C99A2E" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="hour" stroke="#9CA3AF" style={{ fontSize: "11px" }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <Tooltip contentStyle={{ background: 'linear-gradient(135deg, #FFFFFF, #FDF8E8)', border: '1px solid rgba(201,154,46,0.2)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="orders" fill="url(#peakGradient)" radius={[8, 8, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl shadow-card p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)', border: '1px solid rgba(16,185,129,0.08)' }}
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Outlet Performance</h3>
          <div className="space-y-5">
            {outlets.map((outlet, idx) => {
              const gradients = [
                'linear-gradient(90deg, #F59E0B, #D97706)',
                'linear-gradient(90deg, #F97316, #EA580C)',
                'linear-gradient(90deg, #10B981, #059669)',
              ];
              return (
                <div key={outlet.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700">{outlet.name.split(" - ")[1]}</span>
                    <span className="text-sm font-bold text-surface-900">{formatIDR(outlet.revenue)}</span>
                  </div>
                  <div className="w-full bg-surface-200/50 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(outlet.revenue / outlets[0].revenue) * 100}%`, background: gradients[idx] || gradients[0] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Recent Orders & Best Sellers */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl shadow-card p-6 overflow-hidden relative"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200/50">
                  {["Order #", "Customer", "Items", "Total", "Status", "Time"].map((h) => (
                    <th key={h} className={`py-3 px-3 font-semibold text-surface-600 text-sm ${h === "Total" || h === "Time" ? "text-right" : h === "Status" ? "text-center" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const st = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} className="border-b border-surface-100/50 hover:bg-surface-50/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-surface-900">{order.orderNumber}</td>
                      <td className="py-3 px-3 text-surface-700">{order.customerName || "Table " + order.tableNumber}</td>
                      <td className="py-3 px-3 text-surface-700">{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                      <td className="py-3 px-3 text-right font-semibold text-surface-900">{formatIDR(order.grandTotal)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-surface-600">{formatTime(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl shadow-card p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FDF8E8 100%)', border: '1px solid rgba(201,154,46,0.08)' }}
        >
          <h3 className="text-lg font-bold text-surface-900 mb-6">Best Sellers</h3>
          <div className="space-y-3">
            {bestSellers.map((seller, idx) => (
              <motion.div
                key={seller.product.id}
                whileHover={{ x: 4, backgroundColor: 'rgba(201,154,46,0.06)' }}
                className="flex items-center gap-4 p-4 rounded-xl transition-colors"
              >
                <div className="relative">
                  <img src={seller.product.image} alt={seller.product.name} className="w-14 h-14 rounded-xl object-cover shadow-md" />
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
                  >
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-surface-900 text-sm mb-0.5">{seller.product.name}</h4>
                  <p className="text-xs text-surface-500 mb-1">{seller.unitsSold} units sold</p>
                  <p className="text-sm font-bold" style={{ color: '#C99A2E' }}>{formatIDR(seller.revenue)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Business Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Revenue", value: formatIDR(todayRevenue), icon: <DollarSign className="w-4 h-4" />, gradient: 'linear-gradient(135deg, #78350F 0%, #92400E 50%, #B45309 100%)', iconColor: '#FCD34D' },
          { label: "Pending Orders", value: pendingOrders, icon: <Clock className="w-4 h-4" />, gradient: 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #F97316 100%)', iconColor: '#FED7AA' },
          { label: "Low Stock Items", value: lowStockItems, icon: <TrendingUp className="w-4 h-4" />, gradient: 'linear-gradient(135deg, #92400E 0%, #B45309 50%, #D97706 100%)', iconColor: '#FDE68A' },
          { label: "Upcoming Reservations", value: orders.filter((o) => o.status === "pending").length, icon: <Star className="w-4 h-4" />, gradient: 'linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)', iconColor: '#A7F3D0' },
        ].map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            className="rounded-2xl shadow-card p-6 transition-all duration-300 relative overflow-hidden"
            style={{ background: item.gradient }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
              style={{ background: 'rgba(255,255,255,0.3)', transform: 'translate(30%, -30%)', filter: 'blur(20px)' }}
            />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: item.iconColor }}>{item.label}</span>
              <div style={{ color: item.iconColor }}>{item.icon}</div>
            </div>
            <p className="text-2xl font-bold text-white relative z-10">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
