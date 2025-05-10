import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from './Footer';

const Morning = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://church-data.vercel.app/upload/data/url')
      .then((response) => response.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        delay: 0.2 
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-white min-h-screen">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="flex flex-col md:flex-row justify-center items-center p-4 w-[90%] rounded-3xl mx-auto mt-8 bg-gradient-to-r from-yellow-300 to-amber-300 shadow-lg"
      >
        <h1 className="text-center text-2xl md:text-3xl font-bold p-5 text-gray-800">
          ஞாயிற்று ஆராதனை
        </h1>
      </motion.div>

      {/* Video Links Section */}
      <div className="mt-12 flex flex-col min-h-screen pb-20">
        <div className="flex-grow flex items-center justify-center px-4">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ ease: "linear", duration: 2, repeat: Infinity }}
                className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full"
              />
              <p className="mt-4 text-gray-600">Loading videos...</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
            >
              {videos.map((vid, index) => (
                <motion.a
                  key={index}
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover="hover"
                  className="p-8 bg-white text-black rounded-2xl shadow-md flex flex-col items-center justify-center cursor-pointer border border-gray-100 h-64"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 * index, type: "spring" }}
                    className="w-16 h-16 mb-4 bg-red-600 rounded-full flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-center text-gray-800">{vid.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">Sunday Service</p>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Morning;