import { RealtimeChat } from "@/components/realtime-chat";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import taylorAlbums from "@/data/taylorAlbums.json";
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }: { params: { album: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const username = user.email?.split("@")[0];
  const roomName = params.album.toLowerCase();
  const album = taylorAlbums.find(a => a.era.toLowerCase() === params.album.toLowerCase());

  return (
    <div className="relative w-full h-screen">
      {album?.room_bg && (
        <Image
          src={album.room_bg}
          alt={`${album.era} background`}
          fill={true}
          objectFit="cover"
          className="-z-10"
        />
      )}
      <div className="absolute inset-0 bg-white/20 " />
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-4 h-screen flex flex-col max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-neon-pink-400 via-purple-400 to-blue-400 animate-pulse drop-shadow-lg">
           {decodeURIComponent(params.album)} Chat
        </h1>
        <div className="flex-1 min-h-0"> {/* Added min-h-0 to ensure flex child can shrink */}
          <RealtimeChat 
            roomName={roomName} 
            username={username!}
            userId={user.id}
            albumColor={album?.color}
            albumBorder={album?.border}
          />
        </div>
      </div>
    </div>
  );
}
