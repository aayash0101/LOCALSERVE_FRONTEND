import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { Users, Package, Calendar, Clock, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  const { data: users } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data;
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/bookings');
      return data;
    },
  });

  const { data: pendingProviders } = useQuery({
    queryKey: ['pendingProviders'],
    queryFn: async () => {
      const { data } = await api.get('/admin/providers/pending');
      return data;
    },
  });

  const customers = users?.filter((u) => u.role === 'customer') || [];
  const providers = users?.filter((u) => u.role === 'provider') || [];
  const completed = bookings?.filter((b) => b.status === 'completed') || [];
  const earnings = completed.reduce((acc, b) => acc + b.totalPrice, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Users', value: users?.length || 0, icon: <Users size={20} className="text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'Providers', value: providers.length, icon: <Package size={20} className="text-orange-500" />, bg: 'bg-orange-50' },
            { label: 'Total Bookings', value: bookings?.length || 0, icon: <Calendar size={20} className="text-green-500" />, bg: 'bg-green-50' },
            { label: 'Pending Approvals', value: pendingProviders?.length || 0, icon: <Clock size={20} className="text-yellow-500" />, bg: 'bg-yellow-50' },
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

        {/* Pending Approvals Alert */}
        {pendingProviders?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                ⏳ {pendingProviders.length} provider{pendingProviders.length > 1 ? 's' : ''} waiting for approval
              </p>
              <p className="text-amber-600 text-xs mt-0.5">Review and approve provider accounts</p>
            </div>
            <Link
              to="/admin/providers"
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Review Now
            </Link>
          </div>
        )}

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-lg">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          {bookings?.length === 0 ? (
            <p className="text-gray-400 text-sm">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Provider</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings?.slice(0, 5).map((booking) => (
                    <tr key={booking._id}>
                      <td className="py-3 font-medium text-gray-900 truncate max-w-[150px]">{booking.service?.title}</td>
                      <td className="py-3 text-gray-500">{booking.customer?.name}</td>
                      <td className="py-3 text-gray-500">{booking.provider?.name}</td>
                      <td className="py-3 font-semibold text-gray-900">Rs. {booking.totalPrice}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage Providers', desc: 'Approve or reject providers', to: '/admin/providers', emoji: '🛠️' },
            { label: 'All Users', desc: 'View all platform users', to: '/admin/users', emoji: '👥' },
            { label: 'All Bookings', desc: 'Monitor all bookings', to: '/admin/bookings', emoji: '📅' },
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

export default AdminDashboard;