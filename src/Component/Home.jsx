import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Calendar, Globe, ChevronDown, Play, Users, Moon, Sun, Phone, Instagram, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from './Footer';
import logo from "../assets/galaxy.png";
import profile from "../assets/profile.png";
import church from "../assets/chruch.jpg";
import pas from "../assets/pas.png";
import wordT from '../assets/wordT.jpg'
import wordE from '../assets/wordE.jpg'
import axios from 'axios';
import DynamicVideoButton from './Live';

// Container variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const fullText = "🔥 எழுப்புதலின் ஜெப வீடு🔥";
  const timeoutRef = useRef(null);


  const [tamImage, setTamImage] = useState([])
  const [engImage, setEngImage] = useState([])
  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)



  const fetchImages = async () => {
    try {
      setLoading(true);
      // Fetch both Tamil and English images
      const [tamilRes, englishRes] = await Promise.all([
        axios.get('https://church-76ju.vercel.app/api/church/tam'),
        axios.get('https://church-76ju.vercel.app/api/church/eng',)
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

  // Update your state
  const [eventImages, setEventImages] = useState([])

  // Update your fetchImages function
  const fetchImage = async () => {
    try {
      setLoading(true);
      // Fetch event images
      const eventRes = await axios.get('https://church-76ju.vercel.app/api/church/event',);

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


  // Update your events section render code

  // Refs for scroll animations
  const heroTextRef = useRef(null);
  const aboutRef = useRef(null);
  const gsapContainerRef = useRef(null);


  useEffect(() => {
    fetchImages(); // Fetch Tamil and English images
    fetchImage();  // Fetch event images
  }, []);


  const [audioFiles, setAudioFiles] = useState([]);
  const [audioLoading, setAudioLoading] = useState(true);
  const [audioError, setAudioError] = useState(null);

  // Add this useEffect to fetch audio files
  // Updated useEffect to fetch and process audio files by date
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


const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};



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

  const testimonials = [
    { name: "ராஜா", text: "இந்த தேவாலயம் என் வாழ்க்கையை முற்றிலும் மாற்றியது. நான் ஒரு புதிய நபராக உணர்கிறேன்.", image: profile },
    { name: "கவிதா", text: "அன்புள்ள சமூகம், அற்புதமான போதனைகள். என் குடும்பத்திற்கு இது ஒரு வரப்பிரசாதம்.", image: profile },
    { name: "ஜான்", text: "இங்கே நான் கண்டுபிடித்த ஆன்மீக வளர்ச்சி மிகவும் நிறைவாக இருந்தது.", image: profile }
  ];

  // Effect for typing animation
  useEffect(() => {
    let currentIndex = 0;
    const typeEffect = () => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeEffect, 150);
      } else {
        timeoutRef.current = setTimeout(() => {
          setText('');
          currentIndex = 0;
          typeEffect();
        }, 2000);
      }
    };

    typeEffect();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect for GSAP animations
  useEffect(() => {
    // Initialize GSAP animations only if the script is loaded
    if (window.gsap) {
      const gsap = window.gsap;

      // Check if ScrollTrigger plugin is available
      if (gsap.ScrollTrigger) {
        gsap.from(".card-animate", {
          scrollTrigger: {
            trigger: ".cards-container",
            start: "top 80%",
          },
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        });

        gsap.from(".event-animate", {
          scrollTrigger: {
            trigger: "#event",
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)"
        });

        gsap.from(".about-animate", {
          scrollTrigger: {
            trigger: "#about",
            start: "top 70%",
          },
          x: -50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        });

        gsap.from(".testimonial-animate", {
          scrollTrigger: {
            trigger: ".testimonials-container",
            start: "top 80%",
          },
          scale: 0.9,
          opacity: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "elastic.out(1, 0.7)"
        });
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');

    // Store the preference in localStorage
    if (!darkMode) {
      localStorage.setItem('darkMode', 'true');
    } else {
      localStorage.setItem('darkMode', 'false');
    }
  };

  // Check for user's dark mode preference on component mount
  useEffect(() => {
    // Check if dark mode was previously enabled
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';

    // Check system preference if no saved preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedDarkMode || (!localStorage.getItem('darkMode') && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);





  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Navbar */}
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-blue-50/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'} transition-all duration-300`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <motion.img
                src={logo}
                className="h-10 w-10 sm:h-12 sm:w-12"
                alt="Logo"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                ஜெப வீடு
              </motion.span>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isOpen ?
                  <X className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /> :
                  <Menu className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                }
              </motion.button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {["Home", "Video", "Events", "About"].map((item, index) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item === "Home" ? (
                    <Link to="/" className="nav-link text-black text-xl">
                      <Globe className="w-4 h-4" />
                      <span>{item}</span>
                    </Link>
                  ) : item === "Video" ? (
                    <Link to="/video" className="nav-link text-black text-xl">
                      <Play className="w-4 h-4" />
                      <span>{item}</span>
                    </Link>
                  ) : item === "Events" ? (
                    <a href="#event" className="nav-link text-black text-xl">
                      <Calendar className="w-4 h-4" />
                      <span>{item}</span>
                    </a>
                  ) : (
                    <a href="#about" className="nav-link text-black text-xl">
                      <Users className="w-4 h-4" />
                      <span>{item}</span>
                    </a>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>

              <motion.img
                src={profile}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer border-2 border-indigo-500 hover:border-indigo-700 transition-all"
                alt="Profile"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-blue-50 dark:bg-gray-900 z-40 pt-24 px-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              <motion.nav
                className="flex flex-col space-y-6 text-xl font-medium"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Link to="/" className="hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 flex items-center gap-2 border-b pb-4 border-gray-100 dark:border-gray-800" onClick={() => setIsOpen(false)}>
                    <Globe size={24} /> Home
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/video" className="hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 flex items-center gap-2 border-b pb-4 border-gray-100 dark:border-gray-800" onClick={() => setIsOpen(false)}>
                    <Play size={24} /> Video
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <a href="#event" className="hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 flex items-center gap-2 border-b pb-4 border-gray-100 dark:border-gray-800" onClick={() => setIsOpen(false)}>
                    <Calendar size={24} /> Events
                  </a>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <a href="#about" className="hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 flex items-center gap-2 border-b pb-4 border-gray-100 dark:border-gray-800" onClick={() => setIsOpen(false)}>
                    <Users size={24} /> About
                  </a>
                </motion.div>
                <motion.div variants={itemVariants} className="pt-6">
                  <button
                    onClick={() => {
                      toggleDarkMode();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg w-full justify-center"
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="dark:text-white">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content with padding-top to account for fixed navbar */}
        <div className="pt-24">
          {/* Hero Section with Framer Motion */}
          <motion.div
            className='relative flex flex-col items-center justify-center min-h-[80vh] md:min-h-[90vh] bg-cover bg-center overflow-hidden'
            style={{ backgroundImage: `url(${church})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Overlay with radial gradient for more dramatic lighting */}
            <div className="absolute inset-0 bg-gradient-radial from-black/30 via-black/50 to-black/80"></div>

            {/* Animated particles or light effect (optional) */}
            <div className="absolute inset-0 opacity-30">
              {/* You can add particle.js or a custom light effect component here */}
            </div>

            {/* Side design element */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block h-64 w-1"
              initial={{ height: 0 }}
              animate={{ height: 256 }}
              transition={{ delay: 0.6, duration: 1.5 }}
            >
              <div className="h-full w-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-400 rounded-r-md"></div>
            </motion.div>

            {/* Right side design element */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block h-64 w-1"
              initial={{ height: 0 }}
              animate={{ height: 256 }}
              transition={{ delay: 0.9, duration: 1.5 }}
            >
              <div className="h-full w-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-400 rounded-l-md"></div>
            </motion.div>

            {/* Main content container with glass effect */}
            <motion.div
              className="relative z-10 text-center px-4 py-8 md:py-12 w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 
               backdrop-blur-sm bg-black/30 border border-white/10 rounded-xl shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Scripture reference with decorative elements */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-2 md:mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-amber-400"></div>
                <p className="text-amber-300 text-sm md:text-base font-medium tracking-widest">நீதிமொழிகள் 21:31</p>
                <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-amber-400"></div>
              </motion.div>

              {/* Main Tamil scripture with animated border */}
              <motion.div
                className="relative mx-auto max-w-3xl mb-6 md:mb-8 p-3 md:p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                {/* Animated border effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-50"
                  animate={{
                    boxShadow: ["0 0 0 1px rgba(251, 191, 36, 0.1)", "0 0 0 2px rgba(251, 191, 36, 0.3)", "0 0 0 1px rgba(251, 191, 36, 0.1)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed">
                  <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    குதிரை யுத்தநாளுக்கு ஆயத்தமாக்கப்படும், ஜெயமோ கர்த்தரால் வரும்.
                  </span>
                </h2>
              </motion.div>

              {/* Church name with animated gradient */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                <span className="inline-block bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent pb-1 drop-shadow-sm mb-10 mt-5">
                  {text}
                </span>
              </motion.h1>

              {/* Secondary text */}
              <motion.p
                className="text-white/90 text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                உன் விண்ணப்பத்தைக் கேட்டேன், உன் கண்ணீரைக் கண்டேன்.
              </motion.p>

              {/* CTA Buttons with improved design */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                 <DynamicVideoButton/>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <a href="#event" className="group relative overflow-hidden bg-white hover:bg-gray-100 text-indigo-700 px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium transition-colors w-full inline-block">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-200/0 via-amber-200/20 to-amber-200/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    நிகழ்ச்சிகள் அறிய
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Subtle scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <span className="text-white/70 text-sm mb-2">Scroll</span>
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Wave footer with responsive design */}
            <div className="absolute bottom-0 left-0 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                <path
                  fill={darkMode ? "#1f2937" : "#ffffff"}
                  fillOpacity="1"
                  d="M0,128L48,138.7C96,149,192,171,288,176C384,181,480,171,576,144C672,117,768,75,864,69.3C960,64,1056,96,1152,122.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </motion.div>

          {/* Announcement Banner with motion */}
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 my-8 rounded-xl max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="bg-white/20 p-2 rounded-full"
                whileHover={{ rotate: 15 }}
              >
                <Calendar size={24} />
              </motion.div>
              <div className="text-center md:text-left">
                <h3 className="font-bold">அடுத்த சிறப்பு நிகழ்வு: ஞாயிறு ஆராதனை </h3>
                <p className="text-white/80">மே 18, 2025 - காலை 7:30 </p>
              </div>
            </div>
            <motion.a
              href="#event"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              மேலும் அறிய
            </motion.a>
          </motion.div>

          {/* Three Pillars Section with enhanced design */}



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
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-[500px] flex items-center justify-center text-gray-500">
                              No images available
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

          <div className="grid md:grid-cols-3 gap-10 cards-container px-4">
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

          {/* Testimonials with animation */}
          <section className="py-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                  சாட்சிகள்
                </h2>
                <div className="h-1 w-24 bg-purple-500 mx-auto mb-6 rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                  தேவன் செய்த அற்புதங்கள் மற்றும் அடையாளங்கள்
                </p>
              </div>

              {/* Testimonial Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* Card Header - Colored Bar */}
                    <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                    {/* Card Content */}
                    <div className="p-8">
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform scale-110 opacity-30"></div>
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-full object-cover relative z-10 border-4 border-white dark:border-gray-700"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{testimonial.name}</h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">"{testimonial.text}"</p>

                      <div className="flex justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 text-amber-500 fill-current"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Dots (Optional) */}
              <div className="flex justify-center mt-12 space-x-2">
                {[...Array(3)].map((_, i) => (
                  <button
                    key={i}
                    className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-16 bg-gradient-to-b from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  ref={aboutRef}
                  className="about-animate"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400">
                    எங்களைப் பற்றி
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    எங்கள் தேவாலயம் அன்பு, ஏற்றுக்கொள்ளுதல் மற்றும் ஆன்மீக வளர்ச்சியின் சமூகமாகும். நாங்கள் 20 ஆண்டுகளுக்கும் மேலாக எங்கள் சமூகத்திற்கு சேவை செய்து வருகிறோம், விசுவாசிகளுக்கு அர்த்தமுள்ள வழிபாட்டு, வளர்ச்சி அனுபவங்கள் மற்றும் சேவை வாய்ப்புகளை வழங்குகிறோம்.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    எங்கள் தனித்துவமான கலாச்சார மரபு மற்றும் நவீன போதனை அணுகுமுறைகளை இணைக்கும் எங்கள் தேவாலயம், எல்லா வயதினருக்கும் மற்றும் பின்னணியில் இருந்து வருபவர்களுக்கும் வரவேற்பளிக்கும் இடமாக விளங்குகிறது.
                  </p>

                </motion.div>

                <motion.div
                  className="about-animate relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img
                    src={pas}
                    alt="Pastor"
                    className="rounded-2xl shadow-2xl w-full h-auto z-10 relative"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs">
                    <h3 className="text-lg font-bold mb-1 dark:text-white">பேஸ்டர் ஜான்</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      "அன்பு மற்றும் அக்கறையுடன் உங்களை வரவேற்கிறோம்"
                    </p>
                  </div>
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-600/20 rounded-full z-0"></div>
                  <div className="absolute bottom-20 left-0 w-16 h-16 bg-purple-600/20 rounded-full z-0"></div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Call to Action */}


          {/* Call to Action Alternative */}
          <motion.section
            className="py-16 px-4 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side Content */}
                <motion.div
                  className="space-y-6 p-8"
                  initial={{ x: -50 }}
                  whileInView={{ x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="inline-block rounded-lg bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      சிறப்பு அழைப்பு ✨
                    </span>
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400">
                    தேவனுடைய ராஜ்யத்தை கட்டத்தயாரா?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    வாராந்திர ஆராதனைகள், விசேஷ கூட்டங்கள், மற்றும் சமூக நிகழ்வுகளில் பங்கேற்று ஆசீர்வாதங்களைப் பெறுங்கள்.
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                    {[
                      { number: "20+", label: "ஆண்டுகள்" },
                      { number: "1000+", label: "உறுப்பினர்கள்" },
                      { number: "50+", label: "நிகழ்வுகள்" }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Right Side Image */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={church}
                      alt="Church Community"
                      className="w-full h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <Play className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-medium">அடுத்த நிகழ்வு</div>
                          <div className="text-sm text-white/80">ஞாயிறு காலை 9:00</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600/20 rounded-full -z-10"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-600/20 rounded-full -z-10"></div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-xl mb-20 p-8 w-full max-w-md mx-auto transform hover:scale-105 transition-all duration-300">
          <div className="border-b border-blue-200 dark:border-gray-700 pb-4 mb-6">
            <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ஜெப உதவிக்காக
            </h1>
          </div>

          <div className="space-y-6">
            {/* Phone Number */}
            <motion.div
              className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 bg-blue-500 rounded-full">
                <Phone size={20} className="text-white" />
              </div>
              <h2 className="text-center text-lg font-medium text-gray-800 dark:text-gray-200">
                +91 8973037151
              </h2>
            </motion.div>

            {/* Social Links */}
            <div className="flex flex-col gap-4">
              {/* Instagram */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  to="https://www.instagram.com/revival_prayer_house?igsh=NzE3cDV3cWM1eWZ2"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Instagram size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    revival_prayer_house
                  </span>
                </Link>
              </motion.div>

              {/* YouTube */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  to="https://www.youtube.com/@vijayforrevival8513"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                    <Youtube size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    vijayforrevival
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl blur-xl"></div>
        </div>

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Home;