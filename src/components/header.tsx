'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserSearch } from "./user-search";
import { UserMenu } from "./user-menu";
import { type Profile } from "@/types";
import { AuthButton } from "./auth-button";

// Icon Components
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

  // Fetch user and profile data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    };
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      setIsLoggedIn(!!user);
      if (user) {
        fetchUserData(); // Refetch profile on auth change
      } else {
        setProfile(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabase]);

  // Fetch notification count
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchInitialCount = async () => {
      const { count } = await supabase.from('notifications').select('*' , { count: 'exact', head: true }).eq('is_read', false);
      setNotificationCount(count ?? 0);
    };
    fetchInitialCount();
    const channel = supabase.channel('realtime-notifications').on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchInitialCount()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isLoggedIn, supabase]);

  // Handle scroll and keyboard shortcuts
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="font-display text-2xl font-bold tracking-widest uppercase cursor-pointer">
              <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>CS</span>
              <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>2077</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            {isLoggedIn && profile ? (
              <>
                <Link href="/concept"><span className="font-mono text-sm uppercase tracking-wider text-gray-300 hover:text-sky-400 transition-colors duration-300 hidden md:inline">Concept</span></Link>
                
                <button onClick={() => setIsSearchOpen(true)} className="text-gray-300 hover:text-sky-400 transition-colors duration-300"><SearchIcon className="w-5 h-5" /></button>

                <Link href="/notifications" className="relative text-gray-300 hover:text-pink-400 transition-colors duration-300">
                  <BellIcon className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{notificationCount}</span>
                  )}
                </Link>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-pink-500/30 border-2 border-pink-400/50 hover:border-pink-400 transition-colors flex items-center justify-center">
                      <span className="font-bold text-lg text-white">{profile.username?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                  </button>
                  <UserMenu isOpen={isUserMenuOpen} profile={profile} />
                </div>
              </>
            ) : (
              <AuthButton />
            )}
          </div>
        </div>
      </header>
      <UserSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}