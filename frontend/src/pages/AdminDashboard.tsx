import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaSignOutAlt, FaPlus, FaCalendar, FaMapMarkerAlt, FaStar, FaComment, FaTrash, FaUsers } from 'react-icons/fa'
import axios from 'axios'
import { PendingAdminsPanel } from '../components/PendingAdminsPanel'

interface Event {
    _id: string
    title: string
    description: string
    date: string
    location: string
    capacity: number
    attendees: number
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

interface Feedback {
    _id: string
    eventId: Event
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

interface AdminUser {
    id: string
    name: string
    email: string
    role: string
}

export function AdminDashboard() {
    const navigate = useNavigate()
    const [admin, setAdmin] = useState<AdminUser | null>(null)
    const [events, setEvents] = useState<Event[]>([])
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddEvent, setShowAddEvent] = useState(false)
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: 100,
    })

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        const user = localStorage.getItem('adminUser')

        if (!token || !user) {
            toast.error('Please login first')
            navigate('/admin/login')
            return
        }

        setAdmin(JSON.parse(user))
        fetchData(token)
    }, [navigate])

    const fetchData = async (token: string) => {
        try {
            setLoading(true)
            const config = { headers: { Authorization: `Bearer ${token}` } }

            const dashboardRes = await axios.get('http://localhost:5000/admin/dashboard', config)

            setEvents(dashboardRes.data.events || [])
            setFeedbacks(dashboardRes.data.feedbacks || [])
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to load dashboard'
            toast.error(message)
            if (error.response?.status === 401) {
                localStorage.removeItem('adminToken')
                localStorage.removeItem('adminUser')
                navigate('/admin/login')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newEvent.title || !newEvent.date || !newEvent.location) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }

            await axios.post('http://localhost:5000/admin/create', newEvent, config)

            toast.success('Event created successfully!')
            setNewEvent({ title: '', description: '', date: '', location: '', capacity: 100 })
            setShowAddEvent(false)

            const dashboardRes = await axios.get('http://localhost:5000/admin/dashboard', config)
            setEvents(dashboardRes.data.events || [])
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to add event'
            toast.error(message)
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this event? This will also remove associated feedbacks.')) return

        try {
            const token = localStorage.getItem('adminToken')
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.delete(`http://localhost:5000/admin/event/${id}`, config)
            toast.success('Event deleted successfully')
            fetchData(token!)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete event')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        toast.info('Logged out successfully')
        navigate('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
            {/* Header */}
            <header className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 text-white shadow-2xl sticky top-0 z-40">
                <div className="container py-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">🎯 Tech Event Management</h1>
                        <p className="text-sky-100 mt-1">Welcome, {admin?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-sky-600 hover:bg-sky-50 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg hover:shadow-xl"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            <main className="container py-12">
                {/* Pending Admins Panel - Only show to main admin */}
                {admin?.email === 'admin@eventhub.com' && (
                    <PendingAdminsPanel onRefresh={() => { }} />
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-7 border-l-4 border-transparent bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-l-sky-500 backdrop-blur">
                        <h3 className="text-gray-600 text-sm font-bold mb-3 uppercase tracking-widest">📊 Total Events</h3>
                        <p className="text-5xl font-black bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">{events.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-7 border-l-4 border-transparent bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-l-emerald-500 backdrop-blur">
                        <h3 className="text-gray-600 text-sm font-bold mb-3 uppercase tracking-widest">💬 Total Feedbacks</h3>
                        <p className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">{feedbacks.length}</p>
                    </div>
                </div>

                {/* Add Event */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-sky-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">✨ Events Management</h2>
                        <button
                            onClick={() => setShowAddEvent(!showAddEvent)}
                            className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:-translate-y-1"
                        >
                            {showAddEvent ? <FaPlus className="rotate-45" /> : <FaPlus />} {showAddEvent ? 'Cancel' : 'Add Event'}
                        </button>
                    </div>

                    {/* Add Event Form */}
                    {showAddEvent && (
                        <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl mb-8 border-2 border-sky-200">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">Event Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    required
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="e.g., Tech Summit 2026"
                                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">Location</label>
                                <input
                                    type="text"
                                    value={newEvent.location}
                                    required
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    placeholder="e.g., San Francisco, CA"
                                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">Date</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.date}
                                    required
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-3">Capacity</label>
                                <input
                                    type="number"
                                    value={newEvent.capacity}
                                    min="1"
                                    onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-800 mb-3">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Event description..."
                                    className="w-full px-4 py-3 border-2 border-sky-300 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition bg-white resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition transform hover:-translate-y-1"
                                >
                                    Create Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddEvent(false)}
                                    className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Events List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <div key={event._id} className="group relative bg-white rounded-xl overflow-hidden border-2 border-sky-100 shadow-lg hover:shadow-2xl hover:border-cyan-400 transition-all transform hover:-translate-y-2 hover:shadow-cyan-500/20">
                                    <div className="h-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500"></div>
                                    <div className="p-6">
                                        <button
                                            onClick={() => handleDeleteEvent(event._id)}
                                            className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-2 hover:bg-red-50"
                                            title="Delete Event"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 pr-8">{event.title}</h3>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <p className="flex items-center gap-2">
                                                <FaCalendar className="text-sky-500" />
                                                {new Date(event.date).toLocaleDateString()}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-cyan-500" />
                                                {event.location}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FaUsers className="text-emerald-500" />
                                                {event.attendees || 0} / {event.capacity}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-sky-100 uppercase font-bold">
                                                Status: <span className="text-transparent bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text">{event.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400 py-12 bg-sky-50/50 rounded-lg border-2 border-dashed border-sky-200">🚀 No events yet. Create one to get started!</p>
                        )}
                    </div>
                </div>

                {/* Feedbacks */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-sky-100">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent mb-8">📝 Recent Feedbacks</h2>

                    {feedbacks.length > 0 ? (
                        <div className="space-y-4">
                            {feedbacks.map((feedback) => (
                                <div key={feedback._id} className="border-2 border-sky-100 rounded-xl p-6 hover:border-cyan-400 hover:bg-sky-50/50 transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{(feedback.eventId as any)?.title || 'Event'}</p>
                                            <p className="text-sm text-gray-600">{feedback.email}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full border-2 border-yellow-200">
                                            <FaStar className="text-yellow-500 text-sm" />
                                            <span className="font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">{feedback.rating}/5</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3 flex items-start gap-3">
                                        <FaComment className="text-cyan-500 mt-1 flex-shrink-0" />
                                        {feedback.comment}
                                    </p>
                                    <p className="text-xs text-gray-400 font-medium italic text-right">{new Date(feedback.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-16 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border-2 border-dashed border-sky-200">
                            💭 No feedbacks yet. Share your events to start collecting insights!
                        </p>
                    )}
                </div>
            </main>
        </div>
    )
}
