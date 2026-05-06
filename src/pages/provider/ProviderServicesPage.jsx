import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ProviderServicesPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['providerServices'],
    queryFn: async () => {
      const { data } = await api.get('/services?limit=100');
      return data;
    },
  });

  const myServices = data?.services?.filter((s) => s.provider?._id === user?._id) || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      toast.success('Service deleted');
      queryClient.invalidateQueries(['providerServices']);
    },
    onError: () => toast.error('Could not delete service'),
  });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-500 mt-1">Manage your service listings</p>
          </div>
          {user?.isApproved && (
            <Link
              to="/provider/services/new"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              <Plus size={16} /> Add Service
            </Link>
          )}
        </div>

        {!user?.isApproved && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
            ⏳ Your account is pending admin approval. You'll be able to list services once approved.
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-400 text-center py-20">Loading...</p>
        ) : myServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 font-semibold">No services yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first service listing</p>
            {user?.isApproved && (
              <Link
                to="/provider/services/new"
                className="mt-4 inline-flex items-center gap-2 bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-colors"
              >
                <Plus size={16} /> Add Service
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {myServices.map((service) => (
              <div key={service._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-orange-500 uppercase">{service.category}</span>
                    <h3 className="font-bold text-gray-900 mt-0.5 truncate">{service.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${service.isActive ? 'bg-green-400' : 'bg-gray-300'}`} />
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-bold text-gray-900">Rs. {service.price}</p>
                    <p className="text-xs text-gray-400">{service.priceType}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {service.rating || 0} ({service.reviewCount || 0})
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Link
                      to={`/services/${service._id}`}
                      className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-orange-300 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this service?')) {
                          deleteMutation.mutate(service._id);
                        }
                      }}
                      className="text-xs font-semibold text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
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

export default ProviderServicesPage;