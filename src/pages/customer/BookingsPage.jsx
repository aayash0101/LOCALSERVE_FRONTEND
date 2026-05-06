import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const BookingsPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [reviewModal, setReviewModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/mine');
      return data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => api.put(`/bookings/${id}`, { status: 'cancelled' }),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries(['myBookings']);
    },
    onError: () => toast.error('Could not cancel booking'),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ bookingId, rating, comment }) =>
      api.post('/reviews', { bookingId, rating, comment }),
    onSuccess: () => {
      toast.success('Review submitted!');
      setReviewModal(null);
      setRating(5);
      setComment('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Review failed'),
  });

  const filtered = bookings?.filter((b) => activeTab === 'all' || b.status === activeTab) || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-500 mb-6">Track and manage all your service bookings</p>

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
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    🛠️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900">{booking.service?.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyles[booking.status]}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Provider: {booking.provider?.name}
                    </p>
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
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => setReviewModal(booking)}
                            className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors"
                          >
                            <Star size={12} /> Leave Review
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(booking.status) && (
                          <button
                            onClick={() => cancelMutation.mutate(booking._id)}
                            className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Cancel
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

        {/* Review Modal */}
        {reviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Leave a Review</h2>
              <p className="text-sm text-gray-500 mb-5">{reviewModal.service?.title}</p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star
                        size={28}
                        className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setReviewModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => reviewMutation.mutate({ bookingId: reviewModal._id, rating, comment })}
                  disabled={!comment || reviewMutation.isPending}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingsPage;