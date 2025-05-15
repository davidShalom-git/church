import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Calendar, Globe, Heart, ChevronDown, Play, Users, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from './Footer';
import logo from "../assets/galaxy.png";
import profile from "../assets/profile.png";
import pres from '../assets/pres.jpg';
import free from '../assets/freedom.jpg';
import ignite from '../assets/igni.jpg';
import church from "../assets/chruch.jpg";
import thurs from '../assets/thurs.jpg';
import gf from '../assets/gf.jpg';
import pas from "../assets/pas.png";
import cross from '../assets/cross.jpg'

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

  // Refs for scroll animations
  const heroTextRef = useRef(null);
  const aboutRef = useRef(null);
  const gsapContainerRef = useRef(null);

  // Upcoming events data
  const upcomingEvents = [
    { date: "ஏப்ரல் 17 ", title: "குதிரை யுத்தநாளுக்கு ஆயத்தமாக்கப்படும்; ஜெயமோ கர்த்தரால் வரும்", verse: "நீதிமொழிகள் 21:31"},
    { date: "April 17", title: "The horse is made ready for the day of battle, but victory belongs to the Lord", verse: "Proverbs 21:31" },
  ];

  // Testimonials data
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen w-full`}>
      {/* Apply background color directly to the body tag */}
      <style jsx global>{`
        body {
          background: ${darkMode ? 
            'linear-gradient(to bottom, #111827, #1f2937)' : 
            'linear-gradient(to bottom, #ffffff, #eff6ff)'};
          min-height: 100vh;
          width: 100%;
        }
      `}</style>
      
      <div className="bg-white dark:bg-gray-900 min-h-screen w-full transition-colors duration-300">
        {/* Navbar */}
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
            } transition-all duration-300`}
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
                    <Link to="/" className="nav-link text-gray-800 dark:text-white text-xl">
                      <Globe className="w-4 h-4" />
                      <span>{item}</span>
                    </Link>
                  ) : item === "Video" ? (
                    <Link to="/video" className="nav-link text-gray-800 dark:text-white text-xl">
                      <Play className="w-4 h-4" />
                      <span>{item}</span>
                    </Link>
                  ) : item === "Events" ? (
                    <a href="#event" className="nav-link text-gray-800 dark:text-white text-xl">
                      <Calendar className="w-4 h-4" />
                      <span>{item}</span>
                    </a>
                  ) : (
                    <a href="#about" className="nav-link text-gray-800 dark:text-white text-xl">
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
                onClick={handleLogout}
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
              className="fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-24 px-6"
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <a href='https://www.youtube.com/watch?v=91FYRePs40g&list=PLFAPPjda8gQdZ-e-F7eC49pXb5wpV5O_Z' className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/0 via-indigo-300/20 to-indigo-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <Play size={18} className="text-amber-300" />
                    <span>நேரடி ஜெப ஆராதனை</span>
                  </a>
                </motion.div>
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
                <h3 className="font-bold">அடுத்த சிறப்பு நிகழ்வு: இராப்போஜன ஆராதனை </h3>
                <p className="text-white/80">ஏப்ரல் 17, 2025 - மாலை 6:30 </p>
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

          {/* Upcoming Events Section with animations */}
          <section id="event" className="py-16 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
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
                      <h4 className="text-xl font-bold mb-2 dark:text-white">{event.title}</h4>
                      <h5 className="text-[15px] font-bold mb-2 dark:text-white mt-5">{event.verse}</h5>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="text-center mt-10"
                initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  to="/events"
                  className="inline-block mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-full transition-colors"
                >
                  அனைத்து நிகழ்வுகளையும் காண
                </Link>
              </motion.div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="order-2 md:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="about-animate text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400">
                  எங்களைப் பற்றி
                </h2>
                <p className="about-animate text-gray-700 dark:text-gray-300 mb-4">
                  எழுப்புதலின் ஜெப வீடு என்பது ஒரு வலுவான விசுவாசத்தின் சமூகமாகும், இது கிறிஸ்துவின் அன்பைப் பிரதிபலிக்கும் வகையில் கடவுளை வணங்குவதற்கும் சேவை செய்வதற்கும் அர்ப்பணிக்கப்பட்டுள்ளது.
                </p>
                <p className="about-animate text-gray-700 dark:text-gray-300 mb-4">
                  நாங்கள் இயேசுவை மையமாகக் கொண்ட, வேதாகமத்தை அடிப்படையாகக் கொண்ட மற்றும் ஆவியால் நிரப்பப்பட்ட சபை சார்ந்த அனுபவத்தை வழங்குகிறோம், இது ஒவ்வொரு நபரும் கடவுளின் அன்பையும் கிருபையையும் உணர அனுமதிக்கிறது.
                </p>
                <p className="about-animate text-gray-700 dark:text-gray-300">
                  நாங்கள் சேவை செய்யும் சமூகத்திற்கு நேர்மறையான மாற்றத்தைக் கொண்டு வருவதற்கும், அனைத்து நிலைகளிலும் உள்ள மக்களின் ஆன்மீக வளர்ச்சியை ஊக்குவிப்பதற்கும் எங்களை அர்ப்பணித்துள்ளோம்.
                </p>
              </motion.div>

              <motion.div
                className="order-1 md:order-2 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={pas}
                  alt="Our Church"
                  className="rounded-lg shadow-xl max-w-full h-auto"
                />
              </motion.div>
            </div>
          </section>

          {/* Scripture with Image Parallax */}
          <motion.section
            className="relative py-24 bg-fixed bg-cover bg-center h-[60vh] flex items-center justify-center"
            style={{ backgroundImage: `url(${cross})` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mb-6"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                "அன்றியும், ஒருவர் பாவங்களை மறுபடியும் நினையாதிருப்பேன் என்றும் சொல்லியிருக்கிறார்."
              </motion.h2>
              <motion.p
                className="text-xl text-amber-300 font-medium"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                - எபிரெயர் 10:17
              </motion.p>
            </div>
          </motion.section>

          {/* Featured Ministers Grid */}
          <section className="py-16 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400">
                  சபை நிகழ்வு புகைப்படங்கள்
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Featured Image 1 */}
                <motion.div
                  className="card-animate relative overflow-hidden rounded-xl shadow-lg group"
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={ignite}
                    alt="Minister"
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold"> ‭இக்னைட்‬ (5வது செவ்வாய் இளைஞர் ஆராதனை)</h3>
                      <p className="text-gray-300"></p>
                    </div>
                  </div>
                </motion.div>

                {/* Featured Image 2 */}
                <motion.div
                  className="card-animate relative overflow-hidden rounded-xl shadow-lg group"
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <img
                    src={thurs}
                    alt="Minister"
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold">வியாழன் ஜெப ஆராதனை</h3>
                      <p className="text-gray-300"></p>
                    </div>
                  </div>
                </motion.div>

                {/* Featured Image 3 */}
                <motion.div
                  className="card-animate relative overflow-hidden rounded-xl shadow-lg group"
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img
                    src={free}
                    alt="Minister"
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold">பரிசுத்த அன்னியபாஷை ஜெபம்</h3>
                      <p className="text-gray-300"></p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400">
                  சாட்சிகள்
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                  கடவுள் எங்கள் சபையில் உள்ள மக்களின் வாழ்க்கையில் என்ன செய்துள்ளார் என்பதைக் கேளுங்கள்.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 testimonials-container">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="testimonial-animate bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-indigo-300"
                      />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="mt-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <Heart
                          key={i}
                          size={16}
                          className="text-amber-400 fill-amber-400 mr-1"
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                எங்களுடன் சேர்ந்து கடவுளை வணங்குங்கள்
              </motion.h2>
              <motion.p
                className="text-xl max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
               கடவுளின் அன்பையும் வல்லமையையும் அனுபவிக்க இன்றே எங்களுடன் இணையுங்கள்.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link
                  to="/contact"
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-full font-medium inline-block transition-colors"
                >
                  தொடர்பு கொள்ளுங்கள்
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;