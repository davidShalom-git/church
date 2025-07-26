import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const DynamicVideoButton = () => {
  const [latestVideoUrl, setLatestVideoUrl] = useState('https://www.youtube.com/watch?v=91FYRePs40g&list=PLFAPPjda8gQdZ-e-F7eC49pXb5wpV5O_Z');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch the latest video
  const fetchLatestVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://church-data.vercel.app/upload/data/url');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If data is an array, get the most recent video (assuming it's sorted by date)
      if (Array.isArray(data) && data.length > 0) {
        // Sort by createdAt to get the most recent
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const latestVideo = sortedData[0];
        setLatestVideoUrl(latestVideo.url);
      } 
      // If data is a single object
      else if (data && data.url) {
        setLatestVideoUrl(data.url);
      }
      
    } catch (err) {
      console.error('Error fetching latest video:', err);
      setError(err.message);
      // Keep the fallback URL if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchLatestVideo();
  }, []);

  // Optional: Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestVideo();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
      <a 
        href={latestVideoUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/0 via-indigo-300/20 to-indigo-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
        <Play size={18} className={`text-amber-300 ${loading ? 'animate-spin' : ''}`} />
        <span>நேரடி ஜெப ஆராதனை</span>
        {error && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-75">
            Error loading latest video
          </span>
        )}
      </a>
    </motion.div>
  );
};

export default DynamicVideoButton;