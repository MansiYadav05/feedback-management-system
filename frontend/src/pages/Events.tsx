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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 border-b border-primary-100">
          <div className="container py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
                Events Directory
              </h1>
              <p className="text-gray-600 text-lg">Browse available events and provide your valuable feedback</p>
            </div>
            <Link 
              to="/" 
              className="btn btn-secondary inline-flex items-center gap-2 bg-white"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-gray-600 font-medium">Loading events...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center max-w-xl mx-auto shadow-md">
              <p className="font-semibold mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary btn-sm mt-2"
              >
                Retry
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center max-w-lg mx-auto">
              <p className="text-gray-500 text-lg mb-6">No events are currently scheduled.</p>
              <Link to="/admin/dashboard" className="btn btn-primary">
                Add an Event (Admin)
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <article key={event._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{event.title}</h3>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase ${
                        event.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        event.status === 'ongoing' ? 'bg-green-50 text-green-600 border border-green-200' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                        'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {event.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                      {event.description || 'No description provided.'}
                    </p>

                    <div className="space-y-2.5 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaCalendar className="text-primary-500 flex-shrink-0" />
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
                        <FaMapMarkerAlt className="text-primary-500 flex-shrink-0" />
                        {event.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaUsers className="text-primary-500 flex-shrink-0" />
                        {event.attendees || 0} / {event.capacity} capacity
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link 
                      to={`/feedback?eventId=${event._id}`}
                      className="btn btn-primary w-full text-center flex items-center justify-center gap-2 hover:shadow-lg transition"
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
      <footer className="bg-gray-900 text-white py-6 text-center text-sm border-t border-gray-800 mt-12">
        <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
      </footer>
    </div>
  )
}
