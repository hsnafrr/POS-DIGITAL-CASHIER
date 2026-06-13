import React, { useState } from "react";
import {
  Tag,
  BarChart3,
  DollarSign,
  Percent,
  Plus,
  Edit,
  Pause,
  Play,
  Copy,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { promotions } from "../data/mockData";
import { Promotion } from "../types";

const Promotions: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "percentage",
    value: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
    description: "",
    promoCode: "",
  });
  const [promos, setPromos] = useState<Promotion[]>(promotions);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const formatIDR = (value: number, type: string): string => {
    if (type === "percentage") {
      return `${value}% OFF`;
    } else if (type === "fixed") {
      return `Rp ${value.toLocaleString("id-ID")} OFF`;
    } else if (type === "bogo") {
      return "BOGO";
    } else if (type === "bundle") {
      return `Bundle ${value}%`;
    }
    return `${value}`;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      percentage: "bg-blue-100 text-blue-800",
      fixed: "bg-green-100 text-green-800",
      bogo: "bg-purple-100 text-purple-800",
      bundle: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      inactive: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const typeFilters = ["all", "percentage", "fixed", "bogo", "bundle"];

  const filteredPromos =
    selectedType === "all"
      ? promos
      : promos.filter((p) => p.type === selectedType);

  const stats = [
    {
      label: "Active Promos",
      value: promos.filter((p) => p.status === "active").length,
      icon: Tag,
      color: "from-accent-400 to-accent-600",
    },
    {
      label: "Total Usage",
      value: promos.reduce((sum, p) => sum + p.usageCount, 0),
      icon: BarChart3,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Revenue Impact",
      value: "Rp 2.5M",
      icon: DollarSign,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      label: "Avg Discount",
      value: "22%",
      icon: Percent,
      color: "from-green-400 to-green-600",
    },
  ];

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      name: formData.name,
      type: formData.type as "percentage" | "fixed" | "bogo" | "bundle",
      value: formData.value,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "active",
      usageCount: 0,
      description: formData.description,
      code: formData.promoCode,
    };
    setPromos([newPromo, ...promos]);
    setShowCreateModal(false);
    setFormData({
      name: "",
      type: "percentage",
      value: 0,
      startDate: "",
      endDate: "",
      usageLimit: 0,
      description: "",
      promoCode: "",
    });
  };

  const togglePromoStatus = (id: string) => {
    setPromos(
      promos.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: p.status === "active" ? "inactive" : "active",
          };
        }
        return p;
      })
    );
  };

  const deletePromo = (id: string) => {
    setPromos(promos.filter((p) => p.id !== id));
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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
            <h1 className="text-3xl font-bold text-white">Promotions</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage discounts, coupons, and special offers
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Create Promo
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
            const gradients = [
              { gradient: 'linear-gradient(135deg, #FDF8E8, #F9EDC5, #F3DA8B)', border: '1px solid rgba(201,154,46,0.2)' },
              { gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)', border: '1px solid rgba(59,130,246,0.2)' },
              { gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)', border: '1px solid rgba(245,158,11,0.2)' },
              { gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)', border: '1px solid rgba(16,185,129,0.2)' },
            ];
            return (
              <motion.div
                key={idx}
                variants={item}
                whileHover={{ y: -4 }}
                style={{ background: gradients[idx].gradient, border: gradients[idx].border }}
                className="rounded-2xl p-6 text-slate-900 shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75">
                      {stat.label}
                    </p>
                    <h3 className="text-3xl font-bold mt-2 text-slate-900">{stat.value}</h3>
                  </div>
                  <Icon size={24} className="opacity-80 text-slate-600" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {typeFilters.map((type) => (
            <motion.button
              key={type}
              onClick={() => setSelectedType(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedType === type
                  ? "bg-accent-500 text-white shadow-lg"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Promo Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredPromos.map((promo) => (
            <motion.div
              key={promo.id}
              variants={item}
              whileHover={{ y: -4 }}
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderLeft: promo.status === "active" ? '4px solid' : '1px solid rgba(0,0,0,0.05)',
                borderImage: promo.status === "active" ? 'linear-gradient(180deg, #F97316, #E6B426) 1' : 'none',
              }}
              className="rounded-2xl shadow-card hover:shadow-xl transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900 flex-1">
                    {promo.name}
                  </h3>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      promo.type
                    )}`}
                  >
                    {promo.type.charAt(0).toUpperCase() + promo.type.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      promo.status
                    )}`}
                  >
                    {promo.status.charAt(0).toUpperCase() +
                      promo.status.slice(1)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4">{promo.description}</p>

                {/* Discount Value */}
                <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-3 mb-4">
                  <p className="text-2xl font-bold text-accent-600">
                    {formatIDR(promo.value, promo.type)}
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs font-medium">
                      Start Date
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {new Date(promo.startDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-medium">
                      End Date
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {new Date(promo.endDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Usage */}
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-slate-600 font-medium">Usage</p>
                  <p className="text-lg font-bold text-slate-900">
                    {promo.usageCount} / <span className="text-slate-500">Unlimited</span>
                  </p>
                </div>

                {/* Promo Code */}
                {promo.code && (
                  <div className="bg-slate-100 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <code className="font-mono text-sm font-bold text-slate-900">
                      {promo.code}
                    </code>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyPromoCode(promo.code)}
                      className="text-slate-600 hover:text-accent-600 transition-colors"
                    >
                      <Copy size={16} />
                    </motion.button>
                  </div>
                )}

                {copiedCode === promo.code && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-green-600 font-medium mb-3"
                  >
                    Copied to clipboard!
                  </motion.p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
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
                    onClick={() => togglePromoStatus(promo.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      promo.status === "active"
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {promo.status === "active" ? (
                      <>
                        <Pause size={16} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Resume
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    <Copy size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deletePromo(promo.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Create Promo Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
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
                  Create New Promotion
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <form onSubmit={handleCreatePromo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Promo Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="e.g., Summer Sale"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bogo">Buy One Get One</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="e.g., 20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimit: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={formData.promoCode}
                    onChange={(e) =>
                      setFormData({ ...formData, promoCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="e.g., SUMMER20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    rows={3}
                    placeholder="Describe the promotion..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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
                    Create
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

export default Promotions;
