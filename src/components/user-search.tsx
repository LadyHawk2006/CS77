/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { debounce } from 'lodash';
import albumData from '@/data/taylorAlbums.json';

// Define a type for the album data we are using
interface Album {
  id: number;
  title: string;
  era: string;
  imageUrl: string;
}

// Type for the data returned by our RPC function
interface UserSearchResult {
  id: string;
  username: string;
  avatar_url: string;
  friendship_status: 'pending' | 'accepted' | 'blocked' | null;
  friendship_action_user: string | null;
}

// A simple search icon component
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSearch({ isOpen, onClose }: UserSearchProps) {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ users: UserSearchResult[]; albums: Album[] }>({ users: [], albums: [] });
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState<Record<string, 'idle' | 'pending' | 'sent' | 'error'>>({});

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [supabase]);

  const handleAddFriend = async (targetId: string) => {
    if (!currentUser) return;

    setRequestStatus(prev => ({ ...prev, [targetId]: 'pending' }));

    const { error } = await supabase.rpc('send_friend_request', { recipient_id: targetId });

    if (error) {
      console.error('Error sending friend request:', error);
      setRequestStatus(prev => ({ ...prev, [targetId]: 'error' }));
    } else {
      setRequestStatus(prev => ({ ...prev, [targetId]: 'sent' }));
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim().length < 2 || !currentUser) {
        setResults({ users: [], albums: [] });
        setLoading(false);
        return;
      }
      setLoading(true);

      // Use the new RPC function for user search
      const { data: users, error } = await supabase.rpc('search_users_with_friendship_status', { search_query: searchQuery });
      
      // Filter albums locally
      const albums = albumData.filter(album => album.title.toLowerCase().includes(searchQuery.toLowerCase()));

      if (error) {
        console.error('Error fetching users:', error);
      }

      setResults({
        users: users || [],
        albums: albums || [],
      });

      setLoading(false);
    }, 300),
    [supabase, currentUser]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getButtonState = (user: UserSearchResult) => {
    const localStatus = requestStatus[user.id];
    if (localStatus === 'pending') return { text: 'Sending...', disabled: true };
    if (localStatus === 'sent' || (user.friendship_status === 'pending' && user.friendship_action_user === currentUser?.id)) return { text: 'Request Sent', disabled: true };
    if (user.friendship_status === 'pending') return { text: 'Accept Request', disabled: false, action: () => router.push(`/request/${user.id}`) }; // Placeholder for accept action
    if (user.friendship_status === 'accepted') return { text: 'Friends', disabled: true };
    if (user.friendship_status === 'blocked') return { text: 'Blocked', disabled: true };
    return { text: 'Add Friend', disabled: false, action: () => handleAddFriend(user.id) };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex justify-center items-start pt-20 animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-xl bg-black/50 border border-pink-400/30 rounded-lg shadow-lg shadow-pink-500/10" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for users or chat rooms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 pl-12 bg-transparent text-lg text-gray-200 focus:outline-none rounded-t-lg"
            autoFocus
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><SearchIcon /></div>
        </div>

        <div className="border-t border-pink-400/30 p-2 min-h-[200px] max-h-[60vh] overflow-y-auto">
          {loading && <p className="text-center text-gray-400 p-4">Searching...</p>}
          {!loading && results.users.length === 0 && results.albums.length === 0 && query.length > 1 && (
            <p className="text-center text-gray-400 p-4">No results found for &quot;{query}&quot;</p>
          )}

          {results.users.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider px-2 mb-2">Users</h3>
              <div className="space-y-1">
                {results.users.map(user => {
                  const { text, disabled, action } = getButtonState(user);
                  return (
                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-pink-500/10 rounded-md transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar_url || '/images/cyberpunk-pfp.jpg'} alt={user.username || 'avatar'} className="w-10 h-10 rounded-full object-cover" />
                        <span className="font-mono text-white">{user.username}</span>
                      </div>
                      <button 
                        onClick={action}
                        disabled={disabled}
                        className="text-xs px-3 py-1 rounded border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                        style={text === 'Request Sent' || text === 'Friends' ? { backgroundColor: '#4ade80', color: '#000', borderColor: '#4ade80' } : { borderColor: '#38bdf8', color: '#38bdf8' }}
                      >
                        {text}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {results.albums.length > 0 && (
            <div className="p-2">
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider px-2 mb-2 mt-4">Chat Rooms</h3>
              <div className="space-y-1">
                {results.albums.map(album => (
                  <Link key={album.id} href={`/chat/${album.era}`} onClick={onClose}>
                    <div className="flex items-center gap-3 p-2 hover:bg-sky-500/10 rounded-md transition-colors duration-200 cursor-pointer">
                      <img src={album.imageUrl} alt={album.title} className="w-10 h-10 rounded-md object-cover" />
                      <span className="font-mono text-white">{album.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
       <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
