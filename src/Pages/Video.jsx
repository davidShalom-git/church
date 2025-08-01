import React from 'react';
import prayer from '../assets/Prayer.mp4';


const Video = () => {
  return (
    <div className="min-h-screen bg-[#161A30] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 mb-4 tracking-tight">
            ⭐ ஜெப வேலை 🌟
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto"></div>
        </div>

        {/* Video Container */}
        <div className="bg-[#1e2347]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#2a3660]/50">
          <div className="relative group">
            {/* Video Player */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
              <video
                width="100%"
                height="auto"
                controls
                className="w-full rounded-2xl focus:outline-none bg-black transition-transform duration-300 group-hover:scale-[1.02]"
                poster="/poster-image.jpg"
              >
                <source src={prayer} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
            </div>

            {/* Video Info */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Now Playing</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Worship Service</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1a1f3a] to-[#1e2347] rounded-xl p-4 border border-[#2a3660]/30">
                <h2 className="text-xl font-semibold text-white mb-2">
                  ஜெபத்தின் வல்லமை
                </h2>
                <p className="text-indigo-300 font-medium">
                  The Power of Prayer
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                    Duration: 22 min
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    HD Quality
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;