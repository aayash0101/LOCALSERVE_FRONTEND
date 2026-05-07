import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';

const AdminProvidersPage = () => {
  const queryClient = useQueryClient();

  const { data: pending, isLoading } = useQuery({
    queryKey: ['pendingProviders'],
    queryFn: async () => {
      const { data } = await api.get('/admin/providers/pending');
      return data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/providers/${id}/approve`),
    onSuccess: () => {
      toast.success('Provider approved!');
      queryClient.invalidateQueries(['pendingProviders']);
    },
    onError: () => toast.error('Could not approve provider'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/providers/${id}/reject`),
    onSuccess: () => {
      toast.success('Provider rejected');
      queryClient.invalidateQueries(['pendingProviders']);
    },
    onError: () => toast.error('Could not reject provider'),
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Approvals</h1>
        <p className="text-gray-500 mb-8">Review and approve provider accounts</p>

        {isLoading ? (
          <p className="text-gray-400 text-center py-20">Loading...</p>
        ) : pending?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">All caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No providers pending approval</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending?.map((provider) => (
              <div key={provider._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-xl">
                      {provider.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.email}</p>
                    {provider.phone && (
                      <p className="text-sm text-gray-500">{provider.phone}</p>
                    )}
                    {provider.location?.district && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {provider.location.district}
                      </p>
                    )}
                    {provider.bio && (
                      <p className="text-sm text-gray-400 mt-2 italic">"{provider.bio}"</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Registered {new Date(provider.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => approveMutation.mutate(provider._id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Reject and remove this provider?')) {
                          rejectMutation.mutate(provider._id);
                        }
                      }}
                      disabled={rejectMutation.isPending}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 border border-red-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <XCircle size={14} /> Reject
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

export default AdminProvidersPage;