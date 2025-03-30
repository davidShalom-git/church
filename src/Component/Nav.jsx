import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/galaxy.png";
import profile from "../assets/profile.png";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
            <Link to="/about" className="text-[16px]  text-white md:text-black md:text-[24px] py-2 md:py-0">
              About
            </Link>
            {/* Profile Section inside Navigation for Mobile */}
            <div className="md:hidden flex justify-center py-2">
              <img src={profile} className="h-10 w-10" alt="Profile" />
            </div>
          </ul>
        </nav>
      </header>
      
      {/* Profile Section - Right on Desktop */}
      <div className="hidden md:flex md:justify-end md:w-auto">
        <img src={profile} className="h-10 w-10" alt="Profile" />
      </div>
    </div>
  );
};

export default Nav;