import React, { useState, useMemo } from "react";
import {
  Clock,
  Search,
  ChefHat,
  CheckCircle,
  AlertCircle,
  Printer,
  X,
  ChevronRight,
  MapPin,
  Phone,
  CreditCard,
  Utensils,
  DollarSign,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { orders } from "../data/mockData";
import { Order, OrderItem } from "../types";

const OrdersPage: React.FC = () => {
  const [selectedOrderType, setSelectedOrderType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  const formatIDR = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("id-ID");
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const typeMatch =
        selectedOrderType === "all" || order.orderType === selectedOrderType;
      const statusMatch =
        selectedStatus === "all" ||
        (selectedStatus === "new" && order.status === "pending") ||
        (selectedStatus === "preparing" && order.status === "preparing") ||
        (selectedStatus === "ready" &&
          (order.status === "ready" || order.status === "served")) ||
        (selectedStatus === "completed" && order.status === "completed") ||
        (selectedStatus === "cancelled" && order.status === "cancelled");

      const searchMatch =
        !searchQuery ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (order.tableNumber?.toString() || "").includes(searchQuery);

      return typeMatch && statusMatch && searchMatch;
    });
  }, [selectedOrderType, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    const newOrders = orders.filter((o) => o.status === "pending").length;
    const preparingOrders = orders.filter(
      (o) => o.status === "preparing"
    ).length;
    const readyOrders = orders.filter(
      (o) => o.status === "ready" || o.status === "served"
    ).length;
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;

    return { newOrders, preparingOrders, readyOrders, completedOrders };
  }, []);

  const getStatusColor = (status: Order["status"]): string => {
    switch (status) {
      case "completed":
        return "bg-success-50 text-success-700 border-success-200";
      case "served":
        return "bg-accent-50 text-accent-700 border-accent-200";
      case "ready":
        return "bg-accent-100 text-accent-700 border-accent-200";
      case "preparing":
        return "bg-warning-50 text-warning-700 border-warning-200";
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-error-50 text-error-700 border-error-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const getStatusBorderColor = (status: Order["status"]): string => {
    switch (status) {
      case "completed":
        return "border-l-success-500";
      case "served":
      case "ready":
        return "border-l-accent-500";
      case "preparing":
        return "border-l-warning-500";
      case "pending":
        return "border-l-blue-500";
      case "cancelled":
        return "border-l-error-500";
      default:
        return "border-l-neutral-500";
    }
  };

  const getStatusLabel = (status: Order["status"]): string => {
    switch (status) {
      case "pending":
        return "New";
      case "preparing":
        return "Preparing";
      case "served":
        return "Served";
      case "ready":
        return "Ready";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getOrderTypeLabel = (type: string): string => {
    switch (type) {
      case "dine-in":
        return "Dine In";
      case "takeaway":
        return "Take Away";
      case "delivery":
        return "Delivery";
      default:
        return type;
    }
  };

  const getOrderTypeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case "dine-in":
        return <Utensils className="w-4 h-4" />;
      case "takeaway":
        return <AlertCircle className="w-4 h-4" />;
      case "delivery":
        return <MapPin className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleOrderAction = (order: Order) => {
    setSelectedOrder(order);
    setShowDrawer(true);
  };

  const handleActionClick = (
    e: React.MouseEvent,
    action: string,
    order: Order
  ) => {
    e.stopPropagation();
    console.log(`${action} for order ${order.orderNumber}`);
  };

  const renderActionButtons = (order: Order) => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-2 mt-4">
            <button
              onClick={(e) => handleActionClick(e, "accept", order)}
              className="flex-1 px-3 py-2 bg-success-500 text-white rounded-lg text-sm font-medium hover:bg-success-600 transition"
            >
              Accept
            </button>
            <button
              onClick={(e) => handleActionClick(e, "cancel", order)}
              className="flex-1 px-3 py-2 bg-error-500 text-white rounded-lg text-sm font-medium hover:bg-error-600 transition"
            >
              Cancel
            </button>
          </div>
        );
      case "preparing":
        return (
          <button
            onClick={(e) => handleActionClick(e, "markReady", order)}
            className="w-full mt-4 px-3 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition"
          >
            Mark Ready
          </button>
        );
      case "ready":
      case "served":
        return (
          <button
            onClick={(e) => handleActionClick(e, "markComplete", order)}
            className="w-full mt-4 px-3 py-2 bg-success-500 text-white rounded-lg text-sm font-medium hover:bg-success-600 transition"
          >
            Mark Complete
          </button>
        );
      case "completed":
        return (
          <button
            onClick={(e) => handleActionClick(e, "viewReceipt", order)}
            className="w-full mt-4 px-3 py-2 bg-info-500 text-white rounded-lg text-sm font-medium hover:bg-info-600 transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Orders</h1>
        <p className="text-neutral-600">
          Manage kitchen orders and fulfillment
        </p>
      </div>

      <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }} className="rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-200">
          <span className="text-sm font-semibold text-neutral-600">
            Order Type:
          </span>
          <div className="flex gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Dine In", value: "dine-in" },
              { label: "Take Away", value: "takeaway" },
              { label: "Delivery", value: "delivery" },
            ].map((tab) => (
              <motion.button
                key={tab.value}
                onClick={() => setSelectedOrderType(tab.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedOrderType === tab.value
                    ? "bg-accent-500 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-semibold text-neutral-600">
            Status:
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "All", value: "all" },
              { label: "New", value: "new" },
              { label: "Preparing", value: "preparing" },
              { label: "Ready", value: "ready" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ].map((pill) => (
              <motion.button
                key={pill.value}
                onClick={() => setSelectedStatus(pill.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedStatus === pill.value
                    ? "bg-accent-500 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {pill.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order number, customer name, or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "New Orders",
            value: stats.newOrders,
            color: "bg-blue-50 text-blue-700",
            icon: AlertCircle,
          },
          {
            label: "Preparing",
            value: stats.preparingOrders,
            color: "bg-warning-50 text-warning-700",
            icon: ChefHat,
          },
          {
            label: "Ready to Serve",
            value: stats.readyOrders,
            color: "bg-success-50 text-success-700",
            icon: CheckCircle,
          },
          {
            label: "Completed Today",
            value: stats.completedOrders,
            color: "bg-amber-50 text-amber-700",
            icon: DollarSign,
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: stat.label === "New Orders"
                  ? 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)'
                  : stat.label === "Preparing"
                  ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)'
                  : stat.label === "Ready to Serve"
                  ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)'
                  : 'linear-gradient(135deg, #FDF8E8, #F9EDC5, #F3DA8B)',
                border: stat.label === "New Orders"
                  ? '1px solid rgba(59,130,246,0.2)'
                  : stat.label === "Preparing"
                  ? '1px solid rgba(245,158,11,0.2)'
                  : stat.label === "Ready to Serve"
                  ? '1px solid rgba(16,185,129,0.2)'
                  : '1px solid rgba(201,154,46,0.2)',
              }}
              className="rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-25" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div>
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-xl p-12 text-center"
          >
            <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No Orders Found
            </h3>
            <p className="text-neutral-600">
              {searchQuery || selectedStatus !== "all" || selectedOrderType !== "all"
                ? "Try adjusting your filters or search query"
                : "No orders at the moment"}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleOrderAction(order)}
                  style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
                  className={`rounded-xl hover:shadow-md transition cursor-pointer overflow-hidden group border-l-4 ${getStatusBorderColor(
                    order.status
                  )}`}
                >
                  <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 px-6 py-4 border-b border-neutral-200 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block bg-accent-500 text-white px-3 py-1 rounded-lg font-bold text-sm">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        {formatTimeAgo(order.createdAt)}
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-neutral-400 group-hover:text-accent-500 transition" />
                  </div>

                  <div className="px-6 py-4">
                    <div className="mb-4 pb-4 border-b border-neutral-200">
                      <p className="font-semibold text-neutral-900 mb-2">
                        {order.customerName}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          {getOrderTypeIcon(order.orderType)}
                          <span>{getOrderTypeLabel(order.orderType)}</span>
                        </div>
                        {order.tableNumber && (
                          <>
                            <span className="text-neutral-300">•</span>
                            <span>Table {order.tableNumber}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-2">
                        Items
                      </p>
                      <div className="space-y-1">
                        {order.items.map((item: OrderItem) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-start text-sm"
                          >
                            <div className="flex-1">
                              <p className="text-neutral-900 font-medium">
                                {item.product.name}{" "}
                                <span className="text-neutral-600">
                                  x{item.qty}
                                </span>
                              </p>
                              {item.notes && (
                                <p className="text-xs text-neutral-600 italic">
                                  Note: {item.notes}
                                </p>
                              )}
                            </div>
                            <p className="text-neutral-900 font-semibold whitespace-nowrap ml-2">
                              {formatIDR(item.subtotal)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="py-3 border-t border-neutral-200">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-neutral-900">Total</p>
                        <p className="text-lg font-bold text-accent-600">
                          {formatIDR(order.grandTotal)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {renderActionButtons(order)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDrawer && selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)' }}
              className="fixed right-0 top-0 h-screen w-full max-w-md shadow-xl z-50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
                <h2 className="text-xl font-bold text-neutral-900">
                  {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-neutral-600 uppercase">
                      Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Placed {formatTimeAgo(selectedOrder.createdAt)}
                  </p>
                </div>

                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase">
                    Customer Info
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-600 uppercase">Name</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-neutral-600 uppercase">
                          Order Type
                        </p>
                        <p className="text-sm font-medium text-neutral-900">
                          {getOrderTypeLabel(selectedOrder.orderType)}
                        </p>
                      </div>
                      {selectedOrder.tableNumber && (
                        <div>
                          <p className="text-xs text-neutral-600 uppercase">
                            Table
                          </p>
                          <p className="text-sm font-medium text-neutral-900">
                            {selectedOrder.tableNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase">
                    Items
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item: OrderItem) => (
                      <div key={item.id} className="pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-neutral-900">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-neutral-600 mt-1">
                              Qty: {item.qty}
                            </p>
                          </div>
                          <p className="font-semibold text-neutral-900 ml-2">
                            {formatIDR(item.subtotal)}
                          </p>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-neutral-600 italic">
                            Note: {item.notes}
                          </p>
                        )}
                        {(item.addons && item.addons.length > 0 ||
                          item.toppings &&
                            item.toppings.length > 0) && (
                          <div className="text-xs text-neutral-600 mt-2">
                            {item.addons &&
                              item.addons.length > 0 && (
                                <p>Add-ons: {item.addons.join(", ")}</p>
                              )}
                            {item.toppings &&
                              item.toppings.length > 0 && (
                                <p>Toppings: {item.toppings.join(", ")}</p>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase">
                    Payment
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <p className="text-neutral-600">Subtotal</p>
                      <p className="font-medium text-neutral-900">
                        {formatIDR(selectedOrder.subtotal)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-neutral-600">Tax</p>
                      <p className="font-medium text-neutral-900">
                        {formatIDR(selectedOrder.tax)}
                      </p>
                    </div>
                    {selectedOrder.serviceCharge > 0 && (
                      <div className="flex justify-between">
                        <p className="text-neutral-600">Service Charge</p>
                        <p className="font-medium text-neutral-900">
                          {formatIDR(selectedOrder.serviceCharge)}
                        </p>
                      </div>
                    )}
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-success-600">
                        <p>Discount</p>
                        <p className="font-medium">
                          -{formatIDR(selectedOrder.discount)}
                        </p>
                      </div>
                    )}
                    <div className="pt-2 border-t border-neutral-200 flex justify-between">
                      <p className="font-semibold text-neutral-900">Total</p>
                      <p className="text-lg font-bold text-accent-600">
                        {formatIDR(selectedOrder.grandTotal)}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center gap-2 text-xs text-neutral-600">
                      <CreditCard className="w-4 h-4" />
                      <span className="capitalize">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase">
                    Order Details
                  </h3>
                  <div className="text-xs text-neutral-600">
                    <p>
                      <span className="font-medium">Cashier:</span>{" "}
                      {selectedOrder.cashierName}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Placed at:</span>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-200 p-4 flex-shrink-0">
                {selectedOrder.status === "completed" && (
                  <button className="w-full px-4 py-3 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition flex items-center justify-center gap-2">
                    <Printer className="w-5 h-5" />
                    Print Receipt
                  </button>
                )}
                <button
                  onClick={() => setShowDrawer(false)}
                  className="w-full mt-2 px-4 py-3 bg-neutral-100 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-200 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
