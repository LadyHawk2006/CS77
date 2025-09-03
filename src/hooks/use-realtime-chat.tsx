'use client';

import { createClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';

interface UseRealtimeChatProps {
  roomName: string;
  username: string; // This is the fallback username from email
  userId: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  user: {
    name: string;
    avatar_url?: string;
  };
  createdAt: string;
}

export function useRealtimeChat({ roomName, username, userId }: UseRealtimeChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data, error } = await supabase.rpc('get_messages_with_profiles', {
        room_name: roomName,
      });

      if (error) {
        console.error('Error fetching initial messages:', error);
        return;
      }

      if (data) {
        const initialMessages: ChatMessage[] = data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          user_id: msg.user_id,
          user: {
            name: msg.username,
            avatar_url: msg.avatar_url,
          },
          createdAt: msg.created_at,
        }));
        setMessages(initialMessages);
      }
    };

    fetchInitialMessages();
  }, [roomName, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-chat:${roomName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: roomName,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: ChatMessage = {
            id: payload.new.id,
            content: payload.new.content,
            user_id: payload.new.user_id,
            user: {
              name: profile?.username || payload.new.username || 'Anonymous',
              avatar_url: profile?.avatar_url,
            },
            createdAt: payload.new.created_at,
          };
          setMessages((current) => [...current, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // We still send the username as a fallback for older clients or race conditions
      const message = {
        content,
        user_id: userId,
        username: username, 
      };

      await supabase.from(roomName).insert(message).select();
    },
    [roomName, supabase, userId, username]
  );

  return { messages, sendMessage, isConnected };
}

