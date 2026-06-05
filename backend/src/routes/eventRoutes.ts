import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createEvent } from '../controllers/eventController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createEventSchema } from '../middleware/event.validation.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware for event routes
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

router.post('/', authMiddleware, validateRequest(createEventSchema), createEvent);

export default router;