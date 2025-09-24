'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Avatar from '@/components/avatar';
import { ProfileSkeleton } from '@/components/profile-skeleton';
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
  const [favoriteAlbums, setFavoriteAlbums] = useState<string[]>([]);
  const [topSongs, setTopSongs] = useState<string[]>([]);
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');

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
          setFavoriteAlbums(data.favorite_albums || []);
          setTopSongs(data.top_songs || []);

          // Parse social media links
          const socialLinks = data.social_media_links || [];
          const tiktokLink = socialLinks.find((link: string) => link.includes('tiktok.com'));
          const instagramLink = socialLinks.find((link: string) => link.includes('instagram.com'));

          if (tiktokLink) {
            const match = tiktokLink.match(/@([^/]+)/);
            if (match) setTiktokUsername(match[1]);
          }
          if (instagramLink) {
            const match = instagramLink.match(/instagram.com\/([^/]+)/);
            if (match) setInstagramUsername(match[1]);
          }
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

      const newSocialMediaLinks: string[] = [];
      if (tiktokUsername) {
        newSocialMediaLinks.push(`https://www.tiktok.com/@${tiktokUsername}`);
      }
      if (instagramUsername) {
        newSocialMediaLinks.push(`https://www.instagram.com/${instagramUsername}`);
      }

      // Prepare updates
      const profileUpdates = {
        id: user.id,
        username,
        bio,
        favorite_albums: favoriteAlbums,
        top_songs: topSongs,
        social_media_links: newSocialMediaLinks,
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
      <div className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32 flex items-center justify-center">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[50vw] h-[50vh] bg-pink-500/20 -top-1/4 -left-1/4 rounded-full filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute w-[50vw] h-[50vh] bg-sky-500/20 -bottom-1/4 -right-1/4 rounded-full filter blur-[150px] animate-pulse-slow animation-delay-2000"></div>
        <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-widest uppercase">
            <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>User</span>
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>Profile</span>
          </h1>
          <p className="text-lg text-gray-400">Manage your digital identity.</p>
        </header>

        {/* Profile Picture at the top */}
        <div className="flex justify-center mb-8">
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

        <div className="p-8 rounded-lg bg-black/30 border border-pink-400/30 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-sky-400 uppercase tracking-wider">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-2 bg-sky-400/10 border border-sky-400/50 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="username" className="text-sm font-bold text-pink-400 uppercase tracking-wider">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 mt-2 bg-pink-400/10 border border-pink-400/50 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="bio" className="text-sm font-bold text-sky-400 uppercase tracking-wider">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 mt-2 bg-sky-400/10 border border-sky-400/50 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none transition h-24"
              />
            </div>
            <div>
              <label htmlFor="favoriteAlbums" className="text-sm font-bold text-pink-400 uppercase tracking-wider">Favorite Albums (comma-separated)</label>
              <textarea
                id="favoriteAlbums"
                value={favoriteAlbums.join(', ')}
                onChange={(e) => setFavoriteAlbums(e.target.value.split(',').map(item => item.trim()))}
                className="w-full p-3 mt-2 bg-pink-400/10 border border-pink-400/50 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none transition h-24"
              />
            </div>
            <div>
              <label htmlFor="topSongs" className="text-sm font-bold text-sky-400 uppercase tracking-wider">Top Songs (comma-separated)</label>
              <textarea
                id="topSongs"
                value={topSongs.join(', ')}
                onChange={(e) => setTopSongs(e.target.value.split(',').map(item => item.trim()))}
                className="w-full p-3 mt-2 bg-sky-400/10 border border-sky-400/50 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none transition h-24"
              />
            </div>
            <div>
              <label htmlFor="tiktokUsername" className="text-sm font-bold text-pink-400 uppercase tracking-wider">TikTok Username</label>
              <input
                id="tiktokUsername"
                type="text"
                value={tiktokUsername}
                onChange={(e) => setTiktokUsername(e.target.value)}
                className="w-full p-3 mt-2 bg-pink-400/10 border border-pink-400/50 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="instagramUsername" className="text-sm font-bold text-sky-400 uppercase tracking-wider">Instagram Username</label>
              <input
                id="instagramUsername"
                type="text"
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
                className="w-full p-3 mt-2 bg-sky-400/10 border border-sky-400/50 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              />
            </div>
            <div className="mt-4 md:col-span-2">
              <button
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="cyber-button w-full"
              >
                {isSaving ? 'SAVING...' : '[ Update Profile ]'}
                <span className="cyber-button__glitch"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-display {
          font-family: var(--font-orbitron);
        }
        .font-mono {
          font-family: var(--font-share-tech-mono);
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: -2s;
        }
        .cyber-button {
          font-family: var(--font-share-tech-mono);
          position: relative;
          padding: 12px 24px;
          border: 1px solid #ec4899;
          color: #ec4899;
          background: transparent;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.3s;
          overflow: hidden;
        }
        .cyber-button:hover {
          background: #ec4899;
          color: #0A0F19;
          box-shadow: 0 0 20px #ec4899;
        }
        .cyber-button__glitch::before {
          content: '';
          position: absolute;
          left: 0;
          top: -2px;
          width: 100%;
          height: 2px;
          background: #0A0F19;
          animation: glitch-top 1s linear infinite;
        }
        @keyframes glitch-top {
          2%, 64% { transform: translate(2px, -2px); }
          4%, 60% { transform: translate(-2px, 2px); }
          62% { transform: translate(12px, -1px) skewX(22deg); }
        }
      `}</style>
    </main>
  );
}