import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

interface AddEventModalProps {
    onClose: () => void
    onSubmit: (data: any) => void
}

export function AddEventModal({ onClose, onSubmit }: AddEventModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        capacity: '',       // ✅ FIX: renamed from attendees → capacity
        description: '',
    })
    const [errors, setErrors] = useState<any>({})

    const validateForm = () => {
        const newErrors: any = {}

        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.date) {
            newErrors.date = 'Date is required'
        } else {
            // ✅ FIX: Validate date is not invalid (e.g. year 52003)
            const parsed = new Date(formData.date)
            if (isNaN(parsed.getTime())) {
                newErrors.date = 'Please enter a valid date'
            }
        }
        if (!formData.location.trim()) newErrors.location = 'Location is required'
        if (!formData.capacity || parseInt(formData.capacity) <= 0) {
            newErrors.capacity = 'Valid capacity is required'  // ✅ FIX
        }
        if (!formData.description.trim()) newErrors.description = 'Description is required'

        return newErrors
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors = validateForm()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // ✅ FIX: Send capacity (not attendees), and convert date to ISO string safely
        onSubmit({
            ...formData,
            date: new Date(formData.date).toISOString(),
            capacity: parseInt(formData.capacity),
        })
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value })
                                setErrors({ ...errors, title: '' })
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Event title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="datetime-local"
                            value={formData.date}
                            min="2000-01-01T00:00"
                            max="2100-12-31T23:59"
                            onChange={(e) => {
                                setFormData({ ...formData, date: e.target.value })
                                setErrors({ ...errors, date: '' })
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => {
                                setFormData({ ...formData, location: e.target.value })
                                setErrors({ ...errors, location: '' })
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Event location"
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div>
                        {/* ✅ FIX: Label and field renamed to Capacity */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => {
                                setFormData({ ...formData, capacity: e.target.value })
                                setErrors({ ...errors, capacity: '' })
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="100"
                            min="1"
                        />
                        {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({ ...formData, description: e.target.value })
                                setErrors({ ...errors, description: '' })
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Event description"
                            rows={3}
                        />
                        {/* ✅ FIX: Removed extra } that caused syntax error */}
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn btn-primary"
                        >
                            Add Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}