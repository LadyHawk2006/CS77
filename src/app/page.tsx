'use client'

import { motion } from 'framer-motion';
import AlbumComponent from '@/components/reusables/album';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      {/* Background Effects */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
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
            <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>CYBERSWIFTIE</span>
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>2077</span>
          </h1>
                      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Enter the digital realm of Taylor Swift&apos;s musical universe. Experience every era in a high-tech, cyberpunk style.
                      </p>        </motion.header>

        {/* Album Component */}
        <AlbumComponent />

        {/* New Features Section */}
        <section className="relative z-10 container mx-auto px-4 py-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 text-center">
            <span className="text-pink-400 glow-text-pink">Explore the</span>
            <span className="text-sky-400 glow-text-sky"> Cyber-Verse</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Chat Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, amount: 0.5 }}
              className="p-6 rounded-lg bg-sky-400/10 border border-sky-400/50 backdrop-blur-sm feature-card"
            >
              <h3 className="font-display text-2xl font-bold mb-4 text-sky-400 glow-text-sky uppercase">Era-Specific Chat Rooms</h3>
              <p className="text-gray-400 mb-4">
                Dive into real-time conversations with fellow Swifties in dedicated chat rooms for each Taylor Swift era.
              </p>
              <p className="text-xs text-pink-400">[Access requires secure profile]</p>
            </motion.div>

            {/* Feature 2: Secure Profiles */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, amount: 0.5 }}
              className="p-6 rounded-lg bg-pink-400/10 border border-pink-400/50 backdrop-blur-sm feature-card"
            >
              <h3 className="font-display text-2xl font-bold mb-4 text-pink-400 glow-text-pink uppercase">Secure Digital Identity</h3>
              <p className="text-gray-400 mb-4">
                Create your personalized CyberSwiftie profile to unlock exclusive features and track your journey.
              </p>
            </motion.div>

            {/* Feature 3: Immersive Visual Experience */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
              className="p-6 rounded-lg bg-purple-400/10 border border-purple-400/50 backdrop-blur-sm feature-card"
            >
              <h3 className="font-display text-2xl font-bold mb-4 text-purple-400 glow-text-purple uppercase">Immersive Visuals</h3>
              <p className="text-gray-400 mb-4">
                Customize your journey with dynamic background themes that shift with each era and adjust visual intensity.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-pink-500/30 mt-16 py-6 text-center">
        <p className="text-gray-500 text-sm">CyberSwiftie2077© {new Date().getFullYear()}</p>
        <p className="text-gray-600 text-xs">All content is property of Taylor Swift and respective rights holders</p>
      </footer>


    </div>
  );
}
