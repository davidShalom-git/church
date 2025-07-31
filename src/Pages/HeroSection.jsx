import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import church from "../assets/chruch.jpg";
import DynamicVideoButton from "../Component/Live";

const HeroSection = () => {
  const [text, setText] = useState('');
  const fullText = "🔥 எழுப்புதலின் ஜெப வீடு🔥";
  const timeoutRef = useRef(null);

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
      className="relative flex flex-col items-center justify-center min-h-[90vh] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${church})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Dramatic colored overlay + bevel for lively contrast */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#181D35]/70 via-[#141724]/20 to-[#181D35]/90" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0" style={{
          boxShadow: 'inset 0 0 90px 8px #14162C'
        }} />
        {/* Subtle noise overlay can be added here for texture */}
      </div>

      {/* Optional: Add glowing rays for effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[100vh] bg-gradient-radial from-amber-200/15 via-transparent to-transparent blur-2xl rounded-full" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto text-center px-6 py-12 bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl ring-2 ring-amber-900/10"
        initial={{ scale: 0.93, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        {/* Reference line and verse */}
        <motion.div className="flex items-center justify-center gap-3 mb-4">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300" />
          <span className="text-amber-400 font-bold text-xs tracking-widest drop-shadow">நீதிமொழிகள் 21:31</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300" />
        </motion.div>

        {/* Verse with glow */}
        <h2 className="text-2xl md:text-3xl font-semibold leading-normal text-white drop-shadow-[0_1px_8px_rgba(251,191,36,0.25)] mb-7">
          குதிரை யுத்தநாளுக்கு ஆயத்தமாக்கப்படும், ஜெயமோ கர்த்தரால் வரும்.
        </h2>

        {/* Animated heading */}
        <h1 className="text-3xl md:text-5xl font-black text-transparent mb-5 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text py-2 drop-shadow-lg select-none">
          {text}
        </h1>

        {/* Highlighted message */}
        <p className="text-white/90 text-lg md:text-xl mb-10 mt-2 font-medium">
          உன் விண்ணப்பத்தைக் கேட்டேன், உன் கண்ணீரைக் கண்டேன்.
        </p>

        {/* CTA - buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
          <DynamicVideoButton />
          <a
            href="#event"
            className="relative bg-gradient-to-r from-amber-400 via-amber-200 to-white px-7 py-3 md:px-9 md:py-4 rounded-xl font-bold text-lg text-[#212146] shadow-md group overflow-hidden transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
            நிகழ்ச்சிகள் அறிய
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
