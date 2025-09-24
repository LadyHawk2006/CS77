'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_notifications_with_sender_info');

      if (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } else {
        setNotifications(data as Notification[]);
        // Mark all as read when the page is viewed
        await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [supabase]);

  return (
    <main className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-widest uppercase">
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>Notifications</span>
          </h1>
        </header>

        <div className="p-2 md:p-8 rounded-lg bg-black/30 border border-sky-400/30 backdrop-blur-sm">
          <div className="space-y-2">
            {loading ? (
              <p className="text-center text-gray-400 p-8">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center text-gray-400 p-8">You have no notifications.</p>
            ) : (
              notifications.map(notif => (
                <Link key={notif.id} href={`/request/${notif.sender_id}`}>
                  <div className={`flex items-start gap-4 p-4 rounded-md transition-colors duration-200 cursor-pointer hover:bg-sky-500/10 ${!notif.is_read ? 'border border-sky-500/50' : 'border border-transparent'}`}>
                    <img src={notif.sender_avatar_url || '/images/cyberpunk-pfp.jpg'} alt={notif.sender_username} className="w-12 h-12 rounded-full object-cover mt-1" />
                    <div className="flex-grow">
                      <p className="text-base text-gray-200">
                        <span className="font-bold text-white">{notif.sender_username}</span> sent you a friend request.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-sm text-sky-400 font-mono self-center">[ View Request ]</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
