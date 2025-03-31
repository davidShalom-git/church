import React, { useState } from 'react';
import March_30 from '../Video/March_30.mp4';
import mar30 from '../Video/March_30.jpg'; 
import Footer from './Footer';

const Morning = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { title: 'March 30', video: March_30 },
  

  ];

  const handleBoxClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center p-3 w-[90%] rounded-3xl mx-auto mt-5 bg-yellow-300 shadow-md">
        <h1 className="text-center text-xl md:text-2xl font-bold p-5">தினசரி தியானம் </h1>
      </div>
      <div className=" mt-10 flex flex-col min-h-screen">
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
          <div className=" mb-10 flex-grow flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedVideo(null)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Back to Titles
            </button>
            <video width="640" height="360" controls autoPlay className="rounded-lg shadow-lg mb-6">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Poster Section */}
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg">
              <img src={mar30} alt="Poster" className="w-full max-w-md rounded-lg mb-4 shadow-md" />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = mar30;
                  link.download = 'March_30_Poster.jpg'; // File name for download
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                Download Poster
              </button>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default Morning;