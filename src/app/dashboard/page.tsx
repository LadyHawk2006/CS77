'use client'

import { motion } from 'framer-motion';
import AlbumComponent from '@/components/reusables/album';

export default function DashboardPage() {
  return (
    <div className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[50vw] h-[50vh] bg-pink-500/20 -top-1/4 -left-1/4 rounded-full filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute w-[50vw] h-[50vh] bg-sky-500/20 -bottom-1/4 -right-1/4 rounded-full filter blur-[150px] animate-pulse-slow animation-delay-2000"></div>
        <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 pb-8 md:pb-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-widest uppercase">
            <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>DASH</span>
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>BOARD</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select an era and dive into the conversation.
          </p>
        </motion.header>

        {/* Album Component */}
        <AlbumComponent />

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-pink-500/30 mt-16 py-6 text-center">
        <p className="text-gray-500 text-sm">CyberSwiftie2077© {new Date().getFullYear()}</p>
        <p className="text-gray-600 text-xs">All content is property of Taylor Swift and respective rights holders</p>
      </footer>

      <style jsx global>{`
        .font-display {
          font-family: var(--font-orbitron);
        }
        .font-mono {
          font-family: var(--font-share-tech-mono);
        }
        .glow-text-pink {
          text-shadow: 0 0 8px rgba(236, 72, 153, 0.7);
        }
        .glow-text-sky {
          text-shadow: 0 0 8px rgba(56, 189, 248, 0.7);
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: -2s;
        }
      `}</style>
    </div>
  );
}