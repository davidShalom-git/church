import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import axios from 'axios';

const EventsComponent = () => {
  const [eventImages, setEventImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event images
  const fetchEventImages = async () => {
    try {
      setLoading(true);
      const eventRes = await axios.get('https://church-76ju.vercel.app/api/church/event');

      if (eventRes.data.success) {
        // Sort and get only the latest 3 event images
        const sortedEventImages = eventRes.data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3); // Get only the latest 3 images
        setEventImages(sortedEventImages);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventImages();
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400 mb-4">
            சமீபத்திய நிகழ்வுகள்
          </h2>
          <div className="h-1 w-24 bg-purple-500 mx-auto mb-6 rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 cards-container">
          {eventImages.length > 0 ? (
            eventImages.map((item, index) => (
              <motion.div
                key={index}
                className="card-animate group relative bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl dark:shadow-indigo-900/30 border border-gray-100 dark:border-gray-700"
                whileHover={{
                  y: -16,
                  rotateY: 5,
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500 animate-pulse"></div>

                <div className="relative p-8 flex flex-col items-center h-full">
                  {/* Image Container */}
                  <Link to='/video' className="relative mb-8 group/image">
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                      whileHover={{ scale: 1.2 }}
                    ></motion.div>

                    {/* Floating Ring Animation */}
                    <motion.div
                      className="absolute -inset-2 border-2 border-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-50"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    ></motion.div>

                    <motion.div
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={item.base64Data ? `data:${item.mimeType};base64,${item.base64Data}` : `https://church-76ju.vercel.app/api/files/${item.name}`}
                        className="w-full h-96 object-cover transition-transform duration-700 group-hover/image:scale-110 group-hover/image:rotate-1"
                        alt={item.originalName || item.name}
                        onError={(e) => {
                          console.error('Event image failed to load:', e.target.src);
                          e.target.onerror = null;
                        }}
                      />

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>

                    {/* Floating Calendar Icon */}
                    <motion.div
                      className="absolute -top-3 -right-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full p-3 shadow-lg"
                      whileHover={{
                        rotate: 15,
                        scale: 1.1
                      }}
                      animate={{
                        y: [0, -8, 0]
                      }}
                      transition={{
                        y: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <Calendar className="w-5 h-5" />
                    </motion.div>
                  </Link>

                  {/* Content Section */}
                  <div className="text-center space-y-4 flex-grow flex flex-col justify-center">
                    <motion.h2
                      className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-500"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.fileName}
                    </motion.h2>

                    <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Enhanced Action Button */}
                  <motion.div
                    className="mt-8 relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link to='/video'>
                      <motion.button
                        className="relative px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg overflow-hidden group/btn transform-gpu"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

                        <span className="relative z-10 flex items-center gap-2">
                          மேலும் அறிய
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            →
                          </motion.div>
                        </span>
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </motion.div>
            ))
          ) : loading ? (
            <div className="col-span-3 flex flex-col justify-center items-center h-96 space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-500 border-r-purple-500"></div>
                <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-indigo-300 opacity-20"></div>
              </div>
              <motion.p
                className="text-gray-600 dark:text-gray-300 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading amazing events...
              </motion.p>
            </div>
          ) : (
            <motion.div
              className="col-span-3 text-center h-96 flex flex-col items-center justify-center space-y-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                  No Events Available
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Check back soon for exciting updates!
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsComponent;