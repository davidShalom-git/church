import React from 'react';
import prayer from '../assets/Prayer.mp4';

const Video = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#161A30] px-2 py-6">
      <div className="w-full max-w-xl bg-[#232949] rounded-3xl shadow-2xl p-0 overflow-hidden border border-[#26326b]/80">
        <div className="relative bg-gradient-to-tr from-[#20276C]/90 to-[#253469]/90 py-8">
          <h1 className="text-center font-black text-4xl md:text-5xl text-white drop-shadow-lg tracking-tight">
            ⭐ ஜெப வேலை 🌟
          </h1>
        </div>
        <div className="p-6 flex flex-col items-center space-y-4">
          <div className="w-full rounded-2xl ring-2 ring-[#3868b0]/30 hover:ring-[#79aaff]/70 transition duration-300 shadow-xl overflow-hidden">
            <video
              width="100%"
              height="auto"
              controls
              className="rounded-2xl focus:outline-none bg-black"
              poster="/poster-image.jpg"
            >
              <source src={prayer} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="w-full mt-2 bg-[#1b2040] bg-opacity-75 rounded-xl px-4 py-3 text-center text-indigo-100 tracking-wide font-semibold border border-[#3d4666]/60 shadow-sm">
            ஜெபத்தின் வல்லமை · The Power of Prayer
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
