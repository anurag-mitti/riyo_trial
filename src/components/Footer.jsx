import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
              <SocialLink icon={<Instagram size={18} />} href="https://www.instagram.com/riyoshi.app/profilecard/?igsh=MW12NzdkMnh2NWt2aQ==" />
              <SocialLink icon={<svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>} href="https://www.linkedin.com/company/riyoshi/" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about-us" 
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact-us" 
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Door No 48/7 Ward No 22, Saraswathi Nilaya, Opp Anupama Nursing Home, Gandhinagar, PO: Bellari Gandhinagar, DIST: Ballari, Karnataka - 583103
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">+91 9686579789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
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
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-gray-300 transition-colors">Refund Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
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