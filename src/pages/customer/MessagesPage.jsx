import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { MessageCircle } from 'lucide-react';

const MessagesPage = () => {
  const { user } = useAuth();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get('/conversations');
      return data;
    },
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-500 mb-6">Your conversations with service providers</p>

        {isLoading ? (
          <p className="text-gray-400 text-center py-20">Loading...</p>
        ) : conversations?.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-semibold">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-1">Book a service and message your provider</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations?.map((conv) => {
              const other = conv.participants?.find((p) => p._id !== user?._id);
              return (
                <Link
                  key={conv._id}
                  to={`/messages/${conv._id}`}
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-lg">
                      {other?.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{other?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{other?.role}</p>
                    {conv.lastMessage && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{conv.lastMessage}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MessagesPage;