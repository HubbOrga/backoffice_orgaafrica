import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/shared/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import TeamManagement from './pages/users/TeamManagement';
import MenuList from './pages/menu/MenuList';
import Merchants from './pages/restaurants/Merchants';
import PromotionsList from './pages/promotions/PromotionsList';
import RolesList from './pages/roles/RolesList';
import Settings from './pages/settings/Settings';
import OrdersStatistics from './pages/orders/OrdersStatistics';

// ============================================
// MODE FRONT-END ONLY - PAS DE BACKEND REQUIS
// ============================================

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<TeamManagement />} />
              <Route path="/roles" element={<RolesList />} />
              <Route path="/menu" element={<MenuList />} />
              <Route path="/restaurants" element={<Merchants />} />
              <Route path="/orders" element={<OrdersStatistics />} />
              <Route path="/promotions" element={<PromotionsList />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
