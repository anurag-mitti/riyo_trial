import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Signup from './components/pages/SignUp';
import BookingPage from './components/pages/BookingPage';
import UserBookingHistory from './components/pages/UserBookingHistory';
import Discover from './components/pages/Discover';
import NotFound from './components/pages/NotFound';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import TermsAndConditions from './components/pages/TermsAndConditions';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import RefundPolicy from './components/pages/RefundPolicy';
import AboutUs from './components/pages/AboutUs';
import ContactUs from './components/pages/ContactUs';
import './index.css';

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
        limit={2}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/book/salon/:salonId" element={<BookingPage />} />
        <Route path="/booking-history" element={<UserBookingHistory />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;