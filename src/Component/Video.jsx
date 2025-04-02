import React from 'react';
import Footer from './Footer';

const Morning = () => {
  const videos = [
    { title: 'March 30', link: 'https://www.youtube.com/live/FFaPydodqbE?si=2iP_UvZFCPHDwrrS' }, // Replace with actual YouTube link
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-center items-center p-3 w-[90%] rounded-3xl mx-auto mt-5 bg-yellow-300 shadow-md">
        <h1 className="text-center text-xl md:text-2xl font-bold p-5">ஞாயிற்று ஆராதனை</h1>
      </div>

      {/* Video Links Section */}
      <div className="mt-10 flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {videos.map((vid, index) => (
              <a
                key={index}
                href={vid.link} // ✅ YouTube link
                target="_blank" // Opens in a new tab
                rel="noopener noreferrer" // Security best practice
                className="p-10 sm:p-12 lg:p-20 bg-white text-black rounded-lg shadow-md flex flex-col items-center cursor-pointer hover:bg-gray-200 transition duration-300"
              >
                <h3 className="text-lg lg:text-2xl font-bold text-center">{vid.title}</h3>
              </a>
            ))}
          </div>
        </div>

      

        <Footer />
      </div>
    </>
  );
};

export default Morning;