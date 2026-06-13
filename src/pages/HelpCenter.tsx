import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Play,
  MessageCircle,
  ShoppingCart,
  CreditCard,
  Package,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  Mail,
  Phone,
  MessageSquare,
  Search,
} from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Article {
  id: number;
  title: string;
  category: string;
  readTime: string;
}

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  articleCount: number;
}

const faqData: FAQ[] = [
  {
    id: 1,
    question: 'How do I add a new product?',
    answer:
      'Navigate to the Products menu in the main sidebar. Click the "Add Product" button, fill in the product details including name, price, category, and SKU. You can also add product images and set portion sizes. Once completed, click Save to add the product to your inventory.',
  },
  {
    id: 2,
    question: 'How to process a QRIS payment?',
    answer:
      'During checkout, select QRIS as the payment method. A QR code will be generated and displayed on the screen. The customer can scan this QR code using their mobile banking app to complete the payment. The transaction will be confirmed automatically when payment is received.',
  },
  {
    id: 3,
    question: 'How to manage table reservations?',
    answer:
      'Go to the Reservations module in your dashboard. You can view available tables, make new reservations by selecting a date and time, and assign them to customer names. The system will automatically notify you of upcoming reservations and help manage table turnover.',
  },
  {
    id: 4,
    question: 'How to export reports to Excel?',
    answer:
      'Open the Reports section from the main menu. Select the report type and date range you need. Click the "Export" button at the top right of the report table. Choose Excel format and the file will be downloaded to your computer ready for analysis.',
  },
  {
    id: 5,
    question: 'How to set up multiple outlets?',
    answer:
      'Contact your system administrator or go to Settings > Multi-Location Setup. You can add multiple outlets from here, each with its own menu, pricing, and inventory. Each outlet operates independently with centralized reporting available from your main dashboard.',
  },
  {
    id: 6,
    question: 'How to manage employee shifts?',
    answer:
      'Navigate to Staff Management in Settings. Create shift templates for different time slots. Assign employees to shifts by selecting the employee and shift date. You can view the shift schedule in a calendar view and make adjustments as needed.',
  },
];

const articleData: Article[] = [
  { id: 1, title: 'Getting Started with POS', category: 'Getting Started', readTime: '5 min' },
  { id: 2, title: 'Payment Methods Overview', category: 'Payments', readTime: '4 min' },
  { id: 3, title: 'Inventory Management Best Practices', category: 'Inventory', readTime: '8 min' },
  { id: 4, title: 'Customer Loyalty Programs', category: 'Customers', readTime: '6 min' },
  { id: 5, title: 'Generating Sales Reports', category: 'Reports', readTime: '7 min' },
  { id: 6, title: 'System Security Settings', category: 'Settings', readTime: '5 min' },
];

const categories: Category[] = [
  { id: 1, name: 'POS Operations', icon: <ShoppingCart className="w-6 h-6" />, articleCount: 12 },
  { id: 2, name: 'Payments & Billing', icon: <CreditCard className="w-6 h-6" />, articleCount: 8 },
  { id: 3, name: 'Inventory Management', icon: <Package className="w-6 h-6" />, articleCount: 10 },
  { id: 4, name: 'Customer Management', icon: <Users className="w-6 h-6" />, articleCount: 7 },
  { id: 5, name: 'Reports & Analytics', icon: <BarChart3 className="w-6 h-6" />, articleCount: 9 },
  { id: 6, name: 'Settings & Configuration', icon: <Settings className="w-6 h-6" />, articleCount: 11 },
];

export default function HelpCenter() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickActions = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Getting Started',
      description: 'Set up your POS system',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'User Guide',
      description: 'Complete feature documentation',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Contact Support',
      description: 'Get help from our team',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="page-container">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-lg text-gray-600 mb-8">Guides, tutorials, and support</p>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`bg-gradient-to-br ${action.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="mb-4">{action.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFAQ.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-left font-semibold text-gray-900">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFAQ === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-white border-t border-gray-200"
                  >
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        {filteredFAQ.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No matching questions found. Try a different search.</p>
          </motion.div>
        )}
      </div>

      {/* Help Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Help Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              whileHover={{ scale: 1.05 }}
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
              className="rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-blue-600">{category.icon}</div>
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {category.articleCount} articles
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h2>
        <div className="space-y-4">
          {articleData.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ x: 8 }}
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
              className="rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">{article.readTime} read</span>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="text-blue-600"
                >
                  <FileText className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Email Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8 }}
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-xl p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">support@steakhourlabs.com</p>
            <p className="text-xs text-gray-500">Response within 24 hours</p>
          </motion.div>

          {/* WhatsApp Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8 }}
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-xl p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp Support</h3>
            <p className="text-gray-600 text-sm mb-4">+62 812 3456 7890</p>
            <p className="text-xs text-gray-500">Chat with us anytime</p>
          </motion.div>

          {/* Phone Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -8 }}
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-xl p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <Phone className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-4">(021) 1234-5678</p>
            <p className="text-xs text-gray-500">Mon-Fri, 9am-6pm WIB</p>
          </motion.div>

          {/* Live Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8 }}
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.05)' }}
            className="rounded-xl p-8 text-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Start a chat</p>
            <p className="text-xs text-gray-500">Available during business hours</p>
          </motion.div>
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-12 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
        <p className="text-lg opacity-90 mb-8">
          Can't find what you're looking for? Our support team is ready to assist you.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Contact Support Team
        </motion.button>
      </motion.div>
    </div>
  );
}
