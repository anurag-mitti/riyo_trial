import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/pages/Home';
import Discover from './components/pages/Discover';
import SignUp from './components/pages/SignUp';
import Login from './components/pages/Login';
import BookingPage from './components/pages/BookingPage';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
        containerStyle={{
          top: 20,
        }}
        limit={2}
      />
      <Router>
        <Routes>
          <Route path="/book/salon/:salonId" element={<BookingPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;