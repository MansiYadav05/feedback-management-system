import { FaStar } from 'react-icons/fa'

interface Feedback {
  _id: string
  eventId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  createdAt: string
}

interface FeedbackTableProps {
  feedbacks: Feedback[]
}

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No feedbacks received yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left px-6 py-3 font-medium text-gray-700">Name</th>
            <th className="text-left px-6 py-3 font-medium text-gray-700">Email</th>
            <th className="text-left px-6 py-3 font-medium text-gray-700">Rating</th>
            <th className="text-left px-6 py-3 font-medium text-gray-700">Comment</th>
            <th className="text-left px-6 py-3 font-medium text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{feedback.userName}</td>
              <td className="px-6 py-4 text-gray-600">{feedback.userEmail}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      size={14} 
                      className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">{feedback.rating}/5</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{feedback.comment}</td>
              <td className="px-6 py-4 text-gray-600 text-sm">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
