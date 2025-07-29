import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, AlertCircle } from 'lucide-react';

const DynamicVideoButton = () => {
  const [latestVideoUrl, setLatestVideoUrl] = useState('https://www.youtube.com/watch?v=91FYRePs40g&list=PLFAPPjda8gQdZ-e-F7eC49pXb5wpV5O_Z');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to fetch the latest video
  const fetchLatestVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`https://church-data.vercel.app/upload/data/url?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      
      // Handle different response formats
      let videoUrl = null;
      
      if (Array.isArray(data) && data.length > 0) {
        // Sort by createdAt or uploadDate to get the most recent
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.uploadDate);
          const dateB = new Date(b.createdAt || b.uploadDate);
          return dateB - dateA;
        });
        
        // Find the most recent video type entry
        const latestVideo = sortedData.find(item => item.type === 'video') || sortedData[0];
        if (latestVideo && latestVideo.url) {
          videoUrl = latestVideo.url;
        }
      } 
      else if (data && data.url) {
        videoUrl = data.url;
      }
      else if (data && typeof data === 'object') {
        // Handle case where API returns object with nested data
        const videos = Object.values(data).flat().filter(item => item && item.type === 'video');
        if (videos.length > 0) {
          const latest = videos.sort((a, b) => new Date(b.createdAt || b.uploadDate) - new Date(a.createdAt || a.uploadDate))[0];
          videoUrl = latest.url;
        }
      }
      
      if (videoUrl && videoUrl !== latestVideoUrl) {
        setLatestVideoUrl(videoUrl);
        setLastUpdated(new Date().toLocaleString());
        console.log('Updated video URL:', videoUrl); // Debug log
      }
      
    } catch (err) {
      console.error('Error fetching latest video:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchLatestVideo();
  }, []);

  // Auto-refresh every 10 minutes (more frequent updates)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestVideo();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleManualRefresh = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetchLatestVideo();
  };

  return (
    <div className="relative">
      <div className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full">
        <a 
          href={latestVideoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 w-full justify-center text-white no-underline"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/0 via-indigo-300/20 to-indigo-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <Play size={18} className="text-amber-300 relative z-10" />
          <span className="relative z-10">நேரடி ஜெப ஆராதனை</span>
        </a>
        
        {/* Manual refresh button */}
        <button
          onClick={handleManualRefresh}
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-1 hover:bg-indigo-500 rounded transition-colors"
          title="Refresh video link"
        >
          <RefreshCw 
            size={14} 
            className={`text-amber-300 ${loading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      {/* Status indicators */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        {lastUpdated && (
          <span>Last updated: {lastUpdated}</span>
        )}
        {error && (
          <div className="flex items-center gap-1 text-red-500">
            <AlertCircle size={12} />
            <span>Error: {error}</span>
          </div>
        )}
      </div>
      
      {/* Debug info (remove in production) */}
      <div className="mt-2 text-xs text-gray-400 break-all">
        Current URL: {latestVideoUrl}
      </div>
    </div>
  );
};

export default DynamicVideoButton;