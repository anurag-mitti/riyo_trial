import { useState } from 'react' // Removed useEffect
import { Link, useNavigate } from 'react-router-dom'
// import { supabase } from '../lib/supabase-client'
import toast, { Toaster } from 'react-hot-toast'

export function SignupForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    // Removed Supabase useEffect hook

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            // Commented Supabase signup
            /*
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
            */

            // Temporary success message
            toast.success(`Account created successfully!`)
            setFormData({ email: '', password: '', confirmPassword: '', phone: '' })
            navigate('/login')

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
                            <Link to="/login" className="text-primary-500 hover:text-primary-400">
                                Sign in
                            </Link>
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
                            {/* Removed GoogleSignin component */}
                        </div>
                    </form>
                </div>
            </div>
            <Toaster />
        </>
    )
}

export default SignupForm
