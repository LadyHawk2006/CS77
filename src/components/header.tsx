'use client';

import { AuthButton } from "./auth-button";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="w-full bg-gray-900/5 backdrop-blur-xs border-b border-cyan-400 shadow-neon-cyan-md fixed top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <motion.h1
          className="text-2xl font-extrabold text-pink-400 tracking-wide neon-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
            CYBERSWIFTIE2077
          </span>
        </motion.h1>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
      <style jsx>{`
        .text-neon-cyan-400 { color: #00f7ff; }
        .text-neon-cyan-200 { color: #80faff; }
        .text-neon-cyan-100 { color: #b3fdff; }
        .border-cyan-400 { border-color: #00b7eb; }
        .shadow-neon-cyan-md { box-shadow: 0 0 15px rgba(0, 247, 255, 0.5); }
        .neon-text {
          text-shadow: 0 0 8px rgba(0, 247, 255, 0.7);
        }
        .backdrop-blur-xs {
          backdrop-filter: blur(2px);
        }
      `}</style>
    </header>
  );
}