import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Star, MapPin, Clock, Tag, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const timeSlots = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
];

const ServiceDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data } = await api.get(`/services/${id}`);
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/service/${id}`);
      return data;
    },
  });

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (!date || !timeSlot) return toast.error('Please select a date and time slot');
    setBooking(true);
    try {
      await api.post('/bookings', {
        serviceId: id,
        date,
        timeSlot,
        notes,
      });
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleMessage = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post('/conversations', { recipientId: service.provider._id });
      navigate(`/messages/${data._id}`);
    } catch {
      toast.error('Could not start conversation');
    }
  };

  if (isLoading) return <Layout><div className="text-center py-20 text-gray-400">Loading...</div></Layout>;
  if (!service) return <Layout><div className="text-center py-20 text-gray-400">Service not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Service Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center overflow-hidden">
              {service.images?.[0] ? (
                <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-8xl">
                  {service.category === 'cleaning' ? '🧹' :
                   service.category === 'plumbing' ? '🔧' :
                   service.category === 'electrical' ? '⚡' :
                   service.category === 'tutoring' ? '📚' : '🛠️'}
                </span>
              )}
            </div>

            {/* Title & Meta */}
            <div>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">{service.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3">{service.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {service.rating || 0} ({service.reviewCount || 0} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  Rs. {service.price} / {service.priceType}
                </span>
                {service.location?.district && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {service.location.district}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-3">About this service</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>

            {/* Provider */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">About the Provider</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-xl">
                    {service.provider?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <Link to={`/providers/${service.provider?._id}`} className="font-bold text-gray-900 hover:text-orange-500 transition-colors">
                    {service.provider?.name}
                  </Link>
                  {service.provider?.location?.district && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {service.provider.location.district}, {service.provider.location.city}
                    </p>
                  )}
                  {service.provider?.bio && (
                    <p className="text-sm text-gray-500 mt-1">{service.provider.bio}</p>
                  )}
                </div>
                <button
                  onClick={handleMessage}
                  className="ml-auto flex items-center gap-2 border border-gray-200 hover:border-orange-400 text-gray-600 hover:text-orange-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <MessageCircle size={16} /> Message
                </button>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Reviews ({reviews?.length || 0})</h2>
              {reviews?.length === 0 ? (
                <p className="text-gray-400 text-sm">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews?.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-sm">
                            {review.customer?.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{review.customer?.name}</p>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} size={10} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-1">Book this Service</h2>
              <p className="text-2xl font-bold text-orange-500 mb-5">
                Rs. {service.price}
                <span className="text-sm text-gray-400 font-normal"> / {service.priceType}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Select Date</label>
                  <DatePicker
                    selected={date}
                    onChange={setDate}
                    minDate={new Date()}
                    placeholderText="Pick a date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Time Slot</label>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 ${
                          timeSlot === slot
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-200 text-gray-600 hover:border-orange-300'
                        }`}
                      >
                        <Clock size={12} /> {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none"
                  />
                </div>

                <button
                  onClick={handleBook}
                  disabled={booking || user?.role === 'provider' || user?.role === 'admin'}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {booking ? 'Booking...' : user?.role === 'provider' ? 'Providers cannot book' : 'Confirm Booking'}
                </button>

                {!user && (
                  <p className="text-center text-xs text-gray-400">
                    <Link to="/login" className="text-orange-500 font-semibold">Login</Link> to book this service
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetailPage;