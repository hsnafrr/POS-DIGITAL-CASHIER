import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Users,
  Crown,
  Gift,
  Wallet,
  X,
  Phone,
  Mail,
  MessageCircle,
  Edit,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { customers } from "../data/mockData";
import { Customer } from "../types";

const CustomersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthday: "",
    notes: "",
  });

  const formatIDR = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchMatch =
        !searchQuery ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      return searchMatch;
    });
  }, [searchQuery]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeMembers = customers.filter(
      (c) => c.membershipLevel !== "regular"
    ).length;
    const pointsRedeemed = customers.reduce((sum, c) => sum + c.points, 0);
    const avgSpend = Math.round(
      customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers
    );

    return { totalCustomers, activeMembers, pointsRedeemed, avgSpend };
  }, []);

  const getMembershipColor = (
    level: Customer["membershipLevel"]
  ): {
    bg: string;
    text: string;
    badge: string;
  } => {
    switch (level) {
      case "bronze":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          badge: "bg-orange-100 text-orange-700",
        };
      case "silver":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          badge: "bg-gray-100 text-gray-700",
        };
      case "gold":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-700",
        };
      case "platinum":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          badge: "bg-purple-100 text-purple-700",
        };
      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-700",
        };
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (level: Customer["membershipLevel"]): string => {
    switch (level) {
      case "bronze":
        return "bg-orange-400";
      case "silver":
        return "bg-gray-400";
      case "gold":
        return "bg-yellow-400";
      case "platinum":
        return "bg-purple-400";
      default:
        return "bg-blue-400";
    }
  };

  const handleAddCustomer = () => {
    setFormData({ name: "", phone: "", email: "", birthday: "", notes: "" });
    setShowAddModal(true);
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailDrawer(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    setFormData({ name: "", phone: "", email: "", birthday: "", notes: "" });
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">
              Manage customer relationships and loyalty
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCustomer}
            className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors"
          >
            <Plus size={20} />
            Add Customer
          </motion.button>
        </div>

        <div className="mt-6 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)', border: '1px solid rgba(59,130,246,0.2)' }}
          className="rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalCustomers}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white">
              <Users size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'linear-gradient(135deg, #FDF8E8, #F9EDC5, #F3DA8B)', border: '1px solid rgba(201,154,46,0.2)' }}
          className="rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.activeMembers}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white">
              <Crown size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)', border: '1px solid rgba(16,185,129,0.2)' }}
          className="rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Points Available</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.pointsRedeemed.toLocaleString()}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white">
              <Gift size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5, #FDBA74)', border: '1px solid rgba(249,115,22,0.2)' }}
          className="rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Spend</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatIDR(stats.avgSpend)}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white">
              <Wallet size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCustomers.map((customer, index) => {
            const membershipColor = getMembershipColor(customer.membershipLevel);
            const avatarColor = getAvatarColor(customer.membershipLevel);

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCustomerClick(customer)}
                style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
                className="rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {customer.name}
                        </h3>
                        <p className={`text-xs font-medium capitalize ${membershipColor.text}`}>
                          {customer.membershipLevel}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>

                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${membershipColor.badge}`}
                    >
                      {customer.membershipLevel}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100 text-center">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Visits</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {customer.visits}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Spent</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {formatIDR(customer.totalSpent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Points</p>
                      <p className="font-bold text-accent-500 text-lg">
                        {customer.points}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-1">
                        Favorite Items
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {customer.favoriteMenu.slice(0, 2).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {item}
                          </span>
                        ))}
                        {customer.favoriteMenu.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            +{customer.favoriteMenu.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">
                        Last Visit: {formatDate(customer.lastVisit)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">No customers found</p>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      <AnimatePresence>
        {showDetailDrawer && selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailDrawer(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)' }}
              className="fixed right-0 top-0 h-full w-full max-w-md shadow-lg z-50 overflow-y-auto"
            >
              <button
                onClick={() => setShowDetailDrawer(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>

              <div className="p-6">
                <div className="text-center mb-8">
                  <div
                    className={`w-20 h-20 ${getAvatarColor(selectedCustomer.membershipLevel)} rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4`}
                  >
                    {getInitials(selectedCustomer.name)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-gray-600 capitalize mt-1">
                    {selectedCustomer.membershipLevel} Member
                  </p>
                </div>

                <div
                  style={{
                    background: selectedCustomer.membershipLevel === "platinum"
                      ? 'linear-gradient(135deg, #78350F, #92400E, #B45309)'
                      : selectedCustomer.membershipLevel === "gold"
                        ? 'linear-gradient(135deg, #78350F, #92400E, #B45309)'
                        : selectedCustomer.membershipLevel === "silver"
                          ? 'linear-gradient(135deg, #78350F, #92400E, #B45309)'
                          : 'linear-gradient(135deg, #78350F, #92400E, #B45309)'
                  }}
                  className="rounded-lg p-6 mb-6 text-white"
                >
                  <p className="text-sm opacity-90 mb-2">
                    {selectedCustomer.membershipLevel.toUpperCase()} MEMBER
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">
                        {selectedCustomer.points}
                      </p>
                      <p className="text-sm opacity-90">Points</p>
                    </div>
                    <Crown size={32} className="opacity-80" />
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }} className="rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Contact Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Phone</p>
                        <p className="text-gray-900 font-medium">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-gray-900 font-medium">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Customer Stats</h3>
                  <div className="space-y-3">
                    <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }} className="flex justify-between items-center p-3 rounded-lg">
                      <span className="text-gray-600 font-medium">
                        Total Visits
                      </span>
                      <span className="font-bold text-gray-900">
                        {selectedCustomer.visits}
                      </span>
                    </div>
                    <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }} className="flex justify-between items-center p-3 rounded-lg">
                      <span className="text-gray-600 font-medium">
                        Total Spent
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatIDR(selectedCustomer.totalSpent)}
                      </span>
                    </div>
                    <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }} className="flex justify-between items-center p-3 rounded-lg">
                      <span className="text-gray-600 font-medium">
                        Last Visit
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatDate(selectedCustomer.lastVisit)}
                      </span>
                    </div>
                    <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }} className="flex justify-between items-center p-3 rounded-lg">
                      <span className="text-gray-600 font-medium">
                        Member Since
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatDate(selectedCustomer.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedCustomer.favoriteMenu.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Favorite Items
                    </h3>
                    <div className="space-y-2">
                      {selectedCustomer.favoriteMenu.map((item, idx) => (
                        <div
                          key={idx}
                          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
                          className="flex items-center gap-2 p-3 rounded-lg"
                        >
                          <Gift size={16} className="text-accent-500" />
                          <span className="text-gray-900 font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCustomer.notes && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
                    <p style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }} className="text-gray-700 text-sm rounded-lg p-3">
                      {selectedCustomer.notes}
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors"
                  >
                    <Edit size={18} />
                    Edit Customer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={18} />
                    Message via WhatsApp
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)' }}
                className="rounded-lg shadow-xl max-w-md w-full mx-4 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    Add New Customer
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Customer name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Birthday (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) =>
                        setFormData({ ...formData, birthday: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Add any special notes..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 px-4 py-2 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors"
                    >
                      Save
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomersPage;
