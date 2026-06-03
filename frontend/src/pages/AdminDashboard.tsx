import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaSignOutAlt, FaPlus, FaCalendar, FaMapMarkerAlt, FaStar, FaComment, FaTrash, FaUsers } from 'react-icons/fa'
import axios from 'axios'

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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg sticky top-0 z-40">
                <div className="container py-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-primary-100">Welcome, {admin?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            <main className="container py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
                        <h3 className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">Total Events</h3>
                        <p className="text-4xl font-bold text-primary-600">{events.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
                        <h3 className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">Total Feedbacks</h3>
                        <p className="text-4xl font-bold text-primary-600">{feedbacks.length}</p>
                    </div>
                </div>

                {/* Add Event */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
                        <button
                            onClick={() => setShowAddEvent(!showAddEvent)}
                            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition"
                        >
                            {showAddEvent ? <FaPlus className="rotate-45" /> : <FaPlus />} {showAddEvent ? 'Cancel' : 'Add Event'}
                        </button>
                    </div>

                    {/* Add Event Form */}
                    {showAddEvent && (
                        <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-primary-50 rounded-lg mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    required
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="e.g., Tech Summit 2026"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={newEvent.location}
                                    required
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    placeholder="e.g., San Francisco, CA"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.date}
                                    required
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                                <input
                                    type="number"
                                    value={newEvent.capacity}
                                    min="1"
                                    onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Event description..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                                    rows={3}
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                                >
                                    Create Event
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddEvent(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Events List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <div key={event._id} className="group relative bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100 rounded-lg p-6 hover:shadow-lg transition">
                                    <button 
                                        onClick={() => handleDeleteEvent(event._id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete Event"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 pr-6">{event.title}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p className="flex items-center gap-2">
                                            <FaCalendar className="text-primary-500" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-primary-500" />
                                            {event.location}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaUsers className="text-primary-500" />
                                            {event.attendees || 0} / {event.capacity}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-primary-100 uppercase font-medium">
                                            Status: <span className="text-primary-600">{event.status}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-600 py-8">No events yet. Create one to get started!</p>
                        )}
                    </div>
                </div>

                {/* Feedbacks */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Feedbacks</h2>

                    {feedbacks.length > 0 ? (
                        <div className="space-y-4">
                            {feedbacks.map((feedback) => (
                                <div key={feedback._id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-primary-300 transition">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-semibold text-gray-900">{(feedback.eventId as any)?.title || 'Event'}</p>
                                            <p className="text-sm text-gray-600">{feedback.email}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                                            <FaStar className="text-yellow-500 text-sm" />
                                            <span className="font-bold text-yellow-700">{feedback.rating}/5</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3 flex items-start gap-2">
                                        <FaComment className="text-primary-500 mt-1 flex-shrink-0" />
                                        {feedback.comment}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium italic text-right">{new Date(feedback.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">No feedbacks yet. Share your events to start collecting insights!</p>
                    )}
                </div>
            </main>
        </div>
    )
}
