import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './utils/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import ProviderProfilePage from './pages/public/ProviderProfilePage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookingsPage from './pages/customer/BookingsPage';
import MessagesPage from './pages/customer/MessagesPage';
import ChatThreadPage from './pages/customer/ChatThreadPage';
import ProfilePage from './pages/customer/ProfilePage';

// Provider pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderServicesPage from './pages/provider/ProviderServicesPage';
import NewServicePage from './pages/provider/NewServicePage';
import ProviderBookingsPage from './pages/provider/ProviderBookingsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProvidersPage from './pages/admin/AdminProvidersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/providers/:id" element={<ProviderProfilePage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer */}
      <Route path="/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute roles={['customer']}><BookingsPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute roles={['customer']}><MessagesPage /></ProtectedRoute>} />
      <Route path="/messages/:id" element={<ProtectedRoute roles={['customer']}><ChatThreadPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute roles={['customer', 'provider', 'admin']}><ProfilePage /></ProtectedRoute>} />

      {/* Provider */}
      <Route path="/provider/dashboard" element={<ProtectedRoute roles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider/services" element={<ProtectedRoute roles={['provider']}><ProviderServicesPage /></ProtectedRoute>} />
      <Route path="/provider/services/new" element={<ProtectedRoute roles={['provider']}><NewServicePage /></ProtectedRoute>} />
      <Route path="/provider/bookings" element={<ProtectedRoute roles={['provider']}><ProviderBookingsPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/providers" element={<ProtectedRoute roles={['admin']}><AdminProvidersPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookingsPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;