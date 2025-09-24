'use client';

export const ProfileSkeleton = () => {
  return (
    <div className="w-full max-w-2xl rounded-2xl p-4 sm:p-8 border border-cyan-400 bg-gray-900/70 backdrop-blur-xs shadow-neon-cyan-lg relative z-10 text-neon-cyan-100">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-pink-400 mb-8 tracking-wide">Edit Your Profile</h1>
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        <div className="md:w-1/3 flex justify-center items-start pt-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700 rounded-full"></div>
        </div>
        <div className="md:w-2/3 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-700 rounded w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-700 rounded w-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-20 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};
