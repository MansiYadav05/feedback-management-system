import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

export function AdminLogin() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const navigate = useNavigate()

    // Validation
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.trim().length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!isLogin && !formData.name) {
            newErrors.name = 'Name is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix the errors and try again')
            return
        }

        setLoading(true)

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register'
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'admin',
                }

            const response = await axios.post(`http://localhost:5000${endpoint}`, payload)

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token)
                localStorage.setItem('adminUser', JSON.stringify(response.data.user))

                toast.success(isLogin
                    ? `Welcome back, ${response.data.user.name}!`
                    : 'Admin account created successfully!',
                    { position: "top-center" }
                )

                navigate('/admin/dashboard')
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'An error occurred'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 rounded-lg mb-4 shadow-lg shadow-cyan-500/50">
                        <FaUser className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-600 text-transparent bg-clip-text">
                        🎯 EventHub Admin
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-sky-100">
                    {/* Toggle */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => {
                                setIsLogin(true)
                                setErrors({})
                            }}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${isLogin
                                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false)
                                setErrors({})
                            }}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${!isLogin
                                ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field (hidden in login mode) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition ${errors.name ? 'border-red-500' : 'border-sky-200'
                                            }`}
                                    />
                                </div>
                                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@example.com"
                                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition ${errors.email ? 'border-red-500' : 'border-sky-200'
                                        }`}
                                />
                            </div>
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition ${errors.password ? 'border-red-500' : 'border-sky-200'
                                        }`}
                                />
                            </div>
                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:shadow-lg hover:shadow-cyan-500/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
                            {!loading && <FaArrowRight className="text-sm" />}
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Don't have an admin account?" : 'Already have an admin account?'}
                            {' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setErrors({})
                                }}
                                className="text-sky-600 font-semibold hover:text-sky-700 transition"
                            >
                                {isLogin ? 'Create one' : 'Login here'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-sky-600 hover:text-sky-700 font-semibold flex items-center justify-center gap-2 transition"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
