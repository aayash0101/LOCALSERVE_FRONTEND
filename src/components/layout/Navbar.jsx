import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X, MapPin } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'provider') return '/provider/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <MapPin size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">
              Local<span className="text-orange-500">Serve</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/services" className="text-gray-600 hover:text-orange-500 font-medium text-sm transition-colors">
              Browse Services
            </Link>

            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-orange-500 font-medium text-sm transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="text-gray-600 hover:text-orange-500 font-medium text-sm transition-colors">
                  Dashboard
                </Link>
                {user.role === 'customer' && (
                  <Link to="/messages" className="text-gray-600 hover:text-orange-500 font-medium text-sm transition-colors">
                    Messages
                  </Link>
                )}
                {user.role === 'provider' && (
                  <Link to="/provider/services" className="text-gray-600 hover:text-orange-500 font-medium text-sm transition-colors">
                    My Services
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link to="/services" className="text-gray-600 font-medium text-sm py-2" onClick={() => setMenuOpen(false)}>
              Browse Services
            </Link>
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 font-medium text-sm py-2" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="text-gray-600 font-medium text-sm py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-red-500 font-medium text-sm py-2 text-left">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;