import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Images = () => {
    const [tamilImages, setTamilImages] = useState([]);
    const [englishImages, setEnglishImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const [tamilRes, englishRes] = await Promise.all([
                axios.get('https://church-fire.vercel.app/api/image/tam'),
                axios.get('https://church-fire.vercel.app/api/image/eng')
            ]);

            if (tamilRes.data.success) {
                setTamilImages(tamilRes.data.data);
            }
            if (englishRes.data.success) {
                setEnglishImages(englishRes.data.data);
            }
        } catch (err) {
            setError('Failed to fetch images');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -8,
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const ImageSection = ({ images, title, delay = 0 }) => (
        <motion.div 
            className="mb-20"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay }}
        >
            <motion.div
                className="relative mb-8"
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: delay + 0.2 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl font-bold mb-2 text-center relative">
                    <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 
                                   text-transparent bg-clip-text dark:from-amber-400 dark:via-orange-400 dark:to-red-400">
                        {title}
                    </span>
                    <motion.div
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r 
                                 from-amber-600 to-red-600 dark:from-amber-400 dark:to-red-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "80px" }}
                        transition={{ duration: 0.8, delay: delay + 0.4 }}
                        viewport={{ once: true }}
                    />
                </h2>
                <motion.div
                    className="text-center mt-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: delay + 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="text-gray-600 dark:text-gray-300 text-lg">✨ Divine Inspirations ✨</span>
                </motion.div>
            </motion.div>

            {loading ? (
                <motion.div 
                    className="flex justify-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-16 h-16 border-4 border-gradient-to-r from-amber-400 to-red-500 rounded-full border-t-transparent"></div>
                        <motion.div
                            className="absolute inset-2 w-12 h-12 border-4 border-orange-300 rounded-full border-b-transparent"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                </motion.div>
            ) : error ? (
                <motion.div 
                    className="text-red-500 text-center py-16 text-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                        🙏 {error}
                    </div>
                </motion.div>
            ) : images.length === 0 ? (
                <motion.div 
                    className="text-gray-500 text-center py-16 text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
                        🕊️ No sacred images available at this moment
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {images.map((image, index) => (
                        <motion.div
                            key={image._id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                            layout
                        >
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl 
                                          shadow-lg overflow-hidden border border-white/20 dark:border-gray-700/20
                                          transition-all duration-300 group-hover:shadow-2xl">
                                <div className="relative overflow-hidden">
                                    <motion.img
                                        src={`http://localhost:1200/${image.image}`}
                                        alt={image.fileName}
                                        className="w-full h-56 object-cover transition-transform duration-500 
                                                 group-hover:scale-110"
                                        onError={(e) => {
                                            console.error('Image failed to load:', image.image);
                                            e.target.src = 'placeholder.jpg';
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    />
                                    <motion.div
                                        className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 
                                                 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileHover={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span className="text-xl">🔍</span>
                                    </motion.div>
                                </div>
                                
                                <motion.div 
                                    className="p-6"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <p className="text-gray-800 dark:text-gray-200 font-medium mb-2 
                                               group-hover:text-amber-600 dark:group-hover:text-amber-400 
                                               transition-colors duration-300 line-clamp-2">
                                        {image.fileName}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            📅 {new Date(image.createdAt).toLocaleDateString()}
                                        </p>
                                        <motion.div
                                            className="text-amber-500 opacity-0 group-hover:opacity-100"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            ✨
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 
                      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-200/30 
                             to-orange-200/30 rounded-full blur-3xl"
                    animate={{ 
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-red-200/30 
                             to-pink-200/30 rounded-full blur-3xl"
                    animate={{ 
                        x: [0, -40, 0],
                        y: [0, -20, 0],
                        scale: [1, 0.8, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            <div className="relative z-10 p-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        variants={titleVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h1 
                            className="text-5xl md:text-6xl font-bold mb-6 relative"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 
                                           text-transparent bg-clip-text dark:from-amber-400 dark:via-orange-400 dark:to-red-400">
                                தினசரி தியானம்
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 
                                           text-transparent bg-clip-text dark:from-red-400 dark:via-pink-400 dark:to-purple-400">
                                வாக்குத்தத்தங்கள்
                            </span>
                            <motion.div
                                className="absolute -inset-2 bg-gradient-to-r from-amber-200/20 to-red-200/20 
                                         rounded-3xl blur-2xl -z-10"
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </motion.h1>
                        
                        <motion.p
                            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            🙏 Daily Meditation & Sacred Promises 🙏
                            <br />
                            <span className="text-lg text-amber-600 dark:text-amber-400 font-medium">
                                Find peace and inspiration in divine words
                            </span>
                        </motion.p>
                    </motion.div>

                    <ImageSection 
                        images={tamilImages} 
                        title="தமிழ் வசனங்கள்" 
                        delay={0}
                    />
                    
                    <ImageSection 
                        images={englishImages} 
                        title="English Verses" 
                        delay={0.2}
                    />
                </div>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl max-h-[90vh] overflow-auto"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                src={`https://church-fire.vercel.app/${selectedImage.image}`}
                                alt={selectedImage.fileName}
                                className="w-full h-auto rounded-xl mb-4"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                {selectedImage.fileName}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                📅 {new Date(selectedImage.createdAt).toLocaleDateString()}
                            </p>
                            <motion.button
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-red-500 
                                         text-white rounded-full hover:from-amber-600 hover:to-red-600 
                                         transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedImage(null)}
                            >
                                Close
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Images;