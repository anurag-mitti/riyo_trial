import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

const NotFound = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary-500/25"
          >
            <span className="font-medium">Back to Home</span>
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound; 