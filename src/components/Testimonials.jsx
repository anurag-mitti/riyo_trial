import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Regular Client",
    image: "https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote: "Riyoshi made booking my salon appointments so easy! The staff is friendly and I always leave feeling refreshed. Highly recommended for anyone in India looking for a hassle-free experience.",
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "First-time Visitor",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote: "I was able to book my haircut in seconds and didn't have to wait at all. The barbers are professional and the environment is very clean. Will definitely come back!",
    rating: 5
  },
  {
    id: 3,
    name: "Sneha Patel",
    role: "Monthly Subscriber",
    image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300",
    quote: "I love the convenience Riyoshi offers. I can choose my favorite stylist and time slot. The service is top-notch and perfect for my busy schedule.",
    rating: 5
  },
  {
    id: 4,
    name: "Amit Singh",
    role: "Regular Client",
    image: "https://images.pexels.com/photos/938639/pexels-photo-938639.jpeg",
    quote: "The booking system is very user-friendly and the staff is always welcoming. Riyoshi has become my go-to for all grooming needs.",
    rating: 4
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section id="testimonials" className="py-20 relative">
      {/* Background accents */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Hear from our satisfied clients about their experience with Riyoshi's salon services and booking platform.</p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-primary-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <motion.div
                key={testimonials[activeIndex].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonials[activeIndex].name}</h4>
                    <p className="text-gray-400 text-sm">{testimonials[activeIndex].role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${i < testimonials[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-300 italic">"{testimonials[activeIndex].quote}"</p>
              </motion.div>
              
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-primary-500' : 'bg-gray-600'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex justify-between mt-4">
                <button 
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;