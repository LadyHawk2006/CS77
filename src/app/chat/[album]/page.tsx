import { RealtimeChat } from "@/components/realtime-chat";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import taylorAlbums from "@/data/taylorAlbums.json";

export const dynamic = 'force-dynamic';

export default async function ChatPage(props: { params: Promise<{ album: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const username = user.email?.split("@")[0];
  const albumName = params.album;
  const roomName = albumName.toLowerCase();
  const album = taylorAlbums.find(a => a.era.toLowerCase() === albumName.toLowerCase());

  return (
    <main className="w-full min-h-screen bg-[#0A0F19] text-gray-300 font-mono p-8 pt-32">
      {/* Background Effects */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[50vw] h-[50vh] bg-pink-500/20 -top-1/4 -left-1/4 rounded-full filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute w-[50vw] h-[50vh] bg-sky-500/20 -bottom-1/4 -right-1/4 rounded-full filter blur-[150px] animate-pulse-slow animation-delay-2000"></div>
        <div className="fixed top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto h-screen flex flex-col">
        <header className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-2 tracking-widest uppercase">
            <span className="text-pink-400" style={{ textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899' }}>{decodeURIComponent(params.album)}</span>
            <span className="text-sky-400" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}> CHAT</span>
          </h1>
          <p className="text-sm text-cyan-400">[ERA_ARCHIVE: {decodeURIComponent(params.album).toUpperCase()}]</p>
        </header>

        <div className="flex-1 min-h-0 rounded-lg bg-black/30 border border-pink-400/30 backdrop-blur-sm p-4">
          <RealtimeChat 
            roomName={roomName} 
            username={username!}
            userId={user.id}
            albumColor={album?.color}
            albumBorder={album?.border}
          />
        </div>
      </div>

    </main>
  );
}
