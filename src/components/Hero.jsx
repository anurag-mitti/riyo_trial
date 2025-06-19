import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const cursorRef = useRef(null);
  const taglineRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleMouseMove = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`;
        cursorRef.current.style.top = `${event.clientY}px`;
      }
      
      if (taglineRef.current) {
        const rect = taglineRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        taglineRef.current.style.setProperty('--x', `${x}px`);
        taglineRef.current.style.setProperty('--y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div 
        ref={cursorRef} 
        className="fixed w-40 h-40 rounded-full bg-secondary-500/10 pointer-events-none blur-xl transform -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block"
      ></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
              <span className="text-white">Your style.</span>
              <br />
              <span 
                ref={taglineRef}
                className="text-transparent bg-clip-text relative"
                style={{ backgroundImage: 'linear-gradient(to right, #a259ff, #a259ff)' }}

              >
                No queue, just you.
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0">
              Book your salon appointments instantly with personalized services tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
             <motion.button
             onClick={() => navigate('/discover')}
             className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all font-medium shadow-lg hover:shadow-primary-600/30 text-lg w-full sm:w-auto text-center"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
               type="button"
                >
             
      Dicover Salons       </motion.button>
              
              <motion.button
                type="button"
                className="inline-block px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white rounded-full transition-all font-medium text-lg w-full sm:w-auto text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const section = document.getElementById('how-it-works');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                How it works
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* <div className="rounded-2xl overflow-hidden bg-dark-800/50 backdrop-blur-lg border border-white/10 p-6 shadow-xl">
                <h3 className="text-xl font-medium mb-4 text-center">Quick Booking</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center bg-dark-700 rounded-lg p-3">
                    <User className="text-primary-400 mr-3" size={20} />
                    <input 
                      type="text" 
                      placeholder="Your Location"
                      className="bg-transparent w-full focus:outline-none text-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center bg-dark-700 rounded-lg p-3">
                    <Calendar className="text-primary-400 mr-3" size={20} />
                    <input 
                      type="date" 
                      className="bg-transparent w-full focus:outline-none text-gray-300"
                    />
                  </div>
                  
                  <motion.button
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Find Available Slots
                  </motion.button>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-500/20 rounded-full blur-xl"></div> */}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 md:mt-24"
        >
          <StatCard value="250+" label="Happy Clients" />
          <StatCard value="15+" label="Expert Stylists" />
          <StatCard value="20+" label="Services" />
          <StatCard value="4.9" label="Average Rating" />
        </motion.div>
      </div>
    </section>
  );
};

const StatCard = ({ value, label }) => (
  <div className="text-center p-4 rounded-xl bg-dark-800/50 backdrop-blur-sm border border-white/5">
    <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">{value}</p>
    <p className="text-gray-400 text-sm md:text-base">{label}</p>
  </div>
);

export default Hero;