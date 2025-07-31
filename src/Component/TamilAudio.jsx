import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, AlertCircle } from 'lucide-react';

const DynamicTamilVideoButton = () => {
  const [latestVideoUrl, setLatestVideoUrl] = useState('https://www.youtube.com/watch?v=default-english-video');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to fetch the latest English video
  const fetchLatestVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add cache-busting parameter to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`https://church-76ju.vercel.app/api/TamAudio/tamAudio?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Fetched English data:', result);
      
      // Handle the API response format
      let videoUrl = null;
      
      if (result && result.success && result.data && result.data.url) {
        videoUrl = result.data.url;
      }
      
      if (videoUrl && videoUrl !== latestVideoUrl) {
        setLatestVideoUrl(videoUrl);
        setLastUpdated(new Date().toLocaleString());
        console.log('Updated English video URL:', videoUrl);
      }
      
    } catch (err) {
      console.error('Error fetching latest English video:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchLatestVideo();
  }, []);

  // Auto-refresh once daily (24 hours)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestVideo();
    }, 24 * 60 * 60 * 1000); // 24 hours = 86,400,000 milliseconds

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
      <div className="group relative overflow-hidden bg-green-600 hover:bg-green-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full">
        <a 
          href={latestVideoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 w-full justify-center text-white no-underline"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500/0 via-green-300/20 to-green-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <Play size={18} className="text-yellow-300 relative z-10" />
          <span className="relative z-10">Live Prayer & Worship</span>
        </a>
        
        {/* Manual refresh button */}
        <button
          onClick={handleManualRefresh}
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-1 hover:bg-green-500 rounded transition-colors"
          title="Refresh video link"
        >
          <RefreshCw 
            size={14} 
            className={`text-yellow-300 ${loading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          <span>Error: {error}</span>
        </div>
      )}
      
      {/* Last updated info */}
      {lastUpdated && (
        <div className="mt-1 text-xs text-gray-500">
          Last updated: {lastUpdated}
        </div>
      )}
    </div>
  );
};

export default DynamicTamilVideoButton;