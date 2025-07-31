import { motion } from "framer-motion";
import pas from "../assets/pas.png";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-gradient-to-b from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
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

            {/* Church Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { number: "20+", label: "ஆண்டுகள்" },
                { number: "1000+", label: "உறுப்பினர்கள்" },
                { number: "50+", label: "நிகழ்வுகள்" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
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
            </motion.div>
          </motion.div>

          <motion.div
            className="about-animate relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src={pas}
                alt="Pastor"
                className="rounded-2xl shadow-2xl w-full h-auto z-10 relative transform transition-transform duration-300 hover:scale-105"
              />
              
              {/* Pastor Info Card */}
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg max-w-xs"
                initial={{ opacity: 0, x: 20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-lg font-bold mb-1 dark:text-white">பேஸ்டர் ஜான்</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  "அன்பு மற்றும் அக்கறையுடன் உங்களை வரவேற்கிறோம்"
                </p>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div 
                className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-600/20 rounded-full z-0"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360] 
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              ></motion.div>
              
              <motion.div 
                className="absolute bottom-20 left-0 w-16 h-16 bg-purple-600/20 rounded-full z-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [360, 180, 0] 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              ></motion.div>

              {/* Additional decorative elements */}
              <div className="absolute top-10 right-10 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute bottom-32 right-20 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-40 animate-bounce"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;