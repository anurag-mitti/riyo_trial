import { useState, useEffect } from 'react'
import { supabase } from "../supabaseClient.js";


import toast, { Toaster } from 'react-hot-toast'
import GoogleSignin from './GoogleSignin.jsx'
 

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session)

      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (checkError && !checkError.message.includes('No rows found')) {
            throw checkError
          }

          if (!existingUser) {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  created_at: new Date().toISOString()
                }
              ])

            if (insertError) {
              console.error('Insert error:', insertError)
              throw insertError
            }

            toast.success('User profile created successfully!', {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            })
          }
        } catch (error) {
          console.error('Database error:', error)
          toast.error('Error creating user profile')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message || 'Signup error')
        return
      }

      toast.success(`Verification email sent to ${formData.email}`)
      setFormData({ email: '', password: '', confirmPassword: '', phone: '' })

    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An error occurred during signup')
    } finally {
      setIsLoading(false)
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
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-primary-500 hover:text-primary-400">
                Sign in
              </a>
            </p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
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
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-dark-700 bg-dark-900/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-500"
                placeholder="Confirm Password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-4">
            <GoogleSignin />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
