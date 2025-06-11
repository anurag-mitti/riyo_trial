import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '../supabaseClient.js'
import GoogleSignin from './GoogleSignin.jsx' // Adjust the path if needed

export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        toast.error(error.message || 'Login failed')
        return
      }

      toast.success('Login successful!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
        },
      })

      navigate('/discover')
    } catch (error) {
      console.error('Error logging in:', error)
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <div className="mt-10 pt-10 min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 bg-dark-800/50 backdrop-blur-sm p-6 rounded-2xl border border-dark-700">
          <div>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-500 hover:text-primary-400">
                Sign up
              </Link>
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 border border-dark-700 bg-dark-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 border border-dark-700 bg-dark-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-400">
                Forgot your password?
              </Link>
            </div>

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Google Login Button */}
              <GoogleSignin />
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </>
  )
}
