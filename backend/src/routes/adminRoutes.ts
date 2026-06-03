import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Event } from '../models/Event.js';
import { Feedback } from '../models/Feedback.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify token and check admin role
const adminAuth = async (req: any, res: Response, next: any) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Create event (admin only)
router.post('/create', adminAuth, async (req: any, res: Response) => {
    try {
        const { title, description, date, location, capacity } = req.body;

        // Validation
        if (!title || !date || !location) {
            return res.status(400).json({ message: 'Please provide title, date, and location' });
        }

        const newEvent = new Event({
            title,
            description: description || '',
            date: new Date(date),
            location,
            capacity: capacity || 100,
            attendees: 0,
            createdBy: req.userId,
        });

        await newEvent.save();

        res.status(201).json({
            message: 'Event created successfully',
            event: newEvent,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update event (admin only)
router.put('/:eventId', adminAuth, async (req: any, res: Response) => {
    try {
        const { eventId } = req.params;
        const { title, description, date, location, capacity, status } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy?.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = new Date(date);
        if (location) event.location = location;
        if (capacity) event.capacity = capacity;
        if (status) event.status = status;

        await event.save();

        res.json({
            message: 'Event updated successfully',
            event,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get dashboard data (admin only) - events and feedback
router.get('/dashboard', adminAuth, async (req: any, res: Response) => {
    try {
        const events = await Event.find({ createdBy: req.userId });
        const eventIds = events.map((e) => e._id);

        const feedbacks = await Feedback.find({ eventId: { $in: eventIds } }).populate('eventId');

        res.json({
            events,
            feedbacks,
            stats: {
                totalEvents: events.length,
                totalFeedbacks: feedbacks.length,
                averageRating: feedbacks.length > 0
                    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)
                    : 0,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get event feedback
router.get('/:eventId/feedbacks', adminAuth, async (req: any, res: Response) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy?.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view feedbacks' });
        }

        const feedbacks = await Feedback.find({ eventId }).sort({ createdAt: -1 });

        res.json({ feedbacks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete event (admin only)
router.delete('/event/:eventId', adminAuth, async (req: any, res: Response) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy?.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await Event.findByIdAndDelete(eventId);
        await Feedback.deleteMany({ eventId });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;
