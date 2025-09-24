import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
  onViewProfile: (userId: string) => void;
}

const UserAvatar = ({ avatar_url, username, onViewProfile, userId }: { avatar_url?: string; username: string; onViewProfile: (userId: string) => void; userId: string }) => {
  const supabase = createClient();
  const publicUrl = avatar_url ? supabase.storage.from('avatars').getPublicUrl(avatar_url).data.publicUrl : null;

  return (
    <button onClick={() => onViewProfile(userId)} className="focus:outline-none">
      {publicUrl ? (
        <Image
          src={publicUrl}
          alt={`${username}'s avatar`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-white font-bold">{username.charAt(0).toUpperCase()}</span>
        </div>
      )}
    </button>
  );
};

export const ChatMessageItem = ({ message, isOwnMessage, showHeader, onViewProfile }: ChatMessageItemProps) => {
  const avatar = (
    <div className="w-10 h-10 self-end">
      {showHeader && <UserAvatar avatar_url={message.user.avatar_url} username={message.user.name} onViewProfile={onViewProfile} userId={message.user_id} />}
    </div>
  );

  return (
    <div className={`flex mt-2 gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && avatar}
      <div
        className={cn('max-w-[75%] w-fit flex flex-col gap-1', {
          'items-end': isOwnMessage,
          'items-start': !isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn('flex items-center gap-2 text-xs px-3', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <button onClick={() => onViewProfile(message.user_id)} className="focus:outline-none">
              <span className={'font-medium text-white hover:underline'}>{message.user.name}</span>
            </button>
            <span className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            'py-2 px-4 rounded-2xl text-sm w-fit text-white/90 backdrop-blur-lg shadow-lg',
            isOwnMessage
              ? 'bg-white/10 border border-white/20'
              : 'border'
          )}
          style={!isOwnMessage ? {
            backgroundColor: `hsla(var(--album-color-from), 0.2)`,
            borderColor: `hsla(var(--album-color-to), 0.4)`,
          } : {}}>
          {message.content}
        </div>
      </div>
      {isOwnMessage && avatar}
    </div>
  );
};
