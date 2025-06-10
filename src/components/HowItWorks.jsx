import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Scissors, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-dark-800 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-900/20 to-transparent opacity-70"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Booking your salon appointment with Riyoshi is simple and seamless. Follow these easy steps to secure your spot.</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            number={1}
            icon={<Calendar className="w-8 h-8" />}
            title="Choose Your Service"
            description="Browse our extensive menu of premium salon services and select the one that suits your needs."
            delay={0}
          />
          
          <StepCard 
            number={2}
            icon={<Clock className="w-8 h-8" />}
            title="Pick a Date & Time"
            description="Select from available time slots that work with your schedule for a convenient appointment."
            delay={0.2}
          />
          
          <StepCard 
            number={3}
            icon={<Scissors className="w-8 h-8" />}
            title="Select Your Stylist"
            description="Choose from our team of expert stylists based on their specialties and availability."
            delay={0.4}
          />
          
          <StepCard 
            number={4}
            icon={<CheckCircle className="w-8 h-8" />}
            title="Confirm & Relax"
            description="Receive instant confirmation and reminder notifications. Just arrive and enjoy your service."
            delay={0.6}
          />
        </div>
        
        <motion.div 
          className="mt-16 text-center bg-dark-700/50 backdrop-blur-sm rounded-2xl p-8 border border-white/5 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Ready to experience luxury?</h3>
          <p className="text-gray-400 mb-6">Book your first appointment today and enjoy 15% off your service.</p>
          
          <motion.a
            href="#book-now"
            className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-all font-medium shadow-lg hover:shadow-primary-600/30 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Your Appointment
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

const StepCard = ({ number, icon, title, description, delay }) => (
  <motion.div 
    className="rounded-2xl bg-dark-700/50 backdrop-blur-sm border border-white/5 p-6 relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg">
      {number}
    </div>
    
    <div className="mb-5 text-primary-400">
      {icon}
    </div>
    
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default HowItWorks;