'use client'

import { cn } from '@/lib/utils'
import { ChatMessageItem } from '@/components/chat-message'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/types';
import { useRouter } from 'next/navigation';

interface RealtimeChatProps {
  roomName: string
  username: string
  userId: string
  albumColor?: string
  albumBorder?: string
  onMessage?: (messages: ChatMessage[]) => void
}

export const RealtimeChat = ({
  roomName,
  username,
  userId,
  albumColor,
  albumBorder,
  onMessage,
}: RealtimeChatProps) => {
  const supabase = createClient();
  const router = useRouter();
  const [newMessage, setNewMessage] = useState('');

  const {
    messages: allMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
    userId,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  useChatScroll(containerRef, allMessages);

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage]);

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !isConnected) return;

      sendMessage(newMessage);
      setNewMessage('');
    },
    [newMessage, isConnected, sendMessage]
  );

  const handleViewProfile = (profileUserId: string) => {
    router.push(`/dm/${profileUserId}`);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-transparent text-foreground antialiased">
        {/* Messages */}
        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {allMessages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : null}
          <div className="space-y-1">
            {allMessages.map((message, index) => {
              const prevMessage = index > 0 ? allMessages[index - 1] : null;
              const showHeader = !prevMessage || prevMessage.user_id !== message.user_id;

              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-200"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.user_id === userId}
                    showHeader={showHeader}
                    albumColor={albumColor}
                    onViewProfile={handleViewProfile}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className={cn("flex w-full gap-2 border-t p-4", albumBorder)}>
          <Input
            className={cn(
              'rounded-full bg-white/60 text-sm transition-all duration-300',
              isConnected && newMessage.trim() ? 'w-[calc(100%-36px)]' : 'w-full'
            )}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          {isConnected && newMessage.trim() && (
            <Button
              className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
              type="submit"
              disabled={!isConnected}
            >
              <Send className="size-4" />
            </Button>
          )}
        </form>
      </div>
    </>
  );
};
