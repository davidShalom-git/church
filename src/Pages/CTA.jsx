import { motion } from "framer-motion";
import { Play } from "lucide-react";
import church from "../assets/chruch.jpg";

const CTASection = () => {
  return (
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
                  whileHover={{ scale: 1.05 }}
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
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <div className="font-medium">அடுத்த நிகழ்வு</div>
                    <div className="text-sm text-white/80">ஞாயிறு காலை 9:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600/20 rounded-full -z-10"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            ></motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-600/20 rounded-full -z-10"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [360, 180, 0] 
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;