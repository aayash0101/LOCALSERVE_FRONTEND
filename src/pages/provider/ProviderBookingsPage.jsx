import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const ProviderBookingsPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['providerBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/provider');
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/bookings/${id}`, { status }),
    onSuccess: () => {
      toast.success('Booking updated');
      queryClient.invalidateQueries(['providerBookings']);
    },
    onError: () => toast.error('Could not update booking'),
  });

  const filtered = bookings?.filter((b) => activeTab === 'all' || b.status === activeTab) || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
        <p className="text-gray-500 mb-6">Manage incoming bookings from customers</p>

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
              {tab !== 'all' && (
                <span className="ml-1.5">
                  ({bookings?.filter((b) => b.status === tab).length || 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-center py-20">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-20">No bookings found</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <div key={booking._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900">{booking.service?.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Customer: <span className="font-medium text-gray-700">{booking.customer?.name}</span></p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString('en-NP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-500">{booking.timeSlot}</p>
                    {booking.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">"{booking.notes}"</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <p className="font-bold text-gray-900">Rs. {booking.totalPrice}</p>
                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateMutation.mutate({ id: booking._id, status: 'confirmed' })}
                              className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateMutation.mutate({ id: booking._id, status: 'cancelled' })}
                              className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateMutation.mutate({ id: booking._id, status: 'completed' })}
                            className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProviderBookingsPage;