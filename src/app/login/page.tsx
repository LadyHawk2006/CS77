"use client";
import { signIn, signUp } from "@/utils/supabase/auth";
import { useState, use } from "react";
import { motion } from "framer-motion";

export default function Login({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const params = use(searchParams);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    <main className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[50vw] h-[50vh] bg-pink-500/20 -top-1/4 -left-1/4 rounded-full filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute w-[50vw] h-[50vh] bg-sky-500/20 -bottom-1/4 -right-1/4 rounded-full filter blur-[150px] animate-pulse-slow animation-delay-2000"></div>
        <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-8 rounded-lg bg-black/30 border border-pink-400/30 backdrop-blur-sm"
        >
          <header className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold mb-2 tracking-widest uppercase">
              <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>{isLogin ? 'Log In' : 'Sign Up'}</span>
            </h1>
            <p className="text-sm text-cyan-400">{isLogin ? '[Enter the Grid]' : '[Create Your Digital ID]'}</p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-bold text-sky-400 uppercase tracking-wider">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-3 mt-2 bg-sky-400/10 border border-sky-400/50 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-pink-400 uppercase tracking-wider">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full p-3 mt-2 bg-pink-400/10 border border-pink-400/50 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="cyber-button w-full"
            >
              {isLoading ? 'Processing...' : (isLogin ? '[ Log In ]' : '[ Sign Up ]')}
              <span className="cyber-button__glitch"></span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
              className="text-sm text-gray-400 hover:text-pink-400 transition"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </button>
          </div>

          {params?.message && (
            <p className="mt-4 p-3 bg-red-500/20 text-red-300 text-center rounded-md border border-red-500/50">
              {params.message}
            </p>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        .font-display {
          font-family: var(--font-orbitron);
        }
        .font-mono {
          font-family: var(--font-share-tech-mono);
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: -2s;
        }
        .cyber-button {
          font-family: var(--font-share-tech-mono);
          position: relative;
          padding: 12px 24px;
          border: 1px solid #ec4899;
          color: #ec4899;
          background: transparent;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.3s;
          overflow: hidden;
        }
        .cyber-button:hover {
          background: #ec4899;
          color: #0A0F19;
          box-shadow: 0 0 20px #ec4899;
        }
        .cyber-button__glitch::before {
          content: '';
          position: absolute;
          left: 0;
          top: -2px;
          width: 100%;
          height: 2px;
          background: #0A0F19;
          animation: glitch-top 1s linear infinite;
        }
        @keyframes glitch-top {
          2%, 64% { transform: translate(2px, -2px); }
          4%, 60% { transform: translate(-2px, 2px); }
          62% { transform: translate(12px, -1px) skewX(22deg); }
        }
      `}</style>
    </main>
  );
}
