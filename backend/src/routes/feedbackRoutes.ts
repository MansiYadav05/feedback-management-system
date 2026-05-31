import { Router } from 'express';
import {
    createFeedback,
    getFeedbackByEvent,
    getEventAnalytics,
} from '../controllers/feedbackController.js';

const router = Router();

router.post('/', createFeedback);
router.get('/:eventId', getFeedbackByEvent);
router.get('/:eventId/analytics', getEventAnalytics);

export default router;
