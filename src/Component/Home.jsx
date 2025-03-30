import React, { useState, useEffect, useRef } from 'react';
import free from '../assets/freedom.jpg'
import pres from '../assets/pres.jpg'
import ignite from '../assets/igni.jpg'
import Footer from './Footer';
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/galaxy.png";
import profile from "../assets/profile.png";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [text, setText] = useState('');
  const fullText = "🔥 Revival Festival 🔥";
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const typeEffect = () => {
      if (indexRef.current < fullText.length) {
        setText(fullText.substring(0, indexRef.current + 1));
        indexRef.current++;
        timeoutRef.current = setTimeout(typeEffect, 150);
      } else {
        timeoutRef.current = setTimeout(() => {
          setText('');
          indexRef.current = 0;
          typeEffect();
        }, 2000);
      }
    };

    typeEffect();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setAuthStatus(false); // Update authentication state immediately
    navigate('/login'); // Redirect to login page
};



  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center p-3 w-[90%] rounded-3xl mx-auto mt-5  bg-yellow-300 shadow-md">
      <div className="flex items-center w-full md:w-auto justify-between">
        {/* Logo Section */}
        <img src={logo} className="h-10 w-10 animate-spin" alt="Logo" />
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </div>
      </div>

      {/* Navigation Section */}
      <header
        className={`${
          isOpen ? "block" : "hidden"
        } md:flex md:w-auto bg-blue-950 rounded-[20px] p-3 mt-3 md:mt-0 w-full md:bg-transparent flex flex-col md:flex-row items-center md:mx-auto`}
      >
        <nav>
          <ul className="flex flex-col md:flex-row md:space-x-5 text-center">
            <Link to="/" className="text-[16px] ] text-white md:text-black md:text-[24px] py-2 md:py-0">
              Home
            </Link>
            <Link to="/video" className="text-[16px]  text-white md:text-black md:text-[24px] py-2 md:py-0">
              Video
            </Link>
            <a href="#event" className="text-[16px]  text-white md:text-black md:text-[24px] py-2 md:py-0">
              Events
            </a>
            <a href='#about' className="text-[16px]  text-white md:text-black md:text-[24px] py-2 md:py-0">
              About
            </a>
            {/* Profile Section inside Navigation for Mobile */}
            <div className="md:hidden flex justify-center py-2">
              <img src={profile} className="h-10 w-10" alt="Profile" onClick={handleLogout}/>
              
            </div>
          </ul>
        </nav>
      </header>
      
      {/* Profile Section - Right on Desktop */}
      <div className="hidden md:flex md:justify-end md:w-auto">
    <img src={profile} className="h-10 w-10 cursor-pointer" alt="Profile" onClick={handleLogout} />
</div>
    </div>
      <div className='flex flex-col items-center justify-center h-[70vh]'>
        <h1 className='text-white text-3xl md:text-7xl font-extrabold'>{text}</h1>
       
      </div>
      
      <div className="flex flex-wrap justify-around items-center space-y-3 mx-auto mb-10 px-24">
  {/* Card 1 */}
  <div className="bg-white p-8 h-[300px] w-[250px] rounded-2xl shadow-lg flex flex-col items-center">
    <img src={pres} className="w-40 h-40 rounded-full mb-4" alt="Presentation" />
    <h2 className="text-lg font-bold mb-2">Presence</h2>
    <p className="text-sm text-gray-500 text-center">A transformative experience to inspire growth.</p>
  </div>

  {/* Card 2 */}
  <div className="bg-white p-8 h-[300px] w-[250px]  rounded-2xl shadow-lg flex flex-col items-center">
    <img src={free} className="w-40 h-40 rounded-full mb-4" alt="Freedom" />
    <h2 className="text-lg font-bold mb-2">Freedom</h2>
    <p className="text-sm text-gray-500 text-center">Embrace your freedom and live your purpose.</p>
  </div>

  {/* Card 3 */}
  <div className="bg-white p-8 h-[300px] w-[250px] rounded-2xl shadow-lg flex flex-col items-center">
    <img src={ignite} className="w-40 h-40 rounded-full mb-4" alt="Ignite" />
    <h2 className="text-lg font-bold mb-2">Ignite Moments</h2>
    <p className="text-sm text-gray-500 text-center">Spark change and ignite your passion.</p>
  </div>
</div>

<h1 className='text-center text-black mt-24 font-extrabold text-4xl md:text-5xl bg-yellow-300 md:w-[25%] w-[50%] mx-auto rounded-3xl p-2' id='about'>Church</h1>
<div className="flex flex-col justify-center items-center bg-gray-50 w-[90%] mx-auto mt-20 p-8 mb-10 rounded-lg shadow-lg gap-10">
  {/* Image Section */}
  <div className="flex flex-col items-center">
    <h1 className="text-center font-semibold text-2xl mb-4">ALC</h1>
    <img src={pres} className="w-[90%] md:w-[80%] rounded-xl shadow-lg border border-gray-200" alt="Presentation" />
  </div>

  {/* Text Section */}
  <div className="flex flex-col items-center text-center px-6">
    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Transform Your Journey</h2>
    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi cumque amet magnam soluta voluptatum doloribus quis, esse asperiores aliquam dolor optio architecto id repellat molestiae illo obcaecati perspiciatis rem facere placeat natus fuga ut in ipsa quae. Nulla harum accusantium hic ipsum reprehenderit aspernatur sed porro aperiam dolorum, maiores labore quibusdam cum!
    </p>
    <button className="mt-6 py-3 px-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
      Learn More
    </button>
  </div>
</div>
<h1 className='text-center text-black mt-24 font-extrabold text-4xl md:text-5xl bg-yellow-300 md:w-[25%] w-[50%] mx-auto rounded-3xl p-2'>About</h1>


<div className="flex flex-col md:flex-row justify-center mx-5 mb-20 items-center gap-6 bg-gray-100 mt-20 p-12 rounded-lg shadow-md">
  {/* Image Section */}
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
  
    <img src={pres} className="w-[80%] md:w-full rounded-lg shadow-lg" alt="Presentation" />
  </div>

  {/* Text Section */}
  <div className="w-full md:w-1/2">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Richard (Man of God)</h2>
    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi cumque amet magnam soluta voluptatum doloribus quis, esse asperiores aliquam dolor optio architecto id repellat molestiae illo obcaecati perspiciatis rem facere placeat natus fuga ut in ipsa quae. Nulla harum accusantium hic ipsum reprehenderit aspernatur sed porro aperiam dolorum, maiores labore quibusdam cum! Aspernatur necessitatibus sapiente soluta neque omnis architecto itaque, unde nemo fugit esse officia aliquam fuga cum nam nesciunt hic sint consequatur accusamus voluptatem deserunt. Consequuntur incidunt veritatis assumenda recusandae, nisi vel repellendus officiis a rem placeat perferendis numquam repudiandae tenetur rerum nulla pariatur accusantium quia? Ipsa, corporis voluptate.
    </p>
  </div>
</div>

<h1 className='text-center text-black mt-24 font-extrabold text-4xl md:text-5xl bg-yellow-300 md:w-[25%] w-[50%] mx-auto rounded-3xl p-2' id='event'>Events</h1>

<div className="flex flex-col md:flex-row mb-20 justify-center items-center gap-12 mt-20">
  {/* Circle 1 */}
  <div className="flex items-center justify-center bg-yellow-300 h-60 w-60 rounded-full shadow-lg">
    <Link to='/video' className="text-center text-xl font-bold text-gray-800">Sunday Service</Link>
  </div>
<div className="flex flex-col md:flex-row mb-20 justify-center items-center gap-12 mt-20">
  {/* Circle 1 */}
  <div className="flex items-center justify-center bg-yellow-300 h-60 w-60 rounded-full shadow-lg">
    <Link to='/morning' className="text-center text-xl font-bold text-gray-800">Daily Bread</Link>
  </div>
</div>
</div>


<Footer />

    </>
  );
};

export default Home;