export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  isBestSeller: boolean;
  isPromo: boolean;
  promoPrice?: number;
  sku: string;
  status: "active" | "inactive" | "discontinued";
  ingredients?: string[];
  addons?: string[];
  toppings?: string[];
}

export interface OrderItem {
  id: string;
  product: Product;
  qty: number;
  notes?: string;
  addons?: string[];
  toppings?: string[];
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  tableNumber?: number;
  customerName?: string;
  orderType: "dine-in" | "takeaway" | "delivery";
  status: "pending" | "preparing" | "ready" | "served" | "completed" | "cancelled";
  paymentMethod: "cash" | "card" | "digital" | "pending";
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  grandTotal: number;
  createdAt: string;
  cashierName: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  visits: number;
  points: number;
  membershipLevel: "bronze" | "silver" | "gold" | "platinum" | "regular";
  favoriteMenu: string[];
  notes?: string;
  totalSpent: number;
  lastVisit: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  date: string;
  paymentMethod: "cash" | "card" | "digital";
  status: "success" | "pending" | "failed" | "refunded";
  amount: number;
  outletName: string;
  cashierName: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "maintenance";
  currentOrderId?: string;
  area: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId?: string;
  status: "pending" | "confirmed" | "checked-in" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  manager: string;
  phone: string;
  status: "open" | "closed";
  revenue: number;
  ordersCount: number;
  image: string;
}

export interface Employee {
  id: string;
  name: string;
  role: "manager" | "cashier" | "kitchen" | "waiter" | "admin";
  status: "active" | "inactive" | "on-leave";
  shift: "morning" | "afternoon" | "night";
  phone: string;
  avatar: string;
  performance: number;
  attendance: number;
}

export interface Promotion {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "bogo" | "bundle";
  value: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "expired";
  usageCount: number;
  description: string;
  code: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  color: string;
}

export interface DashboardKPI {
  revenue: number;
  orders: number;
  customers: number;
  avgOrder: number;
  growth: number;
  bestSeller: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  time: string;
  read: boolean;
}

export interface AnalyticsData {
  revenueByMonth: Array<{ month: string; revenue: number }>;
  ordersByDay: Array<{ day: string; count: number }>;
  categorySales: Array<{ category: string; sales: number }>;
  peakHours: Array<{ hour: number; orders: number }>;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  costPrice: number;
  supplier: string;
  lastRestockDate: string;
  reorderLevel: number;
}

export interface Settings {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  taxRate: number;
  serviceChargeRate: number;
  currency: string;
  openingTime: string;
  closingTime: string;
  enableDelivery: boolean;
  enableReservation: boolean;
}
