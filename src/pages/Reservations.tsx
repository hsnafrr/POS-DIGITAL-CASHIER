import React, { useState, useMemo } from "react";
import {
  CalendarPlus,
  Calendar,
  List,
  Phone,
  Users,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  MessageCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { reservations, tables } from "../data/mockData";
import { Reservation, Table } from "../types";

const ReservationsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatIDR = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayReservations = reservations.filter((r) => r.date === today);
    const upcomingReservations = reservations.filter((r) => r.date > today);
    const confirmedReservations = reservations.filter(
      (r) => r.status === "confirmed"
    );
    const pendingConfirm = reservations.filter(
      (r) => r.status === "pending"
    );

    return {
      today: todayReservations.length,
      upcoming: upcomingReservations.length,
      confirmed: confirmedReservations.length,
      pending: pendingConfirm.length,
    };
  }, []);

  const dateString = selectedDate.toISOString().split("T")[0];
  const reservationsForDate = reservations.filter((r) => r.date === dateString);

  const getStatusColor = (
    status: string
  ): { bg: string; text: string; label: string } => {
    switch (status) {
      case "confirmed":
        return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Confirmed" };
      case "pending":
        return { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" };
      case "completed":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "Completed" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Unknown" };
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const hasReservations = (day: number) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return reservations.some((r) => r.date === dateStr);
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
  }) => {
    const gradientMap: { [key: string]: string } = {
      blue: "linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)",
      orange: "linear-gradient(135deg, #FFF7ED, #FFEDD5, #FDBA74)",
      green: "linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)",
      yellow: "linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)",
    };

    const borderMap: { [key: string]: string } = {
      blue: "rgba(59,130,246,0.2)",
      orange: "rgba(249,115,22,0.2)",
      green: "rgba(16,185,129,0.2)",
      yellow: "rgba(245,158,11,0.2)",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border shadow-md"
        style={{
          background: gradientMap[color],
          borderColor: borderMap[color],
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div>{Icon}</div>
        </div>
      </motion.div>
    );
  };

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const statusColors = getStatusColor(reservation.status);

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="border rounded-2xl p-6 hover:shadow-md transition-shadow shadow-sm"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {reservation.customerName}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <Phone size={16} />
              {reservation.phone}
            </div>
          </div>
          <div className={`${statusColors.bg} ${statusColors.text} px-3 py-1 rounded-full text-xs font-semibold`}>
            {statusColors.label}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Date & Time</p>
            <p className="font-semibold text-gray-900">
              {new Date(reservation.date).toLocaleDateString("id-ID")} at {reservation.time}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Guest Count</p>
            <p className="font-semibold text-gray-900 flex items-center gap-1">
              <Users size={16} />
              {reservation.guests} people
            </p>
          </div>
        </div>

        {reservation.tableId && (
          <div className="rounded-lg p-3 mb-4" style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <p className="text-xs text-gray-600">Assigned Table</p>
            <p className="font-semibold text-gray-900">
              Table {tables.find((t) => t.id === reservation.tableId)?.number}
            </p>
          </div>
        )}

        {reservation.notes && (
          <div className="rounded-lg p-3 mb-4"
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
              <FileText size={14} />
              Notes
            </p>
            <p className="text-sm text-gray-700">{reservation.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          {reservation.status === "pending" && (
            <>
              <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                Confirm
              </button>
              <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
                Cancel
              </button>
            </>
          )}
          {reservation.status === "confirmed" && (
            <>
              <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #A855F7, #9333EA)' }}>
                Seat Now
              </button>
              <button className="flex-1 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                <MessageSquare size={16} />
                Message
              </button>
            </>
          )}
          <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
            <Edit size={16} />
          </button>
        </div>
      </motion.div>
    );
  };

  const CalendarDay = ({ day, isCurrentMonth }: { day: number; isCurrentMonth: boolean }) => {
    const dateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const dateStr = dateObj.toISOString().split("T")[0];
    const hasRes = reservations.some((r) => r.date === dateStr);
    const isSelected = dateStr === selectedDate.toISOString().split("T")[0];
    const isToday = dateStr === new Date().toISOString().split("T")[0];

    return (
      <motion.button
        onClick={() => {
          if (isCurrentMonth) {
            setSelectedDate(dateObj);
          }
        }}
        className={`aspect-square rounded-lg font-medium text-sm relative transition-all ${
          !isCurrentMonth
            ? "text-gray-300 bg-gray-50 cursor-not-allowed"
            : isSelected
            ? "text-white"
            : isToday
            ? "text-accent-700 border-2 border-accent-500"
            : "text-gray-900 hover:bg-gray-100"
        }`}
        style={
          isSelected
            ? { background: 'linear-gradient(135deg, #F97316, #EA580C)' }
            : isToday
            ? { background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5, #FDBA74)', borderColor: 'rgba(249,115,22,0.3)' }
            : {}
        }
      >
        {day}
        {hasRes && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#F97316' }}></div>
          </div>
        )}
      </motion.button>
    );
  };

  const monthDays = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const prevMonthDays = getDaysInMonth(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
  );

  const calendarDays = [
    ...Array.from({ length: firstDay }, (_, i) => ({
      day: prevMonthDays - firstDay + i + 1,
      isCurrentMonth: false,
    })),
    ...Array.from({ length: monthDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
    })),
    ...Array.from({ length: 42 - firstDay - monthDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: false,
    })),
  ];

  const monthNames = [
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

  return (
    <div className="page-container">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
            <p className="text-gray-600 mt-1">
              Manage table reservations and bookings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded transition-colors flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-white text-accent-500 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-2 rounded transition-colors flex items-center gap-1 ${
                  viewMode === "calendar"
                    ? "bg-white text-accent-500 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar size={18} />
              </button>
            </div>
            <button
              onClick={() => setShowNewReservationModal(true)}
              className="text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              <CalendarPlus size={20} />
              New Reservation
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Calendar size={28} className="text-blue-600" />}
          label="Today's Reservations"
          value={stats.today}
          color="blue"
        />
        <StatCard
          icon={<Clock size={28} className="text-orange-600" />}
          label="Upcoming"
          value={stats.upcoming}
          color="orange"
        />
        <StatCard
          icon={<CheckCircle size={28} className="text-emerald-600" />}
          label="Confirmed"
          value={stats.confirmed}
          color="green"
        />
        <StatCard
          icon={<AlertCircle size={28} className="text-amber-600" />}
          label="Pending Confirm"
          value={stats.pending}
          color="yellow"
        />
      </div>

      {viewMode === "list" ? (
        <div className="space-y-4">
          {reservationsForDate.length > 0 ? (
            reservationsForDate.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
          ) : (
            <div className="text-center py-12 rounded-2xl border"
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">
                No reservations for {selectedDate.toLocaleDateString("id-ID")}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl shadow-lg p-8"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dayObj, index) => (
              <CalendarDay
                key={index}
                day={dayObj.day}
                isCurrentMonth={dayObj.isCurrentMonth}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showNewReservationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewReservationModal(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">New Reservation</h2>
                <button
                  onClick={() => setShowNewReservationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="08xx xxxx xxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Table (Optional)
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500">
                      <option>Select table</option>
                      {tables
                        .filter((t) => t.status === "available")
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            Table {t.number}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Special requests or notes"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t"
                style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)' }}>
                <button
                  onClick={() => setShowNewReservationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 text-white rounded-lg font-semibold transition-colors hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>
                  Save Reservation
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationsPage;
