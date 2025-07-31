import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import church from "../assets/chruch.jpg";
import DynamicVideoButton from '../Component/Live';


const HeroSection = () => {
  const [text, setText] = useState('');
  const fullText = "🔥 எழுப்புதலின் ஜெப வீடு🔥";
  const timeoutRef = useRef(null);

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

  return (
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
    </motion.div>
  );
};

export default HeroSection;