import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { Star, MapPin, Package } from 'lucide-react';

const ProviderProfilePage = () => {
  const { id } = useParams();

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['providerReviews', id],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/provider/${id}`);
      return data;
    },
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['providerServices', id],
    queryFn: async () => {
      const { data } = await api.get('/services?limit=100');
      return data;
    },
  });

  const services = servicesData?.services?.filter((s) => s.provider?._id === id) || [];

  const avgRating = reviews?.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Get provider info from first review or first service
  const providerName = reviews?.[0]?.provider?.name || services?.[0]?.provider?.name || 'Provider';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Provider Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold text-3xl">
                {providerName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{providerName}</h1>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {avgRating} ({reviews?.length || 0} reviews)
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Package size={14} />
                  {services.length} services
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Services */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Services</h2>
            {servicesLoading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : services.length === 0 ? (
              <p className="text-gray-400 text-sm">No services listed yet</p>
            ) : (
              services.map((service) => (
                <Link
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-orange-200 hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {service.category === 'cleaning' ? '🧹' :
                     service.category === 'plumbing' ? '🔧' :
                     service.category === 'electrical' ? '⚡' :
                     service.category === 'tutoring' ? '📚' :
                     service.category === 'beauty' ? '💄' :
                     service.category === 'moving' ? '📦' :
                     service.category === 'repair' ? '🛠️' :
                     service.category === 'gardening' ? '🌿' : '🔨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-orange-500 uppercase">{service.category}</span>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{service.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">Rs. {service.price}</p>
                    <p className="text-xs text-gray-400">{service.priceType}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
            {reviewsLoading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : reviews?.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet</p>
            ) : (
              reviews?.map((review) => (
                <div key={review._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-bold text-xs">
                        {review.customer?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{review.customer?.name}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={10}
                            className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.service && (
                    <p className="text-xs text-orange-500 font-medium mb-1">{review.service.title}</p>
                  )}
                  <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderProfilePage;