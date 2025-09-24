'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Profile } from '@/types';

interface ProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
}

export const ProfileModal = ({ profile, onClose }: ProfileModalProps) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/30 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md rounded-2xl p-4 sm:p-8 border border-pink-500 bg-black/80 shadow-neon-pink-lg relative text-white font-mono"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              {profile.avatar_url && supabaseUrl ? (
                <Image
                  src={`${supabaseUrl}/storage/v1/object/public/avatars/${profile.avatar_url}`}
                  alt={`${profile.username}'s avatar`}
                  className="rounded-full border-4 border-pink-500 w-24 h-24 sm:w-32 sm:h-32 object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-pink-500">
                  <span className="text-2xl sm:text-4xl font-bold">{profile.username?.charAt(0).toUpperCase()}</span>
                </div>
              )}

              <h2 className="text-xl sm:text-3xl font-bold mt-6 text-cyan-400 neon-text-cyan">{profile.username || 'Anonymous'}</h2>

              <p className="mt-4 text-gray-300 text-center max-w-xs">
                {profile.bio || 'No bio yet.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
