'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import AlbumComponent from '@/components/reusables/album';

const title = "CYBERSWIFTIE2077";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Background Container */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/cyberpunk3.jpg"
          alt="Cyberpunk background"
          fill
          priority
          className="object-cover"
          quality={90}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.header
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="text-center mb-16"
>
  <h1 className="text-5xl md:text-7xl font-bold mb-4 glow-text-pink mt-16">
    {title.split("").map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </h1>
  <p className="text-neon-purple-300 text-xl max-w-2xl mx-auto">
    Enter the digital realm of Taylor Swifts musical universe. Experience every era in cyberpunk style.
  </p>
</motion.header>

        {/* Album Component */}
        <AlbumComponent />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-pink-500 backdrop-blur-sm py-6 text-center">
        <p className="text-neon-pink-300">CyberSwiftie2077© {new Date().getFullYear()}</p>
        <p className="text-neon-purple-300 text-sm">All content is property of Taylor Swift and respective rights holders</p>
      </footer>

      <style jsx global>{`
        .text-neon-pink-300 { color: #f9a8d4; }
        .text-neon-pink-400 { color: #f472b6; }
        .text-neon-pink-500 { color: #ec4899; }
        .text-neon-purple-300 { color: #c084fc; }
        .text-neon-purple-400 { color: #a855f7; }
        .text-neon-cyan-400 { color: #22d3ee; }
        
        .shadow-neon-pink-lg { 
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.7);
        }
        
        .shadow-purple-lg { 
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
        }
        
        .shadow-cyan-lg { 
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.7);
        }
        
        .glow-text-pink {
          text-shadow: 0 0 10px rgba(244, 114, 182, 0.8);
        }
        
        .glow-button {
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
        }
        
        .glow-button:hover {
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.7);
        }
      `}</style>
    </div>
  );
}