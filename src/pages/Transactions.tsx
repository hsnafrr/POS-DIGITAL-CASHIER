import React, { useState, useMemo } from "react";
import {
  Download,
  ChevronDown,
  Search,
  Calendar,
  Filter,
  X,
  Eye,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { transactions } from "../data/mockData";
import { Transaction } from "../types";
import { StatusBadge } from "../components/ui/StatusBadge";

const Transactions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [outletFilter, setOutletFilter] = useState("all");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatIDR = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodInfo = (method: string): { icon: React.ReactNode; label: string } => {
    switch (method) {
      case "card":
        return { icon: <CreditCard className="w-4 h-4" />, label: "Credit Card" };
      case "cash":
        return { icon: <Banknote className="w-4 h-4" />, label: "Cash" };
      case "digital":
        return { icon: <Smartphone className="w-4 h-4" />, label: "QRIS/E-Wallet" };
      case "pending":
        return { icon: <Building2 className="w-4 h-4" />, label: "Pending" };
      default:
        return { icon: <CreditCard className="w-4 h-4" />, label: method };
    }
  };

  const outlets = Array.from(new Set(transactions.map((t) => t.outletName)));
  const statusOptions = ["all", "success", "pending", "failed", "refunded"];
  const paymentMethods = ["all", "cash", "card", "digital", "pending"];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.orderId.toLowerCase().includes(searchLower) ||
        transaction.cashierName.toLowerCase().includes(searchLower);

      const transactionDate = new Date(transaction.date);
      let matchesDateRange = true;
      if (dateFrom) {
        matchesDateRange = transactionDate >= new Date(dateFrom);
      }
      if (dateTo && matchesDateRange) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59);
        matchesDateRange = transactionDate <= endDate;
      }

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      const matchesPaymentMethod =
        paymentMethodFilter === "all" ||
        transaction.paymentMethod === paymentMethodFilter;

      const matchesOutlet =
        outletFilter === "all" || transaction.outletName === outletFilter;

      return (
        matchesSearch &&
        matchesDateRange &&
        matchesStatus &&
        matchesPaymentMethod &&
        matchesOutlet
      );
    });
  }, [
    searchQuery,
    dateFrom,
    dateTo,
    statusFilter,
    paymentMethodFilter,
    outletFilter,
  ]);

  const summaryStats = useMemo(() => {
    const completedTransactions = filteredTransactions.filter(
      (t) => t.status === "success"
    );
    const pendingTransactions = filteredTransactions.filter(
      (t) => t.status === "pending"
    );
    const refundedTransactions = filteredTransactions.filter(
      (t) => t.status === "refunded"
    );

    const today = new Date().toLocaleDateString();
    const todayRevenue = completedTransactions
      .filter((t) => new Date(t.date).toLocaleDateString() === today)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalRevenue: completedTransactions.reduce((sum, t) => sum + t.amount, 0),
      todayRevenue,
      pendingAmount: pendingTransactions.reduce((sum, t) => sum + t.amount, 0),
      refundedAmount: refundedTransactions.reduce((sum, t) => sum + t.amount, 0),
      totalCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedTransactions.map((t) => t.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
    setOutletFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    dateFrom ||
    dateTo ||
    statusFilter !== "all" ||
    paymentMethodFilter !== "all" ||
    outletFilter !== "all";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="page-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-start justify-between mb-8" variants={rowVariants}>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Transactions</h1>
          <p className="text-neutral-600 mt-1">
            View and manage all transactions
          </p>
        </div>
        <div className="flex gap-3">
          <div className="dropdown dropdown-end">
            <button className="btn btn-outline btn-sm gap-2">
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a>
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </a>
              </li>
              <li>
                <a>
                  <FileText className="w-4 h-4" />
                  Export as Excel
                </a>
              </li>
              <li>
                <a>
                  <FileText className="w-4 h-4" />
                  Export as CSV
                </a>
              </li>
            </ul>
          </div>

          <button className="btn btn-accent btn-sm">New Transaction</button>
        </div>
      </motion.div>

      <motion.div
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
        className="rounded-xl p-5 mb-6"
        variants={rowVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Search</span>
            </label>
            <input
              type="text"
              placeholder="Transaction ID, Order ID..."
              className="input input-bordered input-sm w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">From Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">To Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Status</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">
                Payment Method
              </span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method === "all"
                    ? "All Methods"
                    : method.charAt(0).toUpperCase() + method.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control lg:col-span-5">
            <label className="label py-1">
              <span className="label-text text-sm font-medium">Outlet</span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={outletFilter}
              onChange={(e) => {
                setOutletFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Outlets</option>
              {outlets.map((outlet) => (
                <option key={outlet} value={outlet}>
                  {outlet}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="btn btn-ghost btn-xs gap-1 text-error"
          >
            <X className="w-3 h-3" />
            Clear Filters
          </button>
        )}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
      >
        <motion.div
          style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)', border: '1px solid rgba(245,158,11,0.2)' }}
          className="rounded-xl p-6"
          variants={rowVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {formatIDR(summaryStats.totalRevenue)}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }} className="w-12 h-12 rounded-lg flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5, #FDBA74)', border: '1px solid rgba(249,115,22,0.2)' }}
          className="rounded-xl p-6"
          variants={rowVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">
                Today's Revenue
              </p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {formatIDR(summaryStats.todayRevenue)}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }} className="w-12 h-12 rounded-lg flex items-center justify-center text-white">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)', border: '1px solid rgba(245,158,11,0.2)' }}
          className="rounded-xl p-6"
          variants={rowVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-warning-600 mt-2">
                {formatIDR(summaryStats.pendingAmount)}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }} className="w-12 h-12 rounded-lg flex items-center justify-center text-white">
              <RefreshCw className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2, #FECACA)', border: '1px solid rgba(239,68,68,0.2)' }}
          className="rounded-xl p-6"
          variants={rowVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm font-medium">
                Refunded Amount
              </p>
              <p className="text-2xl font-bold text-error-600 mt-2">
                {formatIDR(summaryStats.refundedAmount)}
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }} className="w-12 h-12 rounded-lg flex items-center justify-center text-white">
              <RefreshCw className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {filteredTransactions.length === 0 ? (
        <motion.div
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
          className="rounded-2xl p-12 text-center"
          variants={rowVariants}
        >
          <Filter className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No transactions found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your filters to find transactions
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn btn-sm btn-outline"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div
            style={{ background: 'linear-gradient(180deg, #FFFFFF, #FAFAF9)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-2xl shadow-card overflow-hidden"
            variants={rowVariants}
          >
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="w-12">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedRows.size === paginatedTransactions.length && paginatedTransactions.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="text-left">Transaction ID</th>
                    <th className="text-left">Date & Time</th>
                    <th className="text-left">Order ID</th>
                    <th className="text-left">Payment Method</th>
                    <th className="text-right">Amount</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Cashier</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {paginatedTransactions.map((transaction) => {
                      const paymentInfo = getPaymentMethodInfo(
                        transaction.paymentMethod
                      );
                      return (
                        <motion.tr
                          key={transaction.id}
                          variants={rowVariants}
                          className="hover:bg-neutral-50 border-b border-neutral-100 transition-colors"
                        >
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={selectedRows.has(transaction.id)}
                              onChange={(e) =>
                                handleSelectRow(transaction.id, e.target.checked)
                              }
                            />
                          </td>
                          <td>
                            <span className="font-mono text-sm font-medium text-neutral-900">
                              {transaction.id}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-neutral-600">
                              {formatDateTime(transaction.date)}
                            </span>
                          </td>
                          <td>
                            <span className="font-mono text-sm text-accent-600">
                              {transaction.orderId}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-500">
                                {paymentInfo.icon}
                              </span>
                              <span className="text-sm text-neutral-700">
                                {paymentInfo.label}
                              </span>
                            </div>
                          </td>
                          <td className="text-right">
                            <span className="font-bold text-neutral-900">
                              {formatIDR(transaction.amount)}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={transaction.status} />
                          </td>
                          <td>
                            <span className="text-sm text-neutral-600">
                              {transaction.cashierName}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="flex justify-center gap-1">
                              <button
                                className="btn btn-ghost btn-xs"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-neutral-600" />
                              </button>
                              <button
                                className="btn btn-ghost btn-xs"
                                title="View Receipt"
                              >
                                <FileText className="w-4 h-4 text-neutral-600" />
                              </button>
                              {transaction.status !== "refunded" && (
                                <button
                                  className="btn btn-ghost btn-xs"
                                  title="Refund Transaction"
                                >
                                  <RefreshCw className="w-4 h-4 text-error-600" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </motion.div>
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-between mt-6"
            variants={rowVariants}
          >
            <p className="text-sm text-neutral-600">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>
              -
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {filteredTransactions.length}
              </span>{" "}
              transactions
            </p>

            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline gap-1"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${
                        currentPage === page
                          ? "btn-accent"
                          : "btn-outline"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className="btn btn-sm btn-outline gap-1"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Transactions;
