import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/shared/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import UsersList from './pages/users/UsersList';
import IngredientsList from './pages/ingredients/IngredientsList';
import RestaurantsList from './pages/restaurants/RestaurantsList';
import PromotionsList from './pages/promotions/PromotionsList';

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
              <Route path="/users" element={<UsersList />} />
              <Route path="/ingredients" element={<IngredientsList />} />
              <Route path="/restaurants" element={<RestaurantsList />} />
              <Route path="/promotions" element={<PromotionsList />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
