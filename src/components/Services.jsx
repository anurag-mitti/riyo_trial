import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Paintbrush, Sparkles, Smile, SunMedium, Coffee } from 'lucide-react';

const Services = () => {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="services" className="py-20 relative">
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Discover our range of salon services designed to enhance your natural beauty and provide the ultimate relaxation experience.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={<Scissors />}
            title="Precision Haircuts"
            description="Expert cuts tailored to your face shape and personal style, with attention to every detail."
          />
          
          <ServiceCard
            icon={<Paintbrush />}
            title="Color Transformation"
            description="From subtle highlights to bold fashion colors, our colorists create stunning, long-lasting results."
          />
          
          <ServiceCard
            icon={<Sparkles />}
            title="Hair Treatments"
            description="Rejuvenate your hair with premium conditioning treatments for ultimate shine."
          />
          
          <ServiceCard
            icon={<Smile />}
            title="Styling & Blowouts"
            description="Perfect your look with expert styling for any occasion, from casual to formal events."
          />
          
          <ServiceCard
            icon={<SunMedium />}
            title="Extensions & Texturing"
            description="Add volume, length or texture with our premium hair extension and texturing services."
          />
          
          <ServiceCard
            icon={<Coffee />}
            title="Complete Experience"
            description="Enjoy complimentary beverages and head massage with every service for complete relaxation."
          />
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a
            href="#book-now"
            className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all font-medium shadow-lg hover:shadow-primary-600/30 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Services
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, description }) => (
  <div className="reveal group rounded-2xl bg-dark-800/50 backdrop-blur-sm border border-white/5 p-6 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10">
    <div className="w-14 h-14 rounded-full bg-primary-900/50 flex items-center justify-center mb-5 text-primary-400 group-hover:text-primary-300 transition-colors">
      {icon}
    </div>
    
    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-300 transition-colors">{title}</h3>
    <p className="text-gray-400">{description}</p>
    
    <div className="mt-4 pt-4 border-t border-white/5">
      <a href="#book-now" className="text-primary-400 hover:text-primary-300 font-medium flex items-center">
        Book Service
        <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  </div>
);

export default Services;