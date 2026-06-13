import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Cashier from './pages/Cashier';
import Transactions from './pages/Transactions';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import Promotions from './pages/Promotions';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Outlets from './pages/Outlets';
import Employees from './pages/Employees';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import OnlineOrder from './pages/OnlineOrder';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/order" element={<OnlineOrder />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/outlets" element={<Outlets />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
