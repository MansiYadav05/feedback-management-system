import React, { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaStar, FaEnvelope, FaComment, FaCalendar, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axios from 'axios'

interface Event {
  _id: string
  title: string
  description: string
  date?: string
  location: string 
}

export function Feedback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const preselectedEventId = searchParams.get('eventId')

  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [categories, setCategories] = useState({
    organization: 5,
    content: 5,
    venue: 5,
    overall: 5
  })

  const [loading, setLoading] = useState(false)
  const [fetchingEvents, setFetchingEvents] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const welcomeToastShown = useRef(false)

  // Display Welcome Toast on Mount
  useEffect(() => {
    if (!welcomeToastShown.current) {
      toast.info('Welcome to Feedback API', { position: 'top-center' })
      welcomeToastShown.current = true
    }
  }, [])

  // Fetch events list and preselected event details
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setFetchingEvents(true)
        const response = await axios.get('http://localhost:5000/events')
        const allEvents = response.data || []
        setEvents(allEvents)

        if (preselectedEventId) {
          const found = allEvents.find((e: Event) => e._id === preselectedEventId)
          if (found) {
            setSelectedEvent(found)
          } else {
            // Fetch by ID specifically if not found in cache list
            try {
              const res = await axios.get(`http://localhost:5000/events/${preselectedEventId}`)
              if (res.data) {
                setSelectedEvent(res.data)
              }
            } catch (err) {
              console.error('Failed to fetch preselected event', err)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        toast.error('Failed to load events list')
      } finally {
        setFetchingEvents(false)
      }
    }

    fetchEvents()
  }, [preselectedEventId])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    const eventId = preselectedEventId || selectedEvent?._id
    if (!eventId) {
      newErrors.event = 'Please select an event'
    }

    if (rating < 1 || rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the validation errors and try again')
      return
    }

    setLoading(true)

    try {
      const payload = {
        eventId: preselectedEventId || selectedEvent?._id,
        email: email.trim().toLowerCase(),
        rating,
        comment: comment.trim(),
        categories
      }

      await axios.post('http://localhost:5000/feedback', payload)

      toast.success('Feedback submitted successfully! Thank you.', {
        position: 'top-center'
      })

      // Reset fields
      setEmail('')
      setComment('')
      setRating(5)
      setCategories({ organization: 5, content: 5, venue: 5, overall: 5 })

      // Delay redirect to allow toast read-time
      setTimeout(() => {
        navigate('/all-feedbacks')
      }, 2000)

    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to submit feedback'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryRating = (category: 'organization' | 'content' | 'venue' | 'overall', value: number) => {
    setCategories(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const renderStarSelector = (currentRating: number, onSelect: (val: number) => void, size = 24) => {
    return (
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onSelect(val)}
            className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
          >
            <FaStar
              size={size}
              className={val <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    )
  }

  const activeEvent = selectedEvent || events.find(e => e._id === preselectedEventId)

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div>
        {/* Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 border-b border-cyan-300/30">
          <div className="container py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Submit Feedback</h1>
              <p className="text-sky-100 text-lg">We appreciate your review to help us build better events</p>
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

        {/* Content Container */}
        <div className="container py-12 max-w-3xl">
          {fetchingEvents && !activeEvent ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
              <span className="ml-3 text-sky-200 font-medium">Loading form details...</span>
            </div>
          ) : (
            <div className="bg-white/10 rounded-2xl shadow-2xl border-2 border-sky-400/30 overflow-hidden backdrop-blur">

              {/* Event highlight summary if selected */}
              {activeEvent && (
                <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 text-white p-6 md:p-8">
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Selected Event
                  </span>
                  <h2 className="text-2xl font-bold mt-2.5 mb-4">{activeEvent.title}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-sky-100">
                    <p className="flex items-center gap-2">
                      <FaCalendar className="text-white" />
                      {activeEvent.date ? new Date(activeEvent.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Date TBD'}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-white" />
                      {activeEvent.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                {/* Event Selector if NOT preselected */}
                {!preselectedEventId && (
                  <div>
                    <label className="block text-sm font-semibold text-sky-100 mb-2">
                      Choose Event <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={selectedEvent?._id || ''}
                      onChange={(e) => {
                        const found = events.find(event => event._id === e.target.value)
                        setSelectedEvent(found || null)
                        if (errors.event) setErrors(prev => ({ ...prev, event: '' }))
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg bg-sky-900/30 text-white placeholder-sky-300 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 transition backdrop-blur ${errors.event ? 'border-red-500' : 'border-sky-400/30'
                        }`}
                    >
                      <option value="">-- Select an Event --</option>
                      {events.map((event) => (
                        <option key={event._id} value={event._id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                    {errors.event && <p className="text-red-400 text-sm mt-1">{errors.event}</p>}
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-sky-100 mb-2">
                    Your Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }))
                      }}
                      placeholder="e.g. user@example.com"
                      className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg bg-sky-900/30 text-white placeholder-sky-300 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 transition backdrop-blur ${errors.email ? 'border-red-500' : 'border-sky-400/30'
                        }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Star Ratings */}
                <div className="border-t border-sky-400/20 pt-6">
                  <h3 className="text-sm font-semibold text-sky-100 uppercase tracking-wider mb-4">
                    ⭐ Ratings & Feedback
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-sky-500/10 p-6 rounded-xl border border-sky-400/30 backdrop-blur">

                    {/* Overall Rating */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-sky-100">
                        Overall Experience <span className="text-red-400">*</span>
                      </label>
                      {renderStarSelector(rating, setRating, 28)}
                      <p className="text-xs text-sky-300 italic">Score: {rating} / 5</p>
                    </div>

                    {/* Organization Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-sky-100">
                        Event Organization
                      </label>
                      {renderStarSelector(categories.organization, (val) => handleCategoryRating('organization', val), 22)}
                    </div>

                    {/* Content Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-sky-100">
                        Content Quality
                      </label>
                      {renderStarSelector(categories.content, (val) => handleCategoryRating('content', val), 22)}
                    </div>

                    {/* Venue Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-sky-100">
                        Venue & Comfort
                      </label>
                      {renderStarSelector(categories.venue, (val) => handleCategoryRating('venue', val), 22)}
                    </div>

                    {/* Overall Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-sky-100">
                        Value for Money / Overall
                      </label>
                      {renderStarSelector(categories.overall, (val) => handleCategoryRating('overall', val), 22)}
                    </div>

                  </div>
                </div>

                {/* Comment / Review */}
                <div>
                  <label className="block text-sm font-semibold text-sky-100 mb-2">
                    Review / Additional Comments
                  </label>
                  <div className="relative">
                    <FaComment className="absolute left-4 top-4 text-sky-400" />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what you liked or how we can improve..."
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 border-2 rounded-lg bg-sky-900/30 text-white placeholder-sky-300 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/30 transition resize-none backdrop-blur border-sky-400/30"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:shadow-lg hover:shadow-cyan-500/50 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Feedback <FaHeart className="text-sm text-red-300" />
                    </>
                  )}
                </button>

              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-sky-950 to-slate-950 text-white py-6 text-center text-sm border-t border-sky-900">
        <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
      </footer>
    </div>
  )
}
