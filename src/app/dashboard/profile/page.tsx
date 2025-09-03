'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Avatar from '@/components/avatar';
import { ProfileSkeleton } from '@/components/profile-skeleton';
import { motion } from 'framer-motion';
import { UserAttributes } from '@supabase/supabase-js';
import { Profile } from '@/types';

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setEmail(user?.email || '');
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile(data);
          setUsername(data.username || '');
          setBio(data.bio || '');
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user, supabase]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      setIsSaving(true);

      // Prepare updates
      const profileUpdates = {
        id: user.id,
        username,
        bio,
        updated_at: new Date(),
      };

      const authUpdates: UserAttributes = {
        data: { username },
      };

      if (email !== user.email) {
        authUpdates.email = email;
      }

      // Run updates in parallel
      const [profileResult, authResult] = await Promise.all([
        supabase.from('profiles').upsert(profileUpdates),
        supabase.auth.updateUser(authUpdates),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (authResult.error) throw authResult.error;

      alert('Profile updated successfully! If you changed your email, please check your new address for a confirmation link.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      alert('Error updating the data!');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 font-mono relative overflow-hidden pt-24"
           style={{ backgroundImage: "url('/images/cyberpunk2.jpg')" }}>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 font-mono relative overflow-hidden pt-24"
         style={{ backgroundImage: "url('/images/cyberpunk2.jpg')" }}>
      <div className="w-full max-w-2xl rounded-2xl p-8 border border-cyan-400 bg-gray-900/70 backdrop-blur-xs shadow-neon-cyan-lg relative z-10 text-neon-cyan-100">
        <h1 className="text-4xl font-extrabold text-center text-pink-400 mb-8 tracking-wide">Edit Your Profile</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex justify-center items-start pt-4">
            <Avatar
              uid={user!.id}
              url={profile?.avatar_url ?? null}
              onUpload={(url) => {
                supabase.from('profiles').upsert({ id: user!.id, avatar_url: url }).then(({data}) => {
                  setProfile(data?.[0] ?? { id: user!.id, username: profile?.username ?? null, bio: profile?.bio ?? null, avatar_url: url });
                });
              }}
            />
          </div>
          <div className="md:w-2/3 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="text-md font-medium text-neon-cyan-200 mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg px-5 py-3 border border-cyan-600 bg-gray-900/5 text-neon-cyan-100 placeholder-cyan-400 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out glow-input"
              />
            </div>
            <div>
              <label htmlFor="username" className="text-md font-medium text-neon-cyan-200 mb-2 block">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg px-5 py-3 border border-cyan-600 bg-gray-900/5 text-neon-cyan-100 placeholder-cyan-400 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out glow-input"
              />
            </div>
            <div>
              <label htmlFor="bio" className="text-md font-medium text-neon-cyan-200 mb-2 block">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 w-full rounded-lg px-5 py-3 border border-cyan-600 bg-gray-900/5 text-neon-cyan-100 placeholder-cyan-400 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out glow-input"
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={handleUpdateProfile}
            disabled={isSaving}
            className="w-full bg-white/10 text-white rounded-lg px-6 py-3 font-bold uppercase tracking-wider shadow-sm hover:shadow-neon-cyan-md transition-all duration-300 ease-in-out flex items-center justify-center"
          >
            {isSaving ? (
              <>
                <motion.svg
                  className="w-5 h-5 mr-2 animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="15 85"
                  />
                </motion.svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
