'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { useChatScroll } from '@/hooks/use-chat-scroll';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_username: string;
  sender_avatar_url: string;
}

export default function DMChatPage({ params }: { params: { userId: string } }) {
  const { userId: recipientId } = params;
  const supabase = createClient();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientProfile, setRecipientProfile] = useState<Profile | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useChatScroll(chatContainerRef, messages);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/login');
        return;
      }

      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', authUser.id)
        .single();
      if (currentUserError) console.error('Error fetching current user profile:', currentUserError);
      setCurrentUserProfile(currentUserData);

      const { data: recipientData, error: recipientError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', recipientId)
        .single();
      if (recipientError) console.error('Error fetching recipient profile:', recipientError);
      setRecipientProfile(recipientData);

      setLoading(false);
    };

    fetchProfiles();
  }, [supabase, recipientId, router]);

  useEffect(() => {
    if (!currentUserProfile || !recipientProfile) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*, sender:sender_id(username, avatar_url)')
        .or(`and(sender_id.eq.${currentUserProfile.id},receiver_id.eq.${recipientProfile.id}),and(sender_id.eq.${recipientProfile.id},receiver_id.eq.${currentUserProfile.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data.map((msg: any) => ({
          ...msg,
          sender_username: msg.sender.username || 'Anonymous',
          sender_avatar_url: msg.sender.avatar_url ? supabase.storage.from('avatars').getPublicUrl(msg.sender.avatar_url).data.publicUrl : null,
        })));
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`dm:${[currentUserProfile.id, recipientProfile.id].sort().join('-')}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages' }, async (payload) => {
        const newMsg = payload.new as any;

        // If the new message is from the person we are chatting with, and sent to us, add it.
        if (newMsg.sender_id === recipientProfile.id && newMsg.receiver_id === currentUserProfile.id) {
          const { data: senderProfile, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', newMsg.sender_id)
            .single();

          if (error) {
            console.error('Error fetching sender profile for new message:', error);
            return;
          }

          setMessages((prev) => [...prev, {
            ...newMsg,
            sender_username: senderProfile?.username || 'Anonymous',
            sender_avatar_url: senderProfile?.avatar_url ? supabase.storage.from('avatars').getPublicUrl(senderProfile.avatar_url).data.publicUrl : null,
          }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUserProfile, recipientProfile]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUserProfile || !recipientProfile) return;

    const optimisticMessage: Message = {
      id: `optimistic-${Date.now()}`,
      sender_id: currentUserProfile.id,
      receiver_id: recipientProfile.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender_username: currentUserProfile.username || 'Anonymous',
      sender_avatar_url: currentUserProfile.avatar_url ? supabase.storage.from('avatars').getPublicUrl(currentUserProfile.avatar_url).data.publicUrl : 'https://via.placeholder.com/150',
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');

    const { error } = await supabase.from('direct_messages').insert({
      sender_id: currentUserProfile.id,
      receiver_id: recipientProfile.id,
      content: newMessage.trim(),
    });

    if (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32 flex items-center justify-center">
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <main className="w-full h-screen bg-[#0A0F19] text-gray-300 font-mono flex flex-col">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[50vw] h-[50vh] bg-pink-500/20 -top-1/4 -left-1/4 rounded-full filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute w-[50vw] h-[50vh] bg-sky-500/20 -bottom-1/4 -right-1/4 rounded-full filter blur-[150px] animate-pulse-slow animation-delay-2000"></div>
        <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col flex-grow p-8 pt-32 w-full h-full">
        <header className="text-center mb-8 flex-shrink-0">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-2 tracking-widest uppercase">
            <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>DM with</span>
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}> {recipientProfile?.username || 'Anonymous'}</span>
          </h1>
        </header>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 bg-black/30 border border-pink-400/30 rounded-lg mb-4 space-y-4 no-scrollbar">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">Start a conversation!</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender_id === currentUserProfile?.id ? 'justify-end' : 'justify-start'}`}>

                {/* Avatar for recipient */}
                {msg.sender_id !== currentUserProfile?.id && (
                  <img
                    src={msg.sender_avatar_url || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}

                {/* Username and Message Bubble */}
                <div className={`flex flex-col ${msg.sender_id === currentUserProfile?.id ? 'items-end' : 'items-start'}`}>
                  {/* Username outside bubble, only for recipient */}
                  {msg.sender_id !== currentUserProfile?.id && (
                    <p className="text-xs text-gray-400 mb-1">{msg.sender_username}</p>
                  )}
                  <div
                    className={`max-w-full p-3 rounded-lg backdrop-blur-lg shadow-lg text-sm ${msg.sender_id === currentUserProfile?.id
                      ? 'bg-pink-600/20 border border-pink-400/30 text-white'
                      : 'bg-sky-600/20 border border-sky-400/30 text-gray-100'
                    }`}>
                    <p className="text-white/90">{msg.content}</p>
                    <span className="text-xs text-gray-400 block mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {/* Avatar for sender */}
                {msg.sender_id === currentUserProfile?.id && (
                  <img
                    src={msg.sender_avatar_url || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-black/30 border border-sky-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-200"
          />
          <button
            type="submit"
            className="cyber-button px-6 py-3"
            disabled={!newMessage.trim()}
          >
            [ Send ]
            <span className="cyber-button__glitch"></span>
          </button>
        </form>
      </div>
    </main>
  );
}
