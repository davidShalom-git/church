import { motion } from "framer-motion";
import profile from "../assets/profile.png";

const TestimonialsComponent = () => {
  const testimonials = [
    { name: "ராஜா", text: "இந்த தேவாலயம் என் வாழ்க்கையை முற்றிலும் மாற்றியது. நான் ஒரு புதிய நபராக உணர்கிறேன்.", image: profile },
    { name: "கவிதா", text: "அன்புள்ள சமூகம், அற்புதமான போதனைகள். என் குடும்பத்திற்கு இது ஒரு வரப்பிரசாதம்.", image: profile },
    { name: "ஜான்", text: "இங்கே நான் கண்டுபிடித்த ஆன்மீக வளர்ச்சி மிகவும் நிறைவாக இருந்தது.", image: profile }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
            சாட்சிகள்
          </h2>
          <div className="h-1 w-24 bg-purple-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            தேவன் செய்த அற்புதங்கள் மற்றும் அடையாளங்கள்
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
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
                    <motion.svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-amber-500 fill-current"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + i * 0.1, duration: 0.3 }}
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </motion.svg>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots (Optional) */}
        <motion.div 
          className="flex justify-center mt-12 space-x-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.button
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i === 0 ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600 hover:bg-indigo-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsComponent;