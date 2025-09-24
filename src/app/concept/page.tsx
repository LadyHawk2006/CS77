"use client"

import Image from 'next/image';

export default function ConceptPage() {
  return (
    <main className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      {/* Background Effects */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[50vw] h-[50vh] bg-pink-500/20 -top-1/4 -left-1/4 rounded-full filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute w-[50vw] h-[50vh] bg-sky-500/20 -bottom-1/4 -right-1/4 rounded-full filter blur-[150px] animate-pulse-slow animation-delay-2000"></div>
        <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-widest uppercase">
            <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>Digital</span>
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>Folklore</span>
          </h1>
          <p className="text-lg text-gray-400">A design concept blending album aesthetics with a high-tech world.</p>
          <p className="text-sm text-cyan-400">[ERA_ARCHIVE: LOVER]</p>
        </header>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hologram Album Art */}
          <div className="hologram-container animate-flicker">
            <Image
              src="/images/lover.jpg"
              alt="Lover Album Art"
              width={500}
              height={500}
              className="hologram-image rounded-lg"
            />
          </div>

          {/* UI Elements Showcase */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-pink-400 mb-4 glow-text-pink uppercase">UI Elements</h2>
              <button className="cyber-button">
                [ Access Chat Logs ]
                <span className="cyber-button__glitch"></span>
                <span className="cyber-button__tag">R25</span>
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-sky-400 mb-4 glow-text-sky">Data Packet [Chat]</h3>
              <div className="space-y-4">
                {/* Other User's Message */}
                <div className="w-fit max-w-[80%]">
                  <div className="text-xs text-pink-400 mb-1">[user: V1P3R]</div>
                  <div className="p-4 rounded-lg bg-sky-400/10 border border-sky-400/50 backdrop-blur-sm">
                    <p>This is the new aesthetic? It feels like a dream. ✨</p>
                  </div>
                </div>
                {/* Your Message */}
                <div className="w-fit max-w-[80%] ml-auto flex flex-col items-end">
                  <div className="text-xs text-sky-400 mb-1">[user: GHOST]</div>
                  <div className="p-4 rounded-lg bg-pink-400/20 border border-pink-400/70 backdrop-blur-sm shadow-lg shadow-pink-500/20">
                    <p>Exactly. High-tech nostalgia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

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
        .hologram-container {
          position: relative;
          filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.5)) drop-shadow(0 0 30px rgba(56, 189, 248, 0.5));
        }
        .hologram-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.1) 51%, transparent 52%);
          background-size: 100% 4px;
          animation: scanlines 3s linear infinite;
        }
        .hologram-image {
          opacity: 0.85;
          animation: hologram-flicker 5s infinite alternate;
        }
        @keyframes scanlines {
          from { background-position: 0 0; }
          to { background-position: 0 -100px; }
        }
        @keyframes hologram-flicker {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.01); }
        }
        @keyframes animate-flicker {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.5)) drop-shadow(0 0 30px rgba(56, 189, 248, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.7)) drop-shadow(0 0 35px rgba(56, 189, 248, 0.7)); }
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
        .cyber-button__tag {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: 10px;
          padding: 2px 4px;
          background: #38bdf8;
          color: #0A0F19;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: -2s;
        }
      `}</style>
    </main>
  );
}
