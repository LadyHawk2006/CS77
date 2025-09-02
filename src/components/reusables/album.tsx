import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import taylorAlbums from '@/data/taylorAlbums.json';

interface Album {
  id: number;
  title: string;
  era: string;
  color: string;
  border: string;
  year: number;
  songs: string[];
  imageUrl: string;
  embedUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AlbumComponentProps {
  // You can add props here if needed in the future
}

const PlaylistModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white/40 p-4 rounded-lg shadow-lg w-full max-w-5xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-red text-2xl">&times;</button>
        </div>
        <iframe
          style={{ borderRadius: '12px' }}
          src={url}
          width="100%"
          height="500"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

const AlbumComponent: React.FC<AlbumComponentProps> = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album>(taylorAlbums[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  const handleStreamClick = (url: string) => {
    setEmbedUrl(url);
    setModalOpen(true);
  };

  return (
    <>
      {/* Album Selection */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold mb-6 text-center text-neon-pink-300">Albums</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {taylorAlbums.map((album) => (
            <motion.div
              key={album.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAlbum(album)}
              className={`cursor-pointer p-3 border-2 rounded-lg text-center transition-all 
                  ${selectedAlbum.id === album.id 
                    ? `bg-gradient-to-br ${album.color} text-white border-neon-pink-500 shadow-neon-pink-lg` 
                    : `bg-translucent bg-opacity-30 backdrop-blur-sm ${album.border} text-gray-300`
                  }`}>
              <div className="font-bold mb-1">{album.era}</div>
              <div className="text-xs">{album.year}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Album Details */}
      <motion.section 
        key={selectedAlbum.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-translucent bg-opacity-20 backdrop-blur-sm border-2 border-pink-500 rounded-lg p-6 mb-12"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            {/* Album Card with Next Image */}
            <div className="bg-translucent bg-opacity-20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-pink-500">
              <div className="relative w-full h-72">
                <Image 
                  src={selectedAlbum.imageUrl} 
                  alt={selectedAlbum.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-neon-pink-400 mb-2">{selectedAlbum.title}</h3>
                <p className="text-neon-purple-300 text-sm">Released: {selectedAlbum.year}</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold mb-4 text-neon-pink-500">{selectedAlbum.era} Exclusive Content</h3>
            <p className="mb-6 text-white">
              Dive deep into the {selectedAlbum.era.toLowerCase()} with rare tracks, behind-the-scenes footage, and exclusive content only available to Cyber Swifties.
            </p>
            
            <h4 className="text-xl font-bold mb-3 text-neon-pink-300">Featured Tracks</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedAlbum.songs.map((song, index) => (
                <li
                  key={index}
                  className={`group bg-translucent bg-opacity-40 backdrop-blur-sm border border-pink-500 rounded-lg p-3 transition-colors cursor-pointer
                    hover:bg-gradient-to-br hover:${selectedAlbum.color}
                  `}
                >
                  <div className="font-medium text-neon-pink-300">{song}</div>
                  <div className="text-sm text-neon-purple-300">Taylor Swift - {selectedAlbum.title}</div>
                </li>
              ))}
            </ul>
            
            {/* Three small buttons below the featured tracks */}
            <div className="flex gap-2 mt-18">
              <button 
                onClick={() => handleStreamClick(selectedAlbum.embedUrl)}
                className="flex-1 px-4 py-2 bg-translucent bg-opacity-20 backdrop-blur-sm border {selectedAlbum.border} rounded-lg font-medium text-md text-cyan-500 uppercase tracking-wider glow-button transition-colors hover:bg-opacity-60">
                Stream
              </button>
              <button className="flex-1 px-4 py-2 bg-translucent bg-opacity-20 backdrop-blur-sm border {selectedAlbum.border} rounded-lg font-medium text-md text-cyan-500 uppercase tracking-wider glow-button transition-colors hover:bg-opacity-60">
                Merch
              </button>
              <button className="flex-1 px-4 py-2 bg-translucent bg-opacity-20 backdrop-blur-sm border {selectedAlbum.border} rounded-lg font-medium text-md text-cyan-500 uppercase tracking-wider glow-button transition-colors hover:bg-opacity-60">
                Community
              </button>
            </div>
            
          </div>
        </div>
      </motion.section>

      {modalOpen && <PlaylistModal url={embedUrl} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default AlbumComponent;
