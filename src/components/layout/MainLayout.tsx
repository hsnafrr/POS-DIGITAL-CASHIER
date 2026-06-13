import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '../../stores/appStore';

export default function MainLayout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex h-screen" style={{ background: 'linear-gradient(135deg, #FAFAF9 0%, #F5F5F4 25%, #FFF7ED 50%, #FDF8E8 75%, #FAFAF9 100%)' }}>
      <Sidebar />

      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <Header />

        <motion.main
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <Outlet />
        </motion.main>
      </motion.div>
    </div>
  );
}
