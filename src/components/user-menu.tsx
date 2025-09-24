'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Profile } from '@/types';

// Icon components
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.73l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.73l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const PrivacyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const SignOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

interface UserMenuProps {
  isOpen: boolean;
  profile: Profile | null;
}

export function UserMenu({ isOpen, profile }: UserMenuProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-black/80 backdrop-blur-sm border border-pink-400/30 rounded-lg shadow-lg shadow-pink-500/10 animate-fade-in-down">
      <div className="p-4 border-b border-pink-400/30">
        <p className="text-sm text-gray-400">Signed in as</p>
        <p className="font-mono font-bold text-white truncate">{profile?.username || 'User'}</p>
      </div>
      <div className="p-2">
        <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-pink-500/10 hover:text-white transition-colors">
            <span>My Profile</span>
        </Link>
        <Link href="/friends" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-pink-500/10 hover:text-white transition-colors">
            <UsersIcon className="w-4 h-4" />
            <span>My Friends</span>
        </Link>
        <div className="w-full h-[1px] bg-pink-400/20 my-2"></div>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-pink-500/10 hover:text-white transition-colors">
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-pink-500/10 hover:text-white transition-colors">
            <PrivacyIcon className="w-4 h-4" />
            <span>Privacy</span>
        </Link>
        <div className="w-full h-[1px] bg-pink-400/20 my-2"></div>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 rounded-md hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <SignOutIcon className="w-4 h-4" />
            <span>Sign Out</span>
        </button>
      </div>
      <style jsx global>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
