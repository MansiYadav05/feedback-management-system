import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Event } from '../models/Event.js';
import { Feedback } from '../models/Feedback.js';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAIN_ADMIN_EMAIL = process.env.MAIN_ADMIN_EMAIL;

// ─── Auth Middleware ───────────────────────────────────────────────────────────

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

        // ✅ FIX: Check isApproved from DB so pending admins can't access routes
        const user = await User.findById(decoded.userId);
        if (!user || !user.isApproved) {
            return res.status(403).json({ message: 'Admin account pending approval' });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const mainAdminAuth = async (req: any, res: Response, next: any) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const user = await User.findById(decoded.userId);
        if (!user || user.email !== MAIN_ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Main admin access required' });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// ─── Event Routes ──────────────────────────────────────────────────────────────

// Create event (admin only)
router.post('/create', adminAuth, async (req: any, res: Response) => {
    try {
        const { title, description, date, location, capacity } = req.body;

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
        // ✅ FIX: Safe error serialization — prevents circular reference crash
        console.error('🔴 Create event error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
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
        // ✅ FIX: Safe error serialization
        console.error('🔴 Update event error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Get dashboard data (admin only)
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
                averageRating:
                    feedbacks.length > 0
                        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)
                        : 0,
            },
            categoryAverages: feedbacks.length > 0 ? {
                organization: (feedbacks.reduce((sum, f) => sum + (f.categories?.organization || 0), 0) /
                    Math.max(feedbacks.filter(f => f.categories?.organization).length, 1)).toFixed(2),
                content: (feedbacks.reduce((sum, f) => sum + (f.categories?.content || 0), 0) /
                    Math.max(feedbacks.filter(f => f.categories?.content).length, 1)).toFixed(2),
                venue: (feedbacks.reduce((sum, f) => sum + (f.categories?.venue || 0), 0) /
                    Math.max(feedbacks.filter(f => f.categories?.venue).length, 1)).toFixed(2),
                overall: (feedbacks.reduce((sum, f) => sum + (f.categories?.overall || 0), 0) /
                    Math.max(feedbacks.filter(f => f.categories?.overall).length, 1)).toFixed(2),
            } : {
                organization: 0, content: 0, venue: 0, overall: 0
            }
        });
    } catch (error) {
        // ✅ FIX: Safe error serialization
        console.error('🔴 Dashboard error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Get feedbacks for a specific event (admin only)
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
        // ✅ FIX: Safe error serialization
        console.error('🔴 Get feedbacks error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Delete event + its feedbacks (admin only)
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
        // ✅ FIX: Safe error serialization
        console.error('🔴 Delete event error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// ─── Admin Management Routes ───────────────────────────────────────────────────

// Get pending admin requests (main admin only)
router.get('/pending-admins', mainAdminAuth, async (req: any, res: Response) => {
    try {
        const pendingAdmins = await User.find({
            role: 'admin',
            isApproved: false,
        }).select('_id name email createdAt');

        res.json({
            pendingAdmins,
            count: pendingAdmins.length,
        });
    } catch (error) {
        // ✅ FIX: Safe error serialization
        console.error('🔴 Pending admins error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Approve admin (main admin only)
router.post('/approve-admin/:userId', mainAdminAuth, async (req: any, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin' || user.isApproved === true) {
            return res.status(400).json({ message: 'User is not a pending admin' });
        }

        user.isApproved = true;
        await user.save();

        res.json({
            message: `Admin ${user.email} has been approved successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isApproved: user.isApproved,
            },
        });
    } catch (error) {
        // ✅ FIX: Safe error serialization
        console.error('🔴 Approve admin error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Reject/Delete pending admin (main admin only)
router.post('/reject-admin/:userId', mainAdminAuth, async (req: any, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin' || user.isApproved === true) {
            return res.status(400).json({ message: 'User is not a pending admin' });
        }

        const email = user.email;
        await User.findByIdAndDelete(userId);

        res.json({
            message: `Admin ${email} has been rejected and removed`,
        });
    } catch (error) {
        // ✅ FIX: Safe error serialization
        console.error('🔴 Reject admin error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;