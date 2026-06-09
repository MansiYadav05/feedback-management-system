import { Router } from 'express';
import {
    createFeedback,
    getFeedbackByEvent,
    getEventAnalytics,
    getAllFeedback,
} from '../controllers/feedbackController.js';

const router = Router();

// Base path is /feedback
router.post('/', createFeedback);
router.get('/', getAllFeedback);
router.get('/:eventId', getFeedbackByEvent);
router.get('/:eventId/analytics', getEventAnalytics);

export default router;
