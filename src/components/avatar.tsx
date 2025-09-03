'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function Avatar({ uid, url, onUpload }: { uid: string, url: string | null, onUpload: (url: string) => void }) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  const publicUrl = url ? supabase.storage.from('avatars').getPublicUrl(url).data.publicUrl : null;

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {publicUrl ? (
        <Image
          src={publicUrl}
          alt="Avatar"
          className="rounded-full"
          width={150}
          height={150}
        />
      ) : (
        <div className="w-[150px] h-[150px] bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-gray-500">No Avatar</span>
        </div>
      )}
      <div className="mt-4">
        <label className="cursor-pointer bg-white/10 text-white rounded-lg px-4 py-2 font-bold uppercase tracking-wider shadow-sm hover:shadow-neon-cyan-md transition-all duration-300 ease-in-out" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
