import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Send } from 'lucide-react';
import { io } from 'socket.io-client';

let socket;

const ChatThreadPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const { data: initialMessages } = useQuery({
    queryKey: ['messages', id],
    queryFn: async () => {
      const { data } = await api.get(`/conversations/${id}/messages`);
      return data;
    },
  });

  useEffect(() => {
    if (initialMessages) setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    socket = io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true });
    socket.emit('join_conversation', id);

    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.disconnect();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/conversations/${id}/messages`, { text });
      setText('');
      queryClient.invalidateQueries(['conversations']);
    } catch {
      // handled by socket
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Conversation</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isMe = msg.sender?._id === user?._id;
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-end">
                      <span className="text-orange-600 font-bold text-xs">
                        {msg.sender?.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatThreadPage;