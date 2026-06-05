import React, { useState } from 'react';
import axios from 'axios';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '', // format: YYYY-MM-DDTHH:mm
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/events', formData);
      alert('Event successfully created!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.errors?.[0]?.message || 'Failed to create event';
      alert(`Error: ${errorMsg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <input
        type="text"
        placeholder="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <input
        type="datetime-local"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventForm;
