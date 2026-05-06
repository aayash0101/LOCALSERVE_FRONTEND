import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const CustomerDashboard = () => {
  const { user } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/mine');
      return data;
    },
  });

  const upcoming = bookings?.filter((b) => ['pending', 'confirmed'].includes(b.status)) || [];
  const completed = bookings?.filter((b) => b.status === 'completed') || [];
  const cancelled = bookings?.filter((b) => b.status === 'cancelled') || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: bookings?.length || 0, icon: <Calendar size={20} className="text-orange-500" />, bg: 'bg-orange-50' },
            { label: 'Upcoming', value: upcoming.length, icon: <Clock size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'Completed', value: completed.length, icon: <CheckCircle size={20} className="text-green-500" />, bg: 'bg-green-50' },
            { label: 'Cancelled', value: cancelled.length, icon: <XCircle size={20} className="text-red-500" />, bg: 'bg-red-50' },
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

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-lg">Upcoming Bookings</h2>
            <Link to="/bookings" className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">No upcoming bookings</p>
              <Link to="/services" className="mt-3 inline-block bg-orange-500 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((booking) => (
                <BookingRow key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Browse Services', desc: 'Find new services near you', to: '/services', emoji: '🔍' },
            { label: 'My Bookings', desc: 'View all your bookings', to: '/bookings', emoji: '📅' },
            { label: 'Messages', desc: 'Chat with providers', to: '/messages', emoji: '💬' },
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

const BookingRow = ({ booking }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
      {booking.service?.title?.charAt(0) || '🛠'}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 text-sm truncate">{booking.service?.title}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {new Date(booking.date).toLocaleDateString('en-NP', { weekday: 'short', month: 'short', day: 'numeric' })} • {booking.timeSlot}
      </p>
    </div>
    <div className="flex items-center gap-3">
      <p className="text-sm font-bold text-gray-900">Rs. {booking.totalPrice}</p>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[booking.status]}`}>
        {booking.status}
      </span>
    </div>
  </div>
);

export default CustomerDashboard;