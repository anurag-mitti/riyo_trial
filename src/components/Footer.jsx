import React from 'react';
import { motion } from 'framer-motion';
import {  Instagram,  Mail, Phone, MapPin } from 'lucide-react';
import logo_dark from './images/logo_dark.png'; 

const Footer = () => {
  return (
    <footer className="bg-dark-800 pt-16 pb-8 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img src={logo_dark} alt="Logo" className="h-10 w-auto sm:h-12 md:h-16 mr-2" />
              
            </div>
            
            <p className="text-gray-400 mb-6">
              Elevate your salon experience with our premium services and seamless booking platform.
            </p>
            
            <div className="flex space-x-4">
              <SocialLink icon={<Instagram size={18} />} href="https://www.instagram.com/riyoshi.app/profilecard/?igsh=MW12NzdkMnh2NWt2aQ=="    
              />
              
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="#services">Our Services</FooterLink>
              <FooterLink href="#how-it-works">How It Works</FooterLink>
              <FooterLink href="#testimonials">Testimonials</FooterLink>
              <FooterLink href="#book-now">Book Appointment</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Haircuts & Styling</FooterLink>
              <FooterLink href="#">Color & Highlights</FooterLink>
              <FooterLink href="#">Extensions & Treatments</FooterLink>
              <FooterLink href="#">Bridal Services</FooterLink>
              <FooterLink href="#">Spa Packages</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-400 mr-3 mt-0.5" />
                <span className="text-gray-400">BIT Mesra, Ranchi</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary-400 mr-3" />
                <span className="text-gray-400">+91 </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary-400 mr-3" />
                <span className="text-gray-400">riyoshi.salon@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center md:flex md:justify-between md:items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Riyoshi. All rights reserved.
          </p>
          
          <div className="flex justify-center md:justify-end space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-400 hover:text-primary-400 transition-colors"
    >
      {children}
    </a>
  </li>
);

const SocialLink = ({ href, icon }) => (
  <motion.a
    href={href}
    className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-colors"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {icon}
  </motion.a>
);

export default Footer;