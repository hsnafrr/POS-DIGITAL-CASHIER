import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingCart,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Zap,
  Badge,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  Calendar,
  Users,
} from 'lucide-react';
import { products, categories } from '../data/mockData';
import { Product, Category } from '../types';

// Types for cart and reviews
interface CartItem {
  product: Product;
  quantity: number;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

// Sample reviews data
const reviews: Review[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    rating: 5,
    text: 'Absolutely incredible steaks! The Premium Wagyu is simply the best I\'ve ever had. Service was impeccable and the atmosphere is perfect for special occasions.',
    date: '2024-06-10',
    verified: true,
  },
  {
    id: '2',
    name: 'Rina Wijaya',
    rating: 5,
    text: 'Great dining experience! The ribeye was cooked to perfection, and the cocktails are amazing. Highly recommend for dates and celebrations.',
    date: '2024-06-08',
    verified: true,
  },
  {
    id: '3',
    name: 'Ahmad Pratama',
    rating: 4.8,
    text: 'World-class restaurant! The filet mignon was tender and flavorful. Desserts are also fantastic. Will definitely come back.',
    date: '2024-06-05',
    verified: true,
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    rating: 5,
    text: 'Best steak house in Jakarta! Everything is perfectly prepared. The ambiance is elegant and sophisticated. Worth every penny.',
    date: '2024-06-01',
    verified: true,
  },
  {
    id: '5',
    name: 'Hendra Gunawan',
    rating: 4.7,
    text: 'Excellent pasta too! Not just steaks. The carbonara is creamy and delicious. Staff is very attentive.',
    date: '2024-05-28',
    verified: true,
  },
  {
    id: '6',
    name: 'Citra Kusuma',
    rating: 5,
    text: 'Premium quality at premium prices, but worth it. T-bone was magnificent. Already made a reservation for next month!',
    date: '2024-05-25',
    verified: true,
  },
];

// Gallery images
const galleryImages = [
  'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1546134/pexels-photo-1546134.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
];

// Format currency to IDR
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Rating Stars Component
const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  isFeatured?: boolean;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isFeatured = false, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isFeatured) {
    return (
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          {product.isBestSeller && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold"
            >
              <Zap size={12} /> Best Seller
            </motion.div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-accent-500">{formatPrice(product.price)}</span>
              {product.isPromo && product.promoPrice && (
                <span className="text-sm line-through text-gray-400">{formatPrice(product.promoPrice)}</span>
              )}
            </div>
            <StarRating rating={product.rating} size={14} />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            className="w-full bg-accent-500 text-white py-2 rounded-lg font-semibold hover:bg-accent-600 transition-colors"
          >
            Add to Cart
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
    >
      <div className="relative h-40 overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="p-3">
        <h4 className="font-bold text-sm mb-1 text-gray-800">{product.name}</h4>
        <p className="text-xs text-gray-600 line-clamp-1 mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-accent-500">{formatPrice(product.price)}</span>
          <StarRating rating={product.rating} size={12} />
        </div>
      </div>
    </motion.div>
  );
};

// Horizontal Scroll Component
interface HorizontalScrollProps {
  children: React.ReactNode;
  id: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({ children, id }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
        >
          <ChevronLeft size={20} />
        </motion.button>
      )}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pb-2 px-8 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {children}
      </div>
      {canScrollRight && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
        >
          <ChevronRight size={20} />
        </motion.button>
      )}
    </div>
  );
};

// Main Component
const OnlineOrder: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('cat-1');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);

  // Get featured products (best sellers)
  const featuredProducts = products.filter((p) => p.isBestSeller).slice(0, 6);

  // Get popular products
  const popularProducts = products.filter((p) => p.rating >= 4.6).slice(0, 8);

  // Get products for selected category
  const categoryProducts = products.filter((p) => {
    const categoryName = categories.find((c) => c.id === selectedCategory)?.name;
    return p.category === categoryName;
  });

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Banner */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative h-screen bg-black overflow-hidden"
      >
        <img
          src="https://images.pexels.com/photos/1546134/pexels-photo-1546134.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Steak Hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">STEAK HOUR</h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-gray-200 mb-8"
          >
            Premium Steak & Fine Dining
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
              className="px-8 py-3 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Order Now <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReservationOpen(true)}
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              Reserve a Table
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.section>

      {/* Menu Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Menu Categories</h2>
          <HorizontalScroll id="categories">
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-6 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all ${
                    selectedCategory === category.id
                      ? 'bg-accent-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {IconComponent && <IconComponent size={20} />}
                  <span>{category.name}</span>
                  <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded-full">
                    {category.itemCount}
                  </span>
                </motion.button>
              );
            })}
          </HorizontalScroll>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            Our Signature Dishes
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFeatured
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            Most Popular
          </motion.h2>
          <HorizontalScroll id="popular">
            {popularProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleAddToCart(product)}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold mb-2 text-gray-800">{product.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-accent-500">{formatPrice(product.price)}</span>
                    <StarRating rating={product.rating} size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </HorizontalScroll>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            {categories.find((c) => c.id === selectedCategory)?.name || 'Menu'}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categoryProducts.map((product) => (
              <div key={product.id} onClick={() => handleAddToCart(product)}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            What Our Guests Say
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ y: -4 }}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-accent-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                  {review.verified && (
                    <Badge size={14} className="text-green-500" />
                  )}
                </div>
                <div className="mb-3">
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p className="text-gray-700 text-sm">{review.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-8 text-center"
          >
            Reserve Your Table
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800 p-8 rounded-lg"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <input
                  type="time"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
              </div>
              <div>
                <select className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500">
                  <option>Number of Guests</option>
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                className="w-full text-white py-3 rounded-lg font-bold transition-colors"
              >
                Book Now
              </motion.button>
            </form>
          </motion.div>

          {/* WhatsApp Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-gray-300 mb-4">Or</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/6212345678901"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-lg font-bold transition-colors"
            >
              <MessageCircle size={20} /> Reserve via WhatsApp
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            Visit Us
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center border-2 border-gray-300"
            >
              <div className="text-center">
                <MapPin size={48} className="text-gray-500 mx-auto mb-2" />
                <p className="text-gray-600 font-semibold">Map Coming Soon</p>
              </div>
            </motion.div>

            {/* Location Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Location</h3>
                <p className="text-gray-700 flex items-start gap-3">
                  <MapPin size={20} className="text-accent-500 flex-shrink-0 mt-1" />
                  Jl. Jend. Sudirman No. 123, Jakarta Pusat
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-700">
                  {[
                    { day: 'Monday - Friday', hours: '11:00 AM - 11:00 PM' },
                    { day: 'Saturday', hours: '10:00 AM - 12:00 AM' },
                    { day: 'Sunday', hours: '10:00 AM - 11:00 PM' },
                  ].map((item) => (
                    <div key={item.day} className="flex justify-between">
                      <span className="font-semibold">{item.day}</span>
                      <span className="text-gray-600">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:+62215555001"
                  className="text-gray-700 flex items-center gap-3 hover:text-accent-500 transition-colors"
                >
                  <Phone size={20} className="text-accent-500" />
                  +62 21 5555 0001
                </a>
                <a
                  href="mailto:info@steakhour.com"
                  className="text-gray-700 flex items-center gap-3 hover:text-accent-500 transition-colors"
                >
                  <Mail size={20} className="text-accent-500" />
                  info@steakhour.com
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12 text-gray-800"
          >
            Our Restaurant
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div style={{ background: 'linear-gradient(135deg, #78350F, #92400E, #B45309)' }} className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 rounded-lg p-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">STEAK HOUR</h3>
              <p className="text-gray-300 text-sm">Premium Steak & Fine Dining</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-accent-500 transition-colors">Browse Menu</a></li>
                <li><a href="#" className="hover:text-accent-500 transition-colors">Specials</a></li>
                <li><a href="#" className="hover:text-accent-500 transition-colors">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Restaurant</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-accent-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent-500 transition-colors">Reserve Table</a></li>
                <li><a href="#" className="hover:text-accent-500 transition-colors">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 STEAK HOUR. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        {/* Cart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(!isCartOpen)}
          style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
          className="text-white p-4 rounded-full shadow-lg transition-colors relative"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>

        {/* WhatsApp Button */}
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          href="https://wa.me/6212345678901"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          className="text-white p-4 rounded-full shadow-lg transition-colors"
        >
          <MessageCircle size={24} />
        </motion.a>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="fixed right-0 top-0 h-screen w-96 bg-white shadow-xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 pb-4 border-b"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{item.product.name}</h4>
                        <p className="text-accent-500 font-semibold">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                          <span>{item.quantity}</span>
                          <button className="px-2 py-1 bg-gray-200 rounded">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-accent-500">
                    <span>Total:</span>
                    <span className="font-bold text-lg">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
                  className="w-full text-white py-3 rounded-lg font-bold transition-colors"
                >
                  Checkout
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Helper function to get icon component
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Flame: () => <div className="w-5 h-5">🔥</div>,
    Drumstick: () => <div className="w-5 h-5">🍗</div>,
    UtensilsCrossed: () => <div className="w-5 h-5">🥢</div>,
    Pasta: () => <div className="w-5 h-5">🍝</div>,
    Cake: () => <div className="w-5 h-5">🍰</div>,
    Wine: () => <div className="w-5 h-5">🍷</div>,
    Coffee: () => <div className="w-5 h-5">☕</div>,
    Leaf: () => <div className="w-5 h-5">🍃</div>,
  };
  return iconMap[iconName];
}

// ChevronDown component for scroll indicator
const ChevronDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default OnlineOrder;
