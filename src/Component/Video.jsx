import React, { useState } from 'react';
import March_30 from '../Video/March_30.mp4';
import Chemistry from '../Video/Chemistry.mp4';
import DSA from '../Video/DSA.mp4';
import English from '../Video/English.mp4';


import Footer from './Footer';

const VideoGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { title: 'AI Video', video: March_30 },
    { title: 'Chemistry Video', video: Chemistry },
    { title: 'DSA Video', video: DSA },
    { title: 'English Video', video: English },
    { title: 'English Video', video: English },
    { title: 'English Video', video: English },
  ];

  const handleBoxClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center p-3 w-[90%] rounded-3xl mx-auto mt-5 bg-yellow-300 shadow-md">
  <h1 className="text-center text-xl md:text-2xl font-bold p-5">ஞாயிற்று ஆராதனை</h1>
</div>
      <div className="flex flex-col min-h-screen">
        {!selectedVideo ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {videos.map((vid, index) => (
                <div
                  key={index}
                  onClick={() => handleBoxClick(vid.video)}
                  className="p-10 sm:p-12 lg:p-20 bg-white text-black rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-gray-200 transition duration-300"
                >
                  <h3 className="text-lg lg:text-2xl font-bold text-center">{vid.title}</h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedVideo(null)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Back to Titles
            </button>
            <video width="640" height="360" controls autoPlay className="rounded-lg shadow-lg">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
           
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default VideoGrid;