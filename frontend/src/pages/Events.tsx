import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaUsers, FaStar } from 'react-icons/fa'
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

export function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:5000/events')
        setEvents(response.data || [])
        setError('')
      } catch (err: any) {
        console.error('Error fetching events:', err)
        setError('Failed to load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div>
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 border-b border-cyan-300/30">
          <div className="container py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">👀 Events Directory</h1>
              <p className="text-sky-100 text-lg">Browse available events and provide your valuable feedback</p>
            </div>
            <Link
              to="/"
              className="btn btn-secondary inline-flex items-center gap-2 bg-white text-sky-600 hover:bg-sky-50 font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <FaArrowLeft className="text-sm" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
              <span className="ml-3 text-sky-100 font-medium">Loading events...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50/20 border border-red-400/50 text-red-300 px-6 py-4 rounded-lg text-center max-w-xl mx-auto shadow-md backdrop-blur">
              <p className="font-semibold mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary btn-sm mt-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition"
              >
                Retry
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white/10 rounded-2xl backdrop-blur border border-sky-400/30 shadow-lg p-12 text-center max-w-lg mx-auto">
              <p className="text-sky-200 text-lg mb-6">No events are currently scheduled.</p>
              <Link to="/admin/dashboard" className="btn btn-primary bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition">
                Add an Event (Admin)
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <article key={event._id} className="bg-white/10 rounded-2xl border-2 border-sky-400/30 shadow-lg hover:shadow-2xl hover:border-cyan-400 hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col justify-between backdrop-blur hover:shadow-cyan-400/30">
                  <div className="h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white line-clamp-1">{event.title}</h3>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${event.status === 'upcoming' ? 'bg-sky-500/30 text-sky-200 border border-sky-400' :
                          event.status === 'ongoing' ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400' :
                            event.status === 'completed' ? 'bg-gray-500/30 text-gray-200 border border-gray-400' :
                              'bg-red-500/30 text-red-200 border border-red-400'
                        }`}>
                        {event.status}
                      </span>
                    </div>

                    <p className="text-sky-100 text-sm mb-4 line-clamp-2 h-10">
                      {event.description || 'No description provided.'}
                    </p>

                    <div className="space-y-2.5 text-sm text-sky-200">
                      <p className="flex items-center gap-2">
                        <FaCalendar className="text-cyan-400 flex-shrink-0" />
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-emerald-400 flex-shrink-0" />
                        {event.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaUsers className="text-sky-400 flex-shrink-0" />
                        {event.attendees || 0} / {event.capacity} capacity
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/feedback?eventId=${event._id}`}
                      className="btn btn-primary w-full text-center flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold px-4 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
                    >
                      Give Feedback <FaStar className="text-yellow-300" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-sky-950 to-slate-950 text-white py-6 text-center text-sm border-t border-sky-900 mt-12">
        <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
      </footer>
    </div>
  )
}
