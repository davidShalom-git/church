import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import axios from 'axios';
import wordT from '../assets/wordT.jpg';
import wordE from '../assets/wordE.jpg';
import DynamicTamilVideoButton from '../Component/TamilAudio';
import DynamicEnglishVideoButton from '../Component/EnglishAudio';

const DailyPromisesComponent = () => {
  const [tamImage, setTamImage] = useState([]);
  const [engImage, setEngImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchImages(); // Fetch Tamil and English images
  }, []);

  // Updated upcomingEvents array - Only Tamil and English sections
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

        <div className="grid md:grid-cols-2 gap-6 justify-center">
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
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 text-center">
                <h3 className="text-2xl font-bold">{event.date}</h3>
              </div>

              <div className="p-6">
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