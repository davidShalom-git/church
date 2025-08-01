import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Instagram, Youtube, Globe } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 flex justify-center">
      <motion.div 
        className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-xl p-8 w-full max-w-md mx-auto transform hover:scale-105 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
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
            <motion.div 
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
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
            <motion.div 
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                to="https://www.youtube.com/@vijayforrevival8513"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                  <Youtube size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  vijay_for_revival
                </span>
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                to="https://www.revivalprayerhouse.online"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                  <Globe size={20} className="text-white" />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  vijay_for_revival
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl blur-xl"></div>
      </motion.div>
    </section>
  );
};

export default ContactSection;