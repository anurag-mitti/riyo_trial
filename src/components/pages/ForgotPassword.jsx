import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../Header';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset email');
        return;
      }

      setResetSent(true);
      toast.success('Password reset instructions sent to your email!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
        },
      });
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="mt-10 pt-10 min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 bg-dark-800/50 backdrop-blur-sm p-6 rounded-2xl border border-dark-700">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {!resetSent ? (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-dark-700 bg-dark-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Email address"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-300">
                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
              </p>
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-400 font-medium"
              >
                Return to login
              </Link>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
