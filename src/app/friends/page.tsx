'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Profile } from '@/types';
import { useRouter } from 'next/navigation';

export default function FriendsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_friends_list');

      if (error) {
        console.error('Error fetching friends:', error);
      } else {
        setFriends(data || []);
      }
      setLoading(false);
    };

    fetchFriends();
  }, [supabase]);

  const handleUnfriend = async (friendId: string) => {
    const confirmation = confirm('Are you sure you want to unfriend this user?');
    if (!confirmation) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [user_one_id, user_two_id] = [user.id, friendId].sort();

    const { error } = await supabase
      .from('friendships')
      .delete()
      .match({ user_one_id, user_two_id, status: 'accepted' });

    if (error) {
      alert('Failed to unfriend user. Please try again.');
      console.error('Unfriend error:', error);
    } else {
      // Refresh the list
      setFriends(friends.filter(f => f.id !== friendId));
    }
  };

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend =>
    friend.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-widest uppercase">
            <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>Manage</span>
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>Friends</span>
          </h1>
        </header>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search in friends list..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-black/20 border border-sky-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-200 transition-colors"
          />
        </div>

        <div className="p-2 md:p-8 rounded-lg bg-black/30 border border-pink-400/30 backdrop-blur-sm">
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-400 p-8">Loading friends list...</p>
            ) : filteredFriends.length === 0 ? (
              <p className="text-center text-gray-400 p-8">
                {friends.length > 0 ? `No friends found for "${searchTerm}"` : 'You have no friends yet. Use the search to find and add friends.'}
              </p>
            ) : (
              filteredFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-4 rounded-md bg-black/20 border border-transparent hover:border-pink-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-lg text-white">{friend.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button onClick={() => router.push(`/dm/${friend.id}`)} className="text-xs px-3 py-1 rounded border border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-black transition-all duration-200 font-mono">
                        Message
                    </button>
                    <button onClick={() => handleUnfriend(friend.id)} className="text-xs px-3 py-1 rounded border border-red-500 text-red-400 hover:bg-red-500 hover:text-black transition-all duration-200 font-mono">
                        Unfriend
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
