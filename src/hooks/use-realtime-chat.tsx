'use client'

import { createClient } from '@/lib/supabase/client'
import { useCallback, useEffect, useState } from 'react'

interface UseRealtimeChatProps {
  roomName: string
  username: string
  userId: string
}

export interface ChatMessage {
  id: string
  content: string
  user: {
    name: string
  }
  createdAt: string
}

export function useRealtimeChat({ roomName, username, userId }: UseRealtimeChatProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from(roomName)
        .select('*')
        .order('created_at');

      if (data) {
        const initialMessages: ChatMessage[] = data.map(msg => ({
            id: msg.id,
            content: msg.content,
            user: {
                name: msg.username,
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
        (payload) => {
          const newMessage = {
            id: payload.new.id,
            content: payload.new.content,
            user: {
              name: payload.new.username,
            },
            createdAt: payload.new.created_at,
          }
          setMessages((current) => [...current, newMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomName, supabase])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      const message = {
        content,
        user_id: userId,
        username: username,
      }

      await supabase.from(roomName).insert(message).select()
    },
    [roomName, supabase, userId, username]
  )

  return { messages, sendMessage, isConnected }
}

