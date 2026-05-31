import { useState, useEffect } from 'react'
import './App.css'

interface Event {
    _id: string
    title: string
    date: string
    location: string
}

function App() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            setLoading(true)
            setError(null)

            console.log('Fetching events from /api/events...')
            const response = await fetch('/api/events')

            console.log('Response status:', response.status)

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(`HTTP ${response.status}: ${errorData}`)
            }

            const data = await response.json()
            console.log('Events fetched successfully:', data)
            setEvents(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred'
            console.error('Error fetching events:', errorMessage)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Event Feedback Management System</h1>
            </header>

            <main className="app-main">
                {loading && <p className="loading">Loading events...</p>}
                {error && (
                    <div className="error-container">
                        <p className="error">❌ Error: {error}</p>
                        <details className="error-details">
                            <summary>Troubleshooting Tips</summary>
                            <ul>
                                <li>Ensure backend is running on port 5000</li>
                                <li>Check if MongoDB is connected</li>
                                <li>Verify API endpoint: <code>http://localhost:5000/health</code></li>
                                <li>Check browser console for more details</li>
                            </ul>
                        </details>
                        <button onClick={fetchEvents} className="retry-btn">Retry</button>
                    </div>
                )}

                {!loading && events.length === 0 && !error && (
                    <p className="no-events">No events available</p>
                )}

                {!loading && events.length > 0 && (
                    <div className="events-grid">
                        {events.map(event => (
                            <div key={event._id} className="event-card">
                                <h2>{event.title}</h2>
                                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                <p><strong>Location:</strong> {event.location}</p>
                                <button className="feedback-btn">Give Feedback</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
