import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Globe,
  Clock,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

export const Header = () => {
  const {
    searchQuery,
    setSearchQuery,
    toggleSidebar,
    currentOutlet,
    language,
    setLanguage,
    notifications,
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showOutletMenu, setShowOutletMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const outlets = ['Steak Hour Sudirman', 'Steak Hour Menteng', 'Steak Hour Blok M'];

  return (
    <header className="sticky top-0 right-0 z-30"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.7))',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(249,115,22,0.08)',
      }}
    >
      <div className="flex items-center justify-between h-16 px-6 gap-6">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/60 transition-colors duration-200 text-surface-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-surface-900">STEAK HOUR</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest"
              style={{ background: 'linear-gradient(90deg, #F97316, #C99A2E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              POS SYSTEM
            </p>
          </div>
        </div>

        <div className="flex items-center flex-1 max-w-xs">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-base pl-10 pr-4 text-sm"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <button
              onClick={() => setShowOutletMenu(!showOutletMenu)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 transition-colors duration-200 text-surface-700 whitespace-nowrap border border-surface-200/50"
            >
              <span className="text-sm font-medium truncate max-w-[140px]">{currentOutlet}</span>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </button>

            <AnimatePresence>
              {showOutletMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 glass-strong rounded-2xl shadow-panel z-50 overflow-hidden"
                >
                  {outlets.map((outlet, idx) => (
                    <button
                      key={outlet}
                      onClick={() => setShowOutletMenu(false)}
                      className={`block w-full text-left px-4 py-3 text-sm text-surface-700 hover:bg-accent-50/50 transition-colors duration-200 ${idx === outlets.length - 1 ? '' : 'border-b border-surface-100'}`}
                    >
                      {outlet}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              className="relative p-2.5 rounded-xl hover:bg-white/60 transition-colors duration-200 text-surface-700 border border-surface-200/50"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </motion.span>
              )}
            </button>
          </div>

          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/60 transition-colors duration-200 text-surface-700 border border-surface-200/50"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-40 glass-strong rounded-2xl shadow-panel z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { setLanguage('id'); setShowLanguageMenu(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm transition-colors duration-200 ${
                      language === 'id'
                        ? 'font-medium' : 'text-surface-700 hover:bg-accent-50/50'
                    }`}
                    style={language === 'id' ? { background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(201,154,46,0.05))' } : {}}
                  >
                    Bahasa Indonesia
                  </button>
                  <button
                    onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm transition-colors duration-200 ${
                      language === 'en'
                        ? 'font-medium' : 'text-surface-700 hover:bg-accent-50/50'
                    }`}
                    style={language === 'en' ? { background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(201,154,46,0.05))' } : {}}
                  >
                    English
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:flex items-center gap-3 border-l border-surface-200/50 pl-4">
            <div className="flex flex-col items-end">
              <div className="text-sm font-semibold text-surface-900">Admin</div>
              <div className="text-xs text-surface-500">Cashier</div>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C, #C99A2E)' }}
            >
              <span className="text-sm font-bold text-white">A</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-right border-l border-surface-200/50 pl-4">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-surface-700">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{currentTime}</span>
              </div>
              <div className="text-xs text-surface-500">{currentDate}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
