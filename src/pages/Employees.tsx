import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCog,
  Clock,
  CalendarOff,
  Star,
  Search,
  Plus,
  X,
  Phone,
  Eye,
  Edit2,
  Calendar,
  Trash2,
} from "lucide-react";
import { employees } from "../data/mockData";
import { Employee } from "../types";

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "cashier" as const,
    phone: "",
    status: "active" as const,
    shift: "morning" as const,
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm);
    const matchesRole = selectedRole === "All" || emp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const onShift = filteredEmployees.filter((e) => e.status === "active").length;
  const onLeave = filteredEmployees.filter((e) => e.status === "on-leave").length;
  const avgPerformance =
    filteredEmployees.length > 0
      ? Math.round(
          filteredEmployees.reduce((sum, e) => sum + e.performance, 0) /
            filteredEmployees.length
        )
      : 0;

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      cashier: "bg-blue-100 text-blue-700",
      supervisor: "bg-accent-100 text-accent-700",
      manager: "bg-amber-100 text-amber-700",
      owner: "bg-purple-100 text-purple-700",
      kitchen: "bg-orange-100 text-orange-700",
      waiter: "bg-green-100 text-green-700",
      admin: "bg-indigo-100 text-indigo-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-400";
      case "on-leave":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  const getShiftLabel = (shift: string) => {
    const labels: Record<string, string> = {
      morning: "Morning (6 AM - 2 PM)",
      afternoon: "Afternoon (2 PM - 10 PM)",
      night: "Night (10 PM - 6 AM)",
    };
    return labels[shift] || shift;
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      cashier: "Cashier",
      supervisor: "Supervisor",
      manager: "Manager",
      owner: "Owner",
      kitchen: "Kitchen Staff",
      waiter: "Waiter",
      admin: "Admin",
    };
    return labels[role] || role;
  };

  const handleAddEmployee = () => {
    setShowAddModal(false);
    setFormData({
      name: "",
      role: "cashier",
      phone: "",
      status: "active",
      shift: "morning",
    });
  };

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage staff, roles, and performance</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </motion.button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[
            "All",
            "cashier",
            "supervisor",
            "manager",
            "owner",
            "kitchen",
            "waiter",
          ].map((role) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                selectedRole === role
                  ? "bg-accent-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {role === "All" ? role : getRoleLabel(role)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            icon: UserCog,
            label: "Total Staff",
            value: employees.length,
            color: "text-blue-600",
            style: { background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)', border: '1px solid rgba(59,130,246,0.2)' },
          },
          {
            icon: Clock,
            label: "On Shift",
            value: onShift,
            color: "text-green-600",
            style: { background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5, #A7F3D0)', border: '1px solid rgba(16,185,129,0.2)' },
          },
          {
            icon: CalendarOff,
            label: "On Leave",
            value: onLeave,
            color: "text-amber-600",
            style: { background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)', border: '1px solid rgba(245,158,11,0.2)' },
          },
          {
            icon: Star,
            label: "Avg Performance",
            value: `${avgPerformance}%`,
            color: "text-amber-500",
            style: { background: 'linear-gradient(135deg, #FDF8E8, #F9EDC5, #F3DA8B)', border: '1px solid rgba(201,154,46,0.2)' },
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            style={stat.style}
            className="rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Employee Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
              className="rounded-lg p-5 shadow-md hover:shadow-lg transition"
            >
              {/* Employee Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{employee.name}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleColor(
                        employee.role
                      )}`}
                    >
                      {getRoleLabel(employee.role)}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    employee.status
                  )}`}
                />
              </div>

              {/* Status */}
              <div className="text-sm text-gray-600 mb-3">
                Status:{" "}
                <span className="font-medium text-gray-900 capitalize">
                  {employee.status === "on-leave" ? "On Leave" : "Active"}
                </span>
              </div>

              {/* Shift Info */}
              <div className="text-sm text-gray-600 mb-3">
                Shift:{" "}
                <span className="font-medium text-gray-900">
                  {getShiftLabel(employee.shift)}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>

              {/* Performance */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Performance
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {employee.performance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${employee.performance}%` }}
                  />
                </div>
              </div>

              {/* Attendance */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Attendance
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {employee.attendance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${employee.attendance}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEmployee(employee)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded font-medium text-sm transition"
                >
                  <Eye className="w-4 h-4" />
                  View Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-2 rounded font-medium text-sm transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded font-medium text-sm transition"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Employee Detail Drawer */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-accent-500 to-accent-600 text-white p-6 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {selectedEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedEmployee.name}
                    </h2>
                    <p className="text-accent-100">
                      {getRoleLabel(selectedEmployee.role)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 hover:bg-white/20 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-accent-500" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                </div>

                {/* Shift Schedule */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Shift Schedule
                  </h3>
                  <div style={{ background: 'linear-gradient(180deg, #FFFFFF, #FFFBEB)', border: '1px solid rgba(201,154,46,0.08)' }} className="rounded-lg p-4">
                    <p className="text-gray-700 font-medium mb-3">
                      Current Shift: {getShiftLabel(selectedEmployee.shift)}
                    </p>
                    <div className="grid grid-cols-7 gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center py-2 bg-white rounded border border-gray-200"
                          >
                            <p className="text-xs font-medium text-gray-600">
                              {day}
                            </p>
                            <div className="w-6 h-6 bg-accent-100 rounded-full mx-auto mt-1" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Performance Metrics
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">
                          Performance Score
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {selectedEmployee.performance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedEmployee.performance}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-700">
                          Attendance Rate
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {selectedEmployee.attendance}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${selectedEmployee.attendance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Recent Activity
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Clocked in at 2:00 PM today</p>
                    <p>Processed 15 transactions</p>
                    <p>Completed all assigned tasks</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded font-medium transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded font-medium transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">Add New Employee</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/20 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Employee name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="cashier">Cashier</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="manager">Manager</option>
                    <option value="kitchen">Kitchen Staff</option>
                    <option value="waiter">Waiter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="0812-xxxx-xxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift Preference
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shift: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="morning">Morning (6 AM - 2 PM)</option>
                    <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
                    <option value="night">Night (10 PM - 6 AM)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddEmployee}
                    className="flex-1 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
