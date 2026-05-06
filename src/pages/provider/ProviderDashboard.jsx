import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Package, Calendar, CheckCircle, Clock, ChevronRight, Plus } from 'lucide-react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const ProviderDashboard = () => {
  const { user } = useAuth();

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['providerBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/provider');
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ['providerServices'],
    queryFn: async () => {
      const { data } = await api.get('/services?limit=100');
      return data;
    },
  });

  const myServices = services?.services?.filter(
    (s) => s.provider?._id === user?._id
  ) || [];

  const pending = bookings?.filter((b) => b.status === 'pending') || [];
  const confirmed = bookings?.filter((b) => b.status === 'confirmed') || [];
  const completed = bookings?.filter((b) => b.status === 'completed') || [];
  const earnings = completed.reduce((acc, b) => acc + b.totalPrice, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Provider Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          {!user?.isApproved && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium">
              ⏳ Account pending admin approval
            </div>
          )}
          {user?.isApproved && (
            <Link
              to="/provider/services/new"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Plus size={16} /> New Service
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Earnings', value: `Rs. ${earnings}`, icon: <span className="text-xl">💰</span>, bg: 'bg-green-50' },
            { label: 'My Services', value: myServices.length, icon: <Package size={20} className="text-orange-500" />, bg: 'bg-orange-50' },
            { label: 'Pending', value: pending.length, icon: <Clock size={20} className="text-yellow-500" />, bg: 'bg-yellow-50' },
            { label: 'Completed', value: completed.length, icon: <CheckCircle size={20} className="text-green-500" />, bg: 'bg-green-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-lg">Recent Bookings</h2>
            <Link to="/provider/bookings" className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {bookingsLoading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : bookings?.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">No bookings yet</p>
              <p className="text-gray-400 text-xs mt-1">Bookings will appear here once customers book your services</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings?.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{booking.service?.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.customer?.name} •{' '}
                      {new Date(booking.date).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' })} •{' '}
                      {booking.timeSlot}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-gray-900">Rs. {booking.totalPrice}</p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage Services', desc: 'Edit or add new listings', to: '/provider/services', emoji: '🛠️' },
            { label: 'View Bookings', desc: 'Confirm or complete bookings', to: '/provider/bookings', emoji: '📅' },
            { label: 'Messages', desc: 'Chat with customers', to: '/messages', emoji: '💬' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-orange-200 hover:shadow-md transition-all group"
            >
              <span className="text-3xl mb-3 block">{link.emoji}</span>
              <p className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{link.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProviderDashboard;