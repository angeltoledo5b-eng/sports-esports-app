'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

interface Message {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();

    // Suscripción en tiempo real a nuevos mensajes
    const channel = supabase
      .channel('public:direct_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'direct_messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('direct_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const senderName = user.email ? user.email.split('@')[0] : 'Usuario';

    await supabase.from('direct_messages').insert([
      {
        sender_id: user.id,
        sender_name: senderName,
        message: newMessage,
      },
    ]);

    setNewMessage('');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-gray-900 border border-gray-800 rounded-2xl text-center">
        <p className="text-sm text-gray-300">Debes iniciar sesión para usar el chat privado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header Chat */}
        <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            💬 Chat de la Comunidad
          </h2>
          <span className="text-xs text-green-400 font-medium">● En línea</span>
        </div>

        {/* Lista de Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => {
            const isMe = m.sender_name === user.email?.split('@')[0];
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-gray-500 mb-0.5">@{m.sender_name}</span>
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-xs font-medium ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-950 border border-gray-800 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            );
          })}
        </div>

        {/* Formulario para enviar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-gray-950 border-t border-gray-800 flex gap-2">
          <input
            type="text"
            placeholder="Escribe un mensaje privado..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}