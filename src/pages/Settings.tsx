import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Upload,
  Save,
  Bell,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState({
    // General
    restaurantName: "STEAK HOUR POS SYSTEM",
    address: "Jl. Sudirman No. 123, Jakarta Pusat, Indonesia",
    phone: "021-5555-0001",
    email: "info@steakhour.com",

    // Branding
    primaryColor: "#059669",
    accentColor: "#F59E0B",

    // Receipt
    receiptFormat: "80mm",
    showLogo: true,
    showTaxBreakdown: true,
    showQRCode: true,
    footerMessage: "Thank you for your purchase!",

    // Language
    language: "indonesian",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",

    // Currency
    currency: "IDR",
    decimalPlaces: 0,
    thousandSeparator: ".",

    // Tax
    taxRate: 10,
    serviceChargeRate: 5,
    taxInclusive: false,

    // Tables
    defaultTableCount: 15,

    // Notifications
    orderAlerts: true,
    lowStockAlerts: true,
    reservationAlerts: true,
    paymentAlerts: true,
    dailySummary: true,

    // Printer
    printerName: "Brother QL-800",
    autoPrintReceipt: true,
    printKitchenOrder: true,

    // QRIS
    qrisProvider: "Jenis QRIS",
    merchantId: "IDxxxxxx",
    apiKey: "sk_live_xxxxxx",

    // Appearance
    theme: "light",
    sidebarPosition: "left",
    compactMode: false,
    fontSize: "normal",
  });

  const sections = [
    { id: "general", label: "General" },
    { id: "branding", label: "Branding" },
    { id: "receipt", label: "Receipt" },
    { id: "language", label: "Language" },
    { id: "currency", label: "Currency" },
    { id: "tax", label: "Tax" },
    { id: "tables", label: "Tables" },
    { id: "notifications", label: "Notifications" },
    { id: "printer", label: "Printer" },
    { id: "qris", label: "QRIS" },
    { id: "users", label: "Users" },
    { id: "appearance", label: "Appearance" },
  ];

  const handleSave = (section: string) => {
    // Handle save logic
    console.log(`Saved ${section} settings`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) =>
                  setSettings({ ...settings, restaurantName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-accent-500 hover:bg-accent-50 transition">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (max 5MB)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("general")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "branding":
        return (
          <motion.div
            key="branding"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="w-20 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) =>
                    setSettings({ ...settings, accentColor: e.target.value })
                  }
                  className="w-20 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) =>
                    setSettings({ ...settings, accentColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Options
              </label>
              <div className="space-y-2">
                {["Use Logo", "Show Name", "Show Both"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="logo-option"
                      defaultChecked={option === "Show Both"}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Header Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-accent-500 hover:bg-accent-50 transition">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upload header image</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("branding")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "receipt":
        return (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Size
              </label>
              <select
                value={settings.receiptFormat}
                onChange={(e) =>
                  setSettings({ ...settings, receiptFormat: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="58mm">58mm (Thermal)</option>
                <option value="80mm">80mm (Standard)</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Show Logo
                </label>
                <input
                  type="checkbox"
                  checked={settings.showLogo}
                  onChange={(e) =>
                    setSettings({ ...settings, showLogo: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Show Tax Breakdown
                </label>
                <input
                  type="checkbox"
                  checked={settings.showTaxBreakdown}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showTaxBreakdown: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Show QR Code
                </label>
                <input
                  type="checkbox"
                  checked={settings.showQRCode}
                  onChange={(e) =>
                    setSettings({ ...settings, showQRCode: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Message
              </label>
              <textarea
                value={settings.footerMessage}
                onChange={(e) =>
                  setSettings({ ...settings, footerMessage: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("receipt")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "language":
        return (
          <motion.div
            key="language"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="indonesian">Bahasa Indonesia</option>
                <option value="english">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) =>
                  setSettings({ ...settings, dateFormat: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Format
              </label>
              <select
                value={settings.timeFormat}
                onChange={(e) =>
                  setSettings({ ...settings, timeFormat: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="24h">24 Hour (00:00 - 23:59)</option>
                <option value="12h">12 Hour (12:00 AM - 11:59 PM)</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("language")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "currency":
        return (
          <motion.div
            key="currency"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="IDR">Indonesian Rupiah (IDR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decimal Places
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={settings.decimalPlaces}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    decimalPlaces: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thousand Separator
              </label>
              <select
                value={settings.thousandSeparator}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    thousandSeparator: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value=".">Dot (1.000)</option>
                <option value=",">Comma (1,000)</option>
                <option value=" ">Space (1 000)</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("currency")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "tax":
        return (
          <motion.div
            key="tax"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxRate: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Charge Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={settings.serviceChargeRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    serviceChargeRate: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <label className="text-sm font-medium text-gray-700">
                Tax Inclusive (Not Exclusive)
              </label>
              <input
                type="checkbox"
                checked={settings.taxInclusive}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    taxInclusive: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("tax")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "tables":
        return (
          <motion.div
            key="tables"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Table Count
              </label>
              <input
                type="number"
                min="1"
                value={settings.defaultTableCount}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultTableCount: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Areas Management
              </label>
              <div className="space-y-2">
                {["Window Seating", "Main Area", "VIP Area", "Banquet Area"].map(
                  (area) => (
                    <div
                      key={area}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {area}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  )
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("tables")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {[
              { key: "orderAlerts", label: "Order Alerts" },
              { key: "lowStockAlerts", label: "Low Stock Alerts" },
              { key: "reservationAlerts", label: "Reservation Alerts" },
              { key: "paymentAlerts", label: "Payment Alerts" },
              { key: "dailySummary", label: "Daily Summary" },
            ].map((notif) => (
              <div
                key={notif.key}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <label className="text-sm font-medium text-gray-700">
                  {notif.label}
                </label>
                <input
                  type="checkbox"
                  checked={settings[notif.key as keyof typeof settings] as boolean}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [notif.key]: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("notifications")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center mt-6"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "printer":
        return (
          <motion.div
            key="printer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Printer Name
              </label>
              <input
                type="text"
                value={settings.printerName}
                onChange={(e) =>
                  setSettings({ ...settings, printerName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <label className="text-sm font-medium text-gray-700">
                Auto Print Receipt
              </label>
              <input
                type="checkbox"
                checked={settings.autoPrintReceipt}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoPrintReceipt: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <label className="text-sm font-medium text-gray-700">
                Print Kitchen Order
              </label>
              <input
                type="checkbox"
                checked={settings.printKitchenOrder}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    printKitchenOrder: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("printer")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "qris":
        return (
          <motion.div
            key="qris"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QRIS Provider
              </label>
              <select
                value={settings.qrisProvider}
                onChange={(e) =>
                  setSettings({ ...settings, qrisProvider: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="Jenis QRIS">Jenis QRIS</option>
                <option value="QRIS Standard">QRIS Standard</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merchant ID
              </label>
              <input
                type="text"
                value={settings.merchantId}
                onChange={(e) =>
                  setSettings({ ...settings, merchantId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={settings.apiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, apiKey: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("qris")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      case "users":
        return (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                User List
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Admin", role: "Administrator" },
                  { name: "Manager", role: "Manager" },
                  { name: "Cashier", role: "Cashier" },
                ].map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              + Add User
            </motion.button>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Role Permissions
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 font-medium">
                        Permission
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Admin
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Manager
                      </th>
                      <th className="px-4 py-2 text-center text-gray-700 font-medium">
                        Cashier
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {["View Reports", "Manage Users", "Edit Settings"].map(
                      (perm) => (
                        <tr key={perm} className="border-b border-gray-200">
                          <td className="px-4 py-2 text-gray-700 font-medium">
                            {perm}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 rounded"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 rounded"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded"
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );

      case "appearance":
        return (
          <motion.div
            key="appearance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({ ...settings, theme: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sidebar Position
              </label>
              <select
                value={settings.sidebarPosition}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sidebarPosition: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <label className="text-sm font-medium text-gray-700">
                Compact Mode
              </label>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    compactMode: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) =>
                  setSettings({ ...settings, fontSize: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSave("appearance")}
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-medium transition w-full justify-center"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <SettingsIcon className="w-8 h-8 text-accent-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your POS system</p>
        </div>
      </motion.div>

      {/* Settings Layout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        {/* Navigation Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-2 sticky top-6">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveSection(section.id)}
                style={activeSection === section.id ? { background: 'linear-gradient(135deg, #F97316, #EA580C)' } : { background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(201,154,46,0.05))' }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  activeSection === section.id
                    ? "text-white"
                    : "text-gray-700 hover:opacity-80"
                }`}
              >
                {section.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div style={{ background: 'linear-gradient(180deg, #FFFFFF, #FFFBEB)', border: '1px solid rgba(201,154,46,0.08)' }} className="rounded-lg shadow-md p-6">
            {renderSection()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
