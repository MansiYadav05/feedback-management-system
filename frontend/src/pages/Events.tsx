import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

export function Events(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-bg">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
          <p className="text-gray-600 text-lg">Browse all available events and submit your feedback</p>
        </div>
      </div>
      
      <div className="container py-16 text-center">
        <p className="text-gray-600 text-lg mb-6">Events page coming soon...</p>
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <FaArrowLeft className="text-sm" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
