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
import pas from "../assets/pas.png";

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
    { date: "12 மே", title: "ஞாயிற்று ஆராதனை", time: "காலை 9:00" },
    { date: "15 மே", title: "இளைஞர் சந்திப்பு", time: "மாலை 6:00" },
    { date: "20 மே", title: "விசேஷ ஜெப கூட்டம்", time: "இரவு 8:00" }
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
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
        {/* Navbar */}
        <motion.div 
  className={`fixed top-0 left-0 right-0 z-50 ${
    isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
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
        தேவாலயம்
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
            <Link to="/" className="nav-link text-white text-xl">
              <Globe className="w-4 h-4" /> 
              <span>{item}</span>
            </Link>
          ) : item === "Video" ? (
            <Link to="/video" className="nav-link text-white text-xl">
              <Play className="w-4 h-4" /> 
              <span>{item}</span>
            </Link>
          ) : item === "Events" ? (
            <a href="#event" className="nav-link text-white text-xl">
              <Calendar className="w-4 h-4" /> 
              <span>{item}</span>
            </a>
          ) : (
            <a href="#about" className="nav-link text-white text-xl">
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
            className='relative flex flex-col items-center justify-center h-[90vh] bg-cover bg-center rounded-b-3xl overflow-hidden' 
            style={{ backgroundImage: `url(${church})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-black/70"></div>
            <motion.div 
              className="relative z-10 text-center px-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              ref={heroTextRef}
            >
              <motion.h1 
                className='text-white text-3xl md:text-6xl font-extrabold p-6'
                animate={{ 
                  textShadow: ["0 0 5px rgba(79, 70, 229, 0)", "0 0 15px rgba(79, 70, 229, 0.8)", "0 0 5px rgba(79, 70, 229, 0)"] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {text}
              </motion.h1>
              <motion.p 
                className="text-white/80 text-lg md:text-xl mt-4 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                நம்பிக்கையுடன் கூடிய சமூகத்தில் இணையுங்கள், அன்பு மற்றும் ஆன்மீக வளர்ச்சியால் வழிநடத்தப்படும்.
              </motion.p>
              <motion.div 
                className="mt-8 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/video" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2">
                    <Play size={20} /> ஆராதனை காணொளிகள்
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="#event" className="bg-white hover:bg-gray-100 text-indigo-600 px-6 py-3 rounded-full font-medium transition-colors">
                    நிகழ்ச்சிகள் அறிய
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-0 left-0 w-full"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                <path 
                  fill={darkMode ? "#1f2937" : "#ffffff"} 
                  fillOpacity="1" 
                  d="M0,192L48,170.7C96,149,192,107,288,122.7C384,139,480,213,576,240C672,267,768,245,864,224C960,203,1056,181,1152,170.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                >
                </path>
              </svg>
            </motion.div>
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
                <h3 className="font-bold">அடுத்த சிறப்பு நிகழ்வு: விடுதலை பெருவிழா</h3>
                <p className="text-white/80">மே 28, 2025 - காலை 9:00 முதல்</p>
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
          <div className="max-w-7xl mx-auto px-4 py-16">
            <motion.h2 
              className="text-center text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text dark:from-indigo-400 dark:to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              எங்கள் கொள்கைகள்
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8 cards-container">
              {[
                { 
                  img: pres, 
                  title: "தன்னிலை", 
                  desc: "வளர்ச்சியை ஊக்குவிக்க மாற்றமடைவது. தன்னை அறிந்து தெளிவான உணர்வுடன் வாழ்தல்.",
                  icon: <Heart className="w-8 h-8 text-red-500" />
                },
                { 
                  img: free, 
                  title: "சுதந்திரம்", 
                  desc: "உங்கள் சுதந்திரத்தை அணிந்து, உங்கள் நோக்கத்தை வாழுங்கள். விடுதலையில் மகிழ்ச்சி.",
                  icon: <Globe className="w-8 h-8 text-blue-500" />
                },
                { 
                  img: ignite, 
                  title: "தீப்பிளர்ந்த தருணங்கள்", 
                  desc: "நம்பிக்கையை வளர்க்கும் தருணங்கள். ஒவ்வொரு நாளும் வளர்ச்சிக்கான புதிய வாய்ப்பு.",
                  icon: <Play className="w-8 h-8 text-yellow-500" />
                }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="card-animate group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center transition-all hover:shadow-2xl dark:shadow-indigo-900/20"
                  whileHover={{ y: -8 }}
                >
                  <div className="relative mb-6">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-purple-600/40 rounded-full transition-all"
                      whileHover={{ scale: 1.1 }}
                    ></motion.div>
                    <img 
                      src={item.img} 
                      className="w-32 h-32 rounded-full object-cover z-10 relative border-4 border-white dark:border-gray-700" 
                      alt={item.title} 
                    />
                    <motion.div 
                      className="absolute top-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg"
                      whileHover={{ rotate: 15 }}
                    >
                      {item.icon}
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-center group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                    {item.desc}
                  </p>
                  <motion.button 
                    className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    மேலும் அறிய <ChevronDown size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
          
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
                  வரவிருக்கும் நிகழ்வுகள்
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  எங்கள் சமூகத்துடன் இணைந்து கொண்டாடுங்கள், கற்றுக்கொள்ளுங்கள், வளருங்கள்
                </p>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-6">
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
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{event.time}</p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          to="/video" 
                          className="block w-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-center py-2 rounded-lg font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                        >
                          மேலும் அறிய
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="text-center mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/video" 
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
                  >
                    அனைத்து நிகழ்வுகளையும் காண <ChevronDown size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>
          
          {/* Testimonials with animation */}
          <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
  <div className="max-w-7xl mx-auto px-4">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-5xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
        எங்கள் சமூகம் என்ன சொல்கிறது
      </h2>
      <div className="h-1 w-24 bg-purple-500 mx-auto mb-6 rounded-full"></div>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
        எங்கள் சமூகத்தின் உறுப்பினர்களின் அனுபவங்களைக் கேளுங்கள்
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
          <section id="about" className="py-16 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
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
  className="py-16 px-4"
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
          எங்களுடன் இணைந்து பயணிக்க தயாரா?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          வாராந்திர ஆராதனைகள், விசேஷ கூட்டங்கள், மற்றும் சமூக நிகழ்வுகளில் பங்கேற்று ஆசீர்வாதங்களைப் பெறுங்கள்.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/join" 
              className="group relative inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative">இன்றே இணையுங்கள்</span>
              <ChevronDown className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/schedule" 
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>கால அட்டவணை</span>
            </Link>
          </motion.div>
        </div>

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
        
        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Home;