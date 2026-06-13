import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  Search,
  Plus,
  Edit,
  Zap,
  Eye,
  X,
} from 'lucide-react';
import { products } from '../data/mockData';
import { Product } from '../types';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState('');

  const categories = ['All', 'Steak', 'Chicken', 'Rice & Bowl', 'Pasta', 'Dessert', 'Drinks', 'Coffee', 'Tea'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const totalProducts = products.length;
  const lowStockItems = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockItems = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 10).slice(0, 5);

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: 'error' };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: 'warning' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: 'success' };
  };

  const getProgressColor = (stock: number) => {
    if (stock >= 20) return 'linear-gradient(90deg, #10B981, #059669)';
    if (stock >= 10) return 'linear-gradient(90deg, #F59E0B, #D97706)';
    return 'linear-gradient(90deg, #EF4444, #DC2626)';
  };

  const handleStockAdjustment = () => {
    if (selectedProduct && newStock) {
      console.log(`Updated ${selectedProduct.name} stock to ${newStock}`);
      setShowStockModal(false);
      setNewStock('');
      setSelectedProduct(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { y: -4, transition: { duration: 0.2 } },
  };

  return (
    <div className="page-container bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-1">Track stock levels and product management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              <Plus size={18} />
              Add Product
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              <Zap size={18} />
              Stock Adjustment
            </button>
          </div>
        </div>

        <div className="mt-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="rounded-2xl p-6 shadow-md"
          style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE, #BFDBFE)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }}>
              <Package className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="rounded-2xl p-6 shadow-md"
          style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7, #FDE68A)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Low Stock Warning</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{lowStockItems}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }}>
              <AlertTriangle className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="rounded-2xl p-6 shadow-md"
          style={{ background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2, #FECACA)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{outOfStockItems}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }}>
              <XCircle className="text-white" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="rounded-2xl p-6 shadow-md"
          style={{ background: 'linear-gradient(135deg, #FDF8E8, #F9EDC5, #F3DA8B)', border: '1px solid rgba(201,154,46,0.2)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Value</p>
              <p className="text-xl font-bold text-amber-600 mt-2">{formatIDR(totalValue)}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, #F97316, #D97706)' }}>
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-8 overflow-x-auto pb-2"
      >
        <div className="flex gap-3 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-accent-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl shadow-md overflow-hidden mb-8"
        style={{ background: 'linear-gradient(180deg, #FFFFFF, #FAFAF9)', border: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Cost</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, idx) => {
                const status = getStockStatus(product.stock);
                const progressColor = getProgressColor(product.stock);
                const maxStock = Math.max(...products.map((p) => p.stock), 100);

                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.description.substring(0, 30)}...</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-gray-700">{product.sku}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{formatIDR(product.price)}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-gray-600">{formatIDR(product.costPrice)}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 w-8">{product.stock}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ background: progressColor, width: `${(product.stock / maxStock) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStockModal(true);
                          }}
                          className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"
                        >
                          <Zap size={16} />
                        </button>
                        <button className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Restock Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                whileHover="hover"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="rounded-xl p-4 border-2 border-yellow-200"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-yellow-600" size={20} />
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">SKU: {product.sku}</p>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Stock Level</span>
                    <span className="text-sm font-bold text-yellow-600">{product.stock} units</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #F59E0B, #D97706)', width: `${(product.stock / 20) * 100}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowStockModal(true);
                  }}
                  className="w-full px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
                >
                  Restock Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500">
                    <option>Select category</option>
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    placeholder="Enter SKU"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (IDR)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price (IDR)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500">
                    <option>active</option>
                    <option>inactive</option>
                    <option>discontinued</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Enter product description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
              >
                Save Product
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showStockModal && selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowStockModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Stock Adjustment</h2>
              <button
                onClick={() => setShowStockModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Product</p>
                <p className="text-lg font-semibold text-gray-900">{selectedProduct.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Current Stock</p>
                <p className="text-2xl font-bold text-accent-600">{selectedProduct.stock} units</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Stock Level</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="Enter new stock quantity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>

              {newStock && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Change: <span className="font-bold">{parseInt(newStock) - selectedProduct.stock > 0 ? '+' : ''}{parseInt(newStock) - selectedProduct.stock}</span> units
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowStockModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStockAdjustment}
                disabled={!newStock}
                className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={!newStock ? {} : { background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
              >
                Update Stock
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;
