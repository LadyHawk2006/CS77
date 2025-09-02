"use client";
import { signIn, signUp } from "@/utils/supabase/auth";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const formVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 10 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 0px 12px rgba(0, 255, 255, 0.8)" },
    tap: { scale: 0.95 },
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, letterSpacing: "0.2em" },
    visible: {
      opacity: 1,
      scale: 1,
      letterSpacing: "0.3em",
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20, rotate: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const spinnerVariants: Variants = {
    spin: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 1, ease: "linear" },
    },
  };

  const renderAnimatedTitle = (text: string) => (
    <motion.h1
      className="text-4xl font-extrabold text-center text-pink-400 mb-8 tracking-wide"
      variants={titleVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={letterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      await (isLogin ? signIn(formData) : signUp(formData));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 font-mono relative overflow-hidden"
      style={{ backgroundImage: "url('/images/cyberpunk3.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-blue-900/40 z-0 animate-pulse-slow"></div>
      <motion.div
        key={isLogin ? "login" : "signup"}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md rounded-2xl p-8 border border-cyan-400 bg-gray-900/70 backdrop-blur-xs shadow-neon-cyan-lg relative z-10 text-neon-cyan-100"
      >
        {isLogin
          ? renderAnimatedTitle("FAST LOGIN")
          : renderAnimatedTitle("JOIN THE COMMUNITY")}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-md font-medium text-neon-cyan-200 mb-2 block">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">DIGITAL_ID</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="username@domain.ext"
              required
              className="mt-1 w-full rounded-lg px-5 py-3 border border-cyan-600 bg-gray-900/5 text-neon-cyan-100 placeholder-cyan-400 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out glow-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-md font-medium text-neon-cyan-200 mb-2 block">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">SECURE_KEY</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg px-5 py-3 border border-cyan-600 bg-gray-900/5 text-neon-cyan-100 placeholder-cyan-400 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out glow-input"
            />
          </div>
          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isLoading}
            className={`mt-6 bg-white/10 text-white rounded-lg px-6 py-3 font-bold uppercase tracking-wider shadow-sm hover:shadow-neon-cyan-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center ${
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
              <>{isLogin ? "CONNECT TO SITE" : "INITIALIZE PROFILE"}</>
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-center text-white hover:text-white font-medium mt-4 text-sm transition-colors duration-300 neon-text border border-[#0ff] rounded-md px-3 py-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLogin ? "NEW? REGISTER HERE" : "EXISTING USER? LOG IN"}
          </motion.button>
          {searchParams?.message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-900/5 backdrop-blur-xs text-red-300 text-center rounded-lg border border-red-700 neon-error"
            >
              {searchParams.message}
            </motion.p>
          )}
        </form>
      </motion.div>
      <style jsx>{`
        .text-neon-cyan-400 { color: #00f7ff; }
        .text-neon-cyan-200 { color: #80faff; }
        .text-neon-cyan-100 { color: #b3fdff; }
        .text-neon-blue-300 { color: #4bb7ff; }
        .border-cyan-600 { border-color: #008b8b; }
        .border-cyan-400 { border-color: #00b7eb; }
        .shadow-neon-cyan-lg { box-shadow: 0 0 25px rgba(0, 247, 255, 0.7); }
        .shadow-neon-cyan-md { box-shadow: 0 0 15px rgba(0, 247, 255, 0.5); }

        .glow-input:focus {
          box-shadow: 0 0 10px rgba(75, 183, 255, 0.8), 0 0 20px rgba(0, 247, 255, 0.5);
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s infinite alternate;
        }

        @keyframes pulse-slow {
          from { opacity: 0.4; }
          to { opacity: 0.6; }
        }

        .neon-text {
          text-shadow: 0 0 8px rgba(0, 247, 255, 0.7);
        }

        .neon-error {
          text-shadow: 0 0 6px rgba(252, 165, 165, 0.6);
        }

        .backdrop-blur-xs {
          backdrop-filter: blur(2px);
        }
      `}</style>
    </div>
  );
}
