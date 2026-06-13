import React, { useState, useMemo } from "react";
import {
  Grid3x3,
  Map,
  Plus,
  Armchair,
  Users,
  Clock,
  SprayCan,
  Eye,
  ArrowRightLeft,
  X,
  Eye as ViewIcon,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tables, orders } from "../data/mockData";
import { Table, Order } from "../types";

const TablesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "floor">("grid");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const formatIDR = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTableOrder = (tableId: string): Order | undefined => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.currentOrderId) return undefined;
    return orders.find((o) => o.id === table.currentOrderId);
  };

  const stats = useMemo(() => {
    const available = tables.filter((t) => t.status === "available").length;
    const occupied = tables.filter((t) => t.status === "occupied").length;
    const reserved = tables.filter((t) => t.status === "reserved").length;
    const cleaning = tables.filter((t) => t.status === "maintenance").length;

    return { available, occupied, reserved, cleaning };
  }, []);

  const getStatusStyle = (
    status: string
  ): {
    bg: string;
    border: string;
    text: string;
  } => {
    switch (status) {
      case "available":
        return { bg: "bg-emerald-50", border: "border-l-4 border-emerald-500", text: "text-emerald-700" };
      case "occupied":
        return { bg: "bg-red-50", border: "border-l-4 border-red-500", text: "text-red-700" };
      case "reserved":
        return { bg: "bg-amber-50", border: "border-l-4 border-amber-500", text: "text-amber-700" };
      case "maintenance":
        return { bg: "bg-blue-50", border: "border-l-4 border-blue-500", text: "text-blue-700" };
      default:
        return { bg: "bg-gray-50", border: "border-l-4 border-gray-500", text: "text-gray-700" };
    }
  };

  const getStatColor = (
    status: string
  ): { bg: string; icon: string; text: string } => {
    switch (status) {
      case "available":
        return { bg: "bg-emerald-100", icon: "text-emerald-600", text: "text-emerald-700" };
      case "occupied":
        return { bg: "bg-red-100", icon: "text-red-600", text: "text-red-700" };
      case "reserved":
        return { bg: "bg-amber-100", icon: "text-amber-600", text: "text-amber-700" };
      case "maintenance":
        return { bg: "bg-blue-100", icon: "text-blue-600", text: "text-blue-700" };
      default:
        return { bg: "bg-gray-100", icon: "text-gray-600", text: "text-gray-700" };
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowDetailDrawer(true);
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    status,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    status: string;
  }) => {
    const colors = getStatColor(status);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border border-gray-200 shadow-md"
        style={{
          background:
            status === "available"
              ? "linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)"
              : status === "occupied"
              ? "linear-gradient(135deg, #FEF2F2, #FEE2E2, #FECACA)"
              : status === "reserved"
              ? "linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)"
              : "linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)",
          borderColor:
            status === "available"
              ? "rgba(16,185,129,0.2)"
              : status === "occupied"
              ? "rgba(239,68,68,0.2)"
              : status === "reserved"
              ? "rgba(245,158,11,0.2)"
              : "rgba(59,130,246,0.2)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${colors.text} mt-2`}>{value}</p>
          </div>
          <div className={`${colors.bg} p-4 rounded-full`}>
            {Icon}
          </div>
        </div>
      </motion.div>
    );
  };

  const TableCard = ({ table }: { table: Table }) => {
    const order = getTableOrder(table.id);
    const styles = getStatusStyle(table.status);

    const getTableGradient = () => {
      switch (table.status) {
        case "available":
          return "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))";
        case "occupied":
          return "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.04))";
        case "reserved":
          return "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))";
        case "maintenance":
          return "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(37,99,235,0.04))";
        default:
          return "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))";
      }
    };

    const getTableBorder = () => {
      switch (table.status) {
        case "available":
          return "#10B981";
        case "occupied":
          return "#EF4444";
        case "reserved":
          return "#F59E0B";
        case "maintenance":
          return "#3B82F6";
        default:
          return "#6B7280";
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        onClick={() => handleTableClick(table)}
        className="rounded-2xl p-6 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        style={{
          background: getTableGradient(),
          borderLeft: `4px solid ${getTableBorder()}`,
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-4xl font-bold text-gray-900">
              {table.number}
            </p>
            <p className="text-sm text-gray-600 mt-1">{table.area}</p>
          </div>
          <div className={`${styles.bg} px-3 py-1 rounded-full text-xs font-semibold ${styles.text}`}>
            {table.capacity} seats
          </div>
        </div>

        <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
          {table.status === "occupied" && order ? (
            <>
              <div>
                <p className="text-xs text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">
                  {order.customerName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-600">Order Total</p>
                  <p className="font-semibold text-gray-900">
                    {formatIDR(order.grandTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Time Seated</p>
                  <p className="font-semibold text-gray-900">45 min</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                  View Order
                </button>
                <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #A855F7, #9333EA)' }}>
                  Transfer
                </button>
              </div>
            </>
          ) : table.status === "available" ? (
            <button className="w-full text-white py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              Create Order
            </button>
          ) : table.status === "reserved" ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Reserved for</p>
                <p className="font-semibold text-gray-900">Guntur Suwandi</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  Seat Now
                </button>
                <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6B7280, #4B5563)' }}>
                  View
                </button>
              </div>
            </div>
          ) : table.status === "maintenance" ? (
            <button className="w-full text-white py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
              Mark Ready
            </button>
          ) : null}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Table Management
            </h1>
            <p className="text-gray-600 mt-1">
              Visual floor plan and table status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-accent-500 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("floor")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "floor"
                    ? "bg-white text-accent-500 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Map size={20} />
              </button>
            </div>
            <button className="text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>
              <Plus size={20} />
              Add Table
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Armchair size={28} className="text-emerald-600" />}
          label="Available"
          value={stats.available}
          status="available"
        />
        <StatCard
          icon={<Users size={28} className="text-red-600" />}
          label="Occupied"
          value={stats.occupied}
          status="occupied"
        />
        <StatCard
          icon={<Clock size={28} className="text-amber-600" />}
          label="Reserved"
          value={stats.reserved}
          status="reserved"
        />
        <StatCard
          icon={<SprayCan size={28} className="text-blue-600" />}
          label="Cleaning"
          value={stats.cleaning}
          status="maintenance"
        />
      </div>

      <div
        className={`grid gap-4 ${
          viewMode === "grid" ? "grid-cols-4" : "grid-cols-3"
        }`}
      >
        <AnimatePresence>
          {tables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDetailDrawer && selectedTable && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailDrawer(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">Table {selectedTable.number}</h2>
                <button
                  onClick={() => setShowDetailDrawer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Table Information</h3>
                  <div className="space-y-2 rounded-lg p-4"
                    style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-semibold">{selectedTable.capacity} seats</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area</span>
                      <span className="font-semibold">{selectedTable.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold capitalize ${getStatusStyle(selectedTable.status).text}`}>
                        {selectedTable.status}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedTable.status === "occupied" && getTableOrder(selectedTable.id) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                    <div className="space-y-3 rounded-lg p-4"
                      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order #</span>
                        <span className="font-semibold">{getTableOrder(selectedTable.id)?.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer</span>
                        <span className="font-semibold">{getTableOrder(selectedTable.id)?.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grand Total</span>
                        <span className="font-semibold">{formatIDR(getTableOrder(selectedTable.id)?.grandTotal || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="font-semibold text-blue-600 capitalize">
                          {getTableOrder(selectedTable.id)?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedTable.status === "occupied" && (
                    <>
                      <button className="w-full text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                        <ViewIcon size={18} />
                        View Full Order
                      </button>
                      <button className="w-full text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #A855F7, #9333EA)' }}>
                        <ArrowRightLeft size={18} />
                        Transfer Table
                      </button>
                      <button className="w-full text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #6B7280, #4B5563)' }}>
                        <LogOut size={18} />
                        Merge Tables
                      </button>
                    </>
                  )}
                  {selectedTable.status === "available" && (
                    <button className="w-full text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                      <Plus size={18} />
                      Create New Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TablesPage;
