"use client";

import { createClient } from "@/utils/supabase/client"; // Use client-side Supabase client
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check user session on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, [supabase]);

  const handleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        router.push("/login");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 0px 12px rgba(0, 255, 255, 0.8)" },
    tap: { scale: 0.95 },
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 1, ease: "linear" },
    },
  };

  return (
    <header className="w-full bg-gray-900/5 backdrop-blur-xs border-b border-cyan-400 shadow-neon-cyan-md fixed top-0 z-20 mb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <motion.h1
          className="text-2xl font-extrabold text-pink-400 tracking-wide neon-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
            CYBERHUB
          </span>
        </motion.h1>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          disabled={isLoading}
          onClick={handleAuth}
          className={`flex items-center justify-center bg-white/10 text-white rounded-lg px-4 py-2 font-bold uppercase tracking-wider shadow-sm hover:shadow-neon-cyan-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <motion.svg
                variants={spinnerVariants}
                animate="spin"
                className="w-5 h-5 mr-2"
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
              PROCESSING...
            </>
          ) : (
            <>{isLoggedIn ? "SIGN OUT" : "SIGN IN"}</>
          )}
        </motion.button>
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