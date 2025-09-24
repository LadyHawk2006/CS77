'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { ProfileSkeleton } from '@/components/profile-skeleton';
import { useRouter } from 'next/navigation';

interface RequestPageParams {
  params: {
    userId: string;
  };
}

export default function RequestPage({ params }: RequestPageParams) {
  const supabase = createClient();
  const router = useRouter();
  const { userId: senderId } = params;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendship, setFriendship] = useState<{ status: 'pending' | 'accepted' | 'blocked' | 'not_friends', action_user_id?: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [supabase]);

  const fetchPageData = async () => {
    if (!currentUser || !senderId) return;
    setLoading(true);

    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', senderId).single();
    setProfile(profileData);

    const [user_one_id, user_two_id] = [currentUser.id, senderId].sort();
    const { data: friendshipData } = await supabase.from('friendships').select('status, action_user_id').eq('user_one_id', user_one_id).eq('user_two_id', user_two_id).single();

    if (friendshipData) {
      setFriendship(friendshipData);
    } else {
      setFriendship({ status: 'not_friends' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPageData();
  }, [currentUser, senderId, supabase]);

  const handleAccept = async () => {
    if (!currentUser) return;
    setIsUpdating(true);
    const [user_one_id, user_two_id] = [currentUser.id, senderId].sort();

    // 1. Update friendship status
    const { error: updateError } = await supabase
      .from('friendships')
      .update({ status: 'accepted', action_user_id: currentUser.id })
      .match({ user_one_id, user_two_id, status: 'pending' });

    if (updateError) {
      alert('Error accepting request. Please try again.');
      console.error(updateError);
    } else {
      // 2. Delete the notification
      await supabase.from('notifications').delete().match({ user_id: currentUser.id, sender_id: senderId, type: 'friend_request' });
      setFriendship({ status: 'accepted' });
      // Optional: redirect to DMs or friends list
      // router.push(`/dm/${senderId}`);
    }
    setIsUpdating(false);
  };

  const handleReject = async () => {
    if (!currentUser) return;
    setIsUpdating(true);
    const [user_one_id, user_two_id] = [currentUser.id, senderId].sort();

    // 1. Delete the friendship record
    const { error: deleteError } = await supabase.from('friendships').delete().match({ user_one_id, user_two_id });

    if (deleteError) {
      alert('Error rejecting request. Please try again.');
      console.error(deleteError);
    } else {
      // 2. Delete the notification
      await supabase.from('notifications').delete().match({ user_id: currentUser.id, sender_id: senderId, type: 'friend_request' });
      setFriendship({ status: 'not_friends' });
    }
    setIsUpdating(false);
  };

  if (loading) {
    return <div className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32 flex items-center justify-center"><ProfileSkeleton /></div>;
  }

  if (!profile) {
    return <div className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32 flex items-center justify-center"><p>User not found.</p></div>;
  }

  const isRequestPendingForCurrentUser = friendship?.status === 'pending' && friendship.action_user_id === senderId;

  return (
    <main className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <img src={profile.avatar_url || '/images/cyberpunk-pfp.jpg'} alt={profile.username || 'avatar'} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-pink-500/50 object-cover" />
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-2 tracking-widest uppercase text-sky-400">{profile.username}</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{profile.bio || 'No bio available.'}</p>
        </header>

        {isRequestPendingForCurrentUser && (
          <div className="p-6 my-8 rounded-lg bg-black/30 border border-pink-400/30 backdrop-blur-sm text-center">
            <h3 className="font-mono text-lg text-pink-400 mb-4">Friend Request Pending</h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleAccept} disabled={isUpdating} className="cyber-button bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500 hover:text-black disabled:opacity-50">
                {isUpdating ? 'Accepting...' : '[ Accept ]'}
              </button>
              <button onClick={handleReject} disabled={isUpdating} className="cyber-button bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500 hover:text-black disabled:opacity-50">
                {isUpdating ? 'Rejecting...' : '[ Reject ]'}
              </button>
            </div>
          </div>
        )}

        {friendship?.status === 'accepted' && (
            <div className="p-6 my-8 rounded-lg bg-black/30 border border-green-400/30 backdrop-blur-sm text-center">
                <h3 className="font-mono text-lg text-green-400 mb-4">You are friends</h3>
                <button onClick={() => router.push(`/dm/${senderId}`)} className="cyber-button bg-sky-500/20 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-black">
                    [ Send Message ]
                </button>
            </div>
        )}

      </div>
    </main>
  );
}
