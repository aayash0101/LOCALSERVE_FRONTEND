import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/bookings');
      return data;
    },
  });

  const filtered = bookings?.filter((b) => activeTab === 'all' || b.status === activeTab) || [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Bookings</h1>
        <p className="text-gray-500 mb-6">Monitor all bookings across the platform</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && ` (${bookings?.filter((b) => b.status === tab).length || 0})`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-center py-20">Loading...</p>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Provider</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900 max-w-[150px] truncate">
                        {booking.service?.title}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{booking.customer?.name}</td>
                      <td className="px-5 py-3 text-gray-500">{booking.provider?.name}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-900">Rs. {booking.totalPrice}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-10">No bookings found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminBookingsPage;