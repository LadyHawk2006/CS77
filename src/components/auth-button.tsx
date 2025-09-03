'use client';

import { createClient } from "@/utils/supabase/client"; // Use client-side Supabase client
import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";

export function AuthButton() {
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

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
      if (event === "SIGNED_IN") {
        router.refresh();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        await supabase.auth.signOut();
        router.refresh();
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

  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 0px 12px rgba(0, 255, 255, 0.8)" },
    tap: { scale: 0.95 },
  };

  const spinnerVariants: Variants = {
    spin: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 1, ease: "linear" },
    },
  };

  return (
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
  );
}
