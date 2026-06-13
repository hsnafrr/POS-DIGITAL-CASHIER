import React, { useState } from "react";
import {
  Building2,
  CheckCircle,
  DollarSign,
  Trophy,
  Plus,
  Eye,
  Edit,
  Settings,
  X,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { outlets } from "../data/mockData";
import { Outlet } from "../types";

const Outlets: React.FC = () => {
  const [outletList, setOutletList] = useState<Outlet[]>(outlets);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    manager: "",
    phone: "",
    status: "open",
  });

  const formatIDR = (value: number): string => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(1)}K`;
    }
    return `Rp ${value}`;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      open: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      renovation: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const stats = [
    {
      label: "Total Outlets",
      value: outletList.length,
      icon: Building2,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Active Outlets",
      value: outletList.filter((o) => o.status === "open").length,
      icon: CheckCircle,
      color: "from-green-400 to-green-600",
    },
    {
      label: "Total Revenue",
      value: formatIDR(
        outletList.reduce((sum, o) => sum + o.revenue, 0)
      ),
      icon: DollarSign,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: "Best Performer",
      value: outletList.sort((a, b) => b.revenue - a.revenue)[0]?.name.split(" - ")[1] || "N/A",
      icon: Trophy,
      color: "from-accent-400 to-accent-600",
    },
  ];

  const handleAddOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    const newOutlet: Outlet = {
      id: `out-${Date.now()}`,
      name: formData.name,
      address: formData.address,
      manager: formData.manager,
      phone: formData.phone,
      status: formData.status as "open" | "closed",
      revenue: 0,
      ordersCount: 0,
      image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=600",
    };
    setOutletList([...outletList, newOutlet]);
    setShowAddModal(false);
    setFormData({
      name: "",
      address: "",
      manager: "",
      phone: "",
      status: "open",
    });
  };

  const openDetailDrawer = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setShowDetailDrawer(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="page-container min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
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
            <h1 className="text-3xl font-bold text-white">Multi Outlet</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage all restaurant branches
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Add Outlet
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={item}
                whileHover={{ y: -4 }}
                className={`rounded-2xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-card hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <Icon size={24} className="opacity-80" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Outlet Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {outletList.map((outlet) => (
            <motion.div
              key={outlet.id}
              variants={item}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white shadow-card hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden bg-slate-200 relative">
                <img
                  src={outlet.image}
                  alt={outlet.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-6" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                {/* Name */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {outlet.name}
                </h3>

                {/* Address */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {outlet.address}
                </p>

                {/* Manager & Phone */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Manager:</span>
                    <span className="font-semibold text-slate-900">
                      {outlet.manager}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Phone:</span>
                    <span className="font-semibold text-slate-900">
                      {outlet.phone}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      outlet.status
                    )}`}
                  >
                    {outlet.status.charAt(0).toUpperCase() +
                      outlet.status.slice(1)}
                  </span>
                </div>

                {/* Revenue Summary */}
                <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)', border: '1px solid rgba(59,130,246,0.2)' }} className="rounded-lg p-3 mb-4">
                  <p className="text-xs text-blue-600 font-medium">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatIDR(outlet.revenue)}
                  </p>
                </div>

                {/* Orders Count */}
                <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)', border: '1px solid rgba(16,185,129,0.2)' }} className="rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-600 font-medium">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {outlet.ordersCount}
                  </p>
                </div>

                {/* Performance Score Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-medium text-slate-600">
                      Performance Score
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {Math.floor(Math.random() * 40 + 60)}%
                    </p>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.floor(Math.random() * 40 + 60)}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-accent-400 to-accent-600"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openDetailDrawer(outlet)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    <Eye size={16} />
                    View Dashboard
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    <Edit size={16} />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    <Settings size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Outlet Detail Drawer */}
      <AnimatePresence>
        {showDetailDrawer && selectedOutlet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowDetailDrawer(false)}
          >
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto z-50"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-accent-500 to-accent-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedOutlet.name}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailDrawer(false)}
                  className="text-white hover:bg-accent-700/30 rounded-lg p-1"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Info size={20} className="text-accent-600" />
                    Outlet Information
                  </h3>
                  <div style={{ background: 'linear-gradient(180deg, #FFFFFF, #FFFBEB)', border: '1px solid rgba(201,154,46,0.08)' }} className="space-y-3 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-slate-600 font-medium">
                        Address
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {selectedOutlet.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">
                        Manager
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {selectedOutlet.manager}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">
                        Phone
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {selectedOutlet.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">
                        Status
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                          selectedOutlet.status
                        )}`}
                      >
                        {selectedOutlet.status.charAt(0).toUpperCase() +
                          selectedOutlet.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-yellow-600" />
                    Financial Summary
                  </h3>
                  <div className="space-y-3">
                    <div style={{ background: 'linear-gradient(135deg, #FDF8E8, #F9EDC5, #F3DA8B)', border: '1px solid rgba(201,154,46,0.2)' }} className="rounded-lg p-4">
                      <p className="text-xs text-yellow-600 font-medium">
                        Monthly Revenue
                      </p>
                      <p className="text-3xl font-bold text-yellow-900 mt-1">
                        {formatIDR(selectedOutlet.revenue)}
                      </p>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)', border: '1px solid rgba(16,185,129,0.2)' }} className="rounded-lg p-4">
                      <p className="text-xs text-green-600 font-medium">
                        Total Orders
                      </p>
                      <p className="text-3xl font-bold text-green-900 mt-1">
                        {selectedOutlet.ordersCount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Trophy size={20} className="text-accent-600" />
                    Performance Metrics
                  </h3>
                  <div style={{ background: 'linear-gradient(180deg, #FFFFFF, #FFFBEB)', border: '1px solid rgba(201,154,46,0.08)' }} className="space-y-4 rounded-lg p-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-slate-700">
                          Performance Score
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {Math.floor(Math.random() * 40 + 60)}%
                        </p>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.floor(Math.random() * 40 + 60)}%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-accent-400 to-accent-600"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-300">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-600 font-medium">
                            Staff Count
                          </p>
                          <p className="text-2xl font-bold text-slate-900">
                            {Math.floor(Math.random() * 15 + 10)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-medium">
                            Table Count
                          </p>
                          <p className="text-2xl font-bold text-slate-900">
                            {Math.floor(Math.random() * 8 + 12)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini Revenue Chart */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Revenue Trend (Last 6 Months)
                  </h3>
                  <div style={{ background: 'linear-gradient(180deg, #FFFFFF, #FFFBEB)', border: '1px solid rgba(201,154,46,0.08)' }} className="rounded-lg p-4">
                    <div className="space-y-2">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                        (month) => (
                          <div key={month}>
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs text-slate-600 font-medium">
                                {month}
                              </p>
                              <p className="text-sm font-bold text-slate-900">
                                {formatIDR(
                                  selectedOutlet.revenue *
                                    (0.8 + Math.random() * 0.4)
                                )}
                              </p>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.floor(Math.random() * 40 + 60)}%`,
                                }}
                                transition={{
                                  duration: 0.8,
                                  ease: "easeOut",
                                }}
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    Edit Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    View Orders
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Outlet Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Add New Outlet
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <form onSubmit={handleAddOutlet} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Outlet Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="e.g., STEAK HOUR - Bali"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="e.g., Jl. Gatot Subroto No. 456..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.manager}
                    onChange={(e) =>
                      setFormData({ ...formData, manager: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="e.g., 021-5555-0001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="renovation">Renovation</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    Add Outlet
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Outlets;
