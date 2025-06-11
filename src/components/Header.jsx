import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import logo_dark from './images/logo_dark.png'; 

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-dark-800/90 backdrop-blur-md py-3 shadow-lg' 
      : 'bg-transparent py-6'
  }`;

  const navVariants = {
    open: { opacity: 1, height: 'auto', display: 'block' },
    closed: { opacity: 0, height: 0, transitionEnd: { display: 'none' } }
  };

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/">
              <img 
                src={logo_dark} 
                alt="Logo" 
                className="h-10 w-auto sm:h-12 md:h-16 mr-2 cursor-pointer" 
              />
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup"
                className="px-4 py-2 text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
              >
                Sign Up
              </Link>
              <BookButton />
            </div>
          </motion.nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">Menu</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`w-full h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <motion.nav 
          className="md:hidden mt-4"
          initial="closed"
          animate={menuOpen ? "open" : "closed"}
          variants={navVariants}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 py-4">
            <MobileNavLink href="#services" onClick={() => setMenuOpen(false)}>Services</MobileNavLink>
            <MobileNavLink href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</MobileNavLink>
            <MobileNavLink href="#testimonials" onClick={() => setMenuOpen(false)}>Testimonials</MobileNavLink>
            <Link 
              to="/login" 
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
            <BookButton isMobile />
          </div>
        </motion.nav>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }) => (
  <a 
    href={href} 
    className="text-gray-300 hover:text-white transition-colors relative group"
  >
    {children}
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
  </a>
);

const MobileNavLink = ({ href, children, onClick }) => (
  <a 
    href={href} 
    className="text-gray-300 hover:text-white transition-colors py-2"
    onClick={onClick}
  >
    {children}
  </a>
);

const BookButton = ({ isMobile }) => (
  <motion.a
    href="/discover"
    className={`inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all font-medium shadow-lg hover:shadow-primary-600/30 ${
      isMobile ? 'w-full text-center mt-2' : ''
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Discover
  </motion.a>
);

export default Header;