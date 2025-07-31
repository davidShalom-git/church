import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import axios from 'axios';
import wordT from '../assets/wordT.jpg';
import wordE from '../assets/wordE.jpg';
import DynamicTamilVideoButton from '../Component/TamilAudio';
import DynamicEnglishVideoButton from '../Component/EnglishAudio'; // Add this import

const DailyPromisesComponent = () => {
  const [tamImage, setTamImage] = useState([]);
  const [engImage, setEngImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioLoading, setAudioLoading] = useState(true);
  const [audioError, setAudioError] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      // Fetch both Tamil and English images
      const [tamilRes, englishRes] = await Promise.all([
        axios.get('https://church-76ju.vercel.app/api/church/tam'),
        axios.get('https://church-76ju.vercel.app/api/church/eng')
      ]);

      if (tamilRes.data.success) {
        // Sort and get only the latest Tamil image
        const sortedTamilImages = tamilRes.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 1); // Get only the latest image
        setTamImage(sortedTamilImages);
      }

      if (englishRes.data.success) {
        // Sort and get only the latest English image
        const sortedEnglishImages = englishRes.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 1); // Get only the latest image
        setEngImage(sortedEnglishImages);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  // Fetch audio files
  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        setAudioLoading(true);
        const response = await fetch('https://church-76ju.vercel.app/api/audio/');
        if (!response.ok) {
          throw new Error('Failed to fetch audio files');
        }
        const data = await response.json();

        // Process audio files to get only the latest for today
        const today = new Date().toDateString();
        const todayAudioFiles = data.filter(audio => {
          const audioDate = new Date(audio.createdAt || audio.uploadDate).toDateString();
          return audioDate === today;
        });

        // Sort by upload time and get the most recent one
        const latestAudio = todayAudioFiles.sort((a, b) =>
          new Date(b.createdAt || b.uploadDate) - new Date(a.createdAt || a.uploadDate)
        )[0];

        setAudioFiles(latestAudio ? [latestAudio] : []);
      } catch (error) {
        console.error('Error fetching audio files:', error);
        setAudioError('Failed to load audio files');
      } finally {
        setAudioLoading(false);
      }
    };

    fetchAudioFiles();

    // Set up interval to check for new audio files every 5 minutes
    const interval = setInterval(fetchAudioFiles, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchImages(); // Fetch Tamil and English images
  }, []);

  // Updated upcomingEvents array - Audio will show only today's latest file
  const upcomingEvents = [
    {
      date: "தமிழ்",
      type: "tamil",
      images: tamImage
        .filter(img => img && (img.base64Data || img.name))
        .map(img => ({
          url: img.base64Data
            ? `data:${img.mimeType};base64,${img.base64Data}`
            : `https://church-76ju.vercel.app/api/files/${img.name}`,
          date: new Date(img.createdAt).toLocaleDateString()
        })),
    },
    {
      date: "English",
      type: "english",
      images: engImage
        .filter(img => img && (img.base64Data || img.name))
        .map(img => ({
          url: img.base64Data
            ? `data:${img.mimeType};base64,${img.base64Data}`
            : `https://church-76ju.vercel.app/api/files/${img.name}`,
          date: new Date(img.createdAt).toLocaleDateString()
        })),
    },
    {
      date: "🎵 Today's Audio",
      type: "audio",
      audioFiles: audioFiles.map(audio => ({
        id: audio._id,
        name: audio.originalName,
        filename: audio.filename,
        size: audio.size,
        mimetype: audio.mimetype,
        streamUrl: `https://church-76ju.vercel.app/api/audio/stream/${audio._id}`,
        downloadUrl: `https://church-76ju.vercel.app/api/audio/download/${audio._id}`,
        date: new Date(audio.createdAt || audio.uploadDate).toLocaleDateString(),
        time: new Date(audio.createdAt || audio.uploadDate).toLocaleTimeString()
      })),
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="inline-block text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400">
            தினசரி தியானம் மற்றும் வாக்குத்தத்தங்கள்
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              className="event-animate bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`${event.type === 'audio'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                } text-white p-4 text-center`}>
                <h3 className="text-2xl font-bold">{event.date}</h3>
              </div>

              <div className="p-6">
                {/* Image Files Section */}
                {event.type !== 'audio' ? (
                  <div>
                    {loading ? (
                      <div className="h-[500px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : error ? (
                      <div className="h-[500px] flex items-center justify-center text-red-500">
                        {error}
                      </div>
                    ) : event.images && event.images.length > 0 ? (
                      <div className="space-y-4">
                        {event.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={image.url}
                              className='h-[500px] w-full object-contain'
                              alt={`${event.date} ${imgIndex + 1}`}
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = index === 0 ? wordT : wordE;
                              }}
                            />
                            <p className="text-sm text-gray-500 mt-2 text-center">
                              Uploaded on: {image.date}
                            </p>
                            
                            {/* Dynamic Button Section - Show appropriate button based on type */}
                            <div className="mt-4">
                              {event.type === 'tamil' ? (
                                <DynamicTamilVideoButton />
                              ) : event.type === 'english' ? (
                                <DynamicEnglishVideoButton />
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[500px] flex flex-col items-center justify-center text-gray-500">
                        <div className="text-center mb-4">
                          No images available
                        </div>
                        {/* Show dynamic button even when no image */}
                        <div className="mt-4">
                          {event.type === 'tamil' ? (
                            <DynamicTamilVideoButton />
                          ) : event.type === 'english' ? (
                            <DynamicEnglishVideoButton />
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Audio Files Section - Updated for single daily audio */
                  <div>
                    {audioLoading ? (
                      <div className="h-[400px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                      </div>
                    ) : audioError ? (
                      <div className="h-[400px] flex items-center justify-center text-red-500">
                        {audioError}
                      </div>
                    ) : event.audioFiles && event.audioFiles.length > 0 ? (
                      <div className="space-y-4">
                        {event.audioFiles.map((audio, audioIndex) => (
                          <div key={audioIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border">
                            {/* Audio Info */}
                            <div className="mb-3">
                              <h4 className="font-semibold text-gray-800 dark:text-white truncate" title={audio.name}>
                                {audio.name}
                              </h4>
                            </div>

                            {/* Audio Player */}
                            <audio
                              controls
                              className="w-full mb-3"
                              preload="metadata"
                            >
                              <source src={audio.streamUrl} type={audio.mimetype} />
                              Your browser does not support the audio element.
                            </audio>

                            {/* Download Button */}
                            <div className="flex justify-center">
                              <a
                                href={audio.downloadUrl}
                                download={audio.name}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[400px] flex flex-col items-center justify-center text-gray-500">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <p>No audio file uploaded today</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/images"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              வாக்குத்தத்தங்கள்
              <ChevronDown size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyPromisesComponent;