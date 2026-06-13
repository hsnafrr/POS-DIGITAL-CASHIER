import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Flame, Drumstick, UtensilsCrossed, Soup, Cake, Wine,
  Coffee, Leaf, Tag, Star, ShoppingCart, X, Minus, Plus,
  Trash2, CreditCard, Banknote, QrCode, Smartphone, DollarSign,
  Receipt, CheckCircle, AlertCircle, Eye, Download, Share2, Printer, Clock, Check,
} from 'lucide-react';
import { categories, products } from '../data/mockData';
import { useOrderStore } from '../stores/orderStore';
import { Product, OrderItem, Category } from '../types';

const Cashier = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris' | 'ewallet' | 'bank' | 'split'>('cash');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [cashAmount, setCashAmount] = useState(0);
  const [productQty, setProductQty] = useState(1);
  const [productNotes, setProductNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [qrTimeLeft, setQrTimeLeft] = useState(15);

  const order = useOrderStore((state) => state.currentOrder);
  const subtotal = useOrderStore((state) => state.subtotal);
  const tax = useOrderStore((state) => state.tax);
  const serviceCharge = useOrderStore((state) => state.serviceCharge);
  const grandTotal = useOrderStore((state) => state.grandTotal);
  const addItem = useOrderStore((state) => state.addItem);
  const removeItem = useOrderStore((state) => state.removeItem);
  const updateItemQty = useOrderStore((state) => state.updateItemQty);
  const setTableNumber = useOrderStore((state) => state.setTableNumber);
  const setCustomerName = useOrderStore((state) => state.setCustomerName);
  const setOrderType = useOrderStore((state) => state.setOrderType);
  const setDiscount = useOrderStore((state) => state.setDiscount);
  const clearOrder = useOrderStore((state) => state.clearOrder);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    All: <ShoppingCart className="w-5 h-5" />, Steak: <Flame className="w-5 h-5" />,
    Chicken: <Drumstick className="w-5 h-5" />, 'Rice & Bowl': <UtensilsCrossed className="w-5 h-5" />,
    Pasta: <Soup className="w-5 h-5" />, Dessert: <Cake className="w-5 h-5" />,
    Drinks: <Wine className="w-5 h-5" />, Coffee: <Coffee className="w-5 h-5" />,
    Tea: <Leaf className="w-5 h-5" />,
  };

  const categoryGradients: Record<string, string> = {
    All: 'linear-gradient(135deg, #F97316, #EA580C)',
    Steak: 'linear-gradient(135deg, #DC2626, #B91C1C)',
    Chicken: 'linear-gradient(135deg, #F59E0B, #D97706)',
    'Rice & Bowl': 'linear-gradient(135deg, #10B981, #059669)',
    Pasta: 'linear-gradient(135deg, #F97316, #C2410C)',
    Dessert: 'linear-gradient(135deg, #EC4899, #DB2777)',
    Drinks: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    Coffee: 'linear-gradient(135deg, #92400E, #78350F)',
    Tea: 'linear-gradient(135deg, #059669, #047857)',
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All') filtered = filtered.filter((p) => p.category === selectedCategory);
    if (searchQuery.trim()) filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [selectedCategory, searchQuery]);

  const getStockStyle = (stock: number): { bg: string; color: string; border: string } => {
    if (stock > 10) return { bg: 'rgba(16,185,129,0.12)', color: '#059669', border: 'rgba(16,185,129,0.25)' };
    if (stock > 0) return { bg: 'rgba(245,158,11,0.12)', color: '#D97706', border: 'rgba(245,158,11,0.25)' };
    return { bg: 'rgba(239,68,68,0.12)', color: '#DC2626', border: 'rgba(239,68,68,0.25)' };
  };

  const getStockLabel = (stock: number): string => {
    if (stock > 10) return 'In Stock'; if (stock > 0) return 'Low Stock'; return 'Out of Stock';
  };

  const handleAddToOrder = () => {
    if (selectedProduct) {
      addItem(selectedProduct, productQty, productNotes, selectedAddons, selectedToppings);
      setShowDetailDrawer(false);
      setProductQty(1); setProductNotes(''); setSelectedAddons([]); setSelectedToppings([]); setSelectedProduct(null);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'cash' && cashAmount < grandTotal) { alert('Insufficient cash amount'); return; }
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        setShowPaymentModal(false); setShowReceiptModal(true);
        setTimeout(() => { clearOrder(); setShowReceiptModal(false); setPaymentStatus('idle'); setCashAmount(0); }, 3000);
      }, 1500);
    }, 1500);
  };

  const handleProcessPayment = () => {
    if (order.items.length === 0) { alert('Order is empty'); return; }
    setShowPaymentModal(true);
  };

  React.useEffect(() => {
    if (paymentMethod === 'qris' && showPaymentModal && paymentStatus === 'idle') {
      const timer = setInterval(() => { setQrTimeLeft((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }); }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentMethod, showPaymentModal, paymentStatus]);

  const change = cashAmount - grandTotal;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 30%, #FFF7ED 60%, #FDF8E8 100%)' }}>
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT - CATEGORY FILTER */}
        <motion.div initial={{ x: -300 }} animate={{ x: 0 }} className="hidden lg:flex w-52 flex-col overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #1C1917 0%, #292524 50%, #3B3530 100%)' }}
        >
          <div className="p-4 border-b border-white/10">
            <h2 className="font-bold text-white text-sm uppercase tracking-wider">Categories</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {['All', ...Array.from(new Set(products.map((p) => p.category)))].map((cat) => {
              const itemCount = products.filter((p) => cat === 'All' || p.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <motion.button key={cat} whileHover={{ x: 4 }} onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 text-sm font-medium border-l-4 ${
                    isActive ? 'text-white border-l-transparent' : 'text-white/50 border-l-transparent hover:text-white/80 hover:bg-white/5'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(201,154,46,0.1))', borderLeftColor: '#F97316' } : {}}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isActive ? (categoryGradients[cat] || categoryGradients.All) : 'rgba(255,255,255,0.08)' }}
                  >
                    {categoryIcons[cat] || <Tag className="w-4 h-4" />}
                    {isActive && <style>{`.cat-icon-${cat} * { color: white !important; }`}</style>}
                  </div>
                  <div className="flex-1">
                    <div className={isActive ? 'text-white' : ''}>{cat}</div>
                    <div className={`text-xs ${isActive ? 'text-white/60' : 'text-white/30'}`}>{itemCount} items</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* CENTER - PRODUCT GRID */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-surface-200/50"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))', backdropFilter: 'blur(10px)' }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-base pl-10 pr-4 text-sm" style={{ background: 'rgba(255,255,255,0.8)' }}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-full text-surface-500">
                <div className="text-center"><ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No products found</p></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
                {filteredProducts.map((product) => {
                  const stockStyle = getStockStyle(product.stock);
                  return (
                    <motion.div key={product.id} layoutId={product.id} whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => { setSelectedProduct(product); setShowDetailDrawer(true); }}
                      className="rounded-2xl overflow-hidden cursor-pointer transition-all group relative"
                      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                      <div className="relative w-full h-32 sm:h-40 overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #F5F5F4, #E7E5E4)' }}
                      >
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-start justify-between p-2">
                          {product.isBestSeller && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg"
                              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#78350F' }}
                            >
                              <Star className="w-3 h-3 fill-current" />Best
                            </motion.div>
                          )}
                          {product.isPromo && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg text-white"
                              style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                            >
                              PROMO
                            </motion.div>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); addItem(product, 1); }}
                            className="rounded-full p-2.5 shadow-lg text-white"
                            style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-semibold"
                          style={{ background: stockStyle.bg, color: stockStyle.color, border: `1px solid ${stockStyle.border}` }}
                        >
                          {getStockLabel(product.stock)}
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="font-semibold text-surface-900 text-sm line-clamp-2 mb-1">{product.name}</h3>
                        <div className="mb-2">
                          {product.isPromo && product.promoPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm" style={{ color: '#EA580C' }}>{formatPrice(product.promoPrice)}</span>
                              <span className="text-surface-400 line-through text-xs">{formatPrice(product.price)}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-sm" style={{ color: '#EA580C' }}>{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(249,115,22,0.08)', color: '#EA580C' }}
                          >
                            {product.category}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-surface-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* RIGHT - ORDER PANEL */}
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} className="hidden lg:flex w-96 flex-col"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 50%, #FDF8E8 100%)', borderLeft: '1px solid rgba(249,115,22,0.1)' }}
        >
          {/* Header */}
          <div className="p-4 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 40%, #F97316 100%)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
              style={{ background: 'rgba(255,255,255,0.3)', transform: 'translate(30%, -30%)', filter: 'blur(20px)' }}
            />
            <h2 className="font-bold text-lg relative z-10">Current Order</h2>
            <p className="text-white/70 text-sm relative z-10">Table #{order.tableNumber || '-'}</p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-surface-200/50 space-y-3">
              <div>
                <label className="text-xs font-semibold text-surface-600 mb-1 block">TABLE NUMBER</label>
                <input type="number" value={order.tableNumber || ''} onChange={(e) => setTableNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g., 5" className="input-base text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-600 mb-1 block">CUSTOMER NAME</label>
                <input type="text" value={order.customerName || ''} onChange={(e) => setCustomerName(e.target.value || undefined)}
                  placeholder="e.g., Budi Santoso" className="input-base text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-600 mb-2 block">ORDER TYPE</label>
                <div className="flex gap-2">
                  {['dine-in', 'takeaway', 'delivery'].map((type) => (
                    <motion.button key={type} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setOrderType(type as any)}
                      className={`flex-1 py-2 px-2 rounded-xl font-medium text-xs transition-all ${
                        order.orderType === type ? 'text-white shadow-md' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                      style={order.orderType === type ? { background: 'linear-gradient(135deg, #F97316, #EA580C)' } : {}}
                    >
                      {type === 'dine-in' ? 'Dine In' : type === 'takeaway' ? 'Takeaway' : 'Delivery'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 space-y-2">
              {order.items.length === 0 ? (
                <div className="text-center py-8 text-surface-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">No items added</p>
                </div>
              ) : (
                order.items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className="rounded-xl p-3 border transition-colors"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(250,250,250,0.8))', borderColor: 'rgba(0,0,0,0.06)' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-surface-900 text-sm">{item.product.name}</h4>
                        {(item.notes || item.addons.length > 0 || item.toppings.length > 0) && (
                          <p className="text-xs text-surface-400 mt-1">
                            {item.notes && `Notes: ${item.notes}`}
                            {item.addons.length > 0 && ` | +${item.addons.join(', ')}`}
                            {item.toppings.length > 0 && ` | +${item.toppings.join(', ')}`}
                          </p>
                        )}
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => removeItem(item.id)}
                        className="text-error-500 hover:text-error-600 ml-2">
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-surface-200 w-fit"
                        style={{ background: 'rgba(255,255,255,0.6)' }}
                      >
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateItemQty(item.id, item.qty - 1)} className="p-1 text-surface-600 hover:text-accent-600"><Minus className="w-4 h-4" /></motion.button>
                        <span className="px-3 font-semibold text-sm min-w-[2rem] text-center">{item.qty}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateItemQty(item.id, item.qty + 1)} className="p-1 text-surface-600 hover:text-accent-600"><Plus className="w-4 h-4" /></motion.button>
                      </div>
                      <span className="font-semibold text-surface-900 text-sm">{formatPrice(item.subtotal)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Summary */}
            {order.items.length > 0 && (
              <div className="p-4 border-t border-surface-200/50 space-y-2"
                style={{ background: 'linear-gradient(135deg, rgba(253,248,232,0.5), rgba(255,247,237,0.5))' }}
              >
                <div className="flex justify-between text-sm"><span className="text-surface-500">Subtotal</span><span className="font-semibold text-surface-900">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-surface-500">Tax (10%)</span><span className="font-semibold text-surface-900">{formatPrice(tax)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-surface-500">Service (5%)</span><span className="font-semibold text-surface-900">{formatPrice(serviceCharge)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: '#059669' }}>
                    <span>Discount</span><span className="font-semibold">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-surface-200 pt-2 flex justify-between items-center">
                  <span className="font-bold text-surface-900">Total</span>
                  <span className="font-bold text-lg" style={{ color: '#EA580C' }}>{formatPrice(grandTotal)}</span>
                </div>
                <div className="pt-2">
                  <label className="text-xs font-semibold text-surface-500 mb-1 block">DISCOUNT</label>
                  <input type="number" value={order.discount} onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="Enter discount" className="input-base text-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-surface-200/50 space-y-2" style={{ background: 'rgba(255,255,255,0.8)' }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleProcessPayment}
              disabled={order.items.length === 0}
              className="w-full text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C, #C2410C)' }}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />Process Payment
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={clearOrder}
              className="w-full border-2 border-surface-300 text-surface-700 font-bold py-2.5 rounded-xl hover:border-error-400 hover:text-error-600 transition-all">
              Clear Order
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* PRODUCT DETAIL DRAWER */}
      <AnimatePresence>
        {showDetailDrawer && selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowDetailDrawer(false)} className="fixed inset-0 z-40"
            style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))', backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailDrawer && selectedProduct && (
          <motion.div layoutId={selectedProduct.id} initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 shadow-2xl overflow-y-auto flex flex-col"
            style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 50%, #FFF7ED 100%)' }}
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-surface-200/50"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,250,250,0.95))', backdropFilter: 'blur(10px)' }}
            >
              <h2 className="font-bold text-lg text-surface-900">Product Details</h2>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setShowDetailDrawer(false)}
                className="text-surface-500 hover:text-surface-700"><X className="w-6 h-6" /></motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #F5F5F4, #E7E5E4)' }}
              >
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {selectedProduct.isBestSeller && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#78350F' }}
                  >
                    <Star className="w-4 h-4 fill-current" />Best Seller
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-surface-900 mb-2">{selectedProduct.name}</h1>
                <p className="text-surface-500 text-sm mb-4">{selectedProduct.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  {selectedProduct.isPromo && selectedProduct.promoPrice ? (
                    <div>
                      <span className="text-3xl font-bold" style={{ color: '#EA580C' }}>{formatPrice(selectedProduct.promoPrice)}</span>
                      <span className="text-lg line-through text-surface-400 ml-2">{formatPrice(selectedProduct.price)}</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold" style={{ color: '#EA580C' }}>{formatPrice(selectedProduct.price)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-surface-300'}`} />
                  ))}
                  <span className="text-sm font-semibold text-surface-600">{selectedProduct.rating}</span>
                </div>
              </div>

              {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                <div>
                  <h3 className="font-bold text-surface-900 mb-2">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.ingredients.map((ingredient) => (
                      <span key={ingredient} className="px-3 py-1 rounded-full text-sm"
                        style={{ background: 'rgba(249,115,22,0.08)', color: '#EA580C' }}
                      >{ingredient}</span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-surface-900 mb-2 block">Quantity</label>
                <div className="flex items-center gap-4 p-3 rounded-xl w-fit"
                  style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(201,154,46,0.04))' }}
                >
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setProductQty(Math.max(1, productQty - 1))} className="p-1 rounded-lg" style={{ color: '#EA580C' }}><Minus className="w-5 h-5" /></motion.button>
                  <span className="text-2xl font-bold text-surface-900 w-12 text-center">{productQty}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setProductQty(productQty + 1)} className="p-1 rounded-lg" style={{ color: '#EA580C' }}><Plus className="w-5 h-5" /></motion.button>
                </div>
              </div>

              <div>
                <label className="font-bold text-surface-900 mb-2 block">Notes</label>
                <textarea value={productNotes} onChange={(e) => setProductNotes(e.target.value)} placeholder="Special request..."
                  className="input-base text-sm resize-none h-20" />
              </div>

              {selectedProduct.toppings && selectedProduct.toppings.length > 0 && (
                <div>
                  <label className="font-bold text-surface-900 mb-2 block">Toppings</label>
                  <div className="space-y-2">{selectedProduct.toppings.map((topping) => (
                    <label key={topping} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-surface-50 transition-colors">
                      <input type="checkbox" checked={selectedToppings.includes(topping)}
                        onChange={(e) => e.target.checked ? setSelectedToppings([...selectedToppings, topping]) : setSelectedToppings(selectedToppings.filter((t) => t !== topping))}
                        className="w-4 h-4 rounded accent-orange-600" />
                      <span className="text-sm text-surface-700">{topping}</span>
                    </label>
                  ))}</div>
                </div>
              )}

              {selectedProduct.addons && selectedProduct.addons.length > 0 && (
                <div>
                  <label className="font-bold text-surface-900 mb-2 block">Add-ons</label>
                  <div className="space-y-2">{selectedProduct.addons.map((addon) => (
                    <label key={addon} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-surface-50 transition-colors">
                      <input type="checkbox" checked={selectedAddons.includes(addon)}
                        onChange={(e) => e.target.checked ? setSelectedAddons([...selectedAddons, addon]) : setSelectedAddons(selectedAddons.filter((a) => a !== addon))}
                        className="w-4 h-4 rounded accent-orange-600" />
                      <span className="text-sm text-surface-700">{addon}</span>
                    </label>
                  ))}</div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-surface-200/50 sticky bottom-0" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToOrder}
                disabled={selectedProduct.stock === 0}
                className="w-full text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg, #F97316, #EA580C, #C2410C)' }}
              >
                {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Order'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !paymentStatus.includes('processing' as any) && setShowPaymentModal(false)}
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))', backdropFilter: 'blur(4px)' }}
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)' }}
            >
              <div className="text-white p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #C2410C, #EA580C, #F97316)' }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
                  style={{ background: 'rgba(255,255,255,0.3)', transform: 'translate(30%, -30%)', filter: 'blur(15px)' }}
                />
                <h2 className="text-xl font-bold relative z-10">Payment</h2>
                <p className="text-white/70 text-sm relative z-10">Total: {formatPrice(grandTotal)}</p>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {paymentStatus === 'success' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-8 space-y-3">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="flex justify-center">
                      <CheckCircle className="w-16 h-16" style={{ color: '#10B981' }} />
                    </motion.div>
                    <h3 className="text-xl font-bold text-surface-900">Payment Successful!</h3>
                    <p className="text-surface-500 text-sm">Transaction completed</p>
                  </motion.div>
                )}

                {paymentStatus === 'processing' && (
                  <div className="text-center py-8 space-y-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="flex justify-center">
                      <Clock className="w-12 h-12" style={{ color: '#F97316' }} />
                    </motion.div>
                    <h3 className="text-lg font-bold text-surface-900">Processing Payment...</h3>
                  </div>
                )}

                {paymentStatus === 'idle' && (
                  <>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-surface-900">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'cash', icon: Banknote, label: 'Cash' },
                          { id: 'qris', icon: QrCode, label: 'QRIS' },
                          { id: 'card', icon: CreditCard, label: 'Card' },
                          { id: 'ewallet', icon: Smartphone, label: 'E-Wallet' },
                          { id: 'bank', icon: DollarSign, label: 'Bank' },
                          { id: 'split', icon: Share2, label: 'Split' },
                        ].map((method) => {
                          const Icon = method.icon;
                          const isActive = paymentMethod === method.id;
                          return (
                            <motion.button key={method.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => setPaymentMethod(method.id as any)}
                              className={`py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 text-xs font-semibold ${
                                isActive ? 'border-transparent text-white shadow-md' : 'border-surface-200 text-surface-600 hover:border-surface-300'
                              }`}
                              style={isActive ? { background: 'linear-gradient(135deg, #F97316, #EA580C)' } : {}}
                            >
                              <Icon className="w-5 h-5" />{method.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {paymentMethod === 'cash' && (
                      <div className="p-4 rounded-xl space-y-3"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(37,99,235,0.04))' }}
                      >
                        <div>
                          <label className="text-sm font-bold text-surface-900 mb-1 block">Cash Amount</label>
                          <input type="number" value={cashAmount} onChange={(e) => setCashAmount(parseInt(e.target.value) || 0)}
                            placeholder="Enter cash amount" className="input-base text-sm" />
                        </div>
                        {cashAmount > 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="p-3 rounded-xl border border-surface-200"
                            style={{ background: 'rgba(255,255,255,0.8)' }}
                          >
                            <div className="flex justify-between text-sm mb-2"><span className="text-surface-500">Total</span><span className="font-semibold">{formatPrice(grandTotal)}</span></div>
                            <div className="flex justify-between text-sm mb-2"><span className="text-surface-500">Cash</span><span className="font-semibold">{formatPrice(cashAmount)}</span></div>
                            <div className={`flex justify-between text-sm pt-2 border-t border-surface-200 ${change >= 0 ? '' : ''}`}
                              style={{ color: change >= 0 ? '#059669' : '#DC2626' }}
                            >
                              <span className="font-bold">Change</span><span className="font-bold">{formatPrice(Math.max(0, change))}</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {paymentMethod === 'qris' && (
                      <div className="space-y-3">
                        <div className="p-8 rounded-xl text-center"
                          style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.05), rgba(201,154,46,0.08))' }}
                        >
                          <div className="w-40 h-40 rounded-xl mx-auto mb-4 flex items-center justify-center border-2"
                            style={{ background: '#fff', borderColor: 'rgba(249,115,22,0.2)' }}
                          >
                            <QrCode className="w-20 h-20" style={{ color: '#F97316' }} />
                          </div>
                          <p className="text-sm text-surface-500">Scan with your phone</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold p-3 rounded-xl"
                          style={{ background: 'rgba(245,158,11,0.08)', color: '#D97706' }}
                        >
                          <Clock className="w-4 h-4" /><span>Expires in {qrTimeLeft}m</span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="p-4 rounded-xl text-center"
                        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(37,99,235,0.04))' }}
                      >
                        <CreditCard className="w-8 h-8 mx-auto mb-2" style={{ color: '#3B82F6' }} />
                        <p className="text-sm text-surface-500">Insert or tap card to device</p>
                      </div>
                    )}

                    {(paymentMethod === 'ewallet' || paymentMethod === 'bank' || paymentMethod === 'split') && (
                      <div className="p-4 rounded-xl text-center"
                        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.04))' }}
                      >
                        <p className="text-sm text-surface-500">Payment method ready</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {paymentStatus === 'idle' && (
                <div className="p-6 border-t border-surface-200/50 space-y-2 flex gap-2"
                  style={{ background: 'linear-gradient(135deg, rgba(253,248,232,0.3), rgba(255,247,237,0.3))' }}
                >
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-2.5 border border-surface-300 text-surface-700 font-bold rounded-xl hover:bg-surface-50 transition-all">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePayment}
                    disabled={paymentMethod === 'cash' && cashAmount < grandTotal}
                    className="flex-1 text-white font-bold py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                  >Confirm Payment</motion.button>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="p-6 border-t border-surface-200/50" style={{ background: 'rgba(255,255,255,0.8)' }}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowPaymentModal(false)}
                    className="w-full text-white font-bold py-2.5 rounded-xl shadow-md"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >Done</motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECEIPT MODAL */}
      <AnimatePresence>
        {showReceiptModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))', backdropFilter: 'blur(4px)' }}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #FFFFFF, #FFFBEB)' }}
            >
              <div className="p-6 text-center space-y-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-2xl font-bold text-surface-900">STEAK HOUR</h2>
                  <p className="text-surface-500 text-sm">Jakarta Pusat Outlet</p>
                </motion.div>
                <div className="border-y border-surface-200 py-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-surface-500">Date</span><span className="font-semibold">{new Date().toLocaleDateString('id-ID')}</span></div>
                  <div className="flex justify-between"><span className="text-surface-500">Receipt #</span><span className="font-semibold">ORD-{Date.now().toString().slice(-6)}</span></div>
                  <div className="flex justify-between"><span className="text-surface-500">Table</span><span className="font-semibold">#{order.tableNumber || 'N/A'}</span></div>
                </div>
                <div className="text-left space-y-2 text-sm max-h-32 overflow-y-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1"><div className="font-semibold text-surface-900">{item.product.name}</div><div className="text-xs text-surface-400">x{item.qty}</div></div>
                      <div className="font-semibold">{formatPrice(item.subtotal)}</div>
                    </div>
                  ))}
                </div>
                <div className="border-y border-surface-200 py-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between text-surface-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-surface-500"><span>Tax (10%)</span><span>{formatPrice(tax)}</span></div>
                  <div className="flex justify-between text-surface-500"><span>Service (5%)</span><span>{formatPrice(serviceCharge)}</span></div>
                  <div className="flex justify-between font-bold text-lg text-surface-900"><span>TOTAL</span><span>{formatPrice(grandTotal)}</span></div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.04), rgba(201,154,46,0.06))' }}>
                  <QrCode className="w-24 h-24 mx-auto" style={{ color: '#9CA3AF' }} />
                  <p className="text-xs text-surface-500 mt-2">Thank you for your purchase!</p>
                </div>
                <div className="flex gap-2 pt-2">
                  {[
                    { icon: <Printer className="w-4 h-4" />, label: 'Print' },
                    { icon: <Download className="w-4 h-4" />, label: 'PDF' },
                    { icon: <Share2 className="w-4 h-4" />, label: 'Share' },
                  ].map((btn) => (
                    <motion.button key={btn.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-surface-200 rounded-xl hover:bg-surface-50 transition-all text-sm font-medium text-surface-700"
                    >{btn.icon}{btn.label}</motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cashier;
