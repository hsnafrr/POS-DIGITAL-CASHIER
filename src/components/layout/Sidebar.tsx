import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  ClipboardList,
  Users,
  Package,
  Grid3X3,
  Calendar,
  Tag,
  BarChart3,
  FileText,
  Building2,
  UserCog,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShoppingCart, label: 'Digital Cashier', path: '/cashier' },
  { icon: Receipt, label: 'Transactions', path: '/transactions' },
  { icon: ClipboardList, label: 'Orders', path: '/orders' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Grid3X3, label: 'Tables', path: '/tables' },
  { icon: Calendar, label: 'Reservations', path: '/reservations' },
  { icon: Tag, label: 'Promotions', path: '/promotions' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Building2, label: 'Multi Outlet', path: '/outlets' },
  { icon: UserCog, label: 'Employees', path: '/employees' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help Center', path: '/help' },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen flex flex-col z-40"
      style={{
        background: 'linear-gradient(180deg, #1C1917 0%, #292524 40%, #3B3530 100%)',
      }}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #F97316, #EA580C, #C99A2E)' }}
          >
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              <div className="text-sm font-bold text-white">STEAK HOUR</div>
              <div className="text-[10px] font-medium uppercase tracking-widest"
                style={{ background: 'linear-gradient(90deg, #F97316, #E6B426)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                POS SYSTEM
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.15), rgba(201,154,46,0.1))',
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                          style={{ background: 'linear-gradient(180deg, #F97316, #E6B426)' }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm truncate relative z-10"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {!sidebarCollapsed && (
        <div className="px-4 pb-3">
          <div className="rounded-xl p-4"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(201,154,46,0.1))' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
              >
                <span className="text-xs font-bold text-white">P</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-white">PRO Plan</div>
                <div className="text-[10px] text-white/50">3 Outlets Active</div>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div className="h-1.5 rounded-full" style={{ width: '70%', background: 'linear-gradient(90deg, #F97316, #E6B426)' }} />
            </div>
            <div className="text-[10px] text-white/40 mt-1.5">7 days remaining</div>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 p-3">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-200"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};
