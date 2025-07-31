import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Menu, X, Calendar, Globe, Play, Users, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from './Footer';
import logo from "../assets/galaxy.png";
import profile from "../assets/profile.png";
import HeroSection from '../Pages/HeroSection';
import DailyPromisesComponent from '../Pages/DailyPromise';
import EventsComponent from '../Pages/Event';
import TestimonialsComponent from '../Pages/Testimonial';
import AboutSection from '../Pages/About';
import CTASection from '../Pages/CTA';
import ContactSection from '../Pages/Contact';
import Video from '../Pages/Video';

// Import the new components

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
      <div className="min-h-screen bg-blue-100 dark:bg-gray-800 transition-colors duration-300">
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
          {/* Hero Section */}
          <HeroSection />

          {/* Daily Promises Section */}
          <div id="event">
            <DailyPromisesComponent />
          </div>

          {/* Events Section */}
          <EventsComponent />

          <Video />

          {/* Testimonials Section */}
          <TestimonialsComponent />

          {/* About Section */}
          <AboutSection />

          {/* Call to Action Section */}
          <CTASection />

          {/* Contact Section */}
          <ContactSection />
        </div>

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Home;