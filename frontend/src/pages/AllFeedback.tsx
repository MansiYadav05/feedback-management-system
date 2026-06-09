import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaStar, FaCalendar, FaQuoteLeft } from 'react-icons/fa'
import axios from 'axios'

interface Feedback {
    _id: string
    eventId: {
        title: string
    }
    email: string
    rating: number
    comment: string
    categories: {
        organization: number
        content: number
        venue: number
        overall: number
    }
    createdAt: string
}

export function AllFeedbacks() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/feedback')
                // Handle both direct array and wrapped object responses
                const data = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data.feedbacks || [])
                setFeedbacks(data)
                setError(null)
            } catch (error) {
                console.error('Error fetching feedback:', error)
                setError('Failed to load community wall. Please ensure the backend is running.')
            } finally {
                setLoading(false)
            }
        }
        fetchFeedbacks()
    }, [])

    return (
        <div className="min-h-screen flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
            <div>
                <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 border-b border-cyan-300/30">
                    <div className="container py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Community Feedback</h1>
                            <p className="text-sky-100 text-lg">Hear what attendees are saying about our events</p>
                        </div>
                        <Link to="/" className="btn btn-secondary inline-flex items-center gap-2 bg-white text-sky-600 hover:bg-sky-50 font-semibold px-6 py-3 rounded-lg shadow-lg transition">
                            <FaArrowLeft className="text-sm" /> Back to Home
                        </Link>
                    </div>
                </div>

                <div className="container py-12">
                    {loading ? (
                        <div className="flex justify-center items-center py-24">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50/10 rounded-2xl backdrop-blur border border-red-400/30 p-12 text-center max-w-lg mx-auto">
                            <p className="text-red-200 text-lg mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-white bg-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500/70 transition">Retry</button>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="bg-white/10 rounded-2xl backdrop-blur border border-sky-400/30 p-12 text-center max-w-lg mx-auto">
                            <p className="text-sky-200 text-lg">No feedback has been shared yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {feedbacks.map((feedback) => (
                                <div key={feedback._id} className="bg-white/10 rounded-2xl border-2 border-sky-400/30 shadow-lg p-6 backdrop-blur hover:border-cyan-400 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">
                                                {typeof feedback.eventId === 'object' && feedback.eventId !== null 
                                                    ? feedback.eventId.title 
                                                    : 'General Event'}
                                            </h3>
                                            <p className="text-sky-300 text-xs italic">{feedback.email.replace(/(.{3})(.*)(?=@)/, "$1***")}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/50">
                                            <FaStar className="text-yellow-400 text-sm" />
                                            <span className="text-yellow-100 font-bold">{feedback.rating}/5</span>
                                        </div>
                                    </div>

                                    <div className="relative mb-6">
                                        <FaQuoteLeft className="absolute -top-2 -left-2 text-sky-500/20 text-3xl" />
                                        <p className="text-sky-100 pl-4 italic leading-relaxed">
                                            {feedback.comment || "No specific comments shared, but the attendee left a high rating!"}
                                        </p>
                                    </div>

                                    {feedback.categories && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-sky-400/20">
                                            <div className="text-center">
                                                <p className="text-[9px] uppercase font-bold text-sky-400">Org</p>
                                                <p className="text-white text-sm font-semibold">{feedback.categories.organization}/5</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] uppercase font-bold text-cyan-400">Content</p>
                                                <p className="text-white text-sm font-semibold">{feedback.categories.content}/5</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] uppercase font-bold text-emerald-400">Venue</p>
                                                <p className="text-white text-sm font-semibold">{feedback.categories.venue}/5</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] uppercase font-bold text-indigo-400">Value</p>
                                                <p className="text-white text-sm font-semibold">{feedback.categories.overall}/5</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-3 flex justify-end">
                                        <p className="text-[10px] text-sky-400 flex items-center gap-1">
                                            <FaCalendar /> {new Date(feedback.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <footer className="bg-gradient-to-r from-sky-950 to-slate-950 text-white py-6 text-center text-sm border-t border-sky-900 mt-12">
                <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
            </footer>
        </div>
    )
}
// Note: Don't forget to register the new route in your `App.tsx` (or wherever your routing is defined):
// `<Route path="/all-feedbacks" element={<AllFeedbacks />} />`
