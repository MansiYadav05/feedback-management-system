import express, { Response } from 'express';
import jwt from 'jsonwebtoken';
import { createEvent, getAllEvents, getEventById, deleteEvent } from '../controllers/eventController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createEventSchema } from '../middleware/event.validation.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req: any, res: Response, next: any) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// ✅ Public routes — no auth needed
router.get('/', getAllEvents);          // GET /events
router.get('/:id', getEventById);      // GET /events/:id

// ✅ Protected routes
router.post('/', authMiddleware, validateRequest(createEventSchema), createEvent);  // POST /events
router.delete('/:id', authMiddleware, deleteEvent);                                 // DELETE /events/:id

export default router;